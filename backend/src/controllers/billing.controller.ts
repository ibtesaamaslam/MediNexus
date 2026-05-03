import { Response, Request } from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const InvoiceSchema = z.object({
  patientId: z.string(),
  amount: z.number().positive(),
  items: z.array(z.string()),
  dueDate: z.string().datetime().optional()
});

export const createInvoice = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    if (!clinicId) return res.status(401).json({ error: 'Unauthorized' });

    const data = InvoiceSchema.parse(req.body);

    // Simple Mock ID generation for items if we were storing structured items
    // For now, storing items as a string array or JSON based on schema
    
    const invoice = await prisma.invoice.create({
      data: {
        clinicId,
        patientId: data.patientId,
        amount: data.amount,
        status: 'PENDING',
        items: JSON.stringify(data.items), // Storing as JSON string for simplicity
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const getInvoices = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    
    const invoices = await prisma.invoice.findMany({
      where: { clinicId },
      include: {
        patient: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = invoices.map((inv: any) => ({
      ...inv,
      patientName: `${inv.patient.firstName} ${inv.patient.lastName}`,
      items: typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};