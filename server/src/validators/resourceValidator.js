import { ERROR_CODES } from "../errors/errorCodes.js";

import {
    getMissingFields,
    getUnknownFields,
    isValidObject,
    parsePositiveInteger
} from "./validationUtils.js";

const RESOURCE_TYPES = [
    "room",
    "equipment",
];

const RESOURCE_FIELDS = [
    "name",
    "location",
    "type",
    "capacity",
    "is_active",
];

const REQUIRED_RESOURCE_FIELDS = [
    "name",
    "type",
];

export function parseResourceId(resourceId) {
    return parsePositiveInteger(resourceId);
}

export function normalizeCreateResource(body) {
    return {
        name: normalizeString(body.name),
        location: normalizeString(body.location ?? null),
        type: normalizeString(body.type),
        capacity: body.capacity ?? null,
        isActive: body.is_active ?? true,
    };
}


export function normalizeResourceChanges(body) {
    const changes = {};

    if (Object.hasOwn(body, "name")) {
        changes.name = normalizeString(body.name);
    }

    if (Object.hasOwn(body, "location")) {
        changes.location = normalizeString(body.location);
    }

    if (Object.hasOwn(body, "type")) {
        changes.type = normalizeString(body.type);
    }

    if (Object.hasOwn(body, "capacity")) {
        changes.capacity = body.capacity;
    }

    if (Object.hasOwn(body, "is_active")) {
        changes.isActive = body.is_active;
    }


    return changes;
}

function normalizeString(value) {
    return typeof value === "string"
        ? value.trim()
        : value;
}

export function validateResourceName(name) {
    if (
        typeof name !== "string" ||
        name.length === 0
    ) {
        return "Name is required and must be a non-empty string.";
    }

    return null;
}

export function validateResourceType(type) {
    if (!RESOURCE_TYPES.includes(type)) {
        return "Type must be either 'room' or 'equipment'.";
    }

    return null;
}

export function validateResourceLocation(location) {
    //A common thought here is to remove this condition here, but it is necessary since it explicitly checks of the location
    //is deliberetly empty.
    if (location === null) {
        return null;
    }

    if (
        typeof location !== "string" ||
        location.length === 0
    ) {
        return "Location must be a non-empty string or null.";
    }

    return null;
}

export function validateResourceCapacity(type, capacity) {
    if (type === "room") {
        if (
            !Number.isInteger(capacity) ||
            capacity <= 0
        ) {
            return (
                "Capacity is required for rooms and must " +
                "be a positive integer."
            );
        }

        return null;
    }

    if (
        type === "equipment" &&
        capacity !== null
    ) {
        return "Equipment cannot have a capacity.";
    }


    return null;
}

export function validateResourceIsActive(isActive) {
    if (typeof isActive !== "boolean") {
        return "is_active must be a Boolean value.";
    }

    return null;
}

function createResourceValidationFailure(message) {
    return {
        isValid: false,
        message,
        statusCode: 400,
        errorCode:
            ERROR_CODES.RESOURCE_VALIDATION_FAILED,
    };
}

export function validateCreateResource(body) {
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
        RESOURCE_FIELDS
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
        REQUIRED_RESOURCE_FIELDS
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

    const normalizedResource = normalizeCreateResource(body);

    const nameError = validateResourceName(
        normalizedResource.name
    );

    if (nameError !== null) {
        return createResourceValidationFailure(
            nameError
        );
    }

    const typeError = validateResourceType(
        normalizedResource.type
    );

    if (typeError !== null) {
        return createResourceValidationFailure(
            typeError
        );
    }

    const locationError = validateResourceLocation(
        normalizedResource.location
    );

    if (locationError !== null) {
        return createResourceValidationFailure(
            locationError
        );
    }

    const capacityError = validateResourceCapacity(
        normalizedResource.type,
        normalizedResource.capacity
    );

    if (capacityError !== null) {
        return createResourceValidationFailure(
            capacityError
        );
    }

    const isActiveError = validateResourceIsActive(
        normalizedResource.isActive
    );

    if (isActiveError !== null) {
        return createResourceValidationFailure(
            isActiveError
        );
    }

    return {
        isValid: true,
        value: normalizedResource,
    };
}


export function validateUpdateResource(body) {
    if (!isValidObject(body)) {
        return {
            isValid: false,
            message: "Request body must be a valid JSON object.",
            statusCode: 400,
            errorCode: ERROR_CODES.INVALID_JSON,
        };
    }

    if (Object.keys(body).length === 0) {
        return {
            isValid: false,
            message:
                "Request body must contain at least one field to update.",
            statusCode: 400,
            errorCode: ERROR_CODES.EMPTY_REQUEST_BODY,
        };
    }

    const unknownFields = getUnknownFields(
        body,
        RESOURCE_FIELDS
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
    const normalizedResource = normalizeResourceChanges(body)
    return {
        isValid: true,
        value: normalizedResource,
    };
}