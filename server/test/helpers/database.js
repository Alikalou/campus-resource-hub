import pool from "../../database/pool.js";

export async function verifyTestDatabase() {
    const result = await pool.query(`
        SELECT current_database() AS database_name;
    `);

    const databaseName =
        result.rows[0].database_name;

    if (databaseName !== "campus_resource_hub_test") {
        throw new Error(
            `Refusing to run tests against ${databaseName}.`,
        );
    }
}

export async function clearTestData() {
    await pool.query(`
        TRUNCATE TABLE
            audit_logs,
            bookings,
            resources,
            users
        RESTART IDENTITY
        CASCADE;
    `);
}
