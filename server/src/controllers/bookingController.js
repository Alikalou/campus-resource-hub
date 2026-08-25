//This import is necessary since the controller handles the specification of HTTP codes.
//But notice something, I'm not importing error codes since it is handled by the booking validator itself.
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

import { createPaginationMeta } from "../utils/pagination.js";

//Having services to satisfy the need of the project
import {
    createBooking as createBookingService,
    getBookingById as getBookingByIdService,
    getMyBookings as getMyBookingsService,
    updateBookingStatus as updateBookingStatusService,
    getAllBookings as getAllBookingsService,
    cancelBooking as cancelBookingService
} from "../services/bookingService.js";

//Importing validation layer, but parsing shouldn't be confused with validation since it parses rather than validate. 
import {
    validateCreateBooking,
    validateUpdateBookingStatus
} from "../validators/booking/bookingValidator.js";

import { parseBookingId } from "../validators/booking/bookingValidationUtils.js";


export async function getAllBookings(req, res, next) {
    try {

        const {
            page,
            limit,
            offset,
        } = req.pagination;

        const {
            bookings,
            total } = await getAllBookingsService({ limit, offset });

        return res.status(200).json({
            success: true,
            data: bookings,
            pagination: createPaginationMeta({
                page,
                limit,
                total,
            }),
        });

    } catch (error) {
        return next(error);
    }
}

/**
 * GET /bookings/me
 */
export async function getMyBookings(req, res, next) {
    try {
        const {
            page,
            limit,
            offset,
        } = req.pagination;

        const {
            bookings,
            total,
        } = await getMyBookingsService({
            userId: req.user.id,
            limit,
            offset,
        });

        return res.status(200).json({
            success: true,
            data: bookings,
            pagination: createPaginationMeta({
                page,
                limit,
                total,
            }),
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

        if (booking.user_id !== req.user.id) {
            throw new AppError(
                "You are not allowed to access this booking.",
                403,
                ERROR_CODES.FORBIDDEN
            );
        }

        return res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return next(error);
    }
}

export async function updateBookingStatus(req, res, next) {
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

        const validation = validateUpdateBookingStatus(req.body);

        if (!validation.isValid) {
            return next(
                new AppError(
                    validation.message,
                    validation.statusCode,
                    validation.errorCode
                )
            );
        }

        const result = await updateBookingStatusService({
            bookingId,
            status: validation.value.status,
            adminId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            data: result.booking,
            audit: result.audit
        });
    } catch (error) {
        return next(error);
    }
}

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

export async function cancelBooking(req, res, next) {
    try {
        const bookingId = Number(req.params.id);

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return next(
                new AppError(
                    "Booking ID must be a positive integer",
                    400,
                    INVALID_BOOKING_ID
                )
            );
        }


        const booking = await cancelBookingService(bookingId);

        return res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return next(error);
    }
}

