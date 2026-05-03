
<img width="1983" height="793" alt="ChatGPT Image May 3, 2026, 04_37_26 PM" src="https://github.com/user-attachments/assets/8a77b1a7-795f-4da0-9063-aaa9f193130f" />
<br>

<div align="center">

<img src="https://img.shields.io/badge/TypeScript-Full%20Stack-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/NestJS%2FExpress-Backend-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>
<img src="https://img.shields.io/badge/PostgreSQL-Primary%20DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/Gemini-AI%20Assistant-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-Container%20Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/License-Proprietary-FF0000?style=for-the-badge"/>

<br/>

# 🏥 MediNexus SaaS
### *Clinic Management Platform*

**A secure, multi-tenant SaaS platform built for modern clinics — combining patient records (EMR), appointment management, AI-powered clinical assistance via Google Gemini, billing with Stripe, and telehealth into a single production-grade monorepo with HIPAA-compliant AES-256-GCM encryption.**

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/ibtesaamaslam/MediNexus?style=social)](https://github.com/ibtesaamaslam/MediNexus/stargazers)
&nbsp;
[![GitHub Forks](https://img.shields.io/github/forks/ibtesaamaslam/MediNexus?style=social)](https://github.com/ibtesaamaslam/MediNexus/network/members)
&nbsp;
[![GitHub Issues](https://img.shields.io/github/issues/ibtesaamaslam/MediNexus)](https://github.com/ibtesaamaslam/MediNexus/issues)

> ⚠️ **Disclaimer:** This is a demo application. Consult qualified legal counsel before deploying in a real clinical environment for HIPAA / GDPR compliance.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Core Modules](#-core-modules)
- [Role-Based Access Control](#-role-based-access-control)
- [AI Assistant — Google Gemini](#-ai-assistant--google-gemini)
- [Security & Compliance](#-security--compliance)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🔍 Overview

**MediNexus** is a full-stack, production-grade clinic management platform built as a **multi-tenant SaaS monorepo**. Each clinic operates in complete data isolation — patient records, billing, and staff accounts are scoped per tenant with no cross-clinic data leakage.

The platform is designed around four pillars:

- **Clinical operations** — EMR, appointments, telehealth video stubs, and nursing workflows
- **Administrative efficiency** — billing, invoicing, Stripe-ready payments, and receptionist scheduling
- **AI-powered assistance** — Google Gemini integration for SOAP note summarisation and clinical Q&A
- **Enterprise security** — AES-256-GCM PHI encryption, JWT-based RBAC, audit logging, and TLS enforcement

> 💡 **What is multi-tenancy here?** Each clinic that signs up to MediNexus receives a completely isolated data scope in PostgreSQL. A Doctor at Clinic A cannot see any patients, records, or staff from Clinic B — enforced at the application layer via tenant context middleware in NestJS/Express.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│                                                                      │
│   React 19 · TypeScript · Vite · Tailwind CSS                        │
│   ├── Auth pages (login, first-time setup, role select)              │
│   ├── Dashboard (per-role view)                                      │
│   ├── Patient EMR (records, history, notes)                          │
│   ├── Appointments calendar                                          │
│   ├── KDS / Nursing workflow                                         │
│   ├── AI Assistant (Gemini chat panel)                               │
│   ├── Billing & invoicing                                            │
│   └── Telehealth (video stub)                                        │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ REST / WebSocket
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                       │
│           Node.js · NestJS / Express · TypeScript                    │
│                                                                      │
│   ├── Auth module (JWT, RBAC, multi-tenant middleware)               │
│   ├── Patient module (EMR, PHI encryption/decryption)                │
│   ├── Appointment module                                             │
│   ├── AI module (@google/genai — Gemini)                             │
│   ├── Billing module (Stripe integration)                            │
│   └── Audit log module                                               │
└──────┬─────────────────────────────────────────┬─────────────────────┘
       │                                         │
       ▼                                         ▼
┌─────────────────┐                   ┌──────────────────────┐
│   PostgreSQL    │                   │        Redis         │
│  Primary DB     │                   │  Cache · Job queues  │
│  Prisma ORM     │                   │  Session store       │
│  Per-tenant     │                   └──────────────────────┘
│  row isolation  │
└─────────────────┘
```

**Deployment stack:**
```
GitHub Actions → ECR (Docker images) → ECS (AWS) → RDS (PostgreSQL) + ElastiCache (Redis)
                                                  ↕
                                         Terraform (infra provisioning)
```

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| [React 19](https://react.dev/) | UI framework — Hooks and Context API |
| [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety |
| [Vite](https://vitejs.dev/) | Build tool — fast HMR and ESM bundling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first responsive styling |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend

| Technology | Purpose |
|-----------|---------|
| [Node.js](https://nodejs.org/) | Runtime — v18+ |
| [NestJS](https://nestjs.com/) / [Express](https://expressjs.com/) | REST API framework |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database client and migrations |
| [JWT](https://jwt.io/) | Stateless authentication tokens |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Password hashing |

### Data & AI

| Technology | Purpose |
|-----------|---------|
| [PostgreSQL](https://www.postgresql.org/) | Primary relational database — patient and clinic data |
| [Redis](https://redis.io/) | Caching, job queues, and session storage |
| [Google Gemini API (`@google/genai`)](https://ai.google.dev/) | SOAP note summarisation and clinical Q&A |
| AES-256-GCM | Application-layer PHI field encryption |

### Infrastructure

| Tool | Purpose |
|------|---------|
| [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) | Containerised local and production deployment |
| [Terraform](https://www.terraform.io/) | AWS infrastructure provisioning (VPC, ECS, RDS, ElastiCache) |
| [AWS ECS](https://aws.amazon.com/ecs/) | Container orchestration in production |
| [AWS ECR](https://aws.amazon.com/ecr/) | Docker image registry |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline — build, test, push, deploy |
| [Stripe](https://stripe.com/) | Payment gateway integration (billing module) |

---

## 🧩 Core Modules

### 🔐 Authentication & Multi-Tenancy

- **Multi-tenant isolation** — each clinic is a separate tenant; all data queries are scoped by tenant ID enforced in middleware.
- **JWT authentication** — stateless access tokens with configurable expiry.
- **Role-Based Access Control** — four distinct roles: Admin, Doctor, Nurse, and Receptionist.
- **First-time setup flow** — secure onboarding for new clinics to set up admin credentials before accessing the platform.
- **Self-service password updates** — users can change their own passwords after initial setup.

### 🩺 Patient Records (EMR)

- **Electronic Medical Records** — complete patient profiles including demographics, medical history, diagnoses, prescriptions, and visit notes.
- **HIPAA-aligned PHI encryption** — all Protected Health Information fields (Medical History, Diagnoses) are encrypted at the application layer using **AES-256-GCM** before being written to PostgreSQL. Decryption only occurs in the API layer — raw encrypted blobs are never returned to the frontend.
- **CRUD operations** — Doctors and Nurses can create, read, update, and view patient records within their tenant.
- **Audit trail** — all PHI access and modifications are logged to the audit log module.

### 📅 Appointment Management

- **Appointment scheduling** — create, update, and cancel patient appointments.
- **Calendar view** — visual scheduling interface for Doctors and Receptionists.
- **Status tracking** — Pending → Confirmed → In-Progress → Completed → Cancelled lifecycle.
- **Conflict detection** — prevents double-booking of a Doctor or room in the same time slot.

### 👨‍⚕️ Telehealth

- **Integrated video call stub** — a telehealth module with a video call interface ready for WebRTC or a third-party provider (Daily.co, Twilio Video, Zoom SDK) to be wired in.
- **Session management** — telehealth appointments tracked with session IDs and timestamps.

### 💳 Billing & Invoicing

- **Invoice generation** — create itemised invoices for consultations, procedures, and medications.
- **Stripe integration ready** — the billing module is pre-wired for Stripe payment processing — add your `STRIPE_SECRET_KEY` to activate.
- **Payment status tracking** — Unpaid → Paid → Partially Paid → Refunded.
- **PDF export** — invoice download for patient records.

### 📊 Dashboard & Analytics

- **Role-based dashboard** — each role sees only the metrics and actions relevant to their function.
- **Revenue tracking** — daily, weekly, and monthly billing summaries.
- **Appointment metrics** — occupancy rates, cancellation rates, and upcoming schedules.
- **Activity logs** — real-time feed of clinical and administrative actions for audit purposes.

---

## 🔐 Role-Based Access Control

| Feature | Admin | Doctor | Nurse | Receptionist |
|---------|-------|--------|-------|-------------|
| View analytics dashboard | ✅ | ❌ | ❌ | ❌ |
| Manage staff accounts | ✅ | ❌ | ❌ | ❌ |
| Create / edit patient records | ✅ | ✅ | ✅ | ❌ |
| View patient EMR | ✅ | ✅ | ✅ | ❌ |
| Write SOAP notes | ✅ | ✅ | ❌ | ❌ |
| Use AI assistant | ✅ | ✅ | ✅ | ❌ |
| Schedule appointments | ✅ | ✅ | ✅ | ✅ |
| Access billing & invoices | ✅ | ❌ | ❌ | ✅ |
| Start telehealth session | ✅ | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ | ❌ |
| Manage inventory / prescriptions | ✅ | ✅ | ✅ | ❌ |
| Reset user passwords | ✅ | ❌ | ❌ | ❌ |

---

## 🤖 AI Assistant — Google Gemini

MediNexus integrates **Google Gemini** via the `@google/genai` SDK for two primary clinical use cases:

### SOAP Note Summarisation

The Doctor dictates or types raw consultation notes. The AI Assistant formats them into the standard **SOAP** structure:

```
S — Subjective  : Patient's reported symptoms and complaints
O — Objective   : Measurable clinical observations (vitals, lab results)
A — Assessment  : Diagnosis or differential diagnoses
P — Plan        : Treatment, medications, follow-up instructions
```

Example prompt sent to Gemini:
```
You are a clinical documentation assistant. 
Summarise the following consultation into a structured SOAP note:
[raw consultation text]
```

### Clinical Q&A

Doctors and Nurses can ask clinical questions (drug interactions, dosage guidelines, symptom differentials) and receive AI-assisted answers with appropriate medical caveats.

> ⚠️ **Important:** AI responses are intended as reference aids, not clinical decisions. All AI-generated content must be reviewed and validated by a licensed clinician before being used in patient care.

### Configuration

```env
API_KEY=your_google_gemini_api_key
```

Gemini is invoked via the backend AI module — the API key is never exposed to the frontend.

---

## 🔒 Security & Compliance

### PHI Encryption (AES-256-GCM)

All Protected Health Information fields are encrypted **before** database insertion:

```typescript
// Pseudocode — backend/src/common/encryption.service.ts
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encryptedPHI = cipher.update(rawMedicalHistory, 'utf8', 'hex') + cipher.final('hex');
// Store: { encryptedData, iv, authTag } in PostgreSQL
```

Decryption only occurs in the API response layer — the database never stores plaintext PHI.

### Additional Security Measures

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcrypt (cost factor 12) |
| Auth tokens | JWT with configurable expiry — stored httpOnly cookies |
| Audit logging | All PHI access, mutations, and auth events timestamped |
| TLS enforcement | Enforced via AWS Load Balancer in production |
| Rate limiting | API rate limiting middleware on all endpoints |
| Input validation | DTO validation via `class-validator` (NestJS) |
| CORS | Strict origin allowlist for frontend domains only |
| Multi-tenant isolation | Tenant ID enforced at middleware level — prevents cross-clinic data access |

---

## 📂 Project Structure

```
medinexus-monorepo/
│
├── backend/
│   ├── src/
│   │   ├── auth/            # JWT auth, RBAC guards, tenant middleware
│   │   ├── patients/        # EMR module — CRUD, PHI encryption
│   │   ├── appointments/    # Scheduling, conflict detection, lifecycle
│   │   ├── ai/              # Gemini integration — SOAP, Q&A
│   │   ├── billing/         # Invoicing, Stripe, payment tracking
│   │   ├── telehealth/      # Video session stub
│   │   ├── audit/           # Audit log module
│   │   └── common/          # Encryption service, DTOs, interceptors
│   ├── prisma/
│   │   ├── schema.prisma    # Full database schema
│   │   └── migrations/      # Prisma migration history
│   ├── Dockerfile           # Backend container definition
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Dashboard, EMR, Appointments, Billing, AI
│   │   ├── components/      # Shared UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Auth context, tenant context
│   │   └── services/        # API client functions
│   ├── public/
│   ├── Dockerfile           # Frontend container definition
│   ├── vite.config.ts
│   └── package.json
│
├── infra/
│   └── terraform/           # AWS VPC, ECS, RDS, ElastiCache, ALB provisioning
│
├── docker-compose.yml       # Full-stack local development orchestration
├── .gitignore               # Ignores node_modules, .env, dist, prisma client
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker** & **Docker Compose** — for containerised setup
- **Node.js v18+** — for local development without Docker
- **Google Gemini API Key** — for AI assistant features

### Quick Start — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/ibtesaamaslam/MediNexus.git
cd MediNexus

# 2. Create environment file
cp .env.example .env
# → Edit .env with your values (see Environment Variables below)

# 3. Start the full stack
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## 🔑 Environment Variables

Create a `.env` file in the repository root:

```env
# PostgreSQL
DB_USER=postgres
DB_PASSWORD=securepassword
DB_NAME=medinexus

# Authentication
JWT_SECRET=super_secret_key_change_in_production
JWT_EXPIRY=7d

# Google Gemini AI
API_KEY=your_google_gemini_api_key

# Stripe (Billing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Redis
REDIS_URL=redis://redis:6379

# Environment
NODE_ENV=development
PORT=3000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | ✅ | PostgreSQL credentials |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens — must be long and random in production |
| `API_KEY` | For AI features | Google Gemini API key from [Google AI Studio](https://aistudio.google.com/) |
| `STRIPE_SECRET_KEY` | For billing | Stripe secret key from [Stripe Dashboard](https://dashboard.stripe.com/) |
| `REDIS_URL` | ✅ | Redis connection URL |

---

## 💻 Local Development

If you prefer running services individually without Docker:

### Step 1 — Start Database Services

```bash
docker-compose up -d postgres redis
```

### Step 2 — Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
# → API running at http://localhost:3000
```

### Step 3 — Frontend

```bash
cd frontend
npm install
npm run dev
# → Frontend running at http://localhost:5173
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all backend unit tests
cd backend
npm run test
```

### End-to-End Tests

```bash
# Run E2E tests with Cypress
cd backend
npm run test:e2e
```

### Test Coverage

```bash
cd backend
npm run test:cov
```

---

## 🚢 Deployment

### Production — AWS (ECS + RDS + ElastiCache)

#### Step 1 — Provision Infrastructure

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

This provisions: VPC, ECS Cluster, ECS Services (frontend + backend), RDS PostgreSQL, ElastiCache Redis, Application Load Balancer, and ACM TLS certificate.

#### Step 2 — Build and Push Docker Images

```bash
# Build images
docker build -t medinexus-backend ./backend
docker build -t medinexus-frontend ./frontend

# Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ecr-uri>
docker tag medinexus-backend <ecr-uri>/medinexus-backend:latest
docker push <ecr-uri>/medinexus-backend:latest
```

#### Step 3 — Deploy via GitHub Actions

Push to `main` triggers the CI/CD pipeline:
1. Runs unit and E2E tests
2. Builds Docker images
3. Pushes images to ECR
4. Updates ECS service with new task definition

### One-Click Alternatives

| Service | Target |
|---------|--------|
| [Vercel](https://vercel.com/) | Deploy `frontend/` folder |
| [Netlify](https://www.netlify.com/) | Deploy `frontend/` folder |
| [Render](https://render.com/) | Deploy `backend/` folder |
| [Railway](https://railway.app/) | Deploy `backend/` + managed PostgreSQL |
| [Heroku](https://www.heroku.com/) | Deploy `backend/` folder |

---

## 🗺 Roadmap

- [ ] **Real-time sync** — WebSocket-based live updates for KDS and appointment status across multiple staff devices
- [ ] **Full WebRTC telehealth** — replace the video stub with a production WebRTC implementation (Daily.co or Twilio Video)
- [ ] **Prescription management** — e-prescribing with pharmacy integration
- [ ] **Lab results integration** — HL7 FHIR-compliant lab result ingestion
- [ ] **Mobile PWA** — offline-capable Progressive Web App for mobile clinical staff
- [ ] **SMS/WhatsApp reminders** — automated appointment reminders via Twilio
- [ ] **Advanced analytics** — patient outcome tracking and population health dashboards
- [ ] **FHIR API** — expose a standards-compliant FHIR R4 API for EHR interoperability
- [ ] **Multi-language support** — i18n for Arabic, Urdu, and French
- [ ] **Biometric login** — WebAuthn / passkey support for clinical staff

---

## 🤝 Contributing

```bash
# 1. Fork the repository

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/MediNexus.git
cd MediNexus

# 3. Create a feature branch
git checkout -b feature/fhir-api-integration

# 4. Make changes and commit
git add .
git commit -m "feat: add FHIR R4 patient resource endpoint"

# 5. Push and open a Pull Request
git push origin feature/fhir-api-integration
```

Please follow secure coding practices — never commit real patient data, API keys, or JWT secrets.

---

## 👤 Author

<div align="center">

**Ibtesaam Aslam**

[![GitHub](https://img.shields.io/badge/GitHub-ibtesaamaslam-181717?style=for-the-badge&logo=github)](https://github.com/ibtesaamaslam)

*Full-Stack Developer · SaaS Architect · AI Enthusiast*

</div>

---

## 📜 License

```
Proprietary License — Commercial Use Restricted

Copyright (c) 2024 Ibtesaam Aslam. All Rights Reserved.

This software and associated documentation files are provided for viewing,
evaluation, and non-commercial educational purposes only.

You are granted a non-exclusive, non-transferable, revocable license to
access and review the Software solely for personal reference.

Except as expressly permitted above, you are strictly prohibited from:
  - Copying, reproducing, or redistributing the Software in whole or in part
  - Modifying, adapting, or creating derivative works
  - Using the Software for any commercial purposes
  - Selling, sublicensing, or monetizing the Software

Any commercial use requires prior written permission from the author.
Unauthorized commercial use may result in legal action.

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
THE AUTHOR ACCEPTS NO LIABILITY FOR ANY DAMAGES ARISING FROM USE.
```

| Permission | Status |
|-----------|--------|
| ❌ Commercial use | Requires written permission |
| ❌ Redistribution | Not permitted |
| ❌ Modification for redistribution | Not permitted |
| ✅ Personal review and learning | Permitted |
| ✅ Internal evaluation | Permitted |

---

## 🙏 Acknowledgements

- **[Google Gemini](https://ai.google.dev/)** — for the AI API powering SOAP note summarisation and clinical Q&A.
- **[Prisma](https://www.prisma.io/)** — for the type-safe ORM that makes database operations in TypeScript reliable and maintainable.
- **[NestJS](https://nestjs.com/)** — for the opinionated, enterprise-grade Node.js framework that structures the backend with dependency injection and modular architecture.
- **[Stripe](https://stripe.com/)** — for the billing and payment infrastructure.
- **[Terraform](https://www.terraform.io/)** — for infrastructure-as-code that makes cloud provisioning reproducible and version-controlled.

---

<div align="center">

*Built with ❤️ by [Ibtesaam Aslam](https://github.com/ibtesaamaslam) — Running smarter clinics, one feature at a time.*

</div>
