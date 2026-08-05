import { getAuditLogs as getAuditLogsService } from "../services/auditLogService.js";

export async function getAuditLogs(req, res, next) {

    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;

        const result = await getAuditLogsService({ page, limit });


        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        next(error);
    }
}