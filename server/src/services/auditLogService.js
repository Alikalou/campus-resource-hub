import { findAuditLogs, countAuditLogs } from "../repositories/auditRepo.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function getAuditLogs({
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
}) {
    const normalizedPage = Math.max(page, 1);
    const normalizedLimit = Math.min(
        Math.max(limit, 1),
        MAX_LIMIT
    );

    const offset = (normalizedPage - 1) * normalizedLimit;

    const [logs, total] = await Promise.all([
        findAuditLogs({
            limit: normalizedLimit,
            offset,
        }),
        countAuditLogs(),
    ]);

    return {
        auditLogs: logs.map((log) => ({
            id: log.id,
            actor: log.actor_id
                ? {
                    id: log.actor_id,
                    name: log.actor_name,
                    email: log.actor_email,
                }
                : null,
            action: log.action,
            subject_type: log.subject_type,
            subject_id: log.subject_id,
            old_values: log.old_values,
            new_values: log.new_values,
            created_at: log.created_at,
        })),
        pagination: {
            page: normalizedPage,
            limit: normalizedLimit,
            total,
            total_pages: Math.ceil(
                total / normalizedLimit
            ),
        },
    };
}