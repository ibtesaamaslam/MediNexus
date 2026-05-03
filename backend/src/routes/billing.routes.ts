import { Router } from 'express';
import { createInvoice, getInvoices } from '../controllers/billing.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getInvoices);
router.post('/', createInvoice);

export default router;