import { ERROR_CODES } from "../../errors/errorCodes.js";

import {
    isValidDateTime,
    parsePositiveInteger,
} from "../validationUtils.js";

export function parseBookingId(value) {
    return parsePositiveInteger(value);
}

export function normalizeCreateBooking(booking) {
    return {
        resourceId:
            typeof booking.resource_id === "string"
                ? booking.resource_id.trim()
                : booking.resource_id,

        startTime:
            typeof booking.start_time === "string"
                ? booking.start_time.trim()
                : booking.start_time,

        endTime:
            typeof booking.end_time === "string"
                ? booking.end_time.trim()
                : booking.end_time,
    };
}

export function normalizeUpdateBookingStatus(status) {
    return typeof status === "string"
        ? status.trim().toLowerCase()
        : status;
}

export function parseBookingResourceId(value) {
    const resourceId = parsePositiveInteger(value);

    if (resourceId === null) {
        return {
            isValid: false,
            message:
                "Resource ID must be a positive integer.",
            statusCode: 400,
            errorCode: ERROR_CODES.INVALID_RESOURCE_ID,
        };
    }

    return {
        isValid: true,
        value: resourceId,
    };
}

export function validateBookingTimes(
    startTime,
    endTime
) {
    if (!isValidDateTime(startTime)) {
        return "Start time must be a valid date-time string.";
    }

    if (!isValidDateTime(endTime)) {
        return "End time must be a valid date-time string.";
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (startDate >= endDate) {
        return "End time must be later than start time.";
    }

    return null;
}