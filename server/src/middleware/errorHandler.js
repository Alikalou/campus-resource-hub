import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export function errorHandler(error, req, res, next) {
    /*
     * express.json() creates this error when the client sends
     * malformed JSON, such as:
     *
     * { "name": "Room A",
     */
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            error: {
                code: ERROR_CODES.INVALID_JSON,
                message: "Request body contains invalid JSON.",
            },
        });
    }

    /*
     * Errors intentionally created by our application.
     */
    if (error instanceof AppError) {
        const response = {
            success: false,
            error: {
                code: error.code,
                message: error.message,
            },
        };

        if (error.details !== undefined) {
            response.error.details = error.details;
        }

        return res.status(error.statusCode).json(response);
    }

    /*
     * Unexpected programming, database, or server errors.
     * Log the real error internally, but do not expose it.
     */
    console.error(error);

    return res.status(500).json({
        success: false,
        error: {
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: "An unexpected server error occurred.",
        },
    });
}