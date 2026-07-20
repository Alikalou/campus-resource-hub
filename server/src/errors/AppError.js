import { ERROR_CODES } from "./errorCodes.js";

//This class doesn't handle the forwarding yet, it simply creates the error instanc.
export class AppError extends Error {
    constructor(
        message,
        statusCode,
        code = ERROR_CODES.APPLICATION_ERROR,
        details = undefined
    ) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace?.(this, this.constructor);
    }
}