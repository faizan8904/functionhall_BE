import express from 'express';
import { verifyToken, protectRoute } from '../middleware/auth.middleware.js';
import { deleteUser, getUserProfile, loginUser, registerUser, updateUser } from '../controller/user.controller.js';

const router = express.Router();

// User Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, protectRoute, getUserProfile);
router.put('/update', verifyToken, protectRoute, updateUser);
router.delete('/delete', verifyToken, protectRoute, deleteUser);

export default router;
