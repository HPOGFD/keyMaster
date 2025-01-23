import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Route for authentication endpoints like login
router.use('/auth', authRoutes);

// Protect all /api routes with the authenticateToken middleware
router.use('/api', authenticateToken, apiRoutes);  // The authenticateToken will be applied to all routes under /api

export default router;
