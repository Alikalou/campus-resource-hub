import {
    after,
    before,
    beforeEach,
    describe,
    test,
} from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";
import pool from "../database/pool.js";

import { verifyTestDatabase, clearTestData } from "./helpers/database.js";

import {
    createBooking,
    createResource,
    createUser,
} from "./helpers/factories.js";

import { getBookings, getToken, loginUser } from "./helpers/api.js";


describe("Authorization integration flow", () => {
    before(async () => {
        await verifyTestDatabase();
    });

    beforeEach(async () => {
        await clearTestData();
    });

    after(async () => {
        await pool.end();
    });

    test(
        "member cannot update a booking status",
        async () => {
            // Arrange
            const password = "MemberPass123!";

            const member = await createUser({
                name: "Regular Member",
                email: "regular.member@example.com",
                password,
            });

            const resource = await createResource();

            const booking = await createBooking({
                userId: member.id,
                resourceId: resource.id,
                startTime:
                    "2030-02-10T10:00:00.000Z",
                endTime:
                    "2030-02-10T11:00:00.000Z",
            });

            const memberToken = await loginUser({
                email: member.email,
                password,
            });

            // Act
            const response = await request(app)
                .patch(
                    `/bookings/${booking.id}`,
                )
                .set(
                    "Authorization",
                    `Bearer ${memberToken}`,
                )
                .send({
                    status: "approved",
                });

            // Assert the member is forbidden.
            assert.equal(
                response.status,
                403,
                JSON.stringify(response.body),
            );

            // Assert the booking was not changed.
            const bookingResult = await pool.query(
                `
                SELECT status
                FROM bookings
                WHERE id = $1;
            `,
                [booking.id],
            );

            assert.equal(
                bookingResult.rows[0].status,
                "pending",
            );

            // Assert no audit record was created.
            const auditResult = await pool.query(
                `
                SELECT id
                FROM audit_logs
                WHERE subject_id = $1;
            `,
                [booking.id],
            );

            assert.equal(
                auditResult.rows.length,
                0,
            );
        },
    );

});