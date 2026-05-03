import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export interface AuthRequest {
  user?: {
    userId: string;
    clinicId: string;
    role: string;
  };
  [key: string]: any;
}

export const authenticate = async (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      clinicId: decoded.clinicId,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: any, res: any, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};