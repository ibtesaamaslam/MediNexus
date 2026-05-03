# MediNexus Repository Skeleton

This document outlines the file structure for the MediNexus Monorepo.

```text
medinexus/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml           # Main CI/CD pipeline
│       └── security-scan.yml   # CodeQL/Snyk scanning
├── backend/                    # Node.js/NestJS API
│   ├── src/
│   │   ├── config/             # Environment config
│   │   ├── modules/
│   │   │   ├── auth/           # Auth (JWT, RBAC)
│   │   │   ├── patient/        # Patient Records (Encrypted)
│   │   │   ├── appointment/    # Scheduling logic
│   │   │   ├── billing/        # Stripe Integration
│   │   │   └── ai/             # Gemini Service Integration
│   │   ├── common/
│   │   │   ├── decorators/     # @User(), @Roles()
│   │   │   ├── guards/         # AuthGuard, RolesGuard
│   │   │   ├── middleware/     # TenantMiddleware
│   │   │   └── utils/          # Encryption helpers
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database Schema
│   │   │   └── migrations/     # SQL Migrations
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                   # Integration/E2E tests
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route views
│   │   ├── services/           # API clients
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── infra/                      # Infrastructure as Code
│   ├── terraform/
│   │   ├── main.tf             # AWS Resources (ECS, RDS, S3)
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── k8s/                    # Kubernetes Manifests (Optional)
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── helm/                   # Helm Charts
├── scripts/                    # Automation Scripts
│   ├── init-db.sh              # DB Seeder
│   ├── generate-keys.sh        # Local encryption key gen
│   └── deploy.sh               # Deployment helper
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.yaml           # OpenAPI/Swagger
│   └── RUNBOOK.md
├── docker-compose.yml          # Local dev orchestration
├── README.md                   # Entry point documentation
└── metadata.json               # Project Metadata
```