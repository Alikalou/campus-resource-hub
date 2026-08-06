/**
 * Checks whether a value is a plain request object.
 *
 * Arrays and null are objects in JavaScript, but they are not valid
 * request-body objects for our validation purposes.
 */
export function isValidObject(value) {
    return (
        value !== null
        && typeof value === "object"
        && !Array.isArray(value)
    );
}

/**
 * Returns fields that exist in the supplied object but are not included
 * in the endpoint's allowed-fields list.
 */
export function getUnknownFields(object, allowedFields) {
    return Object.keys(object).filter(
        (field) => !allowedFields.includes(field)
    );
}

/**
 * Returns required fields that are missing or contain no meaningful value.
 *
 * false and 0 are treated as provided values.
 */
export function getMissingFields(object, requiredFields) {
    return requiredFields.filter((field) => {
        const value = object[field];

        return (
            value === undefined
            || value === null
            || (
                typeof value === "string"
                && value.trim().length === 0
            )
        );
    });
}

/**
 * Converts a value to a positive integer.
 *
 * Returns null when the value cannot represent a positive integer.
 */
export function parsePositiveInteger(value) {
    const parsedValue = Number(value);

    if (
        !Number.isInteger(parsedValue)
        || parsedValue <= 0
    ) {
        return null;
    }

    return parsedValue;
}

/**
 * Checks whether a value is a non-empty date-time string that JavaScript
 * can convert into a valid Date.
 */
export function isValidDateTime(value) {
    if (
        typeof value !== "string"
        || value.trim().length === 0
    ) {
        return false;
    }

    return !Number.isNaN(
        Date.parse(value.trim())
    );
}


export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}