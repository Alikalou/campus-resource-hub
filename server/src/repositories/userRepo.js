import pool from "../../database/pool.js";


export async function findUserByEmail(email) {
    const result = await pool.query(
        `
            select EXISTS(
                SELECT 1
                FROM users
                WHERE email = $1
            ) AS "exists"
        `,
        [email]
    );

    return result.rows[0].exists ?? null;
}

export async function insertUser({
    name,
    email,
    passwordHash,
}) {
    const result = await pool.query(
        `
            INSERT INTO users (
                name,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                name,
                email,
                role,
                is_active
        `,
        [
            name,
            email,
            passwordHash,
        ]
    );

    return result.rows[0];
}


export async function findUserForAuthenticationByEmail(
    email
) {
    const result = await pool.query(
        `
            SELECT
                id,
                name,
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"
            FROM users
            WHERE email = $1
        `,
        [email]
    );

    return result.rows[0] ?? null;
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
    if (result.rows.length === 0) {
        return null;
    }

    const row = result.rows[0];

    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        isActive: row.is_active,
    };
}