import bcrypt from "bcryptjs";

import {
    findUserByEmail,
    insertUser,
    findUserForAuthenticationByEmail,
} from "../repositories/userRepo.js";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

import {
    createAccessToken,
} from "../tokenUtils.js";



const PASSWORD_SALT_ROUNDS = 12;
export async function registerUser({
    name,
    email,
    password,
}) {
    const emailAlreadyExists = await findUserByEmail(email);

    if (emailAlreadyExists) {
        throw new AppError(
            "An account with this email already exists.",
            409,
            ERROR_CODES.EMAIL_ALREADY_EXISTS
        );
    }

    const passwordHash = await bcrypt.hash(
        password,
        PASSWORD_SALT_ROUNDS
    );

    try {
        return await insertUser({
            name,
            email,
            passwordHash,
        });
    } catch (error) {
        /*
         * PostgreSQL unique_violation.
         *
         * The database remains the final authority in case two
         * registration requests arrive at nearly the same time.
         */
        if (error.code === "23505") {
            throw new AppError(
                "An account with this email already exists.",
                409,
                ERROR_CODES.EMAIL_ALREADY_EXISTS
            );
        }

        throw error;
    }
}


export async function loginUser({
    email,
    password,
}) {
    const user =
        await findUserForAuthenticationByEmail(email);

    if (user === null) {
        throw new AppError(
            "Invalid email or password.",
            401,
            ERROR_CODES.INVALID_CREDENTIALS
        );
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw new AppError(
            "Invalid email or password.",
            401,
            ERROR_CODES.INVALID_CREDENTIALS
        );
    }

    if (!user.isActive) {
        throw new AppError(
            "This account is inactive.",
            403,
            ERROR_CODES.ACCOUNT_INACTIVE
        );
    }

    const token = createAccessToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}