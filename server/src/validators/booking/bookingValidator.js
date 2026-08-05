import { ERROR_CODES } from "../../errors/errorCodes.js";

import {
    getMissingFields,
    getUnknownFields,
    isValidObject,
} from "../validationUtils.js";

import {
    normalizeCreateBooking,
    normalizeUpdateBookingStatus,
    parseBookingResourceId,
    validateBookingTimes,
} from "./bookingValidationUtils.js";

const CREATE_BOOKING_FIELDS = [
    "resource_id",
    "start_time",
    "end_time",
];

const ADMIN_BOOKING_STATUS = [
    "approved",
    "rejected",
];

export function validateUpdateBookingStatus(body) {
    if (!isValidObject(body)) {
        return {
            isValid: false,
            message: "Request body must be a valid JSON object.",
            statusCode: 400,
            errorCode: ERROR_CODES.INVALID_JSON,
        };
    }

    const fields = Object.keys(body);

    if (fields.length !== 1 || !Object.hasOwn(body, "status")) {
        return {
            isValid: false,
            message: "The request body must contain only the status field.",
            statusCode: 400,
            errorCode: ERROR_CODES.UNSUPPORTED_FIELDS,
        };
    }

    const normalizedStatus = normalizeUpdateBookingStatus(body.status);

    if (
        typeof normalizedStatus !== "string" ||
        !ADMIN_BOOKING_STATUS.includes(
            normalizedStatus
        )
    ) {
        return {
            isValid: false,
            message: "Status must be a string and of either \"approved\" or \"rejected\" value.",
            statusCode: 400,
            errorCode: ERROR_CODES.INVALID_BOOKING_STATUS,
        };
    }


    return {
        isValid: true,
        value: {
            status: normalizedStatus,
        },
    };
}


export function validateCreateBooking(body) {
    if (!isValidObject(body)) {
        return {
            isValid: false,
            message:
                "Request body must be a valid JSON object.",
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
            message:
                `Unknown fields: ${unknownFields.join(", ")}.`,
            statusCode: 400,
            errorCode: ERROR_CODES.UNSUPPORTED_FIELDS,
        };
    }

    const missingFields = getMissingFields(
        body,
        CREATE_BOOKING_FIELDS
    );

    if (missingFields.length > 0) {
        return {
            isValid: false,
            message:
                `Missing required fields: ${missingFields.join(", ")}.`,
            statusCode: 400,
            errorCode: ERROR_CODES.MISSING_FIELDS,
        };
    }

    const normalizedBooking = normalizeCreateBooking(body);

    const resourceIdResult = parseBookingResourceId(
        normalizedBooking.resourceId
    );

    if (!resourceIdResult.isValid) {
        return resourceIdResult;
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
            errorCode:
                ERROR_CODES.BOOKING_VALIDATION_FAILED,
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