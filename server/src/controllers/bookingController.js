//This import is necessary since the controller handles the specification of HTTP codes.
//But notice something, I'm not importing error codes since it is handled by the booking validator itself.
import { AppError } from "../errors/AppError.js";

//Having services to satisfy the need of the project
import {
    createBooking as createBookingService,
    getBookingById as getBookingByIdService,
    getBookings as getBookingsService,
} from "../services/bookingService.js";

//Importing validation layer, but parsing shouldn't be confused with validation since it parses rather than validate. 
import {
    parseBookingId,
    validateCreateBooking,
} from "../validators/bookingValidator.js";

/**
 * POST /bookings
 */
export async function createBooking(req, res, next) {
    try {
        const validation = validateCreateBooking(req.body);

        if (!validation.isValid) {
            return next(
                new AppError(
                    validation.message,
                    validation.statusCode,
                    validation.errorCode
                )
            );
        }

        const booking = await createBookingService({
            userId: req.user.id,
            ...validation.value,
        });

        return res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * GET /bookings/me
 */
export async function getBookings(req, res, next) {
    try {
        const bookings = await getBookingsService(req.user.id);

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * GET /bookings/:id
 */
export async function getBookingById(req, res, next) {
    try {
        const bookingId = parseBookingId(req.params.id);

        if (bookingId === null) {
            return next(
                new AppError(
                    "Booking ID must be a positive integer.",
                    400,
                    ERROR_CODES.INVALID_BOOKING_ID
                )
            );
        }

        const booking = await getBookingByIdService(bookingId);

        return res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return next(error);
    }
}