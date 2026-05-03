export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT'
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logoUrl?: string;
  subscriptionTier: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  medicalHistorySummary: string; // Encrypted in backend
  lastVisit: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // ISO String
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type: 'CHECKUP' | 'FOLLOW_UP' | 'TELEHEALTH' | 'EMERGENCY';
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  content: string; // This would be encrypted
  aiSummary?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  date: string;
  dueDate: string;
  items: string[];
}