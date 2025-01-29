import { Router } from 'express';
import { ticketRouter } from './ticket-routes.js';
import { userRouter } from './user-routes.js';
import { authenticateToken } from '../../middleware/auth.js'; // Import the authenticateToken middleware

const router = Router();

// Apply authentication middleware to all routes under /api
// The authenticateToken middleware ensures the user must be authenticated
router.use('/tickets', authenticateToken, ticketRouter);
router.use('/users', authenticateToken, userRouter);

export default router;
