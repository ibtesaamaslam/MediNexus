import { Router } from 'express';
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';
import appointmentRoutes from './appointment.routes';
import billingRoutes from './billing.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/billing', billingRoutes);
router.use('/ai', aiRoutes);

export default router;