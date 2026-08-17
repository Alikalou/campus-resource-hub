import jwt from "jsonwebtoken";
import { findUserById } from "../repositories/userRepo.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export async function authenticate(req, res, next) {
    try {
        const authorizationHeader = req.get("authorization");

        if (
            typeof authorizationHeader !== "string"
            || !authorizationHeader.startsWith("Bearer ")
        ) {
            throw new AppError(
                "Authentication is required.",
                401,
                ERROR_CODES.UNAUTHENTICATED
            );
        }

        const token = authorizationHeader.slice("Bearer ".length);
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                "JWT_SECRET environment variable is required."
            );
        }

        const payload = jwt.verify(token, secret);

        const userId = Number(payload.sub);

        if (!Number.isInteger(userId) || userId <= 0) {
            throw new AppError(
                "The access token contains an invalid subject.",
                401,
                ERROR_CODES.UNAUTHENTICATED
            );
        }

        const user = await findUserById(userId);

        if (user === null || !user.isActive) {
            throw new AppError(
                "The authenticated user is unavailable.",
                401,
                ERROR_CODES.UNAUTHENTICATED
            );
        }

        req.user = user;

        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(
                new AppError(
                    "Your session has expired. Please log in again.",
                    401,
                    ERROR_CODES.UNAUTHENTICATED
                )
            );
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(
                new AppError(
                    "The access token is invalid.",
                    401,
                    ERROR_CODES.UNAUTHENTICATED
                )
            );
        }

        return next(error);
    }
}