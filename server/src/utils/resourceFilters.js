const VALID_RESOURCE_TYPES = [
    "equipment",
    "room"
];

export function parseResourceFilters(query) {
    const filters = {};

    if (query.name !== undefined) {
        if (typeof query.name !== "string") {
            return {
                message: "Resource name must be a string.",
            };
        }

        const name = query.name.trim();

        if (name.length > 100) {
            return {
                message: "Resource name filter is too long.",
            };
        }

        if (name !== "") {
            filters.name = name;
        }
    }

    if (query.type !== undefined) {
        if (typeof query.type !== "string") {
            return {
                message: "Resource type must be a string.",
            };
        }

        if (!VALID_RESOURCE_TYPES.includes(query.type)) {
            return {
                message: "Invalid resource type.",
            };
        }

        filters.type = query.type;
    }

    return filters;
}