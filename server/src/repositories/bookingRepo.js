import pool from "../../database/pool.js";

export async function findAllBookings() {
    const result = await pool.query(
        `
            SELECT *
            FROM bookings
            ORDER BY created_at DESC
        `
    );

    return result.rows ?? null;
}

export async function findUserById(userId) {
    //Be careful that the returned columns here are everything, so later on if you modify the relation's
    //attributes this change would not be obvious unless you test it directly.
    const result = await pool.query(
        `
            SELECT *
            FROM users
            WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0] ?? null;
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

    return result.rows[0] ?? null;
}

export async function findBookingsByUserId(userId) {
    const result = await pool.query(
        `
            SELECT *
            FROM bookings
            WHERE user_id = $1
            ORDER BY start_time DESC, id DESC
        `,
        [userId]
    );

    return result.rows;
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
}) {
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

export async function updateBookingStatus({
    bookingId,
    status,
    db = pool
}) {
    const result = await db.query(
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