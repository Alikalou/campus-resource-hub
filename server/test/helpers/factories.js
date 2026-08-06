import pool from "../../database/pool.js";
import bcrypt from "bcryptjs";

export async function createUser({
    name,
    email,
    password,
    role = "member",
}) {
    const passwordHash = await bcrypt.hash(
        password,
        10,
    );

    const result = await pool.query(
        `
            INSERT INTO users (
                name,
                email,
                password_hash,
                role,
                is_active
            )
            VALUES ($1, $2, $3, $4, TRUE)
            RETURNING
                id,
                name,
                email,
                role;
        `,
        [
            name,
            email,
            passwordHash,
            role,
        ],
    );

    return result.rows[0];
}


export async function createResource() {
    const result = await pool.query(
        `
            INSERT INTO resources (
                name,
                type,
                location,
                capacity,
                is_active
            )
            VALUES ($1, $2, $3, $4, TRUE)
            RETURNING *;
        `,
        [
            "Integration Test Room",
            "room",
            "Building A",
            20,
        ],
    );

    return result.rows[0];
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
                end_time,
                status
            )
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *;
        `,
        [
            userId,
            resourceId,
            startTime,
            endTime,
        ],
    );

    return result.rows[0];
}


