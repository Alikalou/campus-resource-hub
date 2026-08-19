import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

import pool from "../../database/pool.js";


import {
    createBooking as insertBooking,
    findAllBookings,
    findBookingById,
    findBookingsByUserId,
    findResourceById,
    findUserById,
    findBookingConflict,
    updateBookingStatus as updateBookingStatusRepo,
    cancelBooking as cancelBookingRepo
} from "../repositories/bookingRepo.js";

import {
    createAuditLog,
} from "../repositories/auditRepo.js";


export async function getAllBookings() {
    return findAllBookings();
}

export async function getMyBookings(userId) {
    const user = await findUserById(userId);

    if (user === null) {
        throw new AppError(
            "User not found.",
            404,
            ERROR_CODES.USER_NOT_FOUND
        );
    }

    return findBookingsByUserId(userId);
}

export async function getBookingById(bookingId) {
    const booking = await findBookingById(bookingId);

    if (booking === null) {
        throw new AppError(
            "Booking not found.",
            404,
            ERROR_CODES.BOOKING_NOT_FOUND
        );
    }

    return booking;
}


export async function createBooking({
    userId,
    resourceId,
    startTime,
    endTime
}) {

    const user = await findUserById(userId);

    if (user === null) {
        throw new AppError(
            "User not found",
            404,
            ERROR_CODES.USER_NOT_FOUND,
        );
    }

    const resource = await findResourceById(resourceId);

    if (resource === null) {
        throw new AppError(
            "Resource not found.",
            404,
            ERROR_CODES.RESOURCE_NOT_FOUND
        );
    }

    const conflictExists = await hasBookingConflict({
        resourceId,
        startTime,
        endTime,
    });

    if (conflictExists) {
        throw new AppError(
            "The resource is already booked during the requested time.",
            409,
            ERROR_CODES.BOOKING_CONFLICT
        );
    }

    return insertBooking({
        userId,
        resourceId,
        startTime,
        endTime,
    });

}

export async function updateBookingStatus({
    bookingId,
    status,
    adminId
}) {
    const client = await pool.connect();
    try {
        const existingBooking = await findBookingById(bookingId, client);

        if (existingBooking === null) {
            throw new AppError(
                "Booking not found.",
                404,
                ERROR_CODES.BOOKING_NOT_FOUND
            );
        }

        if (existingBooking.status !== "pending") {
            throw new AppError(
                "Only pending bookings can be approved or rejected.",
                409,
                ERROR_CODES.INVALID_BOOKING_STATUS_TRANSITION
            );
        }

        const updatedBooking = await updateBookingStatusRepo({
            bookingId,
            status,
            client
        });

        if (updatedBooking === null) {
            throw new AppError(
                "The booking status was changed by another request.",
                409,
                ERROR_CODES.BOOKING_STATUS_CONFLICT
            );
        }

        const audit = await createAuditLog(
            {
                actorId: adminId,

                action: "booking_status_updated",

                subjectType: "bookings",
                subjectId: bookingId,

                oldValues: {
                    status: existingBooking.status,
                },

                newValues: {
                    status: updatedBooking.status,
                },
                client
            }
        );

        await client.query("COMMIT");

        return {
            booking: updatedBooking,
            audit
        }
    } catch (error) {
        await client.query("ROLLBACK");
        throw error
    } finally {
        client.release();
    }
}

export async function hasBookingConflict({
    resourceId,
    startTime,
    endTime,
}) {
    return findBookingConflict({
        resourceId,
        startTime,
        endTime,
    });
}

export async function cancelBooking(bookingId) {
    const existingBooking = await findBookingById(bookingId);

    if (existingBooking === null) {
        throw new AppError(
            "Booking not found.",
            404,
            ERROR_CODES.BOOKING_NOT_FOUND
        );
    }

    if (existingBooking.status === "cancelled") {
        throw new AppError(
            "Booking is already cancelled.",
            400,
            ERROR_CODES.BOOKING_VALIDATION_FAILED
        );
    }

    if (existingBooking.status === "rejected") {
        throw new AppError(
            "Booking is already rejected.",
            400,
            ERROR_CODES.BOOKING_VALIDATION_FAILED
        );
    }
    const cancelledBooking = await cancelBookingRepo(bookingId);

    if (cancelledBooking === null) {
        throw new AppError(
            "Failed to cancel booking.",
            500,
            ERROR_CODES.INTERNAL_SERVER_ERROR
        );
    }

    return cancelledBooking;
}