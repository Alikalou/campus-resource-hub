// scripts/create-user.js

import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DB_URL,
});

try {
    await client.connect();

    const passwordHash = await bcrypt.hash("password", 10);

    const result = await client.query(
        `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role;
        `,
        [
            "Booking Test User",
            "booking@test.com",
            passwordHash,
            "member",
        ]
    );

    console.log(result.rows[0]);
} finally {
    await client.end();
}