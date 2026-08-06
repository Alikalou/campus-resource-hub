CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id BIGINT REFERENCES users (id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    subject_type VARCHAR(50) NOT NULL,
    subject_id BIGINT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX audit_logs_created_at_index ON audit_logs (created_at);