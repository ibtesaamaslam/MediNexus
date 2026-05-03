import { Tenant, User, UserRole } from './types';

export const MOCK_TENANT: Tenant = {
  id: 't_default',
  name: 'My Clinic',
  subdomain: 'clinic',
  subscriptionTier: 'PROFESSIONAL'
};

// Default empty user for initialization context if needed, though AuthContext handles null
export const MOCK_USER: User = {
  id: '',
  email: '',
  name: '',
  role: UserRole.DOCTOR,
  tenantId: ''
};
