import pool from "../../database/pool.js";

import {
    parseResourceId,
    getUnknownFields,
    isValidObject,
    normalizeResource,
    validateResource,
} from "../validators/resourceValidator.js";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

function mapResource(row) {
    return {
        id: Number(row.id),
        name: row.name,
        type: row.type,
        location: row.location,
        capacity:
            row.capacity === null
                ? null
                : Number(row.capacity),
        is_bookable: row.is_bookable,
    };
}

export async function getResources(req, res, next) {
    try {
        const result = await pool.query(`
            SELECT *
            FROM resources
            ORDER BY id;
        `);

        return res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        return next(error);
    }
}

export async function createResource(req, res, next) {
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

    const result = await pool.query(
        `
        INSERT INTO resources (
            name,
            location,
            type,
            capacity,
            is_bookable
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            name,
            location,
            type,
            capacity,
            is_bookable;
    `,
        [
            newResource.name,
            newResource.location,
            newResource.type,
            newResource.capacity ?? null,
            newResource.is_bookable ?? true,
        ]
    );

    const createdResource = mapResource(result.rows[0]);

    return res.status(201).json({
        success: true,
        data: createdResource,
    });
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

        const result = await pool.query(
            `
                    SELECT *
                    FROM resources
                    WHERE id = $1;
                `,
            [resourceId]
        );

        if (result.rowCount === 0) {
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
            data: mapResource(result.rows[0]),
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

        /*
         * Retrieve the current resource from PostgreSQL.
         * We need its existing values because PATCH may contain
         * only some of the resource fields.
         */
        const existingResult = await pool.query(
            `
                SELECT *
                FROM resources
                WHERE id = $1;
            `,
            [resourceId]
        );

        if (existingResult.rowCount === 0) {
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
                    unknownFields
                )
            );
        }

        /*
         * PostgreSQL returns BIGINT values such as id as strings.
         * Convert the ID to a number to preserve the API's existing shape.
         */
        const existingResource = {
            ...existingResult.rows[0],
            id: Number(existingResult.rows[0].id),
        };

        /*
         * Preserve fields that were not supplied in the PATCH request.
         */
        const updatedResource = normalizeResource({
            ...existingResource,
            ...req.body,
            id: resourceId,
        });

        const validationErrors =
            validateResource(updatedResource);

        if (validationErrors.length > 0) {
            return next(
                new AppError(
                    "Resource validation failed.",
                    400,
                    ERROR_CODES.RESOURCE_VALIDATION_FAILED,
                    validationErrors
                )
            );
        }

        const updateResult = await pool.query(
            `
                UPDATE resources
                SET
                    name = $2,
                    location = $3,
                    type = $4,
                    capacity = $5,
                    is_bookable = $6
                WHERE id = $1
                RETURNING
                    id,
                    name,
                    location,
                    type,
                    capacity,
                    is_bookable;
            `,
            [
                resourceId,
                updatedResource.name,
                updatedResource.location,
                updatedResource.type,
                updatedResource.capacity,
                updatedResource.is_bookable,
            ]
        );

        const savedResource = {
            ...updateResult.rows[0],
            id: Number(updateResult.rows[0].id),
        };

        return res.status(200).json({
            success: true,
            data: savedResource,
        });
    } catch (error) {
        return next(error);
    }
}
