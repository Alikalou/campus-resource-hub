## User Model

A User represents a person who can authenticate with the Campus Resource Hub
and interact with the system according to an assigned role.

### Fields

- `id`
  - A unique integer used to identify the user.
  - Required for every user.
  - Generated automatically by the database.
  - Must be a positive integer.

- `name`
  - The user's human-readable name.
  - Required for every user.
  - Must be a non-empty string.

- `email`
  - The email address used to identify the user and log in.
  - Required for every user.
  - Must be a valid email address.
  - Must be unique across all users.

- `password_hash`
  - Stores the securely hashed form of the user's password.
  - Required for every user.
  - A plaintext password must never be stored in this field.

- `role`
  - Determines the user's authorization level.
  - Required for every user.
  - Defaults to `member`.
  - Accepted values are `member` and `admin`.

- `is_active`
  - Indicates whether the account is currently active and permitted to use
    the system.
  - Required for every user.
  - Must be a Boolean value.
  - Defaults to `true`.
  - A value of `false` represents a disabled account.

### Representation of User Roles

Members and administrators are represented using the same User model rather
than separate models or tables. The `role` field determines what each user is
authorized to do.

| Capability | Member | Admin |
|------------|--------|-------|
| Register and log in | Allowed | Allowed |
| Browse resources | Allowed | Allowed |
| Create booking requests | Allowed | Allowed |
| View own bookings | Allowed | Allowed |
| Create or update resources | Not allowed | Allowed |
| Approve or reject bookings | Not allowed | Allowed |

### Relationships

- A user may have many bookings.
- Each booking belongs to one user.
- A user referenced by an existing booking must not be deleted while that
  relationship still exists.

### User Rules

- The email address must be unique.
- The `password_hash` field must never be exposed through the API.
- Public registration creates a user with the `member` role.
- A user cannot assign themselves the `admin` role through registration.
- The role must be either `member` or `admin`.
- Members may access only their own bookings unless an operation is explicitly
  available to administrators.

### Example

The API representation excludes `password_hash`:

```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@gmail.com",
  "role": "member",
  "is_active": true
}
```
