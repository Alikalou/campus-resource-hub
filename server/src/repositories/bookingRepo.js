import pool from "../../database/pool.js";

export async function findAllBookings({
    limit,
    offset,
    status,
    resourceName,
    start,
    end,
}) {
    const conditions = [];
    const values = [];

    if (status) {
        values.push(status);
        conditions.push(`bookings.status = $${values.length}`);
    }

    if (resourceName) {
        values.push(`%${resourceName}%`);
        conditions.push(`resources.name ILIKE $${values.length}`);
    }

    if (start && end) {
        values.push(start);
        const startParam = values.length;

        values.push(end);
        const endParam = values.length;

        conditions.push(`
            bookings.start_time < $${endParam}
            AND bookings.end_time > $${startParam}
        `);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const limitParam = values.length + 1;
    const offsetParam = values.length + 2;

    const result = await pool.query(
        `
            SELECT
                bookings.id,
                bookings.user_id,
                bookings.resource_id,
                bookings.start_time,
                bookings.end_time,
                bookings.status,
                bookings.created_at,
                resources.name AS resource_name,
                resources.type AS resource_type,
                resources.location AS resource_location
            FROM bookings
            LEFT JOIN resources
                ON bookings.resource_id = resources.id
            ${whereClause}
            ORDER BY bookings.created_at DESC
            LIMIT $${limitParam}
            OFFSET $${offsetParam}
        `,
        [...values, limit, offset]
    );

    const count = await pool.query(
        `
            SELECT COUNT(*)::int AS total
            FROM bookings
            LEFT JOIN resources
                ON bookings.resource_id = resources.id
            ${whereClause}
        `,
        values
    );


    return {
        bookings: result.rows,
        total: count.rows[0].total
    };
}

export async function findBookingsByUserId({ userId, limit, offset }) {
    const result = await pool.query(
        `
            SELECT     
                bookings.id,
                bookings.start_time,
                bookings.end_time,
                bookings.status,
                resources.id AS resource_id,
                resources.name AS "resourceName",
                resources.location AS "resourceLocation"
            FROM bookings
            JOIN resources 
                ON resources.id = bookings.resource_id
            WHERE bookings.user_id = $1
            ORDER BY start_time DESC, id DESC
            LIMIT $2
            OFFSET $3
        `,
        [userId, limit, offset]
    );

    const count = await pool.query(
        `
                SELECT COUNT(*)::int AS total
                FROM bookings
                WHERE bookings.user_id = $1
            `,
        [userId]
    );

    return {
        bookings: result.rows,
        total: count.rows[0].total,
    }
}

export async function findBookingConflict({
    resourceId,
    startTime,
    endTime,
}) {
    const result = await pool.query(
        `
            SELECT EXISTS (
                SELECT 1
                FROM bookings
                WHERE resource_id = $1
                  AND status IN ('pending', 'approved')
                  AND start_time < $3
                  AND end_time > $2
            ) AS has_conflict
        `,
        [
            resourceId,
            startTime,
            endTime,
        ]
    );

    return result.rows[0].has_conflict;
}

export async function findBookingById(bookingId, db = pool) {
    const result = await db.query(
        `
            SELECT *
            FROM bookings
            WHERE id = $1
        `,
        [bookingId]
    );

    return result.rows[0] ?? null;
}

export async function createBooking({
    userId,
    resourceId,
    startTime,
    endTime,
    status,
}) {
    if (status = "pending") {
        const result = await pool.query(
            `
            INSERT INTO bookings (
                user_id,
                resource_id,
                start_time,
                end_time
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
            [
                userId,
                resourceId,
                startTime,
                endTime,
            ]
        );

        return result.rows[0];
    }

    const result = await pool.query(
        `
            INSERT INTO bookings (
                user_id,
                resource_id,
                start_time,
                end_time,
                status
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        [
            userId,
            resourceId,
            startTime,
            endTime,
            status,
        ]
    );

    return result.rows[0];

}

export async function updateBookingStatus({
    bookingId,
    status,
    db = pool
}) {
    const result = await pool.query(
        `
            UPDATE bookings
            SET status = $1
            WHERE id = $2
              AND status = 'pending'
            RETURNING
                id,
                user_id,
                resource_id,
                start_time,
                end_time,
                status,
                created_at,
                updated_at
        `,
        [
            status,
            bookingId,
        ]
    );

    return result.rows[0] ?? null;
}

export async function cancelBooking(bookingId) {
    const result = await pool.query(
        `
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = $1
            RETURNING
                id,
                user_id,
                resource_id,
                start_time,
                end_time,
                status,
                created_at,
                updated_at
        `,
        [bookingId]
    );

    return result.rows[0] ?? null;
}