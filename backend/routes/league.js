// routes/league.js
import express from "express";
import mongoose from "mongoose";
import League from "../models/League.js";
import {
  authenticateToken,
  requireAdmin,
} from "../middleware/auth.js";
import { logAudit } from "../utils/auditLogger.js";
import { uploadLeagueImage } from "../config/cloudinary.js";

const router = express.Router();

// Tất cả các route ở đây đều yêu cầu đăng nhập
router.use(authenticateToken);

/**
 * Middleware kiểm tra quyền sở hữu (Chỉ người tạo giải đấu)
 */
const checkOwnership = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Kiểm tra xem user có phải là người tạo không
    if (league.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.league = league; // Gán league vào request để dùng ở route sau
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware kiểm tra quyền sở hữu hoặc admin
 */
const checkOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Kiểm tra xem user có phải là người tạo hoặc admin không
    const isOwner = league.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.league = league;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leagues
 * Lấy danh sách tất cả giải đấu nội bộ của người dùng
 * User
 */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Lấy tất cả giải đấu mà user là người tạo
    const leagues = await League.find({ creator: userId })
      .sort({ createdAt: -1 })
      .select("-teams -matches") // Không trả về teams và matches để giảm dữ liệu
      .lean();

    res.json({
      success: true,
      data: leagues,
      count: leagues.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leagues/:id
 * Lấy thông tin chi tiết 1 giải đấu
 * User
 */
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const league = await League.findById(req.params.id)
      .populate("creator", "name email avatar")
      .lean();

    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Tăng số lượt xem
    await League.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.json({
      success: true,
      data: league,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leagues
 * Tạo giải đấu nội bộ (PRIVATE)
 * User
 */
router.post("/", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      name,
      format,
      sport,
      phone,
      tournamentType,
      membersPerTeam,
      image,
      banner,
      startDate,
      endDate,
      location,
      address,
      maxParticipants,
      prize,
      description,
      fullDescription,
      registrationDeadline,
      teams,
      matches,
    } = req.body;

    // Validation
    if (!name || !format || !sport || !startDate || !endDate || !maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    // Kiểm tra ngày hợp lệ
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
    }

    // Tạo giải đấu mới
    const newLeague = new League({
      name,
      creator: userId,
      creatorName: req.user.name || req.user.email,
      phone: phone || null,
      tournamentType: tournamentType || "individual",
      membersPerTeam: membersPerTeam ? parseInt(membersPerTeam) : null,
      format,
      sport,
      image: image || null,
      banner: banner || image || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location: location || null,
      address: address || null,
      maxParticipants: parseInt(maxParticipants),
      prize: prize || null,
      status: "upcoming",
      description: description || null,
      fullDescription: fullDescription || description || null,
      registrationDeadline: registrationDeadline
        ? new Date(registrationDeadline)
        : null,
      teams: teams || [],
      matches: matches || [],
      type: "PRIVATE",
    });

    await newLeague.save();

    // Log audit
    await logAudit(
      "CREATE_LEAGUE",
      userId,
      req,
      {
        leagueId: newLeague._id,
        leagueName: name,
      }
    );

    res.status(201).json({
      success: true,
      message: "Tạo giải đấu thành công",
      data: newLeague,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0].message,
      });
    }
    next(error);
  }
});

/**
 * PUT /api/leagues/:id
 * Cập nhật thông tin giải đấu
 * User (người tạo)
 */
router.put("/:id", checkOwnership, async (req, res, next) => {
  try {
    const {
      name,
      format,
      sport,
      phone,
      tournamentType,
      membersPerTeam,
      image,
      banner,
      startDate,
      endDate,
      location,
      address,
      maxParticipants,
      prize,
      status,
      description,
      fullDescription,
      registrationDeadline,
      teams,
      matches,
    } = req.body;

    const updateData = {};

    // Chỉ cập nhật các trường được gửi lên
    if (name !== undefined) updateData.name = name;
    if (format !== undefined) updateData.format = format;
    if (sport !== undefined) updateData.sport = sport;
    if (phone !== undefined) updateData.phone = phone;
    if (tournamentType !== undefined) {
      if (!["team", "individual"].includes(tournamentType)) {
        return res.status(400).json({
          success: false,
          message: "Loại giải đấu không hợp lệ (phải là 'team' hoặc 'individual')",
        });
      }
      updateData.tournamentType = tournamentType;
    }
    if (membersPerTeam !== undefined) {
      const members = parseInt(membersPerTeam);
      if (members < 2 || members > 20) {
        return res.status(400).json({
          success: false,
          message: "Số lượng người mỗi đội phải từ 2 đến 20",
        });
      }
      updateData.membersPerTeam = members;
    }
    if (image !== undefined) updateData.image = image;
    if (banner !== undefined) updateData.banner = banner;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (location !== undefined) updateData.location = location;
    if (address !== undefined) updateData.address = address;
    if (maxParticipants !== undefined)
      updateData.maxParticipants = parseInt(maxParticipants);
    if (prize !== undefined) updateData.prize = prize;
    if (status !== undefined) {
      if (!["upcoming", "ongoing", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }
      updateData.status = status;
    }
    if (description !== undefined) updateData.description = description;
    if (fullDescription !== undefined)
      updateData.fullDescription = fullDescription;
    if (registrationDeadline !== undefined)
      updateData.registrationDeadline = registrationDeadline
        ? new Date(registrationDeadline)
        : null;
    if (teams !== undefined) updateData.teams = teams;
    if (matches !== undefined) updateData.matches = matches;

    // Kiểm tra ngày hợp lệ nếu có cả startDate và endDate
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        return res.status(400).json({
          success: false,
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }
    } else if (updateData.startDate && req.league.endDate) {
      if (updateData.startDate >= req.league.endDate) {
        return res.status(400).json({
          success: false,
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }
    } else if (updateData.endDate && req.league.startDate) {
      if (req.league.startDate >= updateData.endDate) {
        return res.status(400).json({
          success: false,
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }
    }

    const updatedLeague = await League.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("creator", "name email avatar")
      .lean();

    // Log audit
    await logAudit(
      "UPDATE_LEAGUE",
      req.user._id,
      req,
      {
        leagueId: req.params.id,
        leagueName: updatedLeague.name,
        updatedFields: Object.keys(updateData),
      }
    );

    res.json({
      success: true,
      message: "Cập nhật giải đấu thành công",
      data: updatedLeague,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0].message,
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/leagues/:id
 * Xóa giải đấu
 * User (người tạo) hoặc Admin
 */
router.delete("/:id", checkOwnershipOrAdmin, async (req, res, next) => {
  try {
    const leagueId = req.params.id;
    const leagueName = req.league.name;

    await League.findByIdAndDelete(leagueId);

    // Log audit
    await logAudit(
      "DELETE_LEAGUE",
      req.user._id,
      req,
      {
        leagueId: leagueId,
        leagueName: leagueName,
      }
    );

    res.json({
      success: true,
      message: "Xóa giải đấu thành công",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leagues/:id/upload
 * Upload image cho giải đấu
 * User (người tạo)
 */
router.post(
  "/:id/upload",
  checkOwnership,
  uploadLeagueImage.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file ảnh được upload",
        });
      }

      const imageUrl = req.file.path; // Cloudinary URL

      // Cập nhật image và banner của league
      const updatedLeague = await League.findByIdAndUpdate(
        req.params.id,
        {
          image: imageUrl,
          banner: imageUrl, // Dùng chung image cho banner
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("creator", "name email avatar")
        .lean();

      // Log audit
      await logAudit(
        "UPLOAD_LEAGUE_IMAGE",
        req.user._id,
        req,
        {
          leagueId: req.params.id,
          leagueName: updatedLeague.name,
        }
      );

      res.json({
        success: true,
        message: "Upload ảnh thành công",
        data: {
          image: imageUrl,
          imageUrl: imageUrl,
          league: updatedLeague,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

