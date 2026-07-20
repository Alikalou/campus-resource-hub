import express from "express";

import resources from "../../data/resources.js";
import { generateId } from "../helper.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

import {
    parseResourceId,
    getUnknownFields,
    isValidObject,
    normalizeResource,
    validateResource,
} from "../validators/resourceValidator.js";

const router = express.Router();

// GET /resources
router.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        data: resources,
    });
});

// POST /resources
router.post("/", (req, res, next) => {
    if (!isValidObject(req.body)) {
        return next(
            new AppError(
                "Request body must be a valid JSON object.",
                400,
                ERROR_CODES.INVALID_JSON
            )
        );
    }

    const unknownFields = getUnknownFields(req.body);

    if (unknownFields.length > 0) {
        return next(
            new AppError(
                "Request contains unsupported fields.",
                400,
                ERROR_CODES.UNSUPPORTED_FIELDS,
            )
        );

    }

    const newResource = normalizeResource({
        name: req.body.name,
        location: req.body.location ?? null,
        type: req.body.type,
        capacity: req.body.capacity ?? null,
        is_bookable: req.body.is_bookable ?? true,
    });

    const validationErrors = validateResource(newResource);

    if (validationErrors.length > 0) {
        return next(
            new AppError(
                "Resource validation failed.",
                400,
                ERROR_CODES.RESOURCE_VALIDATION_FAILED,
            )
        );
    }

    const nextId = generateId(resources);

    const createdResource = {
        ...newResource,
        id: nextId,
    };

    resources.push(createdResource);

    return res.status(201).json({
        success: true,
        data: createdResource,
    });
});

// GET /resources/:id
router.get("/:id", (req, res, next) => {
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

    const resource = resources.find(
        (item) => item.id === resourceId
    );

    if (!resource) {
        return next(
            new AppError(
                "Resource not found.",
                404,
                ERROR_CODES.RESOURCE_NOT_FOUND
            )
        );
    }

    return res.status(200).json({
        success: true,
        data: resource,
    });
});

// PATCH /resources/:id
router.patch("/:id", (req, res, next) => {
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

    const resourceIndex = resources.findIndex(
        (item) => item.id === resourceId
    );

    if (resourceIndex === -1) {
        return next(
            new AppError(
                "Resource not found.",
                404,
                ERROR_CODES.RESOURCE_NOT_FOUND
            )
        );
    }

    if (!isValidObject(req.body)) {
        return next(
            new AppError(
                "Request body must be a valid JSON object.",
                400,
                ERROR_CODES.INVALID_JSON
            )
        );
    }

    if (Object.keys(req.body).length === 0) {
        return next(
            new AppError(
                "Request body must contain at least one field to update.",
                400,
                ERROR_CODES.EMPTY_REQUEST_BODY
            )
        );
    }

    const unknownFields = getUnknownFields(req.body);

    if (unknownFields.length > 0) {
        return next(
            new AppError(
                "Request contains unsupported fields.",
                400,
                ERROR_CODES.UNSUPPORTED_FIELDS,
            )
        );
    }

    const updatedResource = normalizeResource({
        ...resources[resourceIndex],
        ...req.body,
        id: resourceId,
    });

    const validationErrors = validateResource(updatedResource);

    if (validationErrors.length > 0) {
        return next(
            new AppError(
                "Resource validation failed.",
                400,
                ERROR_CODES.RESOURCE_VALIDATION_FAILED,
            )
        );
    }

    resources[resourceIndex] = updatedResource;

    return res.status(200).json({
        success: true,
        data: updatedResource,
    });
});

export default router;