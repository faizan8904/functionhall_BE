import Booking from '../model/Booking.js';
import { AppError } from '../middleware/globalErrorHandler.js';

// Create a new booking
export const createBooking = async (req, res, next) => {
    try {
        const { customerName, phoneNumber, alternateNumber, email, totalAmount, givenAmount, address, date, time } = req.body;

        // Create and save the booking
        const newBooking = await Booking.create({
            customerName,
            phoneNumber,
            alternateNumber,
            email,
            totalAmount,
            givenAmount,
            address,
            date,
            time,
        });

        res.status(201).json({
            status: 'success',
            data: { booking: newBooking },
        });
    } catch (err) {
        next(err);
    }
};

// Get all bookings
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings },
        });
    } catch (err) {
        next(err);
    }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { booking },
        });
    } catch (err) {
        next(err);
    }
};

// Update a booking
export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedBooking) {
            return next(new AppError('Booking not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { booking: updatedBooking },
        });
    } catch (err) {
        next(err);
    }
};

// Delete a booking
export const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return next(new AppError('Booking not found', 404));
        }

        res.status(204).json({
            status: 'success',
            message: 'Booking deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};
