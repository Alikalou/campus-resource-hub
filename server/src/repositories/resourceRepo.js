import pool from "../../database/pool.js";

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
        isActive: row.is_active,
    };
}

function mapResourceSummary(row) {
    return {
        id: Number(row.id),
        name: row.name,
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
            RETURNING
                id,
                name,
                location,
                type,
                capacity,
                is_active
        `,
        [
            name,
            location,
            type,
            capacity,
            isActive,
        ]
    );

    return mapResource(result.rows[0]);
}

export async function retrieveResources() {

    const result = await pool.query(`
        select id, name
        FROM resources
        ORDER BY id DESC
        `)


    return result.rows.map(mapResourceSummary);
}

export async function findResourceById(resourceId) {
    const result = await pool.query(
        `
            SELECT *
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
                capacity = $5,
                is_active = $6
            WHERE id = $1
            RETURNING
                id,
                name,
                location,
                type,
                capacity,
                is_active
        `,
        [
            resourceId,
            resource.name,
            resource.location,
            resource.type,
            resource.capacity,
            resource.isActive,
        ]
    );

    if (result.rowCount === 0) {
        return null;
    }

    return mapResource(result.rows[0]);
}