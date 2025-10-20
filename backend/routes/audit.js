// routes/audit.js
import express from "express";
import AuditLog from "../models/AuditLog.js";
import { authenticateToken, requireAdmin } from "../middleware/Auth.js";

const router = express.Router();

// Tất cả route đều yêu cầu admin
router.use(authenticateToken, requireAdmin);

/**
 * API SỐ 7 (Mở rộng): Lấy Audit log (Admin only)
 * GET /api/audit/logs
 */
router.get("/logs", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userId = req.query.userId; // Lọc theo user

    const query = {};
    if (userId) {
      query.user = userId;
    }

    const logs = await AuditLog.find(query)
      .populate("user", "name email") // Lấy thông tin user
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
