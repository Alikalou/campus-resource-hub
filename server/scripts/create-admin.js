import "dotenv/config";
import bcrypt from "bcryptjs";
import readline from "node:readline";
import {
    createInterface,
} from "node:readline/promises";
import {
    stdin as input,
    stdout as output,
} from "node:process";

import pool from "../database/pool.js";

const PASSWORD_SALT_ROUNDS = 12;
const MINIMUM_PASSWORD_LENGTH = 8;

function normalizeName(value) {
    return value.trim();
}

function normalizeEmail(value) {
    return value.trim().toLowerCase();
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function askHidden(question) {
    return new Promise((resolve, reject) => {
        if (!input.isTTY) {
            reject(
                new Error(
                    "Hidden input requires an interactive terminal."
                )
            );

            return;
        }

        let value = "";

        readline.emitKeypressEvents(input);

        const previousRawMode = input.isRaw ?? false;

        output.write(question);

        input.setRawMode(true);
        input.resume();

        function cleanup() {
            input.off("keypress", handleKeypress);
            input.setRawMode(previousRawMode);
            input.pause();
        }

        function handleKeypress(character, key) {
            if (key.ctrl && key.name === "c") {
                output.write("\n");
                cleanup();
                reject(new Error("Admin creation cancelled."));
                return;
            }

            if (
                key.name === "return" ||
                key.name === "enter"
            ) {
                output.write("\n");
                cleanup();
                resolve(value);
                return;
            }

            if (key.name === "backspace") {
                if (value.length > 0) {
                    value = value.slice(0, -1);
                    output.write("\b \b");
                }

                return;
            }

            if (
                character &&
                !key.ctrl &&
                !key.meta &&
                key.name !== "tab"
            ) {
                value += character;

                output.write(
                    "*".repeat([...character].length)
                );
            }
        }

        input.on("keypress", handleKeypress);
    });
}

async function collectAdminDetails() {
    const terminal = createInterface({
        input,
        output,
    });

    let name;
    let email;

    try {
        name = normalizeName(
            await terminal.question("Admin name: ")
        );

        email = normalizeEmail(
            await terminal.question("Admin email: ")
        );
    } finally {
        terminal.close();
    }

    if (name.length === 0) {
        throw new Error("Admin name is required.");
    }

    if (!isValidEmail(email)) {
        throw new Error(
            "A valid admin email is required."
        );
    }

    const password = await askHidden(
        "Admin password: "
    );

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
        throw new Error(
            `Password must contain at least ${MINIMUM_PASSWORD_LENGTH} characters.`
        );
    }

    const passwordConfirmation = await askHidden(
        "Confirm password: "
    );

    if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match.");
    }

    return {
        name,
        email,
        password,
    };
}

async function findUserByEmail(email) {
    const result = await pool.query(
        `
            SELECT
                id,
                name,
                email,
                role
            FROM users
            WHERE email = $1
        `,
        [email]
    );

    return result.rows[0] ?? null;
}

async function insertAdmin({
    name,
    email,
    passwordHash,
}) {
    const result = await pool.query(
        `
            INSERT INTO users (
                name,
                email,
                password_hash,
                role,
                is_active
            )
            VALUES ($1, $2, $3, 'admin', true)
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

async function createAdmin() {
    console.log("\nCreate a new administrator\n");

    const {
        name,
        email,
        password,
    } = await collectAdminDetails();

    const existingUser =
        await findUserByEmail(email);

    if (existingUser !== null) {
        if (existingUser.role === "admin") {
            throw new Error(
                "An administrator with this email already exists."
            );
        }

        throw new Error(
            "A member with this email already exists. This script will not silently change their role."
        );
    }

    const passwordHash = await bcrypt.hash(
        password,
        PASSWORD_SALT_ROUNDS
    );

    const admin = await insertAdmin({
        name,
        email,
        passwordHash,
    });

    console.log("\nAdministrator created successfully.");
    console.log(`ID: ${admin.id}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}\n`);
}

createAdmin()
    .catch((error) => {
        if (error.code === "23505") {
            console.error(
                "\nAn account with this email already exists.\n"
            );
        } else {
            console.error(
                `\nFailed to create administrator: ${error.message}\n`
            );
        }

        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });