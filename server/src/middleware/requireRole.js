import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { USER_ROLES } from "../userRoles.js";

export function requireRole(...allowedRoles) {
    return function roleAuthorization(req, res, next) {
        if (!req.user) {
            return next(
                new AppError(
                    "Authentication is required.",
                    401,
                    ERROR_CODES.UNAUTHENTICATED
                )
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action.",
                    403,
                    ERROR_CODES.FORBIDDEN
                )
            );
        }

        next();
    };
}

export const requireAdmin = requireRole(
    USER_ROLES.ADMIN
);