import {
    parseResourceId,
    validateCreateResource,
    validateUpdateResource
} from "../validators/resourceValidator.js";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

import {
    createResource as createResourceService,
    getResourcesForAdmin as getResourcesAdminService,
    getResourcesSummary as getResourcesService,
    getResourceById as getResourceByIdService,
    updateResource as updateResourceService,
} from "../services/resourceService.js";


export async function getResources(req, res, next) {
    try {
        const resources = await getResourcesService();

        return res.status(200).json({
            success: true,
            data: resources,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getResourcesForAdmin(req, res, next) {
    try {
        const resources = await getResourcesAdminService();
        return res.status(200).json({
            success: true,
            data: resources,
        });
    } catch (error) {
        return next(error);
    }
}

export async function createResource(req, res, next) {
    try {
        const validation = validateCreateResource(req.body);

        if (!validation.isValid) {
            return next(
                new AppError(
                    validation.message,
                    validation.statusCode,
                    validation.errorCode
                )
            );
        }

        const resource = await createResourceService(
            validation.value
        );

        return res.status(201).json({
            success: true,
            data: resource,
        });
    } catch (error) {
        return next(error);
    }
}


export async function getResourceById(req, res, next) {
    try {
        const resourceId = parseResourceId(req.params.id);

        if (resourceId === null) {
            return next(
                new AppError(
                    "Resource ID must be of a positive integer value.",
                    400,
                    ERROR_CODES.INVALID_RESOURCE_ID,
                )
            );
        }

        const resource = await getResourceByIdService(resourceId);

        return res.status(200).json({
            success: true,
            data: resource,
        });
    }

    catch (error) {
        return next(error);
    }
}


export async function updateResource(req, res, next) {
    try {
        const resourceId = parseResourceId(req.params.id);

        if (resourceId === null) {
            return next(
                new AppError(
                    "Resource ID must be a positive integer.",
                    400,
                    ERROR_CODES.INVALID_RESOURCE_ID
                )
            );
        }

        const validation = validateUpdateResource(req.body);

        if (!validation.isValid) {
            return next(
                new AppError(
                    validation.message,
                    validation.statusCode,
                    validation.errorCode
                )
            );
        }

        const resource = await updateResourceService({
            resourceId,
            changes: validation.value,
        });

        return res.status(200).json({
            success: true,
            data: resource,
        });
    } catch (error) {
        return next(error);
    }
}
