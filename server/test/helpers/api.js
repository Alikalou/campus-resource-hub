import request from "supertest";
import assert from "node:assert/strict";

import app from "../../src/app.js";

export async function loginUser({
    email,
    password,
}) {
    const response = await request(app)
        .post("/auth/login")
        .send({
            email,
            password,
        });

    assert.equal(
        response.status,
        200,
        `Login failed: ${JSON.stringify(response.body)}`,
    );

    const token = response.body.data?.token;

    assert.ok(
        token,
        `Login response has no token: ${JSON.stringify(response.body)}`,
    );

    return token;
}


export function getToken(responseBody) {
    return (
        responseBody.token ??
        responseBody.data?.token
    );
}

export function getBookings(responseBody) {
    if (Array.isArray(responseBody.data)) {
        return responseBody.data;
    }

    if (Array.isArray(responseBody.bookings)) {
        return responseBody.bookings;
    }

    if (Array.isArray(responseBody.data?.bookings)) {
        return responseBody.data.bookings;
    }

    return null;
} ``