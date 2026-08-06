import {
    createResource as insertResource, findResourceById, updateResourceById, retrieveResources
} from "../repositories/resourceRepo.js";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

import {
    validateUpdateResource,
} from "../validators/resourceValidator.js";

export async function createResource(resourceData) {
    return insertResource(resourceData);
}

export async function getResources() {
    return retrieveResources();
}

export async function getResourceById(resourceId) {
    const resource = await findResourceById(resourceId);

    if (resource === null) {
        throw new AppError(
            "Resource not found.",
            404,
            ERROR_CODES.RESOURCE_NOT_FOUND
        );
    }

    return resource;
}

export async function updateResource({
    resourceId,
    changes,
}) {
    const existingResource =
        await findResourceById(resourceId);

    if (existingResource === null) {
        throw new AppError(
            "Resource not found.",
            404,
            ERROR_CODES.RESOURCE_NOT_FOUND
        );
    }

    const updatedResource = {
        ...existingResource,
        ...changes,
    };

    const validationErrors =
        validateUpdateResource(updatedResource);

    if (validationErrors.length > 0) {
        throw new AppError(
            "Resource validation failed.",
            400,
            ERROR_CODES.RESOURCE_VALIDATION_FAILED,
            validationErrors
        );
    }

    return updateResourceById(
        resourceId,
        updatedResource
    );
}