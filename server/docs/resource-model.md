## Resource Model

A Resource represents an individual university facility or item of
equipment that users may request to book. Examples include classrooms,
meeting rooms, laboratories, projectors, and other shared university
assets.

### Fields

- `id`
  - A unique integer used to identify the resource.
  - Required for every resource.
  - Generated automatically by the application or database.
  - Must be a positive integer.

- `name`
  - A human-readable name used to identify the resource.
  - Required for every resource.
  - Must be a non-empty string.

- `location`
  - Describes where the resource is located.
  - Optional because movable equipment may not have a permanent location.
  - When provided, it must be a non-empty string.

- `type`
  - Identifies the category of the resource.
  - Required for every resource.
  - The accepted values are `room` and `equipment`.
  - Any value outside the accepted resource types is invalid.

- `capacity`
  - Represents the maximum number of people the resource can accommodate.
  - Must be provided when the resource type is `room`.
  - May be omitted or set to `null` when the resource type is `equipment`.
  - When provided, it must be a positive integer.

- `is_bookable`
  - Indicates whether the resource is generally enabled to receive booking
    requests.
  - Required for every resource.
  - Must be a Boolean value.
  - Defaults to `true` when no value is provided.
  - A value of `false` may indicate that the resource is under maintenance,
    damaged, retired, or otherwise unavailable for booking.

### Representation of Resource Types

Rooms and equipment are represented using the same Resource model rather
than separate models or tables. The `type` field distinguishes between
the different categories.

Some fields and validation rules apply differently depending on the
resource type:

|   Field      |   Room        |   equipement       |
|--------------|---------------|--------------------|
| `name`       | Required      | Required           |
| `location`   | Optional      | Optional           |
| `type`       | Must be `room`| Must be `equipment`|
| `capacity`   | Required      | Optional           |
| `is_bookable`| Required      | Required           |

For example, a meeting room and a projector would both be stored as
resources:

```json
{
  "id": 1,
  "name": "Meeting Room A",
  "location": "Administration Building, Floor 2",
  "type": "room",
  "capacity": 12,
  "is_bookable": true
}