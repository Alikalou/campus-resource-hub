## Booking Model

A Booking represents a user's request to reserve a resource for a specific
period of time.

### Fields

- `id`
  - A unique integer used to identify the resource.
  - Required for every resource.
  - Generated automatically by the database.
  - Must be a positive integer.

- `user_id`
  - Identifies the user who created the booking.
  - Must reference an existing user.

- `resource_id`
  - Identifies the requested resource.
  - Must reference an existing resource.

- `start_time`
  - The date and time when the booking begins.
  - Must occur before `end_time`.

- `end_time`
  - The date and time when the booking ends.
  - Must occur after `start_time`.

- `status`
  - Represents the booking's current state.
  - Defaults to `pending`.
  - Accepted values are `pending`, `approved`, `rejected`, and `cancelled`.

- `created_at`
  - Records when the booking was created.

- `updated_at`
  - Records when the booking was last updated.

### Status Transitions

- `pending` → `approved`
- `pending` → `rejected`
- `pending` → `cancelled`

### Relationships

- A user may have many bookings.
- A resource may have many bookings.
- Each booking belongs to one user and one resource.

### Booking Rules

- The resource must exist and be active.
- `end_time` must be later than `start_time`.
- A booking must not overlap another `pending` or `approved` booking for
  the same resource.

### Example

```json
{
  "id": 1,
  "user_id": 2,
  "resource_id": 4,
  "start_time": "2026-07-28T09:00:00.000Z",
  "end_time": "2026-07-28T11:00:00.000Z",
  "status": "pending",
  "created_at": "2026-07-26T12:30:00.000Z",
  "updated_at": "2026-07-26T12:30:00.000Z"
}