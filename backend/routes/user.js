// routes/user.js
import express from "express";
import User from "../models/User.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLogger.js";
import upload from "../utils/upload.js"; // Helper upload

const router = express.Router();

// Tất cả các route ở đây đều yêu cầu đăng nhập
router.use(authenticateToken);

/**
 * Lấy thông tin user hiện tại (Thay thế cho /api/auth/me)
 * GET /api/users/profile
 */
router.get("/profile", (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user, // req.user đã select('-password -refreshTokens')
    },
  });
});

/**
 * API SỐ 8: Cập nhật hồ sơ cá nhân
 * PUT /api/users/profile
 */
router.put("/profile", async (req, res, next) => {
  try {
    const { name, phone, address, dateOfBirth } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshTokens");

    logAudit("UPDATE_PROFILE", req.user._id, req, updateData);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * API SỐ 9: Cập nhật ảnh đại diện
 * POST /api/users/avatar
 */
router.post("/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng upload file ảnh." });
    }

    // req.file.path là đường dẫn file (ví dụ: 'uploads/avatar-12345.png')
    // Bạn nên lưu URL đầy đủ, ví dụ: `${process.env.BASE_URL}/${req.file.path}`
    const avatarUrl = `/${req.file.path}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password -refreshTokens");

    logAudit("UPDATE_AVATAR", req.user._id, req, { path: avatarUrl });

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * API SỐ 10: Đa ngôn ngữ (i18n)
 * PATCH /api/users/language
 */
router.patch("/language", async (req, res, next) => {
  try {
    const { language } = req.body;
    if (!["vi", "en"].includes(language)) {
      // Chỉ cho phép 'vi' hoặc 'en'
      return res
        .status(400)
        .json({ success: false, message: "Ngôn ngữ không hợp lệ." });
    }

    req.user.language = language;
    await req.user.save();

    res.json({ success: true, data: { language: req.user.language } });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN ROUTES ---
// (Di chuyển từ auth.js)

/**
 * Thay đổi vai trò user (Admin only)
 * PUT /api/users/role/:userId
 */
router.put("/role/:userId", requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!["user", "owner", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password -refreshTokens");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    logAudit("CHANGE_ROLE", req.user._id, req, {
      targetUser: userId,
      newRole: role,
    });

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Lấy tất cả users (Admin only)
 * GET /api/users
 */
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password -refreshTokens")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
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
