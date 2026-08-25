import pool from "../../database/pool.js";

const RESOURCE_FIELDS = `
        id,
        name,
        type,
        location,
        capacity,
        is_active
    `;

export function mapResource(row) {
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
            RETURNING ${RESOURCE_FIELDS}
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

export async function retrieveResources({ limit, offset }) {
    const result = await pool.query(
        `
            SELECT ${RESOURCE_FIELDS}
            FROM resources
            ORDER BY id
            LIMIT $1
            OFFSET $2
        `,
        [limit, offset]
    );

    const countResult = await pool.query(
        `
            SELECT COUNT(*)::int AS total
            FROM resources
        `
    );

    return {
        resources: result.rows.map(mapResource),
        total: countResult.rows[0].total,
    };
}

export async function findResourceById(resourceId) {
    const result = await pool.query(
        `
            SELECT ${RESOURCE_FIELDS}
            FROM resources
            WHERE id = $1
        `,
        [resourceId]
    );

    if (result.rowCount === 0) {
        return null;
    }

    return mapResource(result.rows[0]);
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
            RETURNING ${RESOURCE_FIELDS}
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