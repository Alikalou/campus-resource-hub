import "dotenv/config";

import bcrypt from "bcryptjs";
import pg from "pg";

const { Client } = pg;

if (!process.env.DB_URL) {
    throw new Error(
        "DB_URL is missing. Add it to the server/.env file."
    );
}

if (process.env.NODE_ENV === "production") {
    throw new Error(
        "The development seed script must not run in production."
    );
}

const client = new Client({
    connectionString: process.env.DB_URL,
});

async function insertUser({
    name,
    email,
    passwordHash,
    role,
}) {
    const result = await client.query(
        `
            INSERT INTO users (
                name,
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `,
        [name, email, passwordHash, role]
    );

    return result.rows[0].id;
}

async function insertResource({
    name,
    location,
    type,
    capacity,
}) {
    const result = await client.query(
        `
            INSERT INTO resources (
                name,
                location,
                type,
                capacity
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `,
        [name, location, type, capacity]
    );

    return result.rows[0].id;
}

async function seed() {
    try {
        await client.connect();

        console.log("Connected to PostgreSQL.");
        console.log("Starting database seed...");

        await client.query("BEGIN");

        /*
         * This makes the seed repeatable.
         *
         * Every time npm run db:seed is executed, existing development
         * data is removed and the identity counters restart from 1.
         *
         * The schema_migrations table is not affected.
         */
        await client.query(`
            TRUNCATE TABLE
                audit_logs,
                bookings,
                resources,
                users
            RESTART IDENTITY;
        `);

        const demoPassword = "12345678";

        const passwordHash = await bcrypt.hash(
            demoPassword,
            12
        );

        /*
         * Users
         */
        const adminId = await insertUser({
            name: "hassan",
            email: "hassan@gmail.com",
            passwordHash,
            role: "admin",
        });

        const aliId = await insertUser({
            name: "Ali",
            email: "ali@gmail.com",
            passwordHash,
            role: "member",
        });

        const saraId = await insertUser({
            name: "Sara",
            email: "sara@gmail.com",
            passwordHash,
            role: "member",
        });

        /*
         * Resources
         */
        const lectureHallId = await insertResource({
            name: "Main Lecture Hall",
            location: "Building A - Ground Floor",
            type: "room",
            capacity: 120,
        });

        const seminarRoomId = await insertResource({
            name: "Seminar Room 201",
            location: "Building B - Second Floor",
            type: "room",
            capacity: 30,
        });

        const computerLabId = await insertResource({
            name: "Computer Laboratory",
            location: "Technology Building",
            type: "room",
            capacity: 40,
        });

        const projectorId = await insertResource({
            name: "HD Projector",
            location: "Media Office",
            type: "equipment",
            capacity: null,
        });

        const cameraId = await insertResource({
            name: "DSLR Camera",
            location: "Media Office",
            type: "equipment",
            capacity: null,
        });

        const speakerSystemId = await insertResource({
            name: "Portable Speaker System",
            location: "Student Activities Office",
            type: "equipment",
            capacity: null,
        });

        /*
         * Sample bookings
         *
         * The dates are relative to the day the seed runs, so the
         * sample bookings do not become permanently outdated.
         *
         * These bookings do not overlap for the same resource.
         */
        await client.query(
            `
                INSERT INTO bookings (
                    user_id,
                    resource_id,
                    start_time,
                    end_time,
                    status
                )
                VALUES
                    (
                        $1,
                        $3,
                        (CURRENT_DATE + 1) + TIME '09:00',
                        (CURRENT_DATE + 1) + TIME '11:00',
                        'approved'
                    ),
                    (
                        $2,
                        $3,
                        (CURRENT_DATE + 1) + TIME '12:00',
                        (CURRENT_DATE + 1) + TIME '13:00',
                        'pending'
                    ),
                    (
                        $1,
                        $6,
                        (CURRENT_DATE + 1) + TIME '14:00',
                        (CURRENT_DATE + 1) + TIME '16:00',
                        'pending'
                    ),
                    (
                        $1,
                        $4,
                        (CURRENT_DATE + 2) + TIME '10:00',
                        (CURRENT_DATE + 2) + TIME '11:00',
                        'cancelled'
                    ),
                    (
                        $2,
                        $5,
                        (CURRENT_DATE + 3) + TIME '15:00',
                        (CURRENT_DATE + 3) + TIME '17:00',
                        'rejected'
                    );
            `,
            [
                aliId,
                saraId,
                lectureHallId,
                seminarRoomId,
                computerLabId,
                projectorId,
            ]
        );

        await client.query("COMMIT");

        console.log("Database seeded successfully.");
        console.log("");
        console.log("Seeded records:");
        console.log("- 3 users");
        console.log("- 6 resources");
        console.log("- 5 bookings");
        console.log("");
        console.log("Demo accounts:");
        console.log(`- Admin: hassan@gmail.com`);
        console.log(`- Member: ali@gmail.com`);
        console.log(`- Member: sara@gmail.com`);
        console.log(`- Password: ${demoPassword}`);

        /*
         * These variables are intentionally created even when they do
         * not yet appear in bookings. They confirm that all resources
         * were successfully inserted.
         */
        console.log("");
        console.log("Additional seeded resource IDs:");
        console.log(`- Camera: ${cameraId}`);
        console.log(`- Speaker system: ${speakerSystemId}`);
        console.log(`- Admin user: ${adminId}`);
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch {
            // The transaction may not have started yet.
        }

        console.error("Database seed failed.");
        console.error(error);

        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

seed();