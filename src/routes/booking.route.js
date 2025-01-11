import express from 'express';
import { verifyToken, protectRoute } from '../middleware/auth.middleware.js';
import { createBooking, deleteBooking, getAllBookings, getBookingById, updateBooking } from '../controller/booking.controller.js';

const router = express.Router();

// Booking Routes
router.post('/create', verifyToken, protectRoute, createBooking);
router.get('/all', verifyToken, protectRoute, getAllBookings);
router.get('/:id', verifyToken, protectRoute, getBookingById);
router.put('/:id', verifyToken, protectRoute, updateBooking);
router.delete('/:id', verifyToken, protectRoute, deleteBooking);

export default router;
