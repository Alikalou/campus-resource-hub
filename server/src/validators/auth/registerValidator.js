import {
    getMissingFields,
    getUnknownFields,
    isValidObject,
    isValidEmail,
} from "../validationUtils.js";

const REGISTER_FIELDS = [
    "name",
    "email",
    "password",
];

export function hasValidRegisterTypes(body) {
    return (
        typeof body.name === "string" &&
        typeof body.email === "string" &&
        typeof body.password === "string"
    );
}

export function normalizeRegisterInput(body) {
    return {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        password: body.password,
    };
}

function getRegisterValueError({
    name,
    email,
    password,
}) {
    if (name.length === 0) {
        return "Name must be a non-empty string.";
    }

    if (!isValidEmail(email)) {
        return "A valid email address is required.";
    }

    if (password.length < 8) {
        return "Password must contain at least 8 characters.";

    }

    return null;
}



export function validateRegister(body) {
    if (!isValidObject(body)) {
        return {
            isValid: false,
            message: "Request body must be a valid JSON object.",
            statusCode: 400,
            errorCode: "INVALID_JSON",
        };
    }

    const unknownFields = getUnknownFields(
        body,
        REGISTER_FIELDS
    );

    if (unknownFields.length > 0) {
        return {
            isValid: false,
            message: `Unsupported fields: ${unknownFields.join(", ")}.`,
            statusCode: 400,
            errorCode: "UNSUPPORTED_FIELDS",
        };
    }

    const missingFields = getMissingFields(
        body,
        REGISTER_FIELDS
    );

    if (missingFields.length > 0) {
        return {
            isValid: false,
            message: `Missing required fields: ${missingFields.join(", ")}.`,
            statusCode: 400,
            errorCode: "MISSING_FIELDS",
        };
    }

    if (!hasValidRegisterTypes(body)
    ) {
        return {
            isValid: false,
            message: "Name, Email and Password must be non-empty strings.",
            statusCode: 400,
            errorCode: "AUTH_VALIDATION_FAILED",
        };
    }

    const normalizedInput = normalizeRegisterInput(body)

    const errorMessage = getRegisterValueError(normalizedInput);

    if (errorMessage !== null) {
        return {
            isValid: false,
            message: errorMessage,
            statusCode: 400,
            errorCode: "AUTH_VALIDATION_FAILED",
        };
    }

    return {
        isValid: true,
        value: normalizedInput,
    };

}
