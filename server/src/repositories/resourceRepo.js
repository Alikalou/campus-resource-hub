import pool from "../../database/pool.js";

const RESOURCE_FIELDS = {
    summary: `
        id,
        name,
        type
    `,
    full: `
        id,
        name,
        type,
        location,
        capacity,
        is_active
    `,
};

export function mapResourceSummary(row) {
    return {
        id: Number(row.id),
        name: row.name,
        type: row.type,
    };
}

export function mapResourceFull(row) {
    return {
        id: Number(row.id),
        name: row.name,
        type: row.type,
        location: row.location,
        capacity:
            row.capacity === null
                ? null
                : Number(row.capacity),
        isActive: row.is_active,
    };
}

export async function createResource({
    name,
    location,
    type,
    capacity,
    isActive,
}) {
    const result = await pool.query(
        `
            INSERT INTO resources (
                name,
                location,
                type,
                capacity,
                is_active
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${RESOURCE_FIELDS.full}
        `,
        [
            name,
            location,
            type,
            capacity,
            isActive,
        ]
    );

    return result.rows[0];
}

export async function retrieveResourcesSummary() {
    const result = await pool.query(
        `
            SELECT ${RESOURCE_FIELDS.summary}
            FROM resources
            ORDER BY id
        `
    );

    return result.rows.map(mapResourceSummary);
}

export async function retrieveResourcesFull() {
    const result = await pool.query(
        `
            SELECT ${RESOURCE_FIELDS.full}
            FROM resources
            ORDER BY id
        `
    );

    return result.rows.map(mapResourceFull);
}

export async function findResourceById(resourceId) {
    const result = await pool.query(
        `
            SELECT ${RESOURCE_FIELDS.full}
            FROM resources
            WHERE id = $1
        `,
        [resourceId]
    );

    if (result.rowCount === 0) {
        return null;
    }

    return mapResourceFull(result.rows[0]);
}

export async function updateResourceById(
    resourceId,
    resource
) {
    const result = await pool.query(
        `
            UPDATE resources
            SET
                name = $2,
                location = $3,
                type = $4,
                capacity = $5
            WHERE id = $1
            RETURNING ${RESOURCE_FIELDS.full}
        `,
        [
            resourceId,
            resource.name,
            resource.location,
            resource.type,
            resource.capacity,
        ]
    );

    if (result.rowCount === 0) {
        return null;
    }

    return result.rows[0];
}