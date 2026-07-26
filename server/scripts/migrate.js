import dotenv from "dotenv";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Client } = pg;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

dotenv.config({
    path: path.resolve(currentDirectory, "../.env"),
    override: true,
});

const migrationsDirectory = path.resolve(
    currentDirectory,
    "../database/migrations"
);

const requiredVariables = [
    "DB_HOST",
    "DB_PORT",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
];

const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
    throw new Error(
        `Missing database variables: ${missingVariables.join(", ")}`
    );
}

console.log("Database connection:", {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    passwordMatches: process.env.POSTGRES_PASSWORD === "123456",
});

const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

async function createMigrationsTable() {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function getAppliedMigrations() {
    const result = await client.query(`
        SELECT filename
        FROM schema_migrations
        ORDER BY filename
    `);

    return new Set(
        result.rows.map((migration) => migration.filename)
    );
}

async function getMigrationFiles() {
    const files = await readdir(migrationsDirectory);

    return files
        .filter((file) => file.endsWith(".sql"))
        .sort();
}

async function applyMigration(filename) {
    const migrationPath = path.join(
        migrationsDirectory,
        filename
    );

    const sql = await readFile(migrationPath, "utf8");

    console.log(`Applying migration: ${filename}`);

    await client.query("BEGIN");

    try {
        await client.query(sql);

        await client.query(
            `
                INSERT INTO schema_migrations (filename)
                VALUES ($1)
            `,
            [filename]
        );

        await client.query("COMMIT");

        console.log(`Applied migration: ${filename}`);
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(`Migration failed: ${filename}`);

        throw error;
    }
}

async function runMigrations() {
    await client.connect();

    try {
        await createMigrationsTable();

        const appliedMigrations =
            await getAppliedMigrations();

        const migrationFiles =
            await getMigrationFiles();

        for (const filename of migrationFiles) {
            if (appliedMigrations.has(filename)) {
                console.log(
                    `Skipping already applied migration: ${filename}`
                );

                continue;
            }

            await applyMigration(filename);
        }

        console.log("All migrations completed successfully.");
    } finally {
        await client.end();
    }
}

runMigrations().catch((error) => {
    console.error("Database migration failed.");
    console.error(error);

    process.exit(1);
});