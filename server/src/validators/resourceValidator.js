const RESOURCE_TYPES = ["room", "equipment"];

const ALLOWED_FIELDS = [
    "name",
    "location",
    "type",
    "capacity",
    "is_bookable",
];

export function parseResourceId(id) {
    const resourceId = Number(id);

    if (!Number.isInteger(resourceId) || resourceId <= 0) {
        return null;
    }

    return resourceId;
}


export function isValidObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

export function getUnknownFields(body) {
    return Object.keys(body).filter(
        (field) => !ALLOWED_FIELDS.includes(field)
    );
}


//In the normalizing function we enforce a standard over the resources strings
//But to what thing I'm returning the result of the ternary condition? 
export function normalizeResource(resource) {
    return {
        ...resource,

        name:
            typeof resource.name === "string"
                ? resource.name.trim()
                : resource.name,

        location:
            typeof resource.location === "string"
                ? resource.location.trim()
                : resource.location,
    };
}

export function validateResource(resource) {
    const errors = [];

    //Why would I trim the name if it is already normalized?
    if (
        typeof resource.name !== "string" ||
        resource.name.trim().length === 0
    ) {
        errors.push(
            "Name is required and must be a non-empty string."
        );
    }

    if (!RESOURCE_TYPES.includes(resource.type)) {
        errors.push(
            "Type must be either 'room' or 'equipment'."
        );
    }

    if (
        resource.location !== null &&
        resource.location !== undefined &&
        (
            typeof resource.location !== "string" ||
            resource.location.trim().length === 0
        )
    ) {
        errors.push(
            "Location must be a non-empty string or null."
        );
    }

    if (resource.type === "room") {
        if (
            !Number.isInteger(resource.capacity) ||
            resource.capacity <= 0
        ) {
            errors.push(
                "Capacity is required for rooms and must be a positive integer."
            );
        }
    }

    if (
        resource.type === "equipment" &&
        resource.capacity !== null &&
        resource.capacity !== undefined &&
        (
            !Number.isInteger(resource.capacity) ||
            resource.capacity <= 0
        )
    ) {
        errors.push(
            "Equipment capacity must be a positive integer or null."
        );
    }

    if (typeof resource.is_bookable !== "boolean") {
        errors.push(
            "is_bookable must be a Boolean value."
        );
    }

    return errors;
}