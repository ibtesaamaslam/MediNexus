import { Router } from 'express';
import { createAppointment, getAppointments, updateAppointment } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);

export default router;