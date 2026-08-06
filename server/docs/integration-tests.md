# Integration Tests

The integration tests verify the most important authenticated booking flows
against the test database. Unlike isolated unit tests, these tests exercise
multiple application layers together, including routing, authentication,
authorization, services, and PostgreSQL queries.

The tests are divided into two parts, tests against booking flows and a single test against an authorization flow.

## Test Environment and Isolation

The integration tests use a separate test environment and database.

Before the suite begins, `verifyTestDatabase()` checks that the configured
database is safe to use for testing. Before every test, `clearTestData()`
removes data created by earlier tests so that each case starts from a
predictable state. After all tests finish, the PostgreSQL connection pool is
closed with `pool.end()`.

Each test creates only the users, resources, and bookings required for its
own scenario.

The test suite must never run against the development or production
database.

## Test Cases

### 1. Authenticated member can retrieve only their own bookings

This test verifies that the authenticated member's bookings endpoint applies
ownership filtering correctly.

The test creates:

- two member accounts;
- one resource;
- a booking belonging to the first member;
- a booking belonging to the second member.

The first member signs in and requests their bookings. The response must
contain the first member's booking and must not contain the booking owned by
the second member.

This case verifies:

- successful member authentication;
- access to a protected endpoint;
- correct use of the authenticated user's ID;
- protection of another member's booking data.

### 2. Member cannot update a booking status

This test verifies that changing a booking's approval status is restricted to
administrators.

The test creates a member, a resource, and a pending booking. The member signs
in and attempts to change the booking status to `approved`.

The request must be rejected with a forbidden response, and the booking must
remain `pending` in the database.

This case verifies:

- role-based authorization;
- protection of the admin-only status operation;
- prevention of unauthorized database changes.

### 3. Admin can approve a pending booking and the action is audited

This test verifies the complete administrative approval flow.

The test creates an administrator, a member, a resource, and a pending
booking. The administrator signs in and changes the booking status to
`approved`.

The test confirms that:

- the request succeeds;
- the returned booking has the `approved` status;
- the booking is stored as `approved` in the database;
- an audit-log record is created for the status change;
- the audit entry identifies the administrator as the actor;
- the audit entry identifies the affected booking as the subject;
- the old and new values describe the transition from `pending` to
  `approved`.

This case verifies authentication, administrator authorization, booking
persistence, and audit-log creation as one complete application flow.

## Why These Cases Were Selected

Together, the three tests cover the main security boundaries of the booking
API:

1. A member can access their own data.
2. A member cannot perform an administrator action.
3. An administrator can perform the action and the system records it.

They provide stronger confidence than testing only successful status codes
because they also verify ownership, authorization, database state, and audit
history.

## Running the Tests

Create the local test environment file from the provided example:

```text
.env.test.example -> .env.test
```

Run the test database migration command, then run the integration test command. Both are defined in `server/package.json`.

The `.env.test` file should remain untracked because it may contain local
database credentials and a test JWT secret. The `.env.test.example` file may
be committed because it contains only safe example values.
