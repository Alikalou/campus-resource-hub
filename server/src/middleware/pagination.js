import { parsePagination } from "../utils/pagination.js";

export function paginationMiddleware(req, res, next) {
    try {
        const pagination = parsePagination(req.query);

        if (pagination.message) {
            return next(
                new AppError(
                    pagination.message,
                    400,
                    ERROR_CODES.INVALID_PAGINATION_PARAMETERS,
                )
            );
        }

        req.pagination = pagination;

        next();
    } catch (error) {
        next(error);
    }
}