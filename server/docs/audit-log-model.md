## Audit Log Model

An Audit Log represents a recorded action performed by a user on a system
entity, such as a booking, resource, or user.

### Fields

- `id`
  - A unique integer used to identify the audit log.
  - Generated automatically by the database.
  - Must be a positive integer.

- `actor_id`
  - Identifies the user who performed the action.
  - References an existing user when provided.
  - May be `null` when the user has been deleted.
  - Deleting the user does not delete the audit log.

- `action`
  - Describes the action that was performed.
  - Required for every audit log.

- `subject_type`
  - Identifies the type of entity affected by the action.
  - Required for every audit log.
  - It can include `booking`, `resource`, and `user`, but currently it refers only to `booking`.

- `subject_id`
  - Identifies the specific entity affected by the action.
  - Required for every audit log.
  - Must be a positive integer.
  - Its meaning is determined together with `subject_type`.

- `old_values`
  - Stores the relevant values before the action occurred.
  - Optional.
  - Stored as JSON.

- `new_values`
  - Stores the relevant values after the action occurred.
  - Optional.
  - Stored as JSON.

- `created_at`
  - Records when the action occurred.
  - Generated automatically by the database.

### Relationships

- Each audit log may belong to one actor.
- An actor may have many audit logs.
- The audited subject is identified by the combination of `subject_type`
  and `subject_id`.
- `subject_id` does not use a foreign key because it may refer to records
  from different tables.

### Example

```json
{
  "id": 1,
  "actor_id": 3,
  "action": "booking_status_updated",
  "subject_type": "booking",
  "subject_id": 12,
  "old_values": {
    "status": "pending"
  },
  "new_values": {
    "status": "approved"
  },
  "created_at": "2026-08-06T10:30:00.000Z"
}
```
