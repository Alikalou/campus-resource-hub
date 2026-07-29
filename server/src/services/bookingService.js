//I'm importing the app error class and the error codes because errors are not only for validation
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

//we need also to import the booking repo, that is the methods that interacte direclty with the DB.
import {
    createBooking as insertBooking,
    findBookingById,
    findBookingsByUserId,
    findResourceById,
    findUserById,
    findBookingConflict
} from "../repositories/bookingRepo.js";


export async function createBooking({
    userId,
    resourceId,
    startTime,
    endTime
}) {

    const user = findUserById(userId);

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


export async function getBookings(userId) {
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