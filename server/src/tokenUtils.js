import jwt from "jsonwebtoken";

export function createAccessToken(userId) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error(
            "JWT_SECRET environment variable is required."
        );
    }

    return jwt.sign(
        {},
        secret,
        {
            subject: String(userId),
            expiresIn:
                process.env.JWT_EXPIRES_IN ?? "1h",
        }
    );
}