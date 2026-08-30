const VALID_BOOKING_STATUSES = [
    "pending",
    "approved",
    "rejected",
    "cancelled",
];

export function parseBookingFilters(query) {
    const filters = {};

    if (query.status !== undefined) {
        if (typeof query.status !== "string") {
            return {
                message: "Booking status must be a string.",
            };
        }

        if (!VALID_BOOKING_STATUSES.includes(query.status)) {
            return {
                message: "Invalid booking status.",
            };
        }

        filters.status = query.status;
    }

    if (query.resourceName !== undefined) {
        if (typeof query.resourceName !== "string") {
            return {
                message: "Resource name must be a string.",
            };
        }

        const resourceName = query.resourceName.trim();

        if (resourceName.length > 100) {
            return {
                message: "Resource name filter is too long.",
            };
        }

        if (resourceName !== "") {
            filters.resourceName = resourceName;
        }
    }

    if (query.start !== undefined) {
        if (typeof query.start !== "string") {
            return {
                message: "Start time must be a string.",
            };
        }

        const start = new Date(query.start);

        if (Number.isNaN(start.getTime())) {
            return {
                message: "Invalid start time.",
            };
        }

        filters.start = start.toISOString();
    }

    if (query.end !== undefined) {
        if (typeof query.end !== "string") {
            return {
                message: "End time must be a string.",
            };
        }

        const end = new Date(query.end);

        if (Number.isNaN(end.getTime())) {
            return {
                message: "Invalid end time.",
            };
        }

        filters.end = end.toISOString();
    }

    if (filters.start && filters.end) {
        if (new Date(filters.end) <= new Date(filters.start)) {
            return {
                message: "End time must be after start time.",
            };
        }
    }

    return filters;
}