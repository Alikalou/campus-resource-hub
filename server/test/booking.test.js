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

import {
    clearTestData,
    verifyTestDatabase,
} from "./helpers/database.js";

import {
    createBooking,
    createResource,
    createUser,
} from "./helpers/factories.js";

import {
    getToken,
    getBookings,
    loginUser,
} from "./helpers/api.js";



describe("Booking integration flows", () => {
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
        "authenticated member can retrieve only their own bookings",
        async () => {
            // Arrange
            const password = "12345678";

            const firstMember = await createUser({
                name: "ali",
                email: "ali@gmail.com",
                password,
            });

            const secondMember = await createUser({
                name: "sara",
                email: "sara@gmail.com",
                password,
            });

            const resource = await createResource();

            const firstMemberBooking =
                await createBooking({
                    userId: firstMember.id,
                    resourceId: resource.id,
                    startTime:
                        "2030-01-10T10:00:00.000Z",
                    endTime:
                        "2030-01-10T11:00:00.000Z",
                });

            await createBooking({
                userId: secondMember.id,
                resourceId: resource.id,
                startTime:
                    "2030-01-11T10:00:00.000Z",
                endTime:
                    "2030-01-11T11:00:00.000Z",
            });

            const loginResponse = await request(app)
                .post("/auth/login")
                .send({
                    email: firstMember.email,
                    password,
                });

            assert.equal(
                loginResponse.status,
                200,
                JSON.stringify(loginResponse.body),
            );

            const token = getToken(
                loginResponse.body,
            );

            assert.ok(
                token,
                `No token found in response: ${JSON.stringify(loginResponse.body)
                }`,
            );

            // Act
            const bookingsResponse =
                await request(app)
                    .get("/bookings/mine")
                    .set(
                        "Authorization",
                        `Bearer ${token}`,
                    );

            // Assert
            assert.equal(
                bookingsResponse.status,
                200,
                JSON.stringify(
                    bookingsResponse.body,
                ),
            );

            const bookings = getBookings(
                bookingsResponse.body,
            );

            assert.ok(
                Array.isArray(bookings),
                `Could not find bookings array in response: ${JSON.stringify(
                    bookingsResponse.body,
                )
                }`,
            );

            assert.equal(bookings.length, 1);

            assert.equal(
                Number(bookings[0].id),
                Number(firstMemberBooking.id),
            );
        },
    );

    test(
        "admin can approve a pending booking and the action is audited",
        async () => {
            // Arrange
            const memberPassword =
                "MemberPass123!";

            const adminPassword =
                "AdminPass123!";

            const member = await createUser({
                name: "Booking Owner",
                email: "booking.owner@example.com",
                password: memberPassword,
            });

            const admin = await createUser({
                name: "Test Admin",
                email: "test.admin@example.com",
                password: adminPassword,
                role: "admin",
            });

            const resource = await createResource();

            const booking = await createBooking({
                userId: member.id,
                resourceId: resource.id,
                startTime:
                    "2030-03-10T10:00:00.000Z",
                endTime:
                    "2030-03-10T11:00:00.000Z",
            });

            const adminToken = await loginUser({
                email: admin.email,
                password: adminPassword,
            });

            // Act
            const response = await request(app)
                .patch(
                    `/bookings/${booking.id}`,
                )
                .set(
                    "Authorization",
                    `Bearer ${adminToken}`,
                )
                .send({
                    status: "approved",
                });

            // Assert the HTTP response.
            assert.equal(
                response.status,
                200,
                JSON.stringify(response.body),
            );

            // Assert the actual database status.
            const bookingResult = await pool.query(
                `
                SELECT status
                FROM bookings
                WHERE id = $1;
            `,
                [booking.id],
            );

            assert.equal(
                bookingResult.rows.length,
                1,
            );

            assert.equal(
                bookingResult.rows[0].status,
                "approved",
            );

            // Assert the audit record.
            const auditResult = await pool.query(
                `
                SELECT
                    actor_id,
                    action,
                    subject_type,
                    subject_id,
                    old_values,
                    new_values
                FROM audit_logs
                WHERE subject_id = $1
                ORDER BY created_at DESC
                LIMIT 1;
            `,
                [booking.id],
            );

            assert.equal(
                auditResult.rows.length,
                1,
                "Expected an audit log to be created.",
            );

            const auditLog =
                auditResult.rows[0];

            assert.equal(
                Number(auditLog.actor_id),
                Number(admin.id),
            );

            assert.equal(
                auditLog.subject_type,
                "bookings",
            );

            assert.equal(
                Number(auditLog.subject_id),
                Number(booking.id),
            );

            assert.equal(
                auditLog.old_values.status,
                "pending",
            );

            assert.equal(
                auditLog.new_values.status,
                "approved",
            );
        },
    );
});
