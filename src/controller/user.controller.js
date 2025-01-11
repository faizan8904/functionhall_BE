import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/globalErrorHandler.js';

// Register a new user (Admin or Sub-admin)
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('User already exists', 400));
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

// User login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET,
            { expiresIn: '5h' }
        );

        res.cookie('authToken', token, {
            httpOnly: true,            // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS in production
            sameSite: 'strict',        // Protects against CSRF attacks
            maxAge: 5 * 60 * 1000      // 5 minutes in milliseconds
        });

        res.status(200).json({
            status: 'success',
            token,
        });
    } catch (err) {
        next(err);
    }
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (err) {
        next(err);
    }
};

// Update user details
export const updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser },
        });
    } catch (err) {
        next(err);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(204).json({
            status: 'success',
            message: 'User deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};
