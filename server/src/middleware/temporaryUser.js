import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { parsePositiveInteger } from "../validators/validationUtils.js";

export function temporaryUser(req, res, next) {
    const userId = parsePositiveInteger(req.get("x-user-id"));

    if (userId === null) {
        return next(
            new AppError(
                "A valid x-user-id header is required.",
                400,
                ERROR_CODES.INVALID_USER_ID
            )
        );
    }

    req.user = {
        id: userId,
    };

    next();
}