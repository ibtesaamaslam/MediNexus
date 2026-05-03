# MediNexus - SaaS Architecture & Backend Documentation

## A. Architecture Diagram

The system follows a standard multi-tenant SaaS architecture.

**Mermaid Diagram:**

```mermaid
graph TD
    Client[React SPA (Vite)] -->|HTTPS/TLS| LB[Load Balancer / CDN]
    LB --> API[Node.js API Gateway]
    
    subgraph "Backend Services (NestJS)"
        API --> Auth[Auth Service]
        API --> Patient[Patient Service]
        API --> Billing[Billing Service]
        API --> AI[AI Integration Service]
    end

    subgraph "Data Layer"
        Auth --> Redis[Redis (Sessions/Cache)]
        Patient --> DB[(PostgreSQL - Multi-Schema)]
        AI --> Gemini[Google Gemini API]
        Billing --> Stripe[Stripe API]
        Patient --> S3[S3 (File Storage)]
    end

    subgraph "DevOps"
        GitHub[GitHub Actions] -->|CI/CD| Docker[Docker Registry]
        Docker --> K8s[Kubernetes Cluster]
    end
```

## B. Database Schema (Prisma)

This schema demonstrates tenant isolation and field-level encryption preparation.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(uuid())
  name      String
  subdomain String   @unique
  createdAt DateTime @default(now())
  users     User[]
  patients  Patient[]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed
  role      Role     @default(DOCTOR)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
}

model Patient {
  id             String   @id @default(uuid())
  tenantId       String
  tenant         Tenant   @relation(fields: [tenantId], references: [id])
  
  // PII - Standard
  firstName      String
  lastName       String
  dob            DateTime
  
  // PHI - Encrypted Fields (Stored as base64 string of encrypted buffer)
  medicalHistoryEncrypted String  
  currentMedsEncrypted    String
  
  appointments   Appointment[]
  
  @@index([tenantId])
}

model Appointment {
  id        String   @id @default(uuid())
  patientId String
  patient   Patient  @relation(fields: [patientId], references: [id])
  date      DateTime
  status    AppointmentStatus
}

enum Role {
  ADMIN
  DOCTOR
  NURSE
  RECEPTIONIST
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}
```

## C. Backend Code Snippet (Auth & Tenant Context)

**Middleware for Tenant Isolation (NestJS/Express style):**

```typescript
// tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID missing' });
    }

    // Attach to request object for controllers / Prisma extensions
    req['tenantId'] = tenantId;
    next();
  }
}
```

**Encryption Utility (Node.js `crypto`):**

```typescript
// encryption.service.ts
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// In production, retrieve this from AWS KMS or HashiCorp Vault
const MASTER_KEY = Buffer.from(process.env.PHI_MASTER_KEY, 'hex'); 

export function encryptPHI(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  
  // Format: IV:TAG:ENCRYPTED_DATA
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

export function decryptPHI(encryptedText: string) {
  const [ivHex, tagHex, contentHex] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    MASTER_KEY, 
    Buffer.from(ivHex, 'hex')
  );
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let decrypted = decipher.update(contentHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

## F. OpenAPI Spec (Partial)

```yaml
openapi: 3.0.0
info:
  title: MediNexus API
  version: 1.0.0
paths:
  /patients:
    get:
      summary: List patients for the authenticated tenant
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Patient'
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## G. Deployment Steps

1.  **Infrastructure (Terraform):**
    ```bash
    cd infra/terraform
    terraform init
    terraform apply -var="db_password=${DB_PASS}"
    ```
    *Provisions AWS RDS (Postgres), ECS Cluster, and Load Balancer.*

2.  **Database Migration:**
    ```bash
    npx prisma migrate deploy
    ```

3.  **Build & Deploy Backend:**
    ```bash
    docker build -t medinexus-api ./backend
    docker push registry.gitlab.com/medinexus/api:latest
    kubectl apply -f infra/k8s/backend-deployment.yaml
    ```

4.  **Deploy Frontend:**
    ```bash
    npm run build
    # Sync to S3 or deploy via Vercel
    vercel deploy --prod
    ```

## H. Security Checklist

- [ ] **TLS 1.3** enforced on all ingress points.
- [ ] **Database:** Encrypted at rest (RDS settings).
- [ ] **App Layer:** Field-level encryption for PHI (Medical History, Notes).
- [ ] **Audit Logs:** All `WRITE` / `DELETE` operations logged to immutable storage (e.g., CloudWatch Logs with retention).
- [ ] **BAA:** Signed with Cloud Provider (AWS/GCP).
- [ ] **Secrets:** No env vars committed. Use Secrets Manager.
- [ ] **Backup:** Automated daily snapshots of RDS, retained for 7 years (compliance).

## I. Test Plan

1.  **Unit:** Jest for all utility functions (especially encryption).
2.  **Integration:** Supertest against API endpoints using a test database container.
3.  **E2E:** Cypress tests for the React Frontend.
    *   *Scenario 1:* Admin logs in -> Creates new user.
    *   *Scenario 2:* Doctor logs in -> Searches patient -> Adds SOAP note (verifies AI summary appears).

