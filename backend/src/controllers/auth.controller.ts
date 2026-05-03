import { Request, Response } from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  clinicName: z.string().min(2),
  firstName: z.string(),
  lastName: z.string()
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const register = async (req: any, res: any) => {
  try {
    const data = RegisterSchema.parse(req.body);

    // 1. Create Clinic
    const clinic = await prisma.clinic.create({
      data: {
        name: data.clinicName,
        timezone: 'UTC'
      }
    });

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Create Admin User
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'ADMIN',
        clinicId: clinic.id
      }
    });

    // 4. Generate Token
    const token = jwt.sign(
      { userId: user.id, clinicId: clinic.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
       return res.status(400).json({ error: error.issues });
    }
    console.error("Registration Error", error);
    res.status(400).json({ error: 'Registration failed. Email may already exist.' });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const data = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, clinicId: user.clinicId, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Login failed' });
  }
};