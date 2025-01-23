import { Router, Request, Response } from 'express';
import { User } from '../models/user.js'; // Adjust based on your actual user model file location
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Step 1: Check if the user exists in the database
    const user = await User.findOne({ where: { username } });  // Replace with your actual query logic

    if (!user) {
      // If the user does not exist, return an unauthorized response
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Step 2: Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If the passwords don't match, return an unauthorized response
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Step 3: Create a JWT token
    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });  // Customize expiration as needed

    // Step 4: Return the JWT token in the response
    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
