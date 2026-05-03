import { Appointment, Patient, Tenant, User, UserRole, Invoice } from './types';

export const MOCK_TENANT: Tenant = {
  id: 't_123',
  name: 'Springfield Family Health',
  subdomain: 'springfield',
  subscriptionTier: 'PROFESSIONAL'
};

export const MOCK_USER: User = {
  id: 'u_1',
  email: 'dr.smith@springfield.health',
  name: 'Dr. Jane Smith',
  role: UserRole.DOCTOR,
  tenantId: 't_123',
  avatarUrl: 'https://picsum.photos/id/64/200/200'
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p_1',
    tenantId: 't_123',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1985-04-12',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Maple Ave, Springfield',
    medicalHistorySummary: 'Hypertension (Dx 2018), T2 Diabetes controlled with diet.',
    lastVisit: '2023-10-15',
    status: 'ACTIVE'
  },
  {
    id: 'p_2',
    tenantId: 't_123',
    firstName: 'Sarah',
    lastName: 'Connor',
    dob: '1990-08-24',
    email: 's.connor@skynet.net',
    phone: '(555) 987-6543',
    address: '456 Cyberdyne Ln, Los Angeles',
    medicalHistorySummary: 'Trauma to left shoulder. History of anxiety.',
    lastVisit: '2023-11-02',
    status: 'ACTIVE'
  },
  {
    id: 'p_3',
    tenantId: 't_123',
    firstName: 'Robert',
    lastName: 'Bruce',
    dob: '1975-01-30',
    email: 'bruce@wayne.ent',
    phone: '(555) 000-1111',
    address: '1007 Mountain Dr, Gotham',
    medicalHistorySummary: 'Multiple orthopedic injuries. Chronic back pain.',
    lastVisit: '2023-09-20',
    status: 'ACTIVE'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a_1',
    patientId: 'p_1',
    patientName: 'John Doe',
    doctorId: 'u_1',
    doctorName: 'Dr. Jane Smith',
    date: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    status: 'SCHEDULED',
    type: 'CHECKUP',
    notes: 'Annual physical'
  },
  {
    id: 'a_2',
    patientId: 'p_2',
    patientName: 'Sarah Connor',
    doctorId: 'u_1',
    doctorName: 'Dr. Jane Smith',
    date: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    status: 'SCHEDULED',
    type: 'FOLLOW_UP',
    notes: 'Shoulder mobility check'
  },
  {
    id: 'a_3',
    patientId: 'p_3',
    patientName: 'Robert Bruce',
    doctorId: 'u_1',
    doctorName: 'Dr. Jane Smith',
    date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    status: 'COMPLETED',
    type: 'TELEHEALTH',
    notes: 'Lab results review'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    patientId: 'p_3',
    patientName: 'Robert Bruce',
    amount: 150.00,
    status: 'PENDING',
    date: '2023-11-01',
    dueDate: '2023-11-15',
    items: ['Telehealth Consultation', 'Lab Review']
  },
  {
    id: 'inv_002',
    patientId: 'p_1',
    patientName: 'John Doe',
    amount: 200.00,
    status: 'PAID',
    date: '2023-10-15',
    dueDate: '2023-10-30',
    items: ['Annual Physical', 'Blood Work']
  },
  {
    id: 'inv_003',
    patientId: 'p_2',
    patientName: 'Sarah Connor',
    amount: 450.00,
    status: 'OVERDUE',
    date: '2023-09-20',
    dueDate: '2023-10-04',
    items: ['Emergency Visit', 'X-Ray - Shoulder']
  }
];