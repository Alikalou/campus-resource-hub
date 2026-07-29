CREATE TYPE resource_type AS ENUM (
    'room',
    'equipment'
);

CREATE TYPE user_role AS ENUM (
    'member',
    'admin'
);

CREATE TYPE booking_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);