import { Response, Request } from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { encrypt, decrypt } from '../utils/encryption';
import { z } from 'zod';
import { SupabaseService } from '../services/supabase.service';

const prisma = new PrismaClient();

const CreatePatientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  medicalHistory: z.string().optional()
});

const UpdatePatientSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  medicalHistory: z.string().optional()
});

export const createPatient = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    if (!clinicId) return res.status(401).json({ error: 'No clinic context' });

    const data = CreatePatientSchema.parse(req.body);
    const encryptedHistory = data.medicalHistory ? encrypt(data.medicalHistory) : null;

    const patient = await prisma.patient.create({
      data: {
        clinicId,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob ? new Date(data.dob) : undefined,
        email: data.email,
        phone: data.phone,
        medicalRecordEncrypted: encryptedHistory
      }
    });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

export const getPatients = async (req: any, res: any) => {
  try {
    const clinicId = (req as AuthRequest).user?.clinicId;
    const patients = await prisma.patient.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' }
    });
    const sanitizedPatients = patients.map((p: any) => ({
      ...p,
      medicalRecordEncrypted: undefined
    }));
    res.json(sanitizedPatients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const getPatientDetail = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const clinicId = (req as AuthRequest).user?.clinicId;

    const patient = await prisma.patient.findFirst({ where: { id, clinicId } });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    let medicalHistory = null;
    if (patient.medicalRecordEncrypted) {
      try {
        medicalHistory = decrypt(patient.medicalRecordEncrypted);
      } catch (e) {
        medicalHistory = "Error decrypting record";
      }
    }

    // Fetch Documents from Supabase
    let documents: any[] = [];
    try {
       documents = await SupabaseService.listFiles('medinexus-docs', `${clinicId}/${id}`);
    } catch (e) {
       console.warn("Storage fetch failed", e);
    }

    res.json({
      ...patient,
      medicalHistory,
      medicalRecordEncrypted: undefined,
      documents
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving patient' });
  }
};

export const updatePatient = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const clinicId = (req as AuthRequest).user?.clinicId;
    const data = UpdatePatientSchema.parse(req.body);
    
    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dob: data.dob ? new Date(data.dob) : undefined
    };

    if (data.medicalHistory !== undefined) {
      updateData.medicalRecordEncrypted = data.medicalHistory ? encrypt(data.medicalHistory) : null;
    }

    const updatedPatient = await prisma.patient.update({
      where: { id, clinicId }, // ensures ownership
      data: updateData
    });
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

export const deletePatient = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const clinicId = (req as AuthRequest).user?.clinicId;
    await prisma.patient.deleteMany({ where: { id, clinicId } }); // deleteMany checks condition
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};

export const uploadDocument = async (req: any, res: any) => {
  try {
    const { id } = req.params; // Patient ID
    const clinicId = (req as AuthRequest).user?.clinicId;
    const file = req.file;

    if (!file || !clinicId) return res.status(400).json({ error: 'Invalid request' });

    const path = `${clinicId}/${id}/${Date.now()}_${file.originalname}`;
    
    const result = await SupabaseService.uploadFile(
      'medinexus-docs', 
      path, 
      file.buffer, 
      file.mimetype
    );

    res.json({ message: 'Uploaded', url: result.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};