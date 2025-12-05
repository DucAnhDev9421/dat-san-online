// routes/league.js
import express from "express";
import mongoose from "mongoose";
import League from "../models/League.js";
import Facility from "../models/Facility.js";
import Court from "../models/Court.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import {
  authenticateToken,
  requireAdmin,
  authorize,
} from "../middleware/auth.js";
import { logAudit } from "../utils/auditLogger.js";
import { uploadLeagueImage, uploadTeamLogo, cloudinaryUtils } from "../config/cloudinary.js";
import ExcelJS from "exceljs";
import multer from "multer";
import { 
  extractSheetId, 
  getSheetData, 
  getSheetNames,
  parseTeamsFromRows,
  parseMembersFromRows 
} from "../utils/googleSheetsService.js";
import { debit } from "../utils/walletService.js";
import { createNotification } from "../utils/notificationService.js";
import { emitToUser } from "../socket/index.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Public route để lấy danh sách giải đấu public (không cần đăng nhập)
/**
 * GET /api/leagues/public
 * Lấy danh sách giải đấu công khai
 * Public (không cần đăng nhập)
 */
router.get("/public", async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      sport, 
      format,
      search,
      sort = 'createdAt' // createdAt, views, startDate
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    // Lấy giải đấu PUBLIC và:
    // - Đã được approve (approvalStatus: "approved")
    // - Hoặc chưa có approvalStatus (null) - giải không cần duyệt
    // - Hoặc có approvalStatus: "pending" nhưng không có facility (owner tự tạo, không cần duyệt)
    const query = {
      type: "PUBLIC",
      $or: [
        { approvalStatus: "approved" },
        { approvalStatus: null },
        { 
          approvalStatus: "pending",
          facility: null // Giải do owner tạo không có facility (tự quản lý)
        }
      ]
    };
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by sport
    if (sport && sport !== 'all') {
      query.sport = sport;
    }
    
    // Filter by format
    if (format && format !== 'all') {
      const formatMapping = {
        'single-elimination': 'Loại Trực Tiếp',
        'round-robin': 'Vòng tròn',
        'knockout': 'Loại Trực Tiếp'
      };
      query.format = formatMapping[format] || format;
    }
    
    // Search by name
    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }
    
    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'views':
        sortOption = { views: -1 };
        break;
      case 'startDate':
        sortOption = { startDate: 1 };
        break;
      case 'updated':
        sortOption = { updatedAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const leagues = await League.find(query)
      .populate("creator", "name email avatar")
      .populate("facility", "name address")
      .select("-teams -matches") // Không trả về teams và matches để giảm dữ liệu
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await League.countDocuments(query);
    
    res.json({
      success: true,
      data: leagues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leagues/:id/register/template
 * Tải file mẫu Excel để thêm thành viên khi đăng ký
 * Public (cần đăng nhập)
 */
router.get("/:id/register/template", authenticateToken, async (req, res, next) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const isFootball = league.sport === 'Bóng đá';
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách thành viên');

    // Định nghĩa cột dựa trên môn thể thao
    if (isFootball) {
      worksheet.columns = [
        { header: 'Số áo', key: 'jerseyNumber', width: 15 },
        { header: 'Họ tên đầy đủ', key: 'name', width: 30 },
        { header: 'Số điện thoại', key: 'phone', width: 20 },
        { header: 'Vị trí thi đấu', key: 'position', width: 25 }
      ];
    } else {
      worksheet.columns = [
        { header: 'Họ tên đầy đủ', key: 'name', width: 30 },
        { header: 'Số điện thoại', key: 'phone', width: 20 },
        { header: 'Vị trí thi đấu', key: 'position', width: 25 }
      ];
    }

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Thêm dữ liệu mẫu
    if (isFootball) {
      worksheet.addRow(['1', 'Nguyễn Văn A', '0123456789', 'Thủ môn']);
      worksheet.addRow(['2', 'Trần Thị B', '0987654321', 'Hậu vệ']);
      worksheet.addRow(['3', 'Lê Văn C', '0111222333', 'Tiền vệ']);
      worksheet.addRow(['4', 'Phạm Thị D', '0444555666', 'Tiền đạo']);
    } else {
      worksheet.addRow(['Nguyễn Văn A', '0123456789', 'Khác']);
      worksheet.addRow(['Trần Thị B', '0987654321', 'Khác']);
      worksheet.addRow(['Lê Văn C', '0111222333', 'Khác']);
      worksheet.addRow(['Phạm Thị D', '0444555666', 'Khác']);
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="mau-danh-sach-thanh-vien.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leagues/:id/register
 * Đăng ký tham gia giải đấu (tạo đội mới)
 * Public (cần đăng nhập)
 */
router.post("/:id/register", authenticateToken, async (req, res, next) => {
  try {
    const leagueId = req.params.id;
    const userId = req.user._id;
    const { teamData, members } = req.body;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Kiểm tra giải đấu có cho phép đăng ký không
    if (!league.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Giải đấu không cho phép đăng ký",
      });
    }

    // So sánh đến cuối ngày hết hạn (23:59:59)
    const deadlineDate = new Date(league.registrationDeadline);
    deadlineDate.setHours(23, 59, 59, 999); // Set về cuối ngày
    if (deadlineDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Đã hết hạn đăng ký",
      });
    }

    // Kiểm tra số đội đã đăng ký
    if (league.participants >= league.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Giải đấu đã đủ số đội tham gia",
      });
    }

    // Kiểm tra user đã đăng ký chưa
    const existingTeam = league.teams.find(team => 
      team.contactPhone === teamData.contactPhone || 
      (team.members && team.members.some(m => m.phone === teamData.contactPhone))
    );

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký tham gia giải đấu này",
      });
    }

    // Tạo team ID mới
    const newTeamId = league.teams.length > 0 
      ? Math.max(...league.teams.map(t => t.id || 0)) + 1 
      : 1;

    // Tạo đội mới
    const newTeam = {
      id: newTeamId,
      teamNumber: teamData.teamNumber || `#${newTeamId}`,
      contactPhone: teamData.contactPhone || '',
      contactName: teamData.contactName || '',
      logo: null,
      logoPublicId: null,
      registrationStatus: "pending", // Mặc định là đang xét
      registeredAt: new Date(),
      wins: 0,
      draws: 0,
      losses: 0,
      members: members || []
    };

    // Thêm đội vào danh sách
    league.teams.push(newTeam);
    league.participants = league.teams.length;

    await league.save();

    // Log audit
    await logAudit(
      "REGISTER_TO_LEAGUE",
      userId,
      req,
      {
        leagueId: leagueId,
        leagueName: league.name,
        teamId: newTeamId,
        teamName: teamData.teamNumber
      }
    );

    res.json({
      success: true,
      message: "Đăng ký tham gia giải đấu thành công",
      data: {
        team: newTeam,
        league: league
      }
    });
  } catch (error) {
    next(error);
  }
});

// Tất cả các route ở đây đều yêu cầu đăng nhập
router.use(authenticateToken);

// Cấu hình multer cho upload file Excel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV'));
    }
  }
});

/**
 * POST /api/leagues/:id/register/parse-members
 * Parse Excel file để lấy danh sách thành viên khi đăng ký
 * Public (cần đăng nhập)
 */
router.post("/:id/register/parse-members", authenticateToken, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Không có file được upload",
      });
    }

    const league = await League.findById(req.params.id);
    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const isFootball = league.sport === 'Bóng đá';
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
    if (!worksheet) {
      return res.status(400).json({
        success: false,
        message: "File Excel không hợp lệ",
      });
    }

    const members = [];
    const minMembers = league.membersPerTeam || 0;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      let member = {
        name: '',
        phone: '',
        position: '',
        jerseyNumber: '',
        avatar: null
      };

      if (isFootball) {
        const jerseyNumber = row.getCell(1).value?.toString()?.trim() || '';
        const name = row.getCell(2).value?.toString()?.trim() || '';
        const phone = row.getCell(3).value?.toString()?.trim() || '';
        const position = row.getCell(4).value?.toString()?.trim() || '';

        if (name) {
          member.jerseyNumber = jerseyNumber;
          member.name = name;
          member.phone = phone;
          member.position = position;
          members.push(member);
        }
      } else {
        const name = row.getCell(1).value?.toString()?.trim() || '';
        const phone = row.getCell(2).value?.toString()?.trim() || '';
        const position = row.getCell(3).value?.toString()?.trim() || '';

        if (name) {
          member.name = name;
          member.phone = phone;
          member.position = position;
          members.push(member);
        }
      }
    });

    if (members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File không chứa dữ liệu hợp lệ",
      });
    }

    if (members.length < minMembers) {
      return res.status(400).json({
        success: false,
        message: `Cần ít nhất ${minMembers} thành viên. File chỉ có ${members.length} thành viên.`,
      });
    }

    res.json({
      success: true,
      data: members,
      message: `Đã parse ${members.length} thành viên từ file`,
    });
  } catch (error) {
    next(error);
  }
});

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
      .populate({
        path: "facility",
        select: "name address owner",
        populate: {
          path: "owner",
          select: "name email _id"
        }
      })
      .populate("courtId", "name")
      .populate("approvedBy", "name email")
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
      type, // PUBLIC or PRIVATE
      // Cấu hình cho vòng tròn
      numRounds,
      winPoints,
      drawPoints,
      lossPoints,
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
      type: type || "PRIVATE", // Nhận type từ request body, mặc định là PRIVATE
      approvalStatus: req.body.facility ? "pending" : undefined, // Nếu có facility thì chờ duyệt
      // Cấu hình cho vòng tròn
      numRounds: numRounds || 1,
      winPoints: winPoints !== undefined ? winPoints : 3,
      drawPoints: drawPoints !== undefined ? drawPoints : 1,
      lossPoints: lossPoints !== undefined ? lossPoints : 0,
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
      type, // PUBLIC or PRIVATE
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
    if (type !== undefined) {
      if (!["PUBLIC", "PRIVATE"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Type không hợp lệ (phải là 'PUBLIC' hoặc 'PRIVATE')",
        });
      }
      updateData.type = type;
    }
    if (req.body.facility !== undefined) {
      if (req.body.facility === null || req.body.facility === '') {
        updateData.facility = null;
      } else {
        updateData.facility = req.body.facility;
      }
    }
    if (req.body.approvalStatus !== undefined) {
      if (!["pending", "approved", "rejected"].includes(req.body.approvalStatus)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái duyệt không hợp lệ (phải là 'pending', 'approved', hoặc 'rejected')",
        });
      }
      updateData.approvalStatus = req.body.approvalStatus;
    }

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
 * DELETE /api/leagues/:id/teams/:teamId
 * Xóa một đội khỏi giải đấu
 * User (người tạo)
 */
router.delete("/:id/teams/:teamId", checkOwnership, async (req, res, next) => {
  try {
    const leagueId = req.params.id;
    const teamIdParam = req.params.teamId;
    const teamId = parseInt(teamIdParam);
    const isTeamIdNumber = !isNaN(teamId);

    const league = await League.findById(leagueId);

    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const minTeams = 4;
    const validTeams = league.teams.filter(
      (team) => team.teamNumber || team.contactPhone || team.contactName
    );
    
    if (validTeams.length > 0 && validTeams.length <= minTeams) {
      return res.status(400).json({
        success: false,
        message: `Phải có ít nhất ${minTeams} đội tham gia`,
      });
    }
    
    if (league.teams.length === 0 && league.maxParticipants <= minTeams) {
      return res.status(400).json({
        success: false,
        message: `Phải có ít nhất ${minTeams} đội`,
      });
    }

    const teamIndex = league.teams.findIndex(
      (team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        
        return false;
      }
    );

    if (teamIndex === -1) {
      if (isTeamIdNumber && league.maxParticipants > minTeams) {
        league.maxParticipants = Math.max(minTeams, league.maxParticipants - 1);
        await league.save();
        
        await logAudit("DELETE_TEAM", req.user._id, req, {
          leagueId: leagueId,
          leagueName: league.name,
          teamId: teamId,
          action: "decreased_maxParticipants",
        });

        return res.json({
          success: true,
          message: "Xóa đội thành công (giảm số đội tối đa)",
          data: league,
        });
      }
      
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đội",
      });
    }

    league.teams.splice(teamIndex, 1);
    
    if (league.maxParticipants > minTeams && league.teams.length < league.maxParticipants) {
      league.maxParticipants = Math.max(minTeams, league.teams.length);
    }
    
    await league.save();

    await logAudit("DELETE_TEAM", req.user._id, req, {
      leagueId: leagueId,
      leagueName: league.name,
      teamId: teamId,
    });

    res.json({
      success: true,
      message: "Xóa đội thành công",
      data: league,
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

/**
 * GET /api/leagues/:id/teams/template
 * Tải file mẫu Excel cho danh sách đội
 * User (người tạo)
 */
router.get("/:id/teams/template", checkOwnership, async (req, res, next) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách đội');

    worksheet.columns = [
      { header: 'Tên đội', key: 'teamNumber', width: 20 },
      { header: 'SĐT liên hệ', key: 'contactPhone', width: 20 },
      { header: 'Tên người liên hệ', key: 'contactName', width: 30 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    worksheet.addRow({ teamNumber: '#1', contactPhone: '0123456789', contactName: 'Nguyễn Văn A' });
    worksheet.addRow({ teamNumber: '#2', contactPhone: '0987654321', contactName: 'Trần Thị B' });
    worksheet.addRow({ teamNumber: '#3', contactPhone: '0111222333', contactName: 'Lê Văn C' });
    worksheet.addRow({ teamNumber: '#4', contactPhone: '0444555666', contactName: 'Phạm Thị D' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="mau-danh-sach-doi.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leagues/:id/teams/import
 * Import danh sách đội từ file Excel
 * User (người tạo)
 */
router.post(
  "/:id/teams/import",
  checkOwnership,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload",
        });
      }

      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
      if (!worksheet) {
        return res.status(400).json({
          success: false,
          message: "File Excel không hợp lệ",
        });
      }

      const teams = [];
      const minTeams = 4;

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const teamNumber = row.getCell(1).value?.toString()?.trim() || '';
        const contactPhone = row.getCell(2).value?.toString()?.trim() || '';
        const contactName = row.getCell(3).value?.toString()?.trim() || '';

        if (teamNumber || contactPhone || contactName) {
          teams.push({
            id: teams.length + 1,
            teamNumber: teamNumber || `#${teams.length + 1}`,
            contactPhone: contactPhone,
            contactName: contactName,
            logo: null,
            wins: 0,
            draws: 0,
            losses: 0,
            members: []
          });
        }
      });

      if (teams.length === 0) {
        return res.status(400).json({
          success: false,
          message: "File không chứa dữ liệu hợp lệ",
        });
      }

      if (teams.length < minTeams) {
        return res.status(400).json({
          success: false,
          message: `Phải có ít nhất ${minTeams} đội`,
        });
      }

      league.teams = teams;
      league.maxParticipants = Math.max(league.maxParticipants, teams.length);
      await league.save();

      await logAudit("IMPORT_TEAMS", req.user._id, req, {
        leagueId: req.params.id,
        leagueName: league.name,
        teamsCount: teams.length,
      });

      res.json({
        success: true,
        message: `Đã import ${teams.length} đội thành công`,
        data: league,
      });
    } catch (error) {
      if (error.message.includes('Chỉ chấp nhận')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/teams/import-from-sheets
 * Import danh sách đội từ Google Sheets
 * User (người tạo)
 */
router.post(
  "/:id/teams/import-from-sheets",
  checkOwnership,
  async (req, res, next) => {
    try {
      const { sheetUrl, sheetName, range } = req.body;

      if (!sheetUrl) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp Google Sheets URL",
        });
      }

      const sheetId = extractSheetId(sheetUrl);
      if (!sheetId) {
        return res.status(400).json({
          success: false,
          message: "Google Sheets URL không hợp lệ",
        });
      }

      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      // Determine range: use sheetName if provided, otherwise use default
      const sheetRange = sheetName 
        ? `${sheetName}!A:Z` 
        : range || 'A:Z';

      // Get data from Google Sheets
      const rows = await getSheetData(sheetId, sheetRange);

      if (!rows || rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Google Sheets không chứa dữ liệu",
        });
      }

      // Parse teams from rows
      const teams = parseTeamsFromRows(rows);

      if (teams.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy dữ liệu đội hợp lệ trong Google Sheets",
        });
      }

      const minTeams = 4;
      if (teams.length < minTeams) {
        return res.status(400).json({
          success: false,
          message: `Phải có ít nhất ${minTeams} đội`,
        });
      }

      league.teams = teams;
      league.maxParticipants = Math.max(league.maxParticipants, teams.length);
      await league.save();

      await logAudit("IMPORT_TEAMS_FROM_SHEETS", req.user._id, req, {
        leagueId: req.params.id,
        leagueName: league.name,
        teamsCount: teams.length,
        sheetUrl: sheetUrl,
      });

      res.json({
        success: true,
        message: `Đã import ${teams.length} đội từ Google Sheets thành công`,
        data: league,
      });
    } catch (error) {
      console.error('Error importing teams from Google Sheets:', error);
      next(error);
    }
  }
);

/**
 * GET /api/leagues/:id/sheets/preview
 * Preview Google Sheets data (get sheet names and sample data)
 * User (người tạo)
 */
router.get(
  "/:id/sheets/preview",
  checkOwnership,
  async (req, res, next) => {
    try {
      const { sheetUrl } = req.query;

      if (!sheetUrl) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp Google Sheets URL",
        });
      }

      const sheetId = extractSheetId(sheetUrl);
      if (!sheetId) {
        return res.status(400).json({
          success: false,
          message: "Google Sheets URL không hợp lệ",
        });
      }

      // Get sheet names
      const sheetNames = await getSheetNames(sheetId);

      // Get sample data from first sheet
      const firstSheetName = sheetNames[0]?.title || 'Sheet1';
      const sampleData = await getSheetData(sheetId, `${firstSheetName}!A1:Z10`);

      res.json({
        success: true,
        data: {
          sheetNames: sheetNames,
          sampleData: sampleData,
          firstSheetName: firstSheetName,
        },
      });
    } catch (error) {
      console.error('Error previewing Google Sheets:', error);
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/teams/:teamId/members/:memberIndex
 * Cập nhật thông tin thành viên
 * User (người tạo)
 */
router.put(
  "/:id/teams/:teamId/members/:memberIndex",
  checkOwnership,
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const teamIdParam = req.params.teamId;
      const memberIndex = parseInt(req.params.memberIndex);
      const { jerseyNumber, name, phone, position, avatar } = req.body;

      if (isNaN(memberIndex) || memberIndex < 0) {
        return res.status(400).json({
          success: false,
          message: "Chỉ số thành viên không hợp lệ",
        });
      }

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);

      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });

      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }

      const team = league.teams[teamIndex];
      if (!team.members || !Array.isArray(team.members)) {
        team.members = [];
      }

      if (memberIndex >= team.members.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thành viên",
        });
      }

      // Cập nhật thông tin thành viên
      const updatedMember = { ...team.members[memberIndex] };
      
      if (jerseyNumber !== undefined) updatedMember.jerseyNumber = jerseyNumber;
      if (name !== undefined) updatedMember.name = name;
      if (phone !== undefined) updatedMember.phone = phone;
      if (position !== undefined) updatedMember.position = position;
      if (avatar !== undefined) updatedMember.avatar = avatar;

      team.members[memberIndex] = updatedMember;
      league.teams[teamIndex] = team;

      await league.save();

      await logAudit("UPDATE_MEMBER", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        teamId: teamIdParam,
        memberIndex: memberIndex,
        memberName: updatedMember.name,
      });

      res.json({
        success: true,
        message: "Cập nhật thành viên thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/leagues/:id/teams/:teamId/members/:memberIndex
 * Xóa thành viên khỏi đội
 * User (người tạo)
 */
router.delete(
  "/:id/teams/:teamId/members/:memberIndex",
  checkOwnership,
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const teamIdParam = req.params.teamId;
      const memberIndex = parseInt(req.params.memberIndex);

      if (isNaN(memberIndex) || memberIndex < 0) {
        return res.status(400).json({
          success: false,
          message: "Chỉ số thành viên không hợp lệ",
        });
      }

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);

      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });

      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }

      const team = league.teams[teamIndex];
      if (!team.members || !Array.isArray(team.members)) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thành viên",
        });
      }

      if (memberIndex >= team.members.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thành viên",
        });
      }

      const memberName = team.members[memberIndex]?.name || '';

      // Xóa thành viên
      team.members.splice(memberIndex, 1);
      league.teams[teamIndex] = team;

      await league.save();

      await logAudit("DELETE_MEMBER", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        teamId: teamIdParam,
        memberIndex: memberIndex,
        memberName: memberName,
      });

      res.json({
        success: true,
        message: "Xóa thành viên thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/leagues/:id/teams/:teamId/members/template
 * Tải file mẫu Excel để thêm thành viên
 * User (người tạo)
 */
router.get(
  "/:id/teams/:teamId/members/template",
  checkOwnership,
  async (req, res, next) => {
    try {
      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const isFootball = league.sport === 'Bóng đá';
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách thành viên');

      // Định nghĩa cột dựa trên môn thể thao
      if (isFootball) {
        worksheet.columns = [
          { header: 'Số áo', key: 'jerseyNumber', width: 15 },
          { header: 'Họ tên đầy đủ', key: 'name', width: 30 },
          { header: 'Số điện thoại', key: 'phone', width: 20 },
          { header: 'Vị trí thi đấu', key: 'position', width: 25 }
        ];
      } else {
        worksheet.columns = [
          { header: 'Họ tên đầy đủ', key: 'name', width: 30 },
          { header: 'Số điện thoại', key: 'phone', width: 20 },
          { header: 'Vị trí thi đấu', key: 'position', width: 25 }
        ];
      }

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Thêm dữ liệu mẫu
      if (isFootball) {
        worksheet.addRow(['1', 'Nguyễn Văn A', '0123456789', 'Thủ môn']);
        worksheet.addRow(['2', 'Trần Thị B', '0987654321', 'Hậu vệ']);
        worksheet.addRow(['3', 'Lê Văn C', '0111222333', 'Tiền vệ']);
        worksheet.addRow(['4', 'Phạm Thị D', '0444555666', 'Tiền đạo']);
      } else {
        worksheet.addRow(['Nguyễn Văn A', '0123456789', 'Khác']);
        worksheet.addRow(['Trần Thị B', '0987654321', 'Khác']);
        worksheet.addRow(['Lê Văn C', '0111222333', 'Khác']);
        worksheet.addRow(['Phạm Thị D', '0444555666', 'Khác']);
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="mau-danh-sach-thanh-vien.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/teams/:teamId/members/import
 * Import danh sách thành viên từ file Excel
 * User (người tạo)
 */
router.post(
  "/:id/teams/:teamId/members/import",
  checkOwnership,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload",
        });
      }

      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const teamIdParam = req.params.teamId;
      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);

      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });

      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
      if (!worksheet) {
        return res.status(400).json({
          success: false,
          message: "File Excel không hợp lệ",
        });
      }

      const isFootball = league.sport === 'Bóng đá';
      const members = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        let jerseyNumber = '';
        let name = '';
        let phone = '';
        let position = '';

        if (isFootball) {
          jerseyNumber = row.getCell(1).value?.toString()?.trim() || '';
          name = row.getCell(2).value?.toString()?.trim() || '';
          phone = row.getCell(3).value?.toString()?.trim() || '';
          position = row.getCell(4).value?.toString()?.trim() || '';
        } else {
          name = row.getCell(1).value?.toString()?.trim() || '';
          phone = row.getCell(2).value?.toString()?.trim() || '';
          position = row.getCell(3).value?.toString()?.trim() || '';
        }

        if (name) {
          const member = {
            name: name,
            phone: phone || '',
            position: position || '',
            avatar: null
          };

          if (isFootball && jerseyNumber) {
            member.jerseyNumber = jerseyNumber;
          }

          members.push(member);
        }
      });

      if (members.length === 0) {
        return res.status(400).json({
          success: false,
          message: "File không chứa dữ liệu hợp lệ",
        });
      }

      // Thêm thành viên vào đội
      const team = league.teams[teamIndex];
      if (!team.members || !Array.isArray(team.members)) {
        team.members = [];
      }

      team.members = [...team.members, ...members];
      league.teams[teamIndex] = team;

      await league.save();

      await logAudit("IMPORT_MEMBERS", req.user._id, req, {
        leagueId: req.params.id,
        leagueName: league.name,
        teamId: teamIdParam,
        membersCount: members.length,
      });

      res.json({
        success: true,
        message: `Đã import ${members.length} thành viên thành công`,
        data: league,
      });
    } catch (error) {
      if (error.message.includes('Chỉ chấp nhận')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/teams/:teamId/members/import-from-sheets
 * Import danh sách thành viên từ Google Sheets
 * User (người tạo)
 */
router.post(
  "/:id/teams/:teamId/members/import-from-sheets",
  checkOwnership,
  async (req, res, next) => {
    try {
      const { sheetUrl, sheetName, range } = req.body;

      if (!sheetUrl) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp Google Sheets URL",
        });
      }

      const sheetId = extractSheetId(sheetUrl);
      if (!sheetId) {
        return res.status(400).json({
          success: false,
          message: "Google Sheets URL không hợp lệ",
        });
      }

      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const teamIdParam = req.params.teamId;
      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);

      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });

      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }

      // Determine range
      const sheetRange = sheetName 
        ? `${sheetName}!A:Z` 
        : range || 'A:Z';

      // Get data from Google Sheets
      const rows = await getSheetData(sheetId, sheetRange);

      if (!rows || rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Google Sheets không chứa dữ liệu",
        });
      }

      const isFootball = league.sport === 'Bóng đá';
      const members = parseMembersFromRows(rows, isFootball);

      if (members.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy dữ liệu thành viên hợp lệ trong Google Sheets",
        });
      }

      // Add members to team
      const team = league.teams[teamIndex];
      if (!team.members || !Array.isArray(team.members)) {
        team.members = [];
      }

      team.members = [...team.members, ...members];
      league.teams[teamIndex] = team;

      await league.save();

      await logAudit("IMPORT_MEMBERS_FROM_SHEETS", req.user._id, req, {
        leagueId: req.params.id,
        leagueName: league.name,
        teamId: teamIdParam,
        membersCount: members.length,
        sheetUrl: sheetUrl,
      });

      res.json({
        success: true,
        message: `Đã import ${members.length} thành viên từ Google Sheets thành công`,
        data: league,
      });
    } catch (error) {
      console.error('Error importing members from Google Sheets:', error);
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/teams/:teamId/logo
 * Upload logo cho đội
 * User (người tạo)
 */
router.post(
  "/:id/teams/:teamId/logo",
  checkOwnership,
  uploadTeamLogo.single("logo"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file ảnh được upload",
        });
      }

      const leagueId = req.params.id;
      const teamIdParam = req.params.teamId;
      const logoUrl = req.file.path; // Cloudinary URL
      const logoPublicId = req.file.filename; // Cloudinary public_id

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);

      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });

      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }

      const team = league.teams[teamIndex];
      
      // Xóa logo cũ từ Cloudinary nếu có
      if (team.logoPublicId) {
        try {
          await cloudinaryUtils.deleteImage(team.logoPublicId);
        } catch (deleteError) {
        }
      }

      // Cập nhật logo mới
      team.logo = logoUrl;
      team.logoPublicId = logoPublicId;
      league.teams[teamIndex] = team;

      await league.save();

      await logAudit("UPLOAD_TEAM_LOGO", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        teamId: teamIdParam,
        teamNumber: team.teamNumber,
      });

      res.json({
        success: true,
        message: "Upload logo thành công",
        data: {
          logo: logoUrl,
          league: league,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/leagues/:id/teams/:teamId/logo
 * Xóa logo của đội
 * User (người tạo)
 */
router.delete(
  "/:id/teams/:teamId/logo",
  checkOwnership,
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const teamIdParam = req.params.teamId;

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);

      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });

      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }

      const team = league.teams[teamIndex];

      // Xóa logo từ Cloudinary nếu có
      if (team.logoPublicId) {
        try {
          await cloudinaryUtils.deleteImage(team.logoPublicId);
        } catch (deleteError) {
        }
      }

      // Xóa logo trong database
      team.logo = null;
      team.logoPublicId = null;
      league.teams[teamIndex] = team;

      await league.save();

      await logAudit("DELETE_TEAM_LOGO", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        teamId: teamIdParam,
        teamNumber: team.teamNumber,
      });

      res.json({
        success: true,
        message: "Xóa logo thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/draw-matches
 * Bốc thăm ngẫu nhiên các cặp đấu
 * User (người tạo)
 */
router.post(
  "/:id/draw-matches",
  checkOwnership,
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const { stage = "round1", clearExisting = false } = req.body;

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      // Lấy danh sách đội hợp lệ (có thông tin đầy đủ)
      const validTeams = league.teams.filter(
        (team) => team.teamNumber || team.contactPhone || team.contactName
      );

      if (validTeams.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Cần ít nhất 2 đội để bốc thăm",
        });
      }

      // Xáo trộn ngẫu nhiên danh sách đội bằng Fisher-Yates shuffle algorithm
      const shuffledTeams = [...validTeams];
      for (let i = shuffledTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
      }

      // Kiểm tra format giải đấu
      const isRoundRobin = league.format === 'Vòng tròn' || league.format === 'round-robin' || stage === 'round-robin';

      // Chia thành các cặp đấu
      const matches = [];
      let hasBye = false;
      let byeTeam = null;

      if (isRoundRobin) {
        // Round-robin: tạo tất cả các cặp đấu (mỗi đội đấu với tất cả đội khác) × số lượt
        const numRounds = league.numRounds || 1;
        let matchNumber = 1;
        const matchesPerRound = 2; // Mỗi vòng 2 trận
        
        // Tạo tất cả các cặp đấu cho 1 lượt
        const allPairs = [];
        for (let i = 0; i < shuffledTeams.length; i++) {
          for (let j = i + 1; j < shuffledTeams.length; j++) {
            allPairs.push({
              team1Id: shuffledTeams[i].id !== null && shuffledTeams[i].id !== undefined ? shuffledTeams[i].id : shuffledTeams[i]._id,
              team2Id: shuffledTeams[j].id !== null && shuffledTeams[j].id !== undefined ? shuffledTeams[j].id : shuffledTeams[j]._id,
            });
          }
        }
        
        // Tạo matches cho từng lượt, chia thành các vòng nhỏ (mỗi vòng 2 trận)
        for (let round = 1; round <= numRounds; round++) {
          // Chia allPairs thành các vòng nhỏ
          const totalRoundsPerLeg = Math.ceil(allPairs.length / matchesPerRound);
          
          for (let subRound = 1; subRound <= totalRoundsPerLeg; subRound++) {
            const startIndex = (subRound - 1) * matchesPerRound;
            const endIndex = Math.min(startIndex + matchesPerRound, allPairs.length);
            const roundPairs = allPairs.slice(startIndex, endIndex);
            
            // Tạo stage name: round-robin-round1-v1, round-robin-round1-v2, ... (nếu numRounds > 1)
            // hoặc round-robin-v1, round-robin-v2, ... (nếu numRounds = 1)
            // Luôn bắt đầu từ 'round-robin' base, không phụ thuộc vào giá trị của stage variable
            let roundStage;
            if (numRounds > 1) {
              roundStage = `round-robin-round${round}-v${subRound}`;
            } else {
              roundStage = `round-robin-v${subRound}`;
            }
            
            roundPairs.forEach(pair => {
              matches.push({
                stage: roundStage,
                matchNumber: matchNumber++,
                team1Id: pair.team1Id,
                team2Id: pair.team2Id,
                date: null,
                time: null,
                score1: null,
                score2: null,
              });
            });
          }
        }
      } else {
        // Single-elimination: Bước 1 - Chuẩn hóa số lượng đội lên power of 2
        const numTeams = shuffledTeams.length;
        
        // Helper function: Tính power of 2 gần nhất (làm tròn lên)
        const getNextPowerOf2 = (n) => {
          if (n <= 1) return 1;
          if (n <= 2) return 2;
          if (n <= 4) return 4;
          if (n <= 8) return 8;
          if (n <= 16) return 16;
          if (n <= 32) return 32;
          if (n <= 64) return 64;
          // Nếu lớn hơn 64, tính toán động
          let power = 1;
          while (power < n) {
            power *= 2;
          }
          return power;
        };

        const numSlots = getNextPowerOf2(numTeams);
        const numByeSlots = numSlots - numTeams;
        hasBye = numByeSlots > 0;

        // Tạo bracketSlots với độ dài đúng bằng numSlots (power of 2)
        // Sử dụng thuật toán Seeding để rải đều các BYE slots, tránh tập trung ở cuối
        const bracketSlots = new Array(numSlots).fill(null);
        
        if (numByeSlots === 0) {
          // Không có BYE, điền tất cả teams
          shuffledTeams.forEach((team, index) => {
            bracketSlots[index] = team;
          });
        } else {
          // Có BYE: Sử dụng thuật toán Seeding để rải đều
          // Tính khoảng cách giữa các BYE slots để rải đều
          const byeInterval = Math.floor(numSlots / (numByeSlots + 1));
          
          // Tạo mảng vị trí sẽ đặt BYE (rải đều)
          const byePositions = [];
          for (let i = 0; i < numByeSlots; i++) {
            // Rải đều BYE vào các vị trí cách đều nhau
            // Sử dụng công thức: (i + 1) * (numSlots / (numByeSlots + 1))
            const position = Math.floor((i + 1) * (numSlots / (numByeSlots + 1)));
            byePositions.push(position);
          }
          
          // Điền teams vào các vị trí không phải BYE
          let teamIndex = 0;
          for (let i = 0; i < numSlots; i++) {
            if (byePositions.includes(i)) {
              // Vị trí này là BYE, giữ nguyên null
              bracketSlots[i] = null;
            } else {
              // Vị trí này là team thật
              if (teamIndex < shuffledTeams.length) {
                bracketSlots[i] = shuffledTeams[teamIndex];
                teamIndex++;
              } else {
                // Nếu hết teams nhưng vẫn còn slot, đặt BYE
                bracketSlots[i] = null;
              }
            }
          }
          
          // Đảm bảo không có 2 BYE liên tiếp trong cùng một match (cặp slot)
          // Điều chỉnh nếu cần: nếu slot chẵn và slot lẻ đều là BYE, swap một trong hai
          for (let i = 0; i < numSlots; i += 2) {
            const slot1 = bracketSlots[i];
            const slot2 = bracketSlots[i + 1];
            
            // Nếu cả 2 slot trong cùng một match đều là BYE, swap với slot tiếp theo có team
            if (slot1 === null && slot2 === null) {
              // Tìm slot tiếp theo có team để swap
              for (let j = i + 2; j < numSlots; j++) {
                if (bracketSlots[j] !== null) {
                  // Swap: đặt team vào slot1, BYE vào slot j
                  bracketSlots[i] = bracketSlots[j];
                  bracketSlots[j] = null;
                  break;
                }
              }
            }
          }
        }

        // Helper function: Tính toán stage dựa trên số đội
        const calculateStage = (numTeamsInRound) => {
          if (numTeamsInRound === 2) {
            return 'final';
          } else if (numTeamsInRound === 4) {
            return 'semi';
          } else if (numTeamsInRound === 8) {
            return 'round3';
          } else if (numTeamsInRound === 16) {
            return 'round4';
          } else {
            // Tính round number
            let roundNum = 1;
            let tempTeams = numTeamsInRound;
            while (tempTeams > 16) {
              tempTeams = Math.floor(tempTeams / 2);
              roundNum++;
            }
            if (tempTeams === 16) {
              return 'round4';
            } else if (tempTeams === 8) {
              return 'round3';
            } else if (tempTeams === 4) {
              return 'semi';
            } else {
              return `round${roundNum}`;
            }
          }
        };

        // Tính toán tất cả các vòng cần thiết dựa trên số slot (power of 2)
        const allRounds = [];
        let currentTeams = numSlots;
        
        while (currentTeams > 1) {
          const currentNumMatches = Math.floor(currentTeams / 2);
          const currentStage = calculateStage(currentTeams);
          
          allRounds.push({
            stage: currentStage,
            numMatches: currentNumMatches,
            numTeams: currentTeams
          });
          
          currentTeams = currentNumMatches;
        }

        // Tạo matches cho tất cả các vòng (từ đầu đến cuối)
        const allMatchesByRound = []; // Lưu matches theo từng vòng để dễ xử lý

        // Tạo matches cho tất cả các vòng
        allRounds.forEach((round, roundIndex) => {
          const roundMatches = [];

          if (roundIndex === 0) {
            // Vòng đầu tiên: gán teams thật và BYE từ bracketSlots
            for (let i = 0; i < round.numMatches; i++) {
              const slotIndex1 = i * 2;
              const slotIndex2 = i * 2 + 1;
              
              // Lấy team hoặc BYE từ bracketSlots (đảm bảo độ dài đúng bằng numSlots)
              const team1 = bracketSlots[slotIndex1]; // Có thể là team hoặc null (BYE)
              const team2 = bracketSlots[slotIndex2]; // Có thể là team hoặc null (BYE)

              const matchHasBye = !team1 || !team2;
              let team1Id = null;
              let team2Id = null;
              let score1 = null;
              let score2 = null;

              if (team1 && team2) {
                // Cả 2 đội đều thật
                team1Id = team1.id !== null && team1.id !== undefined ? team1.id : team1._id;
                team2Id = team2.id !== null && team2.id !== undefined ? team2.id : team2._id;
              } else if (team1 && !team2) {
                // Team1 thật, Team2 là BYE -> Team1 tự động thắng
                team1Id = team1.id !== null && team1.id !== undefined ? team1.id : team1._id;
                team2Id = "BYE";
                score1 = 1; // Tự động thắng
                score2 = 0;
              } else if (!team1 && team2) {
                // Team1 là BYE, Team2 thật -> Team2 tự động thắng
                team1Id = "BYE";
                team2Id = team2.id !== null && team2.id !== undefined ? team2.id : team2._id;
                score1 = 0;
                score2 = 1; // Tự động thắng
              } else {
                // Cả 2 đều là BYE (double BYE) - Trường hợp này có thể xảy ra với power of 2
                // Ví dụ: 6 đội -> 8 slots, match cuối cùng sẽ là BYE vs BYE
                // Trong trường hợp này, match này không nên tồn tại hoặc cần được skip
                // Ta sẽ không tạo match này (skip), và điều chỉnh nextMatchId của match trước
                // Hoặc đơn giản hơn: tạo match nhưng đánh dấu là double BYE và tự động skip
                team1Id = "BYE";
                team2Id = "BYE";
                // Không set score, match này sẽ được skip trong propagation
                // Match này sẽ không có winner, và vòng tiếp theo sẽ nhận BYE hoặc null
              }

              // Tính nextMatchId
              let nextMatchId = null;
              if (roundIndex < allRounds.length - 1) {
                const nextRound = allRounds[roundIndex + 1];
                // Match 1,2 -> Match 1 (team1, team2)
                // Match 3,4 -> Match 2 (team1, team2)
                const nextMatchNumber = Math.floor(i / 2) + 1;
                nextMatchId = `${nextRound.stage}_${nextMatchNumber}`;
              }

              const match = {
                stage: round.stage,
                matchNumber: i + 1,
                team1Id: team1Id,
                team2Id: team2Id,
                date: null,
                time: null,
                score1: score1,
                score2: score2,
                nextMatchId: nextMatchId,
                hasBye: matchHasBye,
              };

              roundMatches.push(match);
            }
          } else {
            // Các vòng sau: tạo matches với teamId = null (sẽ được cập nhật sau khi có kết quả)
            for (let i = 0; i < round.numMatches; i++) {
              // Tính nextMatchId
              let nextMatchId = null;
              if (roundIndex < allRounds.length - 1) {
                const nextRound = allRounds[roundIndex + 1];
                const nextMatchNumber = Math.floor(i / 2) + 1;
                nextMatchId = `${nextRound.stage}_${nextMatchNumber}`;
              }

              const match = {
                stage: round.stage,
                matchNumber: i + 1,
                team1Id: null, // Sẽ được cập nhật sau khi có kết quả vòng trước
                team2Id: null, // Sẽ được cập nhật sau khi có kết quả vòng trước
                date: null,
                time: null,
                score1: null,
                score2: null,
                nextMatchId: nextMatchId,
                hasBye: false,
              };

              roundMatches.push(match);
            }
          }

          allMatchesByRound.push(roundMatches);
          matches.push(...roundMatches);
        })

        // Xử lý tự động thắng cho các trận có BYE ở vòng đầu tiên
        // Điền đội thắng vào vòng tiếp theo ngay lập tức (Propagation)
        if (allMatchesByRound.length > 0) {
          const firstRoundMatches = allMatchesByRound[0];
          
          firstRoundMatches.forEach(match => {
            // Bỏ qua match double BYE (cả 2 đều là BYE)
            if (match.team1Id === "BYE" && match.team2Id === "BYE") {
              // Match này không có winner, và vòng tiếp theo sẽ nhận BYE hoặc null
              // Nếu match này có nextMatchId, ta cần xử lý đặc biệt
              if (match.nextMatchId) {
                const [nextStage, nextMatchNumber] = match.nextMatchId.split('_');
                const nextMatch = matches.find(m => 
                  m.stage === nextStage && m.matchNumber === parseInt(nextMatchNumber)
                );
                
                if (nextMatch) {
                  // Đặt BYE vào match tiếp theo
                  const isOddMatch = match.matchNumber % 2 === 1;
                  if (isOddMatch && !nextMatch.team1Id) {
                    nextMatch.team1Id = "BYE";
                    nextMatch.hasBye = true;
                  } else if (!isOddMatch && !nextMatch.team2Id) {
                    nextMatch.team2Id = "BYE";
                    nextMatch.hasBye = true;
                  }
                  
                  // Nếu match tiếp theo cũng trở thành double BYE, ta cần xử lý tiếp
                  // (sẽ được xử lý trong lần lặp tiếp theo hoặc trong updateMatchResult)
                  // Đảm bảo match tiếp theo được cập nhật trong mảng matches
                  const nextMatchIndex = matches.findIndex(m => 
                    m.stage === nextStage && m.matchNumber === parseInt(nextMatchNumber)
                  );
                  if (nextMatchIndex !== -1) {
                    matches[nextMatchIndex] = nextMatch;
                  }
                }
              }
              return; // Skip match double BYE
            }
            
            if (match.hasBye && match.score1 !== null && match.score2 !== null) {
              // Xác định đội thắng (loại bỏ BYE)
              const winnerId = match.score1 > match.score2 
                ? (match.team1Id !== "BYE" ? match.team1Id : null)
                : (match.team2Id !== "BYE" ? match.team2Id : null);
              
              if (winnerId && winnerId !== "BYE" && match.nextMatchId) {
                // Tìm match tiếp theo
                const [nextStage, nextMatchNumber] = match.nextMatchId.split('_');
                const nextMatch = matches.find(m => 
                  m.stage === nextStage && m.matchNumber === parseInt(nextMatchNumber)
                );

                if (nextMatch) {
                  // Xác định vị trí team (team1 hoặc team2) dựa trên matchNumber
                  // Match 1, 2 -> Match 1 vòng tiếp theo (team1, team2)
                  // Match 3, 4 -> Match 2 vòng tiếp theo (team1, team2)
                  // Match 5, 6 -> Match 3 vòng tiếp theo (team1, team2)
                  const isOddMatch = match.matchNumber % 2 === 1;
                  if (isOddMatch) {
                    // Match lẻ (1, 3, 5...) -> team1 ở vòng tiếp theo
                    nextMatch.team1Id = winnerId;
                  } else {
                    // Match chẵn (2, 4, 6...) -> team2 ở vòng tiếp theo
                    nextMatch.team2Id = winnerId;
                  }
                  
                  // Đảm bảo match tiếp theo được cập nhật trong mảng matches
                  const nextMatchIndex = matches.findIndex(m => 
                    m.stage === nextStage && m.matchNumber === parseInt(nextMatchNumber)
                  );
                  if (nextMatchIndex !== -1) {
                    matches[nextMatchIndex] = nextMatch;
                  }
                }
              }
            }
          });
        }
      }

      // Cập nhật matches trong league
      let updatedMatches;
      if (clearExisting) {
        if (isRoundRobin) {
          // Round-robin: xóa tất cả matches có stage bắt đầu bằng "round-robin"
          updatedMatches = (league.matches || []).filter(m => {
            return !m.stage || !m.stage.startsWith('round-robin');
          });
          updatedMatches = [...updatedMatches, ...matches];
        } else {
          // Single-elimination: xóa TẤT CẢ các matches của single-elimination
          // (vì bốc thăm tạo matches cho tất cả các vòng)
          const singleEliminationStages = ['round1', 'round2', 'round3', 'round4', 'semi', 'final'];
          updatedMatches = (league.matches || []).filter(m => !singleEliminationStages.includes(m.stage));
          updatedMatches = [...updatedMatches, ...matches];
        }
      } else {
        // Thêm matches mới, loại bỏ trùng lặp
        updatedMatches = [...(league.matches || []), ...matches];
        // Loại bỏ các match trùng lặp (cùng stage và matchNumber)
        const matchMap = new Map();
        updatedMatches.forEach(match => {
          const key = `${match.stage}_${match.matchNumber}`;
          if (!matchMap.has(key)) {
            matchMap.set(key, match);
          }
        });
        updatedMatches = Array.from(matchMap.values());
      }

      league.matches = updatedMatches;
      await league.save();

      await logAudit("DRAW_MATCHES", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        stage: stage,
        matchesCount: matches.length,
        teamsCount: validTeams.length,
        hasBye: hasBye,
      });

      // Tính số lượng BYE slots cho response (chỉ cho single-elimination)
      let byeInfo = null;
      let byeMessage = '';
      if (hasBye && !isRoundRobin) {
        // Lấy thông tin từ biến đã tính toán trước đó
        const firstRoundStage = matches.length > 0 ? matches[0].stage : null;
        const byeMatches = matches.filter(m => m.hasBye && m.stage === firstRoundStage);
        const numByeSlots = byeMatches.length;
        
        byeInfo = {
          numByeSlots: numByeSlots,
          numTeams: validTeams.length,
          byeMatches: byeMatches.map(m => ({
            matchNumber: m.matchNumber,
            stage: m.stage,
            hasAutoWin: m.score1 !== null && m.score2 !== null,
            winnerId: m.score1 > m.score2 ? m.team1Id : (m.score2 > m.score1 ? m.team2Id : null)
          }))
        };
        
        byeMessage = ` (${numByeSlots} slot BYE)`;
      }

      res.json({
        success: true,
        message: `Đã bốc thăm ${matches.length} cặp đấu thành công${byeMessage}`,
        data: {
          league: league,
          matches: matches,
          byeInfo: byeInfo,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/matches/schedule
 * Cập nhật lịch đấu (date, time) cho các matches
 * User (người tạo)
 */
router.put(
  "/:id/matches/schedule",
  checkOwnership,
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const { schedules } = req.body;

      if (!Array.isArray(schedules)) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu lịch đấu không hợp lệ",
        });
      }

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }


      let updatedCount = 0;
      const notFoundMatches = [];
      
      schedules.forEach(({ stage, matchNumber, date, time, endTime }) => {
        // Tìm match với nhiều cách so sánh
        const matchIndex = league.matches.findIndex((m) => {
          const stageMatch = m.stage === stage;
          const numberMatch = m.matchNumber === matchNumber || 
                             m.matchNumber === parseInt(matchNumber) ||
                             parseInt(m.matchNumber) === matchNumber;
          return stageMatch && numberMatch;
        });

        if (matchIndex !== -1) {
          if (date !== undefined) {
            league.matches[matchIndex].date = date ? new Date(date) : null;
          }
          if (time !== undefined) {
            league.matches[matchIndex].time = time || null;
          }
          if (endTime !== undefined) {
            league.matches[matchIndex].endTime = endTime || null;
          }
          updatedCount++;
        } else {
          notFoundMatches.push({ stage, matchNumber });
        }
      });

      if (updatedCount === 0 && schedules.length > 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy matches để cập nhật. Vui lòng bốc thăm trước.",
          details: {
            requested: schedules,
            notFound: notFoundMatches,
            availableMatches: league.matches.map(m => ({
              stage: m.stage,
              matchNumber: m.matchNumber
            }))
          }
        });
      }

      await league.save();

      await logAudit("UPDATE_MATCH_SCHEDULE", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        schedulesCount: schedules.length,
      });

      res.json({
        success: true,
        message: "Cập nhật lịch đấu thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/matches/result
 * Cập nhật kết quả trận đấu (score1, score2)
 * Tự động tính winner và cập nhật vào vòng tiếp theo (single-elimination)
 * Cập nhật thống kê teams (wins, draws, losses) cho round-robin
 * User (người tạo)
 */
router.put(
  "/:id/matches/result",
  checkOwnership,
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const { stage, matchNumber, score1, score2 } = req.body;

      if (stage === undefined || matchNumber === undefined) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin stage hoặc matchNumber",
        });
      }

      // Cho phép null để hủy kết quả, nhưng không cho phép undefined
      if (score1 === undefined || score2 === undefined) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin kết quả (score1, score2)",
        });
      }

      const league = await League.findById(leagueId);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      // Tìm match
      const matchIndex = league.matches.findIndex((m) => {
        const stageMatch = m.stage === stage;
        const numberMatch = m.matchNumber === matchNumber || 
                           m.matchNumber === parseInt(matchNumber) ||
                           parseInt(m.matchNumber) === matchNumber;
        return stageMatch && numberMatch;
      });

      if (matchIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy trận đấu",
        });
      }

      const match = league.matches[matchIndex];
      const oldScore1 = match.score1;
      const oldScore2 = match.score2;
      const oldWinnerId = oldScore1 !== null && oldScore2 !== null
        ? (oldScore1 > oldScore2 ? match.team1Id : (oldScore1 < oldScore2 ? match.team2Id : null))
        : null;

      // Cập nhật kết quả
      match.score1 = score1 !== null && score1 !== undefined ? parseInt(score1) : null;
      match.score2 = score2 !== null && score2 !== undefined ? parseInt(score2) : null;

      // Kiểm tra format giải đấu
      const isRoundRobin = league.format === 'Vòng tròn' || league.format === 'round-robin' || stage === 'round-robin';

      if (isRoundRobin) {
        // Round-robin: Cập nhật thống kê teams
        const team1Id = match.team1Id;
        const team2Id = match.team2Id;

        // Tìm teams
        const team1Index = league.teams.findIndex(t => 
          (t.id === team1Id) || (t._id && t._id.toString() === team1Id?.toString())
        );
        const team2Index = league.teams.findIndex(t => 
          (t.id === team2Id) || (t._id && t._id.toString() === team2Id?.toString())
        );

        // Nếu có kết quả cũ, trừ đi thống kê cũ
        if (oldScore1 !== null && oldScore2 !== null && team1Index !== -1 && team2Index !== -1) {
          const oldTeam1 = league.teams[team1Index];
          const oldTeam2 = league.teams[team2Index];

          if (oldScore1 > oldScore2) {
            oldTeam1.wins = Math.max(0, (oldTeam1.wins || 0) - 1);
            oldTeam2.losses = Math.max(0, (oldTeam2.losses || 0) - 1);
          } else if (oldScore1 < oldScore2) {
            oldTeam1.losses = Math.max(0, (oldTeam1.losses || 0) - 1);
            oldTeam2.wins = Math.max(0, (oldTeam2.wins || 0) - 1);
          } else {
            oldTeam1.draws = Math.max(0, (oldTeam1.draws || 0) - 1);
            oldTeam2.draws = Math.max(0, (oldTeam2.draws || 0) - 1);
          }
        }

        // Cập nhật thống kê mới
        if (match.score1 !== null && match.score2 !== null && team1Index !== -1 && team2Index !== -1) {
          const team1 = league.teams[team1Index];
          const team2 = league.teams[team2Index];

          if (!team1.wins) team1.wins = 0;
          if (!team1.draws) team1.draws = 0;
          if (!team1.losses) team1.losses = 0;
          if (!team2.wins) team2.wins = 0;
          if (!team2.draws) team2.draws = 0;
          if (!team2.losses) team2.losses = 0;

          if (match.score1 > match.score2) {
            team1.wins += 1;
            team2.losses += 1;
          } else if (match.score1 < match.score2) {
            team1.losses += 1;
            team2.wins += 1;
          } else {
            team1.draws += 1;
            team2.draws += 1;
          }

          league.teams[team1Index] = team1;
          league.teams[team2Index] = team2;
        }
      } else {
        // Single-elimination: Tự động tính winner và cập nhật vào vòng tiếp theo (PROPAGATION)
        
        // Bước 1: Xóa đội thắng cũ khỏi vòng tiếp theo (nếu có kết quả cũ)
        if (oldWinnerId && oldWinnerId !== "BYE" && match.nextMatchId) {
          const [oldNextStage, oldNextMatchNumber] = match.nextMatchId.split('_');
          const oldNextMatchIndex = league.matches.findIndex(m => 
            m.stage === oldNextStage && m.matchNumber === parseInt(oldNextMatchNumber)
          );
          
          if (oldNextMatchIndex !== -1) {
            const oldNextMatch = league.matches[oldNextMatchIndex];
            const isOddMatch = match.matchNumber % 2 === 1;
            
            // Xóa đội thắng cũ (chỉ xóa nếu đúng là đội thắng cũ)
            if (isOddMatch && oldNextMatch.team1Id === oldWinnerId) {
              oldNextMatch.team1Id = null;
            } else if (!isOddMatch && oldNextMatch.team2Id === oldWinnerId) {
              oldNextMatch.team2Id = null;
            }
            
            league.matches[oldNextMatchIndex] = oldNextMatch;
          }
        }
        
        // Bước 2: Điền đội thắng mới vào vòng tiếp theo
        if (match.score1 !== null && match.score2 !== null) {
          // Xử lý BYE: nếu một trong hai đội là BYE, đội còn lại tự động thắng
          let winnerId = null;
          
          if (match.team1Id === "BYE" || match.team2Id === "BYE") {
            // Có BYE trong trận đấu
            winnerId = match.team1Id !== "BYE" ? match.team1Id : match.team2Id;
          } else {
            // Trận đấu bình thường, tính winner dựa trên điểm số
            winnerId = match.score1 > match.score2 ? match.team1Id : 
                       match.score1 < match.score2 ? match.team2Id : null;
          }

          if (winnerId && winnerId !== "BYE" && match.nextMatchId) {
            // Sử dụng nextMatchId đã được tính toán sẵn khi bốc thăm
            const [nextStage, nextMatchNumber] = match.nextMatchId.split('_');
            
            // Tìm match tiếp theo
            let nextMatchIndex = league.matches.findIndex(m => 
              m.stage === nextStage && m.matchNumber === parseInt(nextMatchNumber)
            );

            if (nextMatchIndex === -1) {
              // Tạo match mới ở vòng tiếp theo (trường hợp hiếm, không nên xảy ra)
              const nextMatch = {
                stage: nextStage,
                matchNumber: parseInt(nextMatchNumber),
                team1Id: null,
                team2Id: null,
                date: null,
                time: null,
                score1: null,
                score2: null,
                nextMatchId: null, // Sẽ được tính sau
                hasBye: false,
              };

              // Xác định vị trí team (team1 hoặc team2) dựa trên matchNumber hiện tại
              // Match 1, 2 -> Match 1 vòng tiếp theo (team1, team2)
              // Match 3, 4 -> Match 2 vòng tiếp theo (team1, team2)
              const isOddMatch = match.matchNumber % 2 === 1;
              if (isOddMatch) {
                // Match lẻ (1, 3, 5...) -> team1 ở vòng tiếp theo
                nextMatch.team1Id = winnerId;
              } else {
                // Match chẵn (2, 4, 6...) -> team2 ở vòng tiếp theo
                nextMatch.team2Id = winnerId;
              }

              league.matches.push(nextMatch);
            } else {
              // Cập nhật match hiện có - PROPAGATION: Đẩy đội thắng lên vòng tiếp theo
              const nextMatch = league.matches[nextMatchIndex];
              
              // Xác định vị trí team (team1 hoặc team2) dựa trên matchNumber hiện tại
              const isOddMatch = match.matchNumber % 2 === 1;
              if (isOddMatch) {
                // Match lẻ (1, 3, 5...) -> team1 ở vòng tiếp theo
                // Chỉ cập nhật nếu chưa có team1 hoặc đang ghi đè
                nextMatch.team1Id = winnerId;
              } else {
                // Match chẵn (2, 4, 6...) -> team2 ở vòng tiếp theo
                // Chỉ cập nhật nếu chưa có team2 hoặc đang ghi đè
                nextMatch.team2Id = winnerId;
              }

              // Đảm bảo cập nhật vào mảng
              league.matches[nextMatchIndex] = nextMatch;
            }
          }
        }
        
        // Bước 3: Xử lý hủy kết quả (khi score1 hoặc score2 = null)
        // Nếu cả hai đều null hoặc một trong hai null, xóa đội thắng khỏi vòng tiếp theo
        if ((match.score1 === null || match.score2 === null) && oldWinnerId && oldWinnerId !== "BYE" && match.nextMatchId) {
          // Logic xóa đội thắng cũ đã được xử lý ở Bước 1 (dòng 2456-2476)
          // Nhưng cần đảm bảo rằng khi hủy kết quả, đội thắng cũ vẫn bị xóa
          // Logic này đã có sẵn ở Bước 1, không cần thêm gì
        }

        // Bước 4: Kiểm tra trận chung kết (final) - Nếu có đội vô địch, chuyển status thành "completed"
        if (match.stage === 'final' && match.score1 !== null && match.score2 !== null) {
          // Xác định đội thắng
          let winnerId = null;
          
          if (match.team1Id === "BYE" || match.team2Id === "BYE") {
            // Có BYE trong trận đấu
            winnerId = match.team1Id !== "BYE" ? match.team1Id : match.team2Id;
          } else {
            // Trận đấu bình thường, tính winner dựa trên điểm số
            winnerId = match.score1 > match.score2 ? match.team1Id : 
                       match.score1 < match.score2 ? match.team2Id : null;
          }

          // Nếu có đội thắng (không phải hòa), chuyển status thành "completed" và lưu đội vô địch
          if (winnerId && winnerId !== "BYE") {
            league.status = 'completed';
            league.champion = winnerId; // Lưu đội vô địch
          } else if (match.score1 === null || match.score2 === null) {
            // Nếu hủy kết quả trận final, chuyển lại status về "ongoing" và xóa đội vô địch
            if (league.status === 'completed') {
              league.status = 'ongoing';
              league.champion = null; // Xóa đội vô địch
            }
          } else if (winnerId === null) {
            // Trường hợp hòa (score1 === score2), không có đội vô địch
            league.champion = null;
          }
        }
      }

      await league.save();

      await logAudit("UPDATE_MATCH_RESULT", req.user._id, req, {
        leagueId: leagueId,
        leagueName: league.name,
        stage: stage,
        matchNumber: matchNumber,
        score1: match.score1,
        score2: match.score2,
        format: league.format,
      });

      res.json({
        success: true,
        message: "Cập nhật kết quả trận đấu thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/leagues/:id/schedule/template
 * Tải file mẫu Excel để thêm lịch đấu
 * User (người tạo)
 */
router.get(
  "/:id/schedule/template",
  checkOwnership,
  async (req, res, next) => {
    try {
      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Lịch đấu');

      worksheet.columns = [
        { header: 'Vòng đấu', key: 'stage', width: 20 },
        { header: 'Đội 1', key: 'team1', width: 30 },
        { header: 'Đội 2', key: 'team2', width: 30 },
        { header: 'Ngày thi đấu', key: 'date', width: 20 },
        { header: 'Giờ bắt đầu', key: 'time', width: 20 },
        { header: 'Giờ kết thúc', key: 'endTime', width: 20 }
      ];

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const mapStageToStageName = (stage) => {
        switch (stage) {
          case 'final': return 'chung kết';
          case 'semi': return 'bán kết';
          case 'round3': return 'tứ kết';
          case 'round4': return 'vòng 4';
          case 'round2': return 'vòng 2';
          case 'round1': return 'vòng 1';
          case 'round-robin': return 'vòng tròn';
          default: return stage;
        }
      };

      const getTeamName = (teamId, teams) => {
        if (teamId === null || teamId === undefined) return null;
        
        // Xử lý BYE
        if (teamId === "BYE" || String(teamId) === "BYE") {
          return "BYE";
        }
        
        let teamIdStr = String(teamId);
        let teamIdNum = null;
        
        if (typeof teamId === 'number') {
          teamIdNum = teamId;
        } else if (teamId && typeof teamId === 'object' && teamId.toString) {
          teamIdStr = teamId.toString();
          const parsed = parseInt(teamIdStr);
          if (!isNaN(parsed)) {
            teamIdNum = parsed;
          }
        } else {
          const parsed = parseInt(teamId);
          if (!isNaN(parsed)) {
            teamIdNum = parsed;
          }
        }
        
        for (const team of teams) {
          if (team.id !== null && team.id !== undefined) {
            if (team.id === teamId) {
              return team.teamNumber || `Đội #${team.id}`;
            }
            
            if (teamIdNum !== null && typeof team.id === 'number' && team.id === teamIdNum) {
              return team.teamNumber || `Đội #${team.id}`;
            }
            
            if (String(team.id) === teamIdStr) {
              return team.teamNumber || `Đội #${team.id}`;
            }
          }
          
          if (team._id) {
            const tIdMongoStr = String(team._id);
            if (tIdMongoStr === teamIdStr) {
              return team.teamNumber || `Đội #${team.id || team._id}`;
            }
            
            if (teamIdNum !== null && team._id.toString && String(team._id) === String(teamIdNum)) {
              return team.teamNumber || `Đội #${team.id || team._id}`;
            }
          }
        }
        
        return null;
      };

      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formatTime = (time) => {
        if (!time) return '';
        return time.toString();
      };

      const isRoundRobin = league.format === 'Vòng tròn' || league.format === 'round-robin';
      
      if (league.matches && league.matches.length > 0) {
        const sortedMatches = [...league.matches].sort((a, b) => {
          const stageOrder = ['round1', 'round2', 'round3', 'round4', 'semi', 'final', 'round-robin'];
          const stageA = stageOrder.indexOf(a.stage) !== -1 ? stageOrder.indexOf(a.stage) : 999;
          const stageB = stageOrder.indexOf(b.stage) !== -1 ? stageOrder.indexOf(b.stage) : 999;
          if (stageA !== stageB) return stageA - stageB;
          return (a.matchNumber || 0) - (b.matchNumber || 0);
        });

        sortedMatches.forEach(match => {
          const stageName = mapStageToStageName(match.stage);
          let team1Name = '';
          let team2Name = '';

          const getPrevStage = (currentStage) => {
            switch (currentStage) {
              case 'final': return 'semi';
              case 'semi': return 'round3';
              case 'round3': return 'round4';
              case 'round4': return 'round4';
              default: return 'round1';
            }
          };

          if (match.team1Id !== null && match.team1Id !== undefined) {
            // Xử lý BYE
            if (match.team1Id === "BYE" || String(match.team1Id) === "BYE") {
              team1Name = "BYE";
            } else {
              const foundTeam1Name = getTeamName(match.team1Id, league.teams);
              team1Name = foundTeam1Name || `Đội #${match.team1Id}`;
            }
          } else {
            const prevStage = getPrevStage(match.stage);
            const prevStageName = mapStageToStageName(prevStage);
            const prevMatchNumber = (match.matchNumber - 1) * 2 + 1;
            team1Name = `W#${prevMatchNumber} ${prevStageName}`;
          }

          if (match.team2Id !== null && match.team2Id !== undefined) {
            // Xử lý BYE
            if (match.team2Id === "BYE" || String(match.team2Id) === "BYE") {
              team2Name = "BYE";
            } else {
              const foundTeam2Name = getTeamName(match.team2Id, league.teams);
              team2Name = foundTeam2Name || `Đội #${match.team2Id}`;
            }
          } else {
            const prevStage = getPrevStage(match.stage);
            const prevStageName = mapStageToStageName(prevStage);
            const prevMatchNumber = (match.matchNumber - 1) * 2 + 2;
            team2Name = `W#${prevMatchNumber} ${prevStageName}`;
          }

          const dateStr = formatDate(match.date);
          const timeStr = formatTime(match.time);
          const endTimeStr = formatTime(match.endTime);

          worksheet.addRow([stageName, team1Name, team2Name, dateStr, timeStr, endTimeStr]);
        });
      } else {
        const isRoundRobin = league.format === 'Vòng tròn' || league.format === 'round-robin';
        
        if (isRoundRobin) {
          worksheet.addRow(['vòng tròn', 'Đội 1', 'Đội 2', '', '', '']);
          worksheet.addRow(['vòng tròn', 'Đội 3', 'Đội 4', '', '', '']);
        } else {
          const numTeams = league.maxParticipants || 4;
          if (numTeams === 2) {
            worksheet.addRow(['chung kết', 'Đội 1', 'Đội 2', '', '', '']);
          } else if (numTeams === 4) {
            worksheet.addRow(['bán kết', 'Đội 1', 'Đội 2', '', '', '']);
            worksheet.addRow(['bán kết', 'Đội 3', 'Đội 4', '', '', '']);
            worksheet.addRow(['chung kết', 'W#1 bán kết', 'W#2 bán kết', '', '', '']);
          } else if (numTeams === 8) {
            worksheet.addRow(['tứ kết', 'Đội 1', 'Đội 2', '', '', '']);
            worksheet.addRow(['tứ kết', 'Đội 3', 'Đội 4', '', '', '']);
            worksheet.addRow(['tứ kết', 'Đội 5', 'Đội 6', '', '', '']);
            worksheet.addRow(['tứ kết', 'Đội 7', 'Đội 8', '', '', '']);
            worksheet.addRow(['bán kết', 'W#1 tứ kết', 'W#2 tứ kết', '', '', '']);
            worksheet.addRow(['bán kết', 'W#3 tứ kết', 'W#4 tứ kết', '', '', '']);
            worksheet.addRow(['chung kết', 'W#1 bán kết', 'W#2 bán kết', '', '', '']);
          } else {
            worksheet.addRow(['vòng 1', 'Đội 1', 'Đội 2', '', '', '']);
            worksheet.addRow(['vòng 1', 'Đội 3', 'Đội 4', '', '', '']);
          }
        }
      }

      const dateColumn = worksheet.getColumn('date');
      dateColumn.numFmt = '@';
      
      const timeColumn = worksheet.getColumn('time');
      timeColumn.numFmt = '@';
      
      const endTimeColumn = worksheet.getColumn('endTime');
      endTimeColumn.numFmt = '@';

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="mau-lich-dau.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/schedule/import
 * Import lịch đấu từ file Excel
 * User (người tạo)
 */
router.post(
  "/:id/schedule/import",
  checkOwnership,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload",
        });
      }

      const league = await League.findById(req.params.id);
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
      if (!worksheet) {
        return res.status(400).json({
          success: false,
          message: "File Excel không hợp lệ",
        });
      }

      const isRoundRobin = league.format === 'Vòng tròn' || league.format === 'round-robin';
      
      const mapStageNameToStage = (stageName) => {
        const normalized = stageName?.toLowerCase()?.trim() || '';
        if (normalized === 'chung kết' || normalized === 'chungket') return 'final';
        if (normalized === 'bán kết' || normalized === 'banket' || normalized === 'bán kết') return 'semi';
        if (normalized === 'tứ kết' || normalized === 'tuket') return 'round3';
        if (normalized === 'vòng tròn' || normalized === 'vongtron' || normalized === 'round-robin') return 'round-robin';
        if (normalized.startsWith('vòng ')) {
          const roundNum = parseInt(normalized.replace('vòng ', '').trim());
          if (!isNaN(roundNum) && roundNum >= 1 && roundNum <= 4) {
            return `round${roundNum}`;
          }
        }
        return null;
      };

      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const str = dateStr.toString().trim();
        const parts = str.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month - 1, day);
            if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
              return date;
            }
          }
        }
        return null;
      };

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const str = timeStr.toString().trim();
        const parts = str.split(':');
        if (parts.length === 2) {
          const hour = parseInt(parts[0]);
          const minute = parseInt(parts[1]);
          if (!isNaN(hour) && !isNaN(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          }
        }
        return null;
      };

      const findTeamIdByName = (teamName) => {
        if (!teamName) return null;
        const normalizedName = teamName.toString().trim();
        
        if (normalizedName.startsWith('W#') || normalizedName.startsWith('w#')) {
          return null;
        }

        const team = league.teams.find(t => {
          const teamNumber = t.teamNumber?.toString().trim() || '';
          return teamNumber === normalizedName || 
                 teamNumber === `Đội ${normalizedName}` ||
                 teamNumber === `Đội #${normalizedName}` ||
                 normalizedName === `Đội ${t.id}` ||
                 normalizedName === `Đội #${t.id}`;
        });

        return team ? (team.id || team._id) : null;
      };

      const schedules = [];
      const errors = [];
      let rowNumber = 0;

      worksheet.eachRow((row, rowNum) => {
        rowNumber = rowNum;
        if (rowNum === 1) return;

        const stageName = row.getCell(1).value?.toString()?.trim() || '';
        const team1Name = row.getCell(2).value?.toString()?.trim() || '';
        const team2Name = row.getCell(3).value?.toString()?.trim() || '';
        const dateStr = row.getCell(4).value?.toString()?.trim() || '';
        const timeStr = row.getCell(5).value?.toString()?.trim() || '';
        const endTimeStr = row.getCell(6).value?.toString()?.trim() || '';

        if (!stageName) {
          errors.push(`Dòng ${rowNum}: Thiếu vòng đấu`);
          return;
        }

        const stage = mapStageNameToStage(stageName);
        if (!stage) {
          errors.push(`Dòng ${rowNum}: Vòng đấu "${stageName}" không hợp lệ`);
          return;
        }

        if (!team1Name && !team2Name) {
          errors.push(`Dòng ${rowNum}: Thiếu tên đội`);
          return;
        }

        const team1Id = findTeamIdByName(team1Name);
        const team2Id = findTeamIdByName(team2Name);

        if (team1Name && !team1Name.startsWith('W#') && !team1Name.startsWith('w#') && !team1Id) {
          errors.push(`Dòng ${rowNum}: Không tìm thấy đội "${team1Name}"`);
        }

        if (team2Name && !team2Name.startsWith('W#') && !team2Name.startsWith('w#') && !team2Id) {
          errors.push(`Dòng ${rowNum}: Không tìm thấy đội "${team2Name}"`);
        }

        const date = parseDate(dateStr);
        const time = parseTime(timeStr);
        const endTime = parseTime(endTimeStr);

        if (dateStr && !date) {
          errors.push(`Dòng ${rowNum}: Định dạng ngày không hợp lệ "${dateStr}". Yêu cầu: Ngày-tháng-năm (VD: 23-12-2000)`);
        }

        if (timeStr && !time) {
          errors.push(`Dòng ${rowNum}: Định dạng giờ bắt đầu không hợp lệ "${timeStr}". Yêu cầu: Giờ:phút (VD: 23:18)`);
        }

        if (endTimeStr && !endTime) {
          errors.push(`Dòng ${rowNum}: Định dạng giờ kết thúc không hợp lệ "${endTimeStr}". Yêu cầu: Giờ:phút (VD: 23:18)`);
        }

        const stageMatches = league.matches.filter(m => m.stage === stage);
        if (stageMatches.length === 0) {
          errors.push(`Dòng ${rowNum}: Không tìm thấy trận đấu cho vòng "${stageName}". Vui lòng bốc thăm trước.`);
          return;
        }

        let matchNumber = null;
        
        const isTeam1Winner = team1Name.startsWith('W#') || team1Name.startsWith('w#');
        const isTeam2Winner = team2Name.startsWith('W#') || team2Name.startsWith('w#');
        
        if (team1Id && team2Id) {
          const match = stageMatches.find(m => 
            (m.team1Id === team1Id && m.team2Id === team2Id) ||
            (m.team1Id === team2Id && m.team2Id === team1Id)
          );
          if (match) {
            matchNumber = match.matchNumber;
          }
        } else if (isTeam1Winner && isTeam2Winner) {
          const winner1MatchNum = parseInt(team1Name.replace(/^W#/i, '').split(' ')[0]);
          const winner2MatchNum = parseInt(team2Name.replace(/^W#/i, '').split(' ')[0]);
          
          if (!isNaN(winner1MatchNum) && !isNaN(winner2MatchNum)) {
            const minMatchNum = Math.min(winner1MatchNum, winner2MatchNum);
            const nextMatchNumber = Math.ceil(minMatchNum / 2);
            const foundMatch = stageMatches.find(m => m.matchNumber === nextMatchNumber);
            if (foundMatch) {
              matchNumber = foundMatch.matchNumber;
            } else if (stageMatches.length === 1) {
              matchNumber = stageMatches[0].matchNumber;
            } else {
              matchNumber = nextMatchNumber;
            }
          }
        } else if (team1Id || team2Id) {
          const match = stageMatches.find(m => 
            m.team1Id === team1Id || m.team2Id === team1Id ||
            m.team1Id === team2Id || m.team2Id === team2Id
          );
          if (match) {
            matchNumber = match.matchNumber;
          }
        }

        if (!matchNumber) {
          if (stageMatches.length === 1) {
            matchNumber = stageMatches[0].matchNumber;
          } else {
            errors.push(`Dòng ${rowNum}: Không xác định được số trận đấu. Vui lòng kiểm tra lại tên đội.`);
            return;
          }
        }

        schedules.push({
          stage,
          matchNumber,
          date,
          time,
          endTime
        });
      });

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Có lỗi trong file Excel",
          errors: errors
        });
      }

      if (schedules.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Không có dữ liệu hợp lệ để import",
        });
      }

      let updatedCount = 0;
      const notFoundMatches = [];

      schedules.forEach(({ stage, matchNumber, date, time, endTime }) => {
        const matchIndex = league.matches.findIndex((m) => {
          const stageMatch = m.stage === stage;
          const numberMatch = m.matchNumber === matchNumber || 
                             m.matchNumber === parseInt(matchNumber) ||
                             parseInt(m.matchNumber) === matchNumber;
          return stageMatch && numberMatch;
        });

        if (matchIndex !== -1) {
          if (date !== null && date !== undefined) {
            league.matches[matchIndex].date = date;
          }
          if (time !== null && time !== undefined) {
            league.matches[matchIndex].time = time;
          }
          if (endTime !== null && endTime !== undefined) {
            league.matches[matchIndex].endTime = endTime;
          }
          updatedCount++;
        } else {
          notFoundMatches.push({ stage, matchNumber });
        }
      });

      if (updatedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy matches để cập nhật. Vui lòng bốc thăm trước.",
          details: {
            requested: schedules,
            notFound: notFoundMatches,
            availableMatches: league.matches.map(m => ({
              stage: m.stage,
              matchNumber: m.matchNumber
            }))
          }
        });
      }

      await league.save();

      await logAudit(
        "IMPORT_SCHEDULE",
        req.user.id,
        req,
        {
          leagueId: req.params.id,
          leagueName: league.name,
          schedulesCount: schedules.length,
          updatedCount: updatedCount
        }
      );

      res.json({
        success: true,
        message: `Đã import ${updatedCount}/${schedules.length} lịch đấu thành công`,
        data: league,
        details: {
          total: schedules.length,
          updated: updatedCount,
          notFound: notFoundMatches
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/leagues/owner/pending
 * Lấy danh sách giải đấu chờ duyệt của owner
 * Owner (chủ sân)
 */
router.get(
  "/owner/pending",
  authenticateToken,
  authorize("owner", "admin"),
  async (req, res, next) => {
    try {
      const ownerId = req.user._id || req.user.id;
      
      const ownerFacilities = await Facility.find({ owner: ownerId }).select("_id name");
      const facilityIds = ownerFacilities.map(f => f._id);
      const facilityNames = ownerFacilities.map(f => f.name).filter(name => name);
      
      // Tìm các giải đấu có facility ID hoặc location (tên facility) trùng với facilities của owner
      const pendingLeagues = await League.find({
        $and: [
          {
            $or: [
              { facility: { $in: facilityIds } },
              ...(facilityNames.length > 0 ? [{ location: { $in: facilityNames } }] : [])
            ]
          },
          { approvalStatus: "pending" }
        ]
      })
        .populate("creator", "name email phone")
        .populate("facility", "name address")
        .populate("courtId", "name type")
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: pendingLeagues,
        count: pendingLeagues.length
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/leagues/owner/all
 * Lấy tất cả giải đấu của owner (đã duyệt, từ chối, chờ duyệt)
 * Owner (chủ sân)
 */
router.get(
  "/owner/all",
  authenticateToken,
  authorize("owner", "admin"),
  async (req, res, next) => {
    try {
      const ownerId = req.user._id || req.user.id;
      const { status, approvalStatus } = req.query;
      
      const ownerFacilities = await Facility.find({ owner: ownerId }).select("_id");
      const facilityIds = ownerFacilities.map(f => f._id);
      
      const query = {
        $or: [
          { facility: { $in: facilityIds } },
          { approvedBy: ownerId }
        ]
      };
      
      if (status) {
        query.status = status;
      }
      
      if (approvalStatus) {
        query.approvalStatus = approvalStatus;
      }
      
      const leagues = await League.find(query)
        .populate("creator", "name email phone")
        .populate("facility", "name address")
        .populate("courtId", "name type")
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: leagues,
        count: leagues.length
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/approve
 * Duyệt giải đấu
 * Owner (chủ sân)
 */
router.put(
  "/:id/approve",
  authenticateToken,
  authorize("owner", "admin"),
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const ownerId = req.user._id || req.user.id;
      
      const league = await League.findById(leagueId).populate("facility");
      
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }
      
      // Nếu league chưa có facility nhưng có location, tìm facility theo tên
      if (!league.facility && league.location) {
        const facility = await Facility.findOne({
          owner: ownerId,
          name: league.location
        });
        
        if (facility) {
          league.facility = facility._id;
        }
      }
      
      // Kiểm tra quyền: nếu có facility, phải là owner của facility đó
      if (league.facility) {
        let facilityOwnerId;
        if (typeof league.facility === 'object' && league.facility.owner) {
          facilityOwnerId = league.facility.owner.toString();
        } else {
          // Nếu chưa populate, fetch lại
          const facility = await Facility.findById(league.facility);
          if (facility) {
            facilityOwnerId = facility.owner.toString();
          }
        }
        
        if (facilityOwnerId && facilityOwnerId !== ownerId.toString() && req.user.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Không có quyền duyệt giải đấu này",
          });
        }
      }
      
      league.approvalStatus = "approved";
      league.approvedBy = ownerId;
      league.approvedAt = new Date();
      league.rejectionReason = null;
      
      await league.save();
      
      await logAudit(
        "APPROVE_LEAGUE",
        ownerId,
        req,
        {
          leagueId: leagueId,
          leagueName: league.name,
        }
      );
      
      res.json({
        success: true,
        message: "Đã duyệt giải đấu thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/reject
 * Từ chối giải đấu
 * Owner (chủ sân)
 */
router.put(
  "/:id/reject",
  authenticateToken,
  authorize("owner", "admin"),
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const ownerId = req.user._id || req.user.id;
      const { reason } = req.body;
      
      const league = await League.findById(leagueId).populate("facility");
      
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }
      
      if (league.facility && league.facility.owner.toString() !== ownerId.toString() && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền từ chối giải đấu này",
        });
      }
      
      league.approvalStatus = "rejected";
      league.approvedBy = ownerId;
      league.approvedAt = new Date();
      league.rejectionReason = reason || null;
      
      await league.save();
      
      await logAudit(
        "REJECT_LEAGUE",
        ownerId,
        req,
        {
          leagueId: leagueId,
          leagueName: league.name,
          reason: reason,
        }
      );
      
      res.json({
        success: true,
        message: "Đã từ chối giải đấu",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/teams/:teamId/approve
 * Chấp nhận đội đăng ký
 * Owner (chủ sân) hoặc người tạo giải
 */
router.put(
  "/:id/teams/:teamId/approve",
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const teamIdParam = req.params.teamId;
      const userId = req.user._id || req.user.id;
      
      const league = await League.findById(leagueId).populate("facility");
      
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }
      
      // Kiểm tra quyền: owner của facility hoặc người tạo giải
      const isCreator = league.creator.toString() === userId.toString();
      let isOwner = false;
      
      if (league.facility) {
        let facilityOwnerId;
        if (typeof league.facility === 'object' && league.facility.owner) {
          facilityOwnerId = league.facility.owner.toString();
        } else {
          const facility = await Facility.findById(league.facility);
          if (facility) {
            facilityOwnerId = facility.owner.toString();
          }
        }
        isOwner = facilityOwnerId && facilityOwnerId === userId.toString();
      }
      
      if (!isCreator && !isOwner && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền chấp nhận đội này",
        });
      }
      
      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);
      
      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });
      
      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }
      
      league.teams[teamIndex].registrationStatus = "accepted";
      await league.save();
      
      await logAudit(
        "APPROVE_TEAM_REGISTRATION",
        userId,
        req,
        {
          leagueId: leagueId,
          leagueName: league.name,
          teamId: teamIdParam,
          teamName: league.teams[teamIndex].teamNumber
        }
      );
      
      res.json({
        success: true,
        message: "Đã chấp nhận đội đăng ký",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/teams/:teamId/reject
 * Từ chối đội đăng ký
 * Owner (chủ sân) hoặc người tạo giải
 */
router.put(
  "/:id/teams/:teamId/reject",
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const teamIdParam = req.params.teamId;
      const userId = req.user._id || req.user.id;
      const { reason } = req.body;
      
      const league = await League.findById(leagueId).populate("facility");
      
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }
      
      // Kiểm tra quyền: owner của facility hoặc người tạo giải
      const isCreator = league.creator.toString() === userId.toString();
      let isOwner = false;
      
      if (league.facility) {
        let facilityOwnerId;
        if (typeof league.facility === 'object' && league.facility.owner) {
          facilityOwnerId = league.facility.owner.toString();
        } else {
          const facility = await Facility.findById(league.facility);
          if (facility) {
            facilityOwnerId = facility.owner.toString();
          }
        }
        isOwner = facilityOwnerId && facilityOwnerId === userId.toString();
      }
      
      if (!isCreator && !isOwner && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền từ chối đội này",
        });
      }
      
      const teamId = parseInt(teamIdParam);
      const isTeamIdNumber = !isNaN(teamId);
      
      const teamIndex = league.teams.findIndex((team) => {
        if (isTeamIdNumber) {
          const teamIdNum = typeof team.id === 'number' ? team.id : (team.id ? parseInt(team.id) : null);
          if (teamIdNum !== null && !isNaN(teamIdNum) && teamIdNum === teamId) {
            return true;
          }
        }
        const teamIdStr = team._id?.toString();
        if (teamIdStr && teamIdStr === teamIdParam) {
          return true;
        }
        return false;
      });
      
      if (teamIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đội",
        });
      }
      
      league.teams[teamIndex].registrationStatus = "rejected";
      if (reason) {
        league.teams[teamIndex].rejectionReason = reason;
      }
      await league.save();
      
      await logAudit(
        "REJECT_TEAM_REGISTRATION",
        userId,
        req,
        {
          leagueId: leagueId,
          leagueName: league.name,
          teamId: teamIdParam,
          teamName: league.teams[teamIndex].teamNumber,
          reason: reason
        }
      );
      
      res.json({
        success: true,
        message: "Đã từ chối đội đăng ký",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/leagues/:id/assign-court
 * Chốt sân cho giải đấu
 * Owner (chủ sân)
 */
router.put(
  "/:id/assign-court",
  authenticateToken,
  authorize("owner", "admin"),
  async (req, res, next) => {
    try {
      const leagueId = req.params.id;
      const ownerId = req.user._id || req.user.id;
      const { courtId } = req.body;
      
      if (!courtId) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp courtId",
        });
      }
      
      const league = await League.findById(leagueId).populate("facility");
      
      if (!league) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giải đấu",
        });
      }
      
      if (league.facility && league.facility.owner.toString() !== ownerId.toString() && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền chốt sân cho giải đấu này",
        });
      }
      
      const court = await Court.findById(courtId).populate("facility");
      
      if (!court) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sân",
        });
      }
      
      if (court.facility.owner.toString() !== ownerId.toString() && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền sử dụng sân này",
        });
      }
      
      league.courtId = courtId;
      await league.save();
      
      await logAudit(
        "ASSIGN_COURT_TO_LEAGUE",
        ownerId,
        req,
        {
          leagueId: leagueId,
          leagueName: league.name,
          courtId: courtId,
          courtName: court.name,
        }
      );
      
      res.json({
        success: true,
        message: "Đã chốt sân cho giải đấu thành công",
        data: league,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/leagues/:id/pay-fee
 * Thanh toán phí giải đấu bằng ví
 */
router.post(
  "/:id/pay-fee",
  authenticateToken,
  asyncHandler(async (req, res, next) => {
    const leagueId = req.params.id;
    const { amount, method } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số tiền không hợp lệ",
      });
    }

    if (method !== "wallet") {
      return res.status(400).json({
        success: false,
        message: "Chỉ hỗ trợ thanh toán bằng ví",
      });
    }

    // 1. Tìm giải đấu
    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // 2. Kiểm tra quyền sở hữu (chỉ creator mới có thể thanh toán)
    if (league.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thanh toán phí cho giải đấu này",
      });
    }

    // 3. Kiểm tra giải đấu đã được thanh toán chưa
    if (league.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Giải đấu này đã được thanh toán",
      });
    }

    // 4. Kiểm tra số dư ví
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Số dư ví không đủ",
      });
    }

    // 5. Trừ tiền từ ví
    await debit(user._id, amount, "payment", {
      leagueId: league._id,
      description: `Thanh toán phí tạo giải đấu: ${league.name}`,
      type: "tournament_fee",
    });

    // 6. Tạo bản ghi Payment
    const paymentId = `WALLET_LEAGUE_${league._id}_${new Date().getTime()}`;
    const payment = await Payment.create({
      user: user._id,
      league: league._id,
      amount: amount,
      method: "wallet",
      status: "success",
      paymentId: paymentId,
      transactionId: paymentId,
      orderInfo: `Thanh toán phí tạo giải đấu: ${league.name}`,
      paidAt: new Date(),
    });

    // 7. Cập nhật trạng thái giải đấu
    league.paymentStatus = "paid";
    league.paymentMethod = "wallet";
    league.paidAt = new Date();
    await league.save();

    // 8. Gửi thông báo
    await createNotification({
      userId: user._id.toString(),
      type: "payment",
      title: "Thanh toán phí giải đấu thành công",
      message: `Thanh toán phí tạo giải đấu "${league.name}" đã thành công. Số tiền: ${amount.toLocaleString("vi-VN")} VNĐ`,
      metadata: {
        leagueId: league._id.toString(),
        paymentId: payment._id.toString(),
        paymentMethod: "wallet",
      },
    });

    // 9. Emit socket event
    emitToUser(user._id.toString(), "league:payment:success", {
      league: league.toObject(),
      payment: payment.toObject(),
      message: "Thanh toán phí giải đấu thành công!",
    });

    // 10. Log audit
    await logAudit(
      "LEAGUE_FEE_PAYMENT",
      user._id,
      req,
      {
        leagueId: league._id.toString(),
        leagueName: league.name,
        amount: amount,
        paymentMethod: "wallet",
        paymentId: payment._id.toString(),
      }
    );

    res.json({
      success: true,
      message: "Thanh toán phí giải đấu thành công",
      data: {
        league: league.toObject(),
        payment: payment.toObject(),
        newBalance: user.walletBalance - amount,
      },
    });
  })
);

export default router;


