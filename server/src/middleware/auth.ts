import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  try {
    // Changed JWT_SECRET to JWT_SECRET_KEY to match your .env
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not configured');
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = { username: decoded.username };
    return next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};