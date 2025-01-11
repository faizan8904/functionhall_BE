import jwt from 'jsonwebtoken';
import { AppError } from './globalErrorHandler.js'

// Middleware to verify token from `req.body`
export const verifyToken = (req, res, next) => {
    const  token  = req.cookies.authToken;
    console.log(token);
    
    if (!token) {
        return next(new AppError('No token provided', 401));
    }

    try {
        // Verify token with secret
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next(new AppError('Invalid or expired token', 401));
    }
};

// Middleware to protect routes for authenticated users
export const protectRoute = (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Unauthorized access', 403));
    }
    next();
};
