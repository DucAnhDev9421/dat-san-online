// routes/facility.js
import express from "express";
import mongoose from "mongoose";
import Facility from "../models/Facility.js";
import {
  authenticateToken,
  authorize,
  requireAdmin,
} from "../middleware/Auth.js";
import { logAudit } from "../utils/auditLogger.js";

const router = express.Router();

// === MIDDLEWARE TÙY CHỈNH CHO ROUTE NÀY ===

// Middleware kiểm tra quyền sở hữu (Chỉ Owner của cơ sở)
const checkOwnership = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy cơ sở" });
    }

    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy cơ sở" });
    }

    // Kiểm tra xem user có phải là chủ sở hữu không
    if (facility.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.facility = facility; // Gán facility vào request để dùng ở route sau
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware kiểm tra quyền sở hữu HOẶC Admin
const checkOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next(); // Admin có toàn quyền
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy cơ sở" });
    }

    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy cơ sở" });
    }

    // Kiểm tra xem user có phải là chủ sở hữu không
    if (facility.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.facility = facility;
    next();
  } catch (error) {
    next(error);
  }
};

// === CÁC API ENDPOINTS ===

/**
 * BE: POST /api/facilities
 * Tạo cơ sở mới (Chỉ cho Owner)
 */
router.post(
  "/",
  authenticateToken,
  authorize("owner"), // Chỉ 'owner' mới được tạo
  async (req, res, next) => {
    try {
      const { name, location, type, pricePerHour, description } = req.body;

      const facility = new Facility({
        ...req.body,
        owner: req.user._id, // Gán chủ sở hữu là user đang đăng nhập
      });

      await facility.save();

      // (Tùy chọn) Ghi log
      // logAudit("CREATE_FACILITY", req.user._id, req, { facilityId: facility._id });

      res.status(201).json({ success: true, data: facility });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * BE: GET /api/facilities
 * Lấy danh sách cơ sở (Public, có filter)
 */
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter
    const query = {};
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.location) {
      // Tìm kiếm location gần đúng
      query.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.ownerId) {
      query.owner = req.query.ownerId;
    }

    query.status = "opening"; // Mặc định chỉ lấy sân đang mở

    const facilities = await Facility.find(query)
      .populate("owner", "name email avatar") // Lấy thông tin chủ sân
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Facility.countDocuments(query);

    res.json({
      success: true,
      data: {
        facilities,
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

/**
 * BE: GET /api/facilities/:id
 * Chi tiết cơ sở (Public)
 */
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy cơ sở" });
    }

    const facility = await Facility.findById(req.params.id).populate(
      "owner",
      "name email avatar"
    );

    if (!facility) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy cơ sở" });
    }

    res.json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
});

/**
 * BE: PUT /api/facilities/:id
 * Cập nhật cơ sở (Chỉ Owner sở hữu)
 */
router.put(
  "/:id",
  authenticateToken,
  checkOwnership, // Middleware kiểm tra đúng chủ sở hữu
  async (req, res, next) => {
    try {
      // Không cho phép cập nhật owner
      delete req.body.owner;

      const updatedFacility = await Facility.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("owner", "name email avatar");

      // (Tùy chọn) Ghi log
      // logAudit("UPDATE_FACILITY", req.user._id, req, { facilityId: updatedFacility._id });

      res.json({
        success: true,
        message: "Cập nhật cơ sở thành công",
        data: updatedFacility,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * BE: DELETE /api/facilities/:id
 * Xóa cơ sở (Owner sở hữu hoặc Admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkOwnershipOrAdmin, // Middleware kiểm tra chủ sở hữu HOẶC Admin
  async (req, res, next) => {
    try {
      await Facility.findByIdAndDelete(req.params.id);

      // (Tùy chọn) Ghi log
      // logAudit("DELETE_FACILITY", req.user._id, req, { facilityId: req.params.id });

      res.json({ success: true, message: "Xóa cơ sở thành công" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
