import { Request, Response } from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

/**
 * DATA WAREHOUSE (ETL)
 * Aggregates transactional data into a lightweight analytics format.
 * In production, this would be a scheduled job (Cron).
 */
export const generateDailyMetrics = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    if (!clinicId) return res.status(401).json({ error: 'Unauthorized' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Aggregate Appointments
    const appointmentCounts = await prisma.appointment.groupBy({
      by: ['status'],
      where: {
        clinicId,
        startAt: { gte: today }
      },
      _count: { id: true }
    });

    // 2. Aggregate Revenue
    const revenue = await prisma.invoice.aggregate({
      where: {
        clinicId,
        status: 'PAID',
        createdAt: { gte: today }
      },
      _sum: { amount: true }
    });

    // 3. Aggregate Patients
    const totalPatients = await prisma.patient.count({
      where: { clinicId }
    });

    const metrics = {
      date: today.toISOString().split('T')[0],
      appointments: appointmentCounts,
      revenue: revenue._sum.amount || 0,
      totalPatients
    };

    // In a real warehouse, we would insert this into a `DailyMetric` table here.
    // await prisma.dailyMetric.create({ data: ... })

    res.json(metrics);
  } catch (error) {
    console.error("Analytics Error", error);
    res.status(500).json({ error: "Failed to generate metrics" });
  }
};

export const getDashboardStats = async (req: any, res: any) => {
    // Re-uses the generation logic for real-time dashboard display
    return generateDailyMetrics(req, res);
};