import {
    getMissingFields,
    getUnknownFields,
    isValidObject,
    isValidEmail,
} from "../validationUtils.js";


const LOGIN_FIELDS = [
    "email",
    "password",
];

function hasValidLoginTypes(body) {
    return (
        typeof body.email === "string" &&
        typeof body.password === "string"
    );
}
function normalizeLoginInput(body) {
    return {
        email: body.email.trim().toLowerCase(),
        password: body.password,
    };
}


function getLoginValueError({
    email,
    password,
}) {
    if (!isValidEmail(email)) {
        return "A valid email address is required.";
    }

    if (password.length === 0) {
        return "Password must be a non-empty string.";
    }

    return null;
}

export function validateLogin(body) {
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
        LOGIN_FIELDS
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
        LOGIN_FIELDS
    );

    if (missingFields.length > 0) {
        return {
            isValid: false,
            message: `Missing required fields: ${missingFields.join(", ")}.`,
            statusCode: 400,
            errorCode: "MISSING_FIELDS",
        };
    }

    if (!hasValidLoginTypes(body)) {
        return {
            isValid: false,
            message: "Email and password must be strings.",
            statusCode: 400,
            errorCode: "AUTH_VALIDATION_FAILED",
        };
    }

    const normalizedInput = normalizeLoginInput(body);

    const errorMessage =
        getLoginValueError(normalizedInput);

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