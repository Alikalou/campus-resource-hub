import { ERROR_CODES } from "../errors/errorCodes.js";

import {
    getMissingFields,
    getUnknownFields,
    isValidDateTime,
    isValidObject,
    parsePositiveInteger,
} from "./validationUtils.js";

const CREATE_BOOKING_FIELDS = [
    "resource_id",
    "start_time",
    "end_time",
];

const REQUIRED_CREATE_BOOKING_FIELDS = [
    "resource_id",
    "start_time",
    "end_time",
];

// Primarily used for route parameters such as GET /bookings/:id.
export function parseBookingId(value) {
    return parsePositiveInteger(value);
}

export function normalizeBooking(booking) {
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

export function parseBookingResourceId(value) {
    const resourceId = parsePositiveInteger(value);

    if (resourceId === null) {
        return {
            isValid: false,
            message: "Resource ID must be a positive integer.",
            statusCode: 400,
            errorCode: ERROR_CODES.INVALID_RESOURCE_ID,
        };
    }

    return {
        isValid: true,
        value: resourceId,
    };
}

export function validateBookingTimes(startTime, endTime) {
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

export function validateCreateBooking(body) {
    if (!isValidObject(body)) {
        return {
            isValid: false,
            message: "Request body must be a valid JSON object.",
            statusCode: 400,
            errorCode: ERROR_CODES.INVALID_JSON,
        };
    }

    const unknownFields = getUnknownFields(
        body,
        CREATE_BOOKING_FIELDS
    );

    if (unknownFields.length > 0) {
        return {
            isValid: false,
            message: `Unknown fields: ${unknownFields.join(", ")}.`,
            statusCode: 400,
            errorCode: ERROR_CODES.UNSUPPORTED_FIELDS,
        };
    }

    const missingFields = getMissingFields(
        body,
        REQUIRED_CREATE_BOOKING_FIELDS
    );

    if (missingFields.length > 0) {
        return {
            isValid: false,
            message: `Missing required fields: ${missingFields.join(", ")}.`,
            statusCode: 400,
            errorCode: ERROR_CODES.MISSING_FIELDS,
        };
    }

    const normalizedBooking = normalizeBooking(body);

    const resourceIdResult = parseBookingResourceId(
        normalizedBooking.resourceId
    );

    if (!resourceIdResult.isValid) {
        return resourceIdResult
    }

    const timeError = validateBookingTimes(
        normalizedBooking.startTime,
        normalizedBooking.endTime
    );

    if (timeError !== null) {
        return {
            isValid: false,
            message: timeError,
            statusCode: 400,
            errorCode: ERROR_CODES.BOOKING_VALIDATION_FAILED,
        };
    }

    return {
        isValid: true,
        value: {
            resourceId: resourceIdResult.value,
            startTime: new Date(
                normalizedBooking.startTime
            ).toISOString(),
            endTime: new Date(
                normalizedBooking.endTime
            ).toISOString(),
        },
    };
}