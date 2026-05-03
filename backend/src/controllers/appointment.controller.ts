
import { Response, Request } from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';
import crypto from 'crypto';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  startAt: z.string().datetime(), // ISO String
  endAt: z.string().datetime(),   // ISO String
  type: z.string().optional(),
  notes: z.string().optional()
});

const UpdateAppointmentSchema = z.object({
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  type: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional()
});

export const createAppointment = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    if (!clinicId) return res.status(401).json({ error: 'Unauthorized' });

    const data = CreateAppointmentSchema.parse(req.body);
    const start = new Date(data.startAt);
    const end = new Date(data.endAt);

    if (start >= end) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    // 1. Conflict Check (Double Booking Prevention)
    const conflicts = await prisma.appointment.findFirst({
      where: {
        clinicId,
        doctorId: data.doctorId,
        status: { notIn: ['CANCELLED'] },
        AND: [
          { startAt: { lt: end } },
          { endAt: { gt: start } }
        ]
      }
    });

    if (conflicts) {
      return res.status(409).json({ 
        error: 'Doctor is unavailable at this time.',
        conflict: conflicts 
      });
    }

    // 2. Generate Telehealth Link if needed
    let videoLink = null;
    if (data.type === 'TELEHEALTH') {
      const roomToken = crypto.randomBytes(16).toString('hex');
      videoLink = `https://meet.medinexus.com/room/${roomToken}`;
    }

    // 3. Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        clinicId,
        patientId: data.patientId,
        doctorId: data.doctorId,
        startAt: start,
        endAt: end,
        type: data.type || 'CHECKUP',
        notes: data.notes,
        status: 'SCHEDULED',
        videoLink: videoLink
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    // 4. Send Notification
    // We don't await this to avoid blocking the response
    NotificationService.notifyAppointmentCreated(
      appointment, 
      appointment.patient?.email, 
      appointment.patient?.phone
    ).catch(err => console.error("Notification failed", err));

    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAppointment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const clinicId = (req as AuthRequest).user?.clinicId;
    if (!clinicId) return res.status(401).json({ error: 'Unauthorized' });

    const data = UpdateAppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.findFirst({
      where: { id, clinicId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        startAt: data.startAt ? new Date(data.startAt) : undefined,
        endAt: data.endAt ? new Date(data.endAt) : undefined,
        type: data.type,
        notes: data.notes,
        status: data.status as any
      }
    });

    res.json(updated);
  } catch (error) {
     if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

export const getAppointments = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    if (!clinicId) return res.status(401).json({ error: 'Unauthorized' });

    const appointments = await prisma.appointment.findMany({
      where: { clinicId },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        },
        doctor: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { startAt: 'asc' }
    });

    const formatted = appointments.map((appt: any) => ({
      ...appt,
      patientName: `${appt.patient.firstName} ${appt.patient.lastName}`,
      doctorName: `${appt.doctor.firstName} ${appt.doctor.lastName}`
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
