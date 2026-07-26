CREATE TABLE resources (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    type resource_type NOT NULL,
    capacity INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT resources_capacity_non_negative CHECK (
        capacity IS NULL
        OR capacity >= 0
    )
);