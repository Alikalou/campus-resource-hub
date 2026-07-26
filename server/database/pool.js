import "dotenv/config";

import pg from "pg";

const { Pool } = pg;

if (!process.env.DB_URL) {
    throw new Error(
        "DB_URL is missing. Add it to the server/.env file."
    );
}

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

pool.on("error", (error) => {
    console.error(
        "Unexpected PostgreSQL pool error:",
        error
    );
});

export default pool;