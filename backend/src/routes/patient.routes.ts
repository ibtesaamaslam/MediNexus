import { Router } from 'express';
import { createPatient, getPatients, getPatientDetail, updatePatient, deletePatient, uploadDocument } from '../controllers/patient.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.get('/', getPatients);
router.get('/:id', getPatientDetail);
router.post('/', authorize(['ADMIN', 'DOCTOR', 'NURSE']), createPatient);
router.put('/:id', authorize(['ADMIN', 'DOCTOR']), updatePatient);
router.delete('/:id', authorize(['ADMIN']), deletePatient);
router.post('/:id/documents', upload.single('file'), uploadDocument);

export default router;