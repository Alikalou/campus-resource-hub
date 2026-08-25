const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(query) {
    const page = Number(query.page ?? DEFAULT_PAGE);
    const limit = Number(query.limit ?? DEFAULT_LIMIT);

    if (
        !Number.isInteger(page) ||
        page < 1
    ) {
        return {
            message: "Page must be a positive integer.",
        };
    }

    if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > MAX_LIMIT
    ) {
        return {
            message: `Limit must be between 1 and ${MAX_LIMIT}.`,
        };
    }

    return {
        page,
        limit,
        offset: (page - 1) * limit,
    };
}

export function createPaginationMeta({
    page,
    limit,
    total,
}) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}