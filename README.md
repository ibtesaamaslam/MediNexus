# MediNexus SaaS - Clinic Management Platform

MediNexus is a secure, multi-tenant SaaS platform designed for clinics to manage patient records, appointments, billing, and leverage AI for clinical assistance.

## 🚀 Features

- **Multi-Tenancy:** Secure isolation for multiple clinics.
- **Role-Based Access Control (RBAC):** Admin, Doctor, Nurse, Receptionist roles.
- **Patient Records (EMR):** HIPAA-compliant storage with field-level PHI encryption.
- **AI Assistant:** Google Gemini integration for SOAP note summarization and Q&A.
- **Telehealth:** Integrated video call stub.
- **Billing:** Invoicing and Stripe integration ready.

##  Project Structure 

medinexus-monorepo/
├── .gitignore             # Ignores node_modules, .env, dist
├── README.md
├── docker-compose.yml
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
└── infra/                 # Terraform/K8s


## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js (NestJS/Express), Prisma ORM
- **Database:** PostgreSQL (Relational Data), Redis (Cache/Queues)
- **AI:** Google Gemini API (@google/genai)
- **Infra:** Docker, Terraform (AWS)

## 🏁 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js v18+ (if running locally without Docker)
- Google Gemini API Key (for AI features)

### Quick Start (Docker)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/medinexus.git
   cd medinexus
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   DB_USER=postgres
   DB_PASSWORD=securepassword
   DB_NAME=medinexus
   JWT_SECRET=super_secret_key_change_in_prod
   API_KEY=your_google_gemini_api_key
   ```

3. **Run the Stack:**
   ```bash
   docker-compose up --build
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Postgres: localhost:5432

### Local Development (Manual)

If you prefer running services individually:

**1. Database:**
Start Postgres and Redis using Docker:
```bash
docker-compose up -d postgres redis
```

**2. Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

**3. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

- **Unit Tests:** `npm run test` (in backend/)
- **E2E Tests:** `npm run test:e2e` (using Cypress)

## 🔒 Security & Compliance

- **PHI Encryption:** All sensitive patient data (Medical History) is encrypted at the application layer using AES-256-GCM before storage.
- **Audit Logs:** Critical actions are logged.
- **TLS:** Enforced in production via Load Balancer.

## 📦 Deployment

### Production (AWS)

1. **Provision Infra:**
   ```bash
   cd infra/terraform
   terraform init && terraform apply
   ```
2. **Deploy Containers:**
   Push images to ECR and update ECS services via GitHub Actions.

### One-Click Deploy

- **Frontend:** Deploy `frontend/` folder to **Vercel** or **Netlify**.
- **Backend:** Deploy `backend/` folder to **Render**, **Railway**, or **Heroku**.

---
*Disclaimer: This is a demo application. Consult legal counsel for HIPAA/GDPR compliance in production.*
