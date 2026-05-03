# Security & Compliance Checklist (HIPAA/GDPR)

## Data Protection
- [x] **Encryption at Rest:** Database storage (AWS RDS) is encrypted.
- [x] **Field-Level Encryption:** Sensitive PHI (e.g., medical history) is encrypted at the application layer using AES-256-GCM before entering the database.
- [x] **Encryption in Transit:** TLS 1.2+ enforced for all API connections.

## Access Control
- [x] **Authentication:** JWT (JSON Web Tokens) with secure signing algorithms.
- [x] **RBAC:** Strict role separation (Admin vs Doctor vs Receptionist).
- [x] **Tenant Isolation:** Data is logically separated by `clinicId`.

## Auditing & Monitoring
- [ ] **Audit Logs:** Enable logging for all READ/WRITE access to patient records (To be implemented in Sprint 2).
- [ ] **Key Management:** Migrate from environment variable keys to AWS KMS (Sprint 2).

## Operational
- [ ] **BAA:** Business Associate Agreement signed with cloud provider (AWS/Google).
- [ ] **Backups:** Automated daily encrypted backups with 7-year retention.