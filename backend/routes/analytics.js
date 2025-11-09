import express from "express";
import mongoose from "mongoose";
import * as analyticsController from "../controllers/analyticsController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";
import Facility from "../models/Facility.js"; // Cần để check ownership

const router = express.Router();

/**
 * Middleware tùy chỉnh: Kiểm tra quyền sở hữu Facility
 * Middleware này sẽ áp dụng cho TẤT CẢ các route trong file này.
 * Nó đảm bảo user là "owner" của facilityId (hoặc là "admin").
 */
const checkFacilityOwnership = async (req, res, next) => {
  try {
    const facilityId = req.query.facilityId;

    if (!facilityId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp facilityId",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(facilityId)) {
      return res.status(400).json({
        success: false,
        message: "facilityId không hợp lệ",
      });
    }

    const facility = await Facility.findById(facilityId).select("owner");

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cơ sở",
      });
    }

    // Kiểm tra: Hoặc user là admin, hoặc user là chủ sở hữu
    const isOwner = facility.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập thống kê của cơ sở này",
      });
    }

    // Lưu facilityId đã được xác thực vào request để controller sử dụng
    req.facilityId = facility._id;
    next();
  } catch (error) {
    next(error);
  }
};

// === ĐĂNG KÝ ROUTE ===

// Tất cả các route bên dưới đều yêu cầu:
// 1. Đã đăng nhập (authenticateToken)
// 2. Có vai trò "owner" hoặc "admin" (authorize)
// 3. Phải là chủ sở hữu của facilityId (checkFacilityOwnership)

router.use(
  authenticateToken,
  authorize("owner", "admin"),
  checkFacilityOwnership
);

// GET /api/analytics/owner/dashboard?facilityId=xxx&period=month
router.get("/owner/dashboard", analyticsController.getOwnerDashboard);

// GET /api/analytics/owner/revenue?facilityId=xxx&startDate=xxx&endDate=xxx
router.get("/owner/revenue", analyticsController.getOwnerRevenue);

// GET /api/analytics/owner/bookings?facilityId=xxx&startDate=xxx&endDate=xxx
router.get("/owner/bookings", analyticsController.getOwnerBookings);

// GET /api/analytics/owner/courts?facilityId=xxx
router.get("/owner/courts", analyticsController.getOwnerCourts);

export default router;
