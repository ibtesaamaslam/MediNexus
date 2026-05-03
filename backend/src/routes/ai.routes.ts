import { Router } from 'express';
import { summarizeNotes } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/summarize', summarizeNotes);

export default router;