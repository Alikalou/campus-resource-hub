import pool from "../../database/pool.js";

export async function createAuditLog({
    actorId,
    action,
    subjectType,
    subjectId,
    oldValues,
    newValues,
    client
}
) {

    const result = await client.query(
        `
            INSERT INTO audit_logs (
                actor_id,
                action,
                subject_type,
                subject_id,
                old_values,
                new_values
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `,
        [
            actorId,
            action,
            subjectType,
            subjectId,
            oldValues,
            newValues,
        ]
    );

    return result.rows[0];


}


export async function findAuditLogs({
    limit,
    offset,
}) {
    const result = await pool.query(
        `
        SELECT
            audit_logs.id,
            audit_logs.action,
            audit_logs.subject_type,
            audit_logs.subject_id,
            audit_logs.old_values,
            audit_logs.new_values,
            audit_logs.created_at,
            users.id AS actor_id,
            users.name AS actor_name,
            users.email AS actor_email
        FROM audit_logs
        LEFT JOIN users
            ON users.id = audit_logs.actor_id
        ORDER BY audit_logs.created_at DESC
        LIMIT $1
        OFFSET $2
        `,
        [limit, offset]
    );

    return result.rows;
}


export async function countAuditLogs() {
    const result = await pool.query(
        `
        SELECT COUNT(*)::integer AS total
        FROM audit_logs
        `
    );

    return result.rows[0].total;
}