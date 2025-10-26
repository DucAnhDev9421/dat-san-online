// routes/court.js
import express from "express";
import mongoose from "mongoose";
import Court from "../models/Court.js";
import Facility from "../models/Facility.js";
import {
  authenticateToken,
  authorize,
  requireAdmin,
} from "../middleware/auth.js";
import { logAudit } from "../utils/auditLogger.js";
import { uploadCourtImage, cloudinaryUtils } from "../config/cloudinary.js";

const router = express.Router();

// === MIDDLEWARE TÙY CHỈNH ===

// Middleware kiểm tra quyền sở hữu (Chỉ Owner của facility chứa sân)
const checkFacilityOwnership = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id).populate("facility");

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân",
      });
    }

    // Kiểm tra xem user có phải là chủ sở hữu của facility chứa sân không
    if (court.facility.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.court = court;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware kiểm tra quyền sở hữu HOẶC Admin
const checkFacilityOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next();
    }

    const court = await Court.findById(req.params.id).populate("facility");

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân",
      });
    }

    if (court.facility.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.court = court;
    next();
  } catch (error) {
    next(error);
  }
};

// === CÁC API ENDPOINTS ===

/**
 * POST /api/courts
 * Tạo sân mới (Chỉ Owner)
 */
router.post(
  "/",
  authenticateToken,
  authorize("owner"), // Chỉ owner mới được tạo
  async (req, res, next) => {
    try {
      const { facility, name, type, capacity, price, description, status, services, images, maintenance } =
        req.body;

      // Kiểm tra facility có tồn tại không
      const facilityDoc = await Facility.findById(facility);
      if (!facilityDoc) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cơ sở",
        });
      }

      // Kiểm tra user có phải là chủ sở hữu của facility không
      if (facilityDoc.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền tạo sân trong cơ sở này",
        });
      }

      // Tạo sân mới
      const court = new Court({
        facility,
        name,
        type,
        capacity,
        price,
        description,
        status: status || "active",
        services: services || [],
        images: images || [],
        maintenance: maintenance || "Không có lịch bảo trì",
      });

      await court.save();

      res.status(201).json({
        success: true,
        data: court,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/courts
 * Lấy danh sách sân
 */
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter
    const query = {};
    if (req.query.facility) {
      query.facility = req.query.facility;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const courts = await Court.find(query)
      .populate("facility", "name location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Court.countDocuments(query);

    res.json({
      success: true,
      data: {
        courts,
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
 * GET /api/courts/:id
 * Chi tiết sân
 */
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân",
      });
    }

    const court = await Court.findById(req.params.id).populate(
      "facility",
      "name location"
    );

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân",
      });
    }

    res.json({
      success: true,
      data: court,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/courts/:id
 * Cập nhật sân
 */
router.put(
  "/:id",
  authenticateToken,
  checkFacilityOwnership,
  async (req, res, next) => {
    try {
      // Không cho phép cập nhật facility
      delete req.body.facility;

      const updatedCourt = await Court.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("facility", "name location");

      res.json({
        success: true,
        message: "Cập nhật sân thành công",
        data: updatedCourt,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/courts/:id/status
 * Cập nhật trạng thái sân
 */
router.patch(
  "/:id/status",
  authenticateToken,
  checkFacilityOwnership,
  async (req, res, next) => {
    try {
      const { status } = req.body;

      if (!["active", "maintenance", "inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      const updatedCourt = await Court.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("facility", "name location");

      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: updatedCourt,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/courts/:id
 * Xóa sân
 */
router.delete(
  "/:id",
  authenticateToken,
  checkFacilityOwnershipOrAdmin,
  async (req, res, next) => {
    try {
      await Court.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Xóa sân thành công",
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/courts/:id/upload
 * Upload ảnh cho sân (Tối đa 5 ảnh)
 */
router.post(
  "/:id/upload",
  authenticateToken,
  checkFacilityOwnership,
  uploadCourtImage.array("images", 5), // Tối đa 5 ảnh
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn ít nhất 1 ảnh",
        });
      }

      // Lấy danh sách ảnh hiện tại
      const court = await Court.findById(req.params.id);
      const currentImages = court.images || [];

      // Tạo mảng ảnh mới từ req.files
      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      // Kiểm tra tổng số ảnh không vượt quá 5
      const totalImages = currentImages.length + newImages.length;
      if (totalImages > 5) {
        // Xóa các ảnh mới upload trên Cloudinary
        for (const img of newImages) {
          await cloudinaryUtils.deleteImage(img.publicId);
        }
        return res.status(400).json({
          success: false,
          message: "Tổng số ảnh không được vượt quá 5",
        });
      }

      // Cập nhật court với ảnh mới
      court.images = [...currentImages, ...newImages];
      await court.save();

      res.json({
        success: true,
        message: "Upload ảnh thành công",
        data: court,
      });
    } catch (error) {
      // Nếu có lỗi, xóa các ảnh đã upload trên Cloudinary
      if (req.files) {
        for (const file of req.files) {
          try {
            await cloudinaryUtils.deleteImage(file.filename);
          } catch (deleteError) {
            console.error("Error cleaning up uploaded files:", deleteError);
          }
        }
      }
      next(error);
    }
  }
);

/**
 * DELETE /api/courts/:id/images/:imageId
 * Xóa ảnh khỏi sân
 */
router.delete(
  "/:id/images/:imageId",
  authenticateToken,
  checkFacilityOwnership,
  async (req, res, next) => {
    try {
      const court = await Court.findById(req.params.id);
      if (!court) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sân",
        });
      }

      const imageToDelete = court.images.id(req.params.imageId);
      if (!imageToDelete) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy ảnh",
        });
      }

      // Xóa ảnh trên Cloudinary
      if (imageToDelete.publicId) {
        try {
          await cloudinaryUtils.deleteImage(imageToDelete.publicId);
        } catch (deleteError) {
          console.error("Error deleting image from Cloudinary:", deleteError);
        }
      }

      // Xóa ảnh khỏi mảng
      court.images.pull(req.params.imageId);
      await court.save();

      res.json({
        success: true,
        message: "Xóa ảnh thành công",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

