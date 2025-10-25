// routes/user.js
import express from "express";
import User from "../models/User.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLogger.js";
import upload, { cloudinaryUtils } from "../config/cloudinary.js"; // Cloudinary upload middleware

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
    const { name, phone } = req.body;

    // Validation
    if (!name && !phone) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ít nhất một trường để cập nhật (name hoặc phone).",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshTokens");

    logAudit("UPDATE_PROFILE", req.user._id, req, updateData);

    res.json({
      success: true,
      message: "Cập nhật hồ sơ thành công.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * API SỐ 9: Cập nhật ảnh đại diện với Cloudinary
 * POST /api/users/avatar
 */
router.post("/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng upload file ảnh." });
    }

    // Cloudinary trả về thông tin file trong req.file
    // CloudinaryStorage sử dụng 'path' và 'filename' thay vì 'secure_url' và 'public_id'
    const secure_url = req.file.path;
    const public_id = req.file.filename;

    // Lấy user hiện tại để xóa avatar cũ
    const currentUser = await User.findById(req.user._id);
    
    // Xóa avatar cũ từ Cloudinary nếu có
    if (currentUser.avatarPublicId) {
      try {
        await cloudinaryUtils.deleteImage(currentUser.avatarPublicId);
      } catch (deleteError) {
        console.warn('⚠️ Could not delete old avatar:', deleteError.message);
        // Không throw error vì upload mới đã thành công
      }
    }

    // Lưu URL và public_id vào database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        avatar: secure_url,
        avatarPublicId: public_id // Lưu public_id để có thể xóa sau này
      },
      { new: true }
    ).select("-password -refreshTokens");

    logAudit("UPDATE_AVATAR", req.user._id, req, { 
      url: secure_url, 
      publicId: public_id,
      oldPublicId: currentUser.avatarPublicId
    });

    res.json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công.",
      data: { 
        user,
        uploadInfo: {
          url: secure_url,
          publicId: public_id
        }
      },
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

/**
 * API SỐ 11: Đổi mật khẩu
 * PUT /api/users/change-password
 */
router.put("/change-password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select("+password");

    // Check if user has password (not OAuth user)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản này đăng ký qua Google, không thể đổi mật khẩu.",
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng.",
      });
    }

    // Check if new password is same as current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu hiện tại.",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log audit
    logAudit("CHANGE_PASSWORD", user._id, req);

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công.",
    });
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

/**
 * API: Xóa ảnh đại diện
 * DELETE /api/users/avatar
 */
router.delete("/avatar", async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.avatarPublicId) {
      return res.status(400).json({
        success: false,
        message: "Không có ảnh đại diện để xóa."
      });
    }

    // Xóa avatar từ Cloudinary
    try {
      await cloudinaryUtils.deleteImage(user.avatarPublicId);
      console.log('✅ Deleted avatar from Cloudinary:', user.avatarPublicId);
    } catch (deleteError) {
      console.warn('⚠️ Could not delete avatar from Cloudinary:', deleteError.message);
      // Vẫn tiếp tục xóa trong database
    }

    // Xóa avatar trong database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        avatar: null,
        avatarPublicId: null
      },
      { new: true }
    ).select("-password -refreshTokens");

    logAudit("DELETE_AVATAR", req.user._id, req, { 
      publicId: user.avatarPublicId 
    });

    res.json({
      success: true,
      message: "Xóa ảnh đại diện thành công.",
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
