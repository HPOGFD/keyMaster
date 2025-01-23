import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the "Authorization" header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Split Bearer and token

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  // Try verifying and decoding the token
  try {
    const secretKey = process.env.JWT_SECRET as string; // Retrieve the JWT secret key
    const decoded = jwt.verify(token, secretKey) as JwtPayload; // Verify the token and decode it

    // Attach user data (in this case, the username) to the request object for further processing
    req.user = { username: decoded.username };
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return a 403 Forbidden response
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
