// routes/booking.js
import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import Facility from "../models/Facility.js";
import User from "../models/User.js";
import Promotion from "../models/Promotion.js";
import {
  authenticateToken,
  authorize,
  requireAdmin,
} from "../middleware/auth.js";
import { logAudit } from "../utils/auditLogger.js";
import { emitToUser, emitToFacility, emitToOwners } from "../socket/index.js";
import {
  createNotification,
  notifyFacilityOwner,
} from "../utils/notificationService.js";
import QRCode from "qrcode";

// === IMPORTS TỪ STASH (CHO TÍNH NĂNG VÍ & REWARD) ===
import { debit } from "../utils/walletService.js";
import { creditOwnerBalance } from "../utils/ownerBalanceService.js";
import Payment from "../models/Payment.js";
import { isSlotLocked } from "../socket/bookingSocket.js";
import asyncHandler from "express-async-handler";
import { processBookingRewards } from "../utils/rewardService.js";
import { sendPaymentReceipt } from "../utils/emailService.js";
const router = express.Router();

// === MIDDLEWARE TÙY CHỈNH ===

// Middleware kiểm tra quyền sở hữu booking
const checkBookingOwnership = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    // User chỉ có thể xem/sửa booking của chính mình
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware kiểm tra quyền sở hữu facility
const checkFacilityOwnership = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("facility");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    if (booking.facility.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
};

// === CÁC API ENDPOINTS ===

/**
 * GET /api/bookings/availability
 * Kiểm tra tính khả dụng của slot
 */
router.get("/availability", async (req, res, next) => {
  try {
    const { courtId, date, timeStart, timeEnd } = req.query;

    if (!courtId || !date) {
      return res.status(400).json({
        success: false,
        message: "courtId và date là bắt buộc",
      });
    }

    // Validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Ngày không hợp lệ",
      });
    }

    // Get court info with facility
    const court = await Court.findById(courtId).populate("facility");
    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân",
      });
    }

    // Get facility operating hours
    const facility = court.facility;
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cơ sở",
      });
    }

    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = bookingDate.getDay();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[dayOfWeek];

    // Get operating hours for this day
    const dayOperatingHours = facility.operatingHours?.[dayName];

    // Check if facility is open on this day
    if (!dayOperatingHours || !dayOperatingHours.isOpen) {
      return res.json({
        success: true,
        data: {
          slots: [],
          totalAvailable: 0,
          totalSlots: 0,
          court: {
            name: court.name,
            type: court.type,
            price: court.price,
            status: court.status,
          },
          facility: {
            name: facility.name,
            address: facility.address,
            location: facility.location,
          },
          message: "Cơ sở không hoạt động vào ngày này",
        },
      });
    }

    // Get open and close times
    const openTime = dayOperatingHours.open || "06:00";
    const closeTime = dayOperatingHours.close || "22:00";

    // Parse time strings to hours
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    // Convert to total minutes for easier calculation
    let openMinutes = openHour * 60 + openMinute;
    let closeMinutes = closeHour * 60 + closeMinute;

    // Use query params if provided (override facility hours, but within valid range)
    if (timeStart) {
      const [startHour, startMinute] = timeStart.split(":").map(Number);
      const startMinutes = startHour * 60 + startMinute;
      if (startMinutes >= openMinutes && startMinutes < closeMinutes) {
        openMinutes = startMinutes;
      }
    }

    if (timeEnd) {
      const [endHour, endMinute] = timeEnd.split(":").map(Number);
      const endMinutes = endHour * 60 + endMinute;
      if (endMinutes <= closeMinutes && endMinutes > openMinutes) {
        closeMinutes = endMinutes;
      }
    }

    // Get existing bookings for this date (exclude expired)
    const now = new Date();
    
    // Tạo date range để query (từ 00:00:00 đến 23:59:59 của ngày)
    // Sử dụng range rộng hơn để tránh vấn đề timezone
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    // Trừ 12 giờ để cover timezone (UTC+7)
    startOfDay.setTime(startOfDay.getTime() - 12 * 60 * 60 * 1000);
    
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);
    // Cộng 12 giờ để cover timezone
    endOfDay.setTime(endOfDay.getTime() + 12 * 60 * 60 * 1000);
    
    const existingBookings = await Booking.find({
      court: courtId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ["pending_payment", "hold", "confirmed"] },
      // Exclude expired bookings
      $or: [
        { holdUntil: { $exists: false } },
        { holdUntil: { $gt: now } },
        { status: "confirmed" }, // Confirmed bookings don't expire
      ],
    });
    
    console.log(`[BOOKING_AVAILABILITY] Kiểm tra sân ${courtId} ngày ${bookingDate.toISOString().split('T')[0]}:`, {
      queryDateRange: {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString(),
        bookingDate: bookingDate.toISOString()
      },
      foundBookings: existingBookings.length,
      bookings: existingBookings.map(b => ({
        id: b._id,
        status: b.status,
        date: b.date,
        dateISO: b.date?.toISOString(),
        timeSlots: b.timeSlots,
        league: b.league,
        matchInfo: b.matchInfo,
        holdUntil: b.holdUntil,
        court: b.court
      }))
    });

    // Generate time slots based on operating hours
    const allSlots = [];
    let currentMinutes = openMinutes;

    // Lấy timeSlotDuration từ facility (mặc định 60 phút nếu không có)
    const slotDuration = facility.timeSlotDuration || 60;

    while (currentMinutes < closeMinutes) {
      const currentHour = Math.floor(currentMinutes / 60);
      const currentMin = currentMinutes % 60;
      const nextMinutes = currentMinutes + slotDuration; // Sử dụng slotDuration thay vì hardcode 60
      const nextHour = Math.floor(nextMinutes / 60);
      const nextMin = nextMinutes % 60;

      // Don't exceed close time
      if (nextMinutes > closeMinutes) {
        break;
      }

      const startTime = `${String(currentHour).padStart(2, "0")}:${String(
        currentMin
      ).padStart(2, "0")}`;
      const endTime = `${String(nextHour).padStart(2, "0")}:${String(
        nextMin
      ).padStart(2, "0")}`;
      const slotString = `${startTime}-${endTime}`;

      // Helper để chuyển time string sang phút
      const timeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      // Check if this slot is booked (check overlap, không chỉ exact match)
      const slotStartMinutes = timeToMinutes(startTime);
      const slotEndMinutes = timeToMinutes(endTime);
      
      const isBooked = existingBookings.some((booking) => {
        // Check overlap với bất kỳ slot nào trong booking
        for (const bookingSlot of booking.timeSlots || []) {
          const [bookingSlotStart, bookingSlotEnd] = bookingSlot.split('-');
          const bookingSlotStartMinutes = timeToMinutes(bookingSlotStart);
          const bookingSlotEndMinutes = timeToMinutes(bookingSlotEnd);
          
          if (slotStartMinutes !== null && slotEndMinutes !== null &&
              bookingSlotStartMinutes !== null && bookingSlotEndMinutes !== null) {
            // Check overlap: không overlap nếu slot kết thúc trước booking bắt đầu HOẶC slot bắt đầu sau booking kết thúc
            const hasOverlap = !(slotEndMinutes <= bookingSlotStartMinutes || slotStartMinutes >= bookingSlotEndMinutes);
            if (hasOverlap) {
              return true; // Có overlap, slot bị block
            }
          }
        }
        return false;
      });
      
      if (isBooked) {
        const blockingBooking = existingBookings.find(b => {
          for (const bookingSlot of b.timeSlots || []) {
            const [bookingSlotStart, bookingSlotEnd] = bookingSlot.split('-');
            const bookingSlotStartMinutes = timeToMinutes(bookingSlotStart);
            const bookingSlotEndMinutes = timeToMinutes(bookingSlotEnd);
            
            if (slotStartMinutes !== null && slotEndMinutes !== null &&
                bookingSlotStartMinutes !== null && bookingSlotEndMinutes !== null) {
              const hasOverlap = !(slotEndMinutes <= bookingSlotStartMinutes || slotStartMinutes >= bookingSlotEndMinutes);
              if (hasOverlap) return true;
            }
          }
          return false;
        });
        console.log(`[BOOKING_AVAILABILITY] Slot ${slotString} bị block bởi booking ${blockingBooking?._id}:`, {
          status: blockingBooking?.status,
          league: blockingBooking?.league,
          matchInfo: blockingBooking?.matchInfo,
          bookingTimeSlots: blockingBooking?.timeSlots
        });
      }

      allSlots.push({
        time: startTime,
        slot: slotString,
        available: !isBooked,
        price: court.price,
      });

      currentMinutes = nextMinutes;
    }

    res.json({
      success: true,
      data: {
        slots: allSlots,
        totalAvailable: allSlots.filter((s) => s.available).length,
        totalSlots: allSlots.length,
        court: {
          name: court.name,
          type: court.type,
          price: court.price,
          status: court.status,
        },
        facility: {
          name: facility.name,
          address: facility.address,
          location: facility.location,
          timeSlotDuration: facility.timeSlotDuration || 60, // Khung giờ đặt sân
        },
        operatingHours: {
          day: dayName,
          isOpen: dayOperatingHours.isOpen,
          open: openTime,
          close: closeTime,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookings
 * Tạo booking mới
 */
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const {
      courtId,
      facilityId,
      date,
      timeSlots,
      contactInfo,
      totalAmount,
      promotionCode,
      discountAmount,
    } = req.body;

    // Validation
    if (!courtId || !facilityId || !date || !timeSlots || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // Validate timeSlots
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất 1 khung giờ",
      });
    }

    // Check court exists
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân",
      });
    }

    // Check court status
    if (court.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Sân này hiện không hoạt động",
      });
    }

    // Check availability
    const bookingDate = new Date(date);
    const isAvailable = await Booking.checkAvailability(
      courtId,
      bookingDate,
      timeSlots
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Một hoặc nhiều khung giờ đã được đặt",
      });
    }

    // Validate and process promotion code if provided
    let promotion = null;
    let finalDiscountAmount = discountAmount || 0;

    if (promotionCode) {
      promotion = await Promotion.findOne({
        code: promotionCode.toUpperCase(),
      });

      if (!promotion) {
        return res.status(400).json({
          success: false,
          message: "Mã khuyến mãi không tồn tại",
        });
      }

      // Validate promotion using isValid method
      const validation = promotion.isValid(facilityId, null);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.reason || "Mã khuyến mãi không hợp lệ",
        });
      }

      // Calculate discount amount if not provided
      if (!discountAmount || discountAmount === 0) {
        // Use totalAmount (subtotal) to calculate discount
        const discountCalc = promotion.calculateDiscount(
          totalAmount || court.price * timeSlots.length
        );
        finalDiscountAmount = discountCalc.discountAmount;
      }
    }

    // Calculate total amount if not provided
    let calculatedAmount = totalAmount;
    if (!calculatedAmount) {
      calculatedAmount = court.price * timeSlots.length;
    }

    // Apply discount to total amount
    const finalAmount = Math.max(0, calculatedAmount - finalDiscountAmount);

    // Create booking với status pending_payment và holdUntil
    const holdUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 phút từ bây giờ

    const booking = new Booking({
      user: req.user._id,
      court: courtId,
      facility: facilityId,
      date: bookingDate,
      timeSlots,
      contactInfo,
      totalAmount: finalAmount,
      promotionCode: promotionCode ? promotionCode.toUpperCase() : null,
      discountAmount: finalDiscountAmount,
      status: "pending_payment", // Trạng thái mới: đang chờ thanh toán
      paymentStatus: "pending",
      holdUntil: holdUntil, // Thời gian hết hạn giữ slot
    });

    await booking.save();

    // Increment promotion usage count if promotion was used
    if (promotion) {
      promotion.usageCount = (promotion.usageCount || 0) + 1;
      await promotion.save();
    }

    // Sinh mã QR chứa bookingId (có thể mở rộng thông tin nếu cần)
    let qrPayload = { bookingId: booking._id.toString() };
    const qrData = JSON.stringify(qrPayload);
    booking.qrCode = await QRCode.toDataURL(qrData);
    await booking.save();

    // Populate for response
    await booking.populate("court", "name type price");
    await booking.populate("facility", "name address location");

    // Emit socket events for real-time updates
    // Notify user about successful booking
    emitToUser(req.user._id.toString(), "booking:created", {
      booking: booking.toObject(),
      message: "Đặt sân thành công! Vui lòng thanh toán để hoàn tất.",
    });

    // Create notification for user
    await createNotification({
      userId: req.user._id.toString(),
      type: "booking",
      title: "Đặt sân thành công",
      message: `Bạn đã đặt sân thành công tại ${
        booking.facility.name
      }. Mã đặt sân: ${
        booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()
      }. Vui lòng thanh toán để hoàn tất.`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId: facilityId.toString(),
        courtId: courtId.toString(),
      },
      priority: "high",
    });

    // Notify facility owner about new booking
    await notifyFacilityOwner({
      facilityId: facilityId.toString(),
      type: "booking",
      title: "Có đặt sân mới",
      message: `Có đặt sân mới tại ${booking.facility.name}. Mã đặt sân: ${
        booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()
      }.`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId: facilityId.toString(),
        courtId: courtId.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Notify all users in facility room about slot update
    emitToFacility(facilityId, "booking:slot:booked", {
      facilityId: facilityId.toString(),
      courtId,
      date,
      timeSlots,
      bookingId: booking._id,
    });

    res.status(201).json({
      success: true,
      message: "Đặt sân thành công! Vui lòng thanh toán để hoàn tất.",
      data: {
        booking,
        paymentPending: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/my-bookings
 * Lấy danh sách bookings của user đang đăng nhập
 */
router.get("/my-bookings", authenticateToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get bookings
    const bookings = await Booking.find(filter)
      .populate("court", "name type price")
      .populate("facility", "name address location images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Auto-update status for past bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatePromises = [];
    for (const booking of bookings) {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);

      // If booking date has passed and status is confirmed, update to completed
      // (pending_payment/hold bookings will be expired before this)
      if (bookingDate < today && booking.status === "confirmed") {
        booking.status = "completed";
        booking.completedAt = new Date();
        updatePromises.push(booking.save());
      }
    }

    // Wait for all updates to complete (don't block response)
    if (updatePromises.length > 0) {
      Promise.all(updatePromises).catch((err) => {
        console.error("Error auto-updating booking statuses:", err);
      });
    }

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
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
 * GET /api/bookings/admin/all
 * Lấy tất cả bookings (chỉ admin)
 */
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = {};

      // Status filter
      if (req.query.status) {
        filter.status = req.query.status;
      }

      // Payment status filter
      if (req.query.paymentStatus) {
        filter.paymentStatus = req.query.paymentStatus;
      }

      // Date filter
      if (req.query.date) {
        const date = new Date(req.query.date);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date = { $gte: date, $lt: nextDay };
      }

      // Date range filter
      if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filter.date = { $gte: startDate, $lte: endDate };
      }

      // Facility filter
      if (req.query.facilityId) {
        filter.facility = req.query.facilityId;
      }

      // Search functionality
      if (req.query.search) {
        const searchTerm = req.query.search.trim();

        // Check if search term looks like a booking code (BK-YYYYMMDD-XXXX)
        if (/^BK-\d{8}-\d{4}$/i.test(searchTerm)) {
          filter.bookingCode = searchTerm.toUpperCase();
        } else {
          // Search in facility name, user name, email, phone
          const facilities = await Facility.find({
            name: { $regex: searchTerm, $options: "i" },
          }).select("_id");

          const facilityIds = facilities.map((f) => f._id);

          // Also search in user fields
          const users = await User.find({
            $or: [
              { name: { $regex: searchTerm, $options: "i" } },
              { email: { $regex: searchTerm, $options: "i" } },
              { phone: { $regex: searchTerm, $options: "i" } },
            ],
          }).select("_id");

          const userIds = users.map((u) => u._id);

          // Combine filters - search in multiple fields
          filter.$or = [
            { facility: { $in: facilityIds } },
            { user: { $in: userIds } },
            { "contactInfo.name": { $regex: searchTerm, $options: "i" } },
            { "contactInfo.email": { $regex: searchTerm, $options: "i" } },
            { "contactInfo.phone": { $regex: searchTerm, $options: "i" } },
            { bookingCode: { $regex: searchTerm, $options: "i" } },
          ];
        }
      }

      // Get bookings - Sort by createdAt descending first (newest first), then by date
      const bookings = await Booking.find(filter)
        .populate("court", "name type price")
        .populate("user", "name email phone avatar")
        .populate({
          path: "facility",
          select: "name address location owner",
          populate: {
            path: "owner",
            select: "name email",
          },
        })
        .sort({ createdAt: -1, date: 1 })
        .skip(skip)
        .limit(limit);

      // Auto-update status for past bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const updatePromises = [];
      for (const booking of bookings) {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);

        // If booking date has passed and status is still pending/confirmed, update to completed
        if (
          bookingDate < today &&
          (booking.status === "pending" || booking.status === "confirmed")
        ) {
          booking.status = "completed";
          booking.completedAt = new Date();
          updatePromises.push(booking.save());
        }
      }

      // Wait for all updates to complete (don't block response)
      if (updatePromises.length > 0) {
        Promise.all(updatePromises).catch((err) => {
          console.error("Error auto-updating booking statuses:", err);
        });
      }

      const total = await Booking.countDocuments(filter);

      // Get stats
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayBookings = await Booking.countDocuments({
        date: { $gte: today, $lt: tomorrow },
      });

      const pendingBookings = await Booking.countDocuments({
        status: "pending",
      });

      const todayRevenue = await Booking.aggregate([
        {
          $match: {
            date: { $gte: today, $lt: tomorrow },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
          stats: {
            total,
            today: todayBookings,
            pending: pendingBookings,
            revenueToday: todayRevenue[0]?.total || 0,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/bookings/facility/:facilityId
 * Lấy danh sách bookings của facility (chỉ owner)
 */
router.get(
  "/facility/:facilityId",
  authenticateToken,
  async (req, res, next) => {
    try {
      // Check facility ownership
      const facility = await Facility.findById(req.params.facilityId);
      if (!facility) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cơ sở",
        });
      }

      if (facility.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập",
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = { facility: req.params.facilityId };

      if (req.query.status) {
        filter.status = req.query.status;
      }

      // Date filter - lọc theo ngày đặt sân
      if (req.query.date) {
        const date = new Date(req.query.date);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.date = { $gte: date, $lt: nextDay };
      }

      // Search functionality
      if (req.query.search) {
        const searchTerm = req.query.search.trim();

        // Check if search term looks like a booking code (BK-YYYYMMDD-XXXX)
        if (/^BK-\d{8}-\d{4}$/i.test(searchTerm)) {
          // Search by booking code
          filter.bookingCode = searchTerm.toUpperCase();
        } else {
          // Search in facility name, user name, email, phone
          const facilities = await Facility.find({
            name: { $regex: searchTerm, $options: "i" },
          }).select("_id");

          const facilityIds = facilities.map((f) => f._id);

          // Also search in user fields
          const users = await User.find({
            $or: [
              { name: { $regex: searchTerm, $options: "i" } },
              { email: { $regex: searchTerm, $options: "i" } },
              { phone: { $regex: searchTerm, $options: "i" } },
            ],
          }).select("_id");

          const userIds = users.map((u) => u._id);

          // Combine filters - search in multiple fields
          filter.$or = [
            { facility: { $in: facilityIds } },
            { user: { $in: userIds } },
            { "contactInfo.name": { $regex: searchTerm, $options: "i" } },
            { "contactInfo.email": { $regex: searchTerm, $options: "i" } },
            { "contactInfo.phone": { $regex: searchTerm, $options: "i" } },
          ];
        }
      }

      // Get bookings - Sort by createdAt descending first (newest first), then by date
      const bookings = await Booking.find(filter)
        .populate("court", "name type price")
        .populate("user", "name email phone avatar")
        .sort({ createdAt: -1, date: 1 })
        .skip(skip)
        .limit(limit);

      // Auto-update status for past bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const updatePromises = [];
      for (const booking of bookings) {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);

        // If booking date has passed and status is still pending/confirmed, update to completed
        if (
          bookingDate < today &&
          (booking.status === "pending" || booking.status === "confirmed")
        ) {
          booking.status = "completed";
          booking.completedAt = new Date();
          updatePromises.push(booking.save());
        }
      }

      // Wait for all updates to complete (don't block response)
      if (updatePromises.length > 0) {
        Promise.all(updatePromises).catch((err) => {
          console.error("Error auto-updating booking statuses:", err);
        });
      }

      const total = await Booking.countDocuments(filter);

      // Get stats (reuse today variable from above)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayBookings = await Booking.countDocuments({
        facility: req.params.facilityId,
        date: { $gte: today, $lt: tomorrow },
      });

      const pendingBookings = await Booking.countDocuments({
        facility: req.params.facilityId,
        status: "pending",
      });

      const todayRevenue = await Booking.aggregate([
        {
          $match: {
            facility: new mongoose.Types.ObjectId(req.params.facilityId),
            date: { $gte: today, $lt: tomorrow },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
          stats: {
            total,
            today: todayBookings,
            pending: pendingBookings,
            revenueToday: todayRevenue[0]?.total || 0,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/bookings/:id
 * Chi tiết booking
 */
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone avatar")
      .populate("court", "name type price description images")
      .populate({
        path: "facility",
        select: "name location phoneNumber owner",
        populate: {
          path: "owner",
          select: "name email",
        },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    // Check permission
    const isOwner =
      booking.user && booking.user._id.toString() === req.user._id.toString();

    // Handle both populated and unpopulated owner
    let facilityOwnerId = null;
    if (booking.facility && booking.facility.owner) {
      facilityOwnerId = booking.facility.owner._id
        ? booking.facility.owner._id.toString()
        : booking.facility.owner.toString();
    }

    const isFacilityOwner = facilityOwnerId === req.user._id.toString();

    if (!isOwner && !isFacilityOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/bookings/:id/status
 * Cập nhật trạng thái booking (chỉ owner hoặc admin)
 */
router.patch("/:id/status", authenticateToken, async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (
      ![
        "pending",
        "pending_payment",
        "hold",
        "confirmed",
        "expired",
        "cancelled",
        "completed",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const booking = await Booking.findById(req.params.id).populate({
      path: "facility",
      select: "owner",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    // Check permission (owner of facility or admin)
    // Handle both populated and unpopulated owner
    let facilityOwnerId = null;
    if (booking.facility && booking.facility.owner) {
      facilityOwnerId = booking.facility.owner._id
        ? booking.facility.owner._id.toString()
        : booking.facility.owner.toString();
    }

    if (
      facilityOwnerId &&
      facilityOwnerId !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    // Update status
    booking.status = status;
    if (notes) {
      booking.ownerNotes = notes;
    }

    // If confirming booking and payment method is cash, mark payment as paid
    if (status === "confirmed" && booking.paymentMethod === "cash") {
      booking.paymentStatus = "paid";
    }

    if (status === "cancelled") {
      booking.cancelledAt = new Date();
    }

    if (status === "completed") {
      booking.completedAt = new Date();
    }

    await booking.save();

    // Populate for socket events
    await booking.populate("court", "name type price");
    await booking.populate("facility", "name address location");

    // Emit socket events for status update
    const userId = booking.user._id?.toString() || booking.user.toString();
    emitToUser(userId, "booking:status:updated", {
      booking: booking.toObject(),
      status,
      message: `Trạng thái booking đã được cập nhật thành: ${status}`,
    });

    // Status messages
    const statusMessages = {
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Đã hoàn thành",
      pending: "Đang chờ xử lý",
      pending_payment: "Chờ thanh toán",
    };

    const statusTitles = {
      confirmed:
        booking.paymentMethod === "cash" && booking.paymentStatus === "paid"
          ? "Đặt sân đã được xác nhận và thanh toán"
          : "Đặt sân đã được xác nhận",
      cancelled: "Đặt sân đã bị hủy",
      completed: "Đặt sân đã hoàn thành",
      pending: "Đặt sân đang chờ xác nhận",
      pending_payment: "Đặt sân chờ thanh toán",
    };

    // Custom message for cash payment confirmation
    let notificationMessage = `Đặt sân ${
      booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()
    } tại ${booking.facility.name} đã được ${
      statusMessages[status] || status
    }.`;

    if (
      status === "confirmed" &&
      booking.paymentMethod === "cash" &&
      booking.paymentStatus === "paid"
    ) {
      notificationMessage = `Đặt sân ${
        booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()
      } tại ${
        booking.facility.name
      } đã được xác nhận và thanh toán tiền mặt thành công.`;
    }

    // Create notification for user
    await createNotification({
      userId,
      type: status === "cancelled" ? "cancellation" : "booking",
      title: statusTitles[status] || "Trạng thái đặt sân đã thay đổi",
      message: notificationMessage,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId:
          booking.facility._id?.toString() || booking.facility.toString(),
        status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        notes,
      },
      priority: status === "cancelled" ? "high" : "normal",
    });

    // Notify facility room
    const facilityId =
      booking.facility._id?.toString() || booking.facility.toString();
    emitToFacility(facilityId, "booking:status:updated", {
      bookingId: booking._id,
      facilityId,
      courtId: booking.court._id?.toString() || booking.court.toString(),
      status,
      date: booking.date,
      timeSlots: status === "cancelled" ? booking.timeSlots : undefined, // Include timeSlots when cancelled
    });

    res.json({
      success: true,
      message: `Cập nhật trạng thái thành công: ${status}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/bookings/:id/cancel
 * User hủy booking
 */
router.patch(
  "/:id/cancel",
  authenticateToken,
  checkBookingOwnership,
  async (req, res, next) => {
    try {
      const reason = req.body?.reason;

      const booking = req.booking;

      // Check if can cancel
      if (!booking.canCancel()) {
        return res.status(400).json({
          success: false,
          message: "Booking này không thể hủy",
        });
      }

      // Nếu booking đang pending_payment hoặc hold, set expired thay vì cancelled
      // (vì đây là auto-expire do hết thời gian thanh toán)
      const isPendingPayment =
        booking.status === "pending_payment" || booking.status === "hold";
      const isExpired = booking.holdUntil && new Date() > booking.holdUntil;

      if (isPendingPayment || isExpired) {
        booking.status = "expired";
        booking.cancelledAt = new Date();
        booking.cancellationReason = reason || "Hết hạn thanh toán";
      } else {
        // User tự hủy booking đã confirmed
        booking.status = "cancelled";
        booking.cancelledAt = new Date();
        booking.cancellationReason = reason || "Người dùng tự hủy";
      }

      // Check if eligible for refund
      let refundAmount = 0;
      if (booking.paymentStatus === "paid") {
        // Calculate refund based on cancellation time
        const bookingDateTime = new Date(
          `${booking.date.toISOString().split("T")[0]} ${
            booking.timeSlots[0].split("-")[0]
          }`
        );
        const now = new Date();
        const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

        if (hoursUntilBooking >= 24) {
          // Cancel 24+ hours before: 100% refund
          refundAmount = booking.totalAmount;
        } else if (hoursUntilBooking >= 12) {
          // Cancel 12-24 hours before: 50% refund
          refundAmount = booking.totalAmount * 0.5;
        } else {
          // Cancel less than 12 hours: no refund (or service fee only)
          refundAmount = 0;
        }

        booking.paymentStatus = "refunded";
      }

      await booking.save();

      // Populate for notifications
      await booking.populate("facility", "name owner");
      await booking.populate("court", "name");

      // Notify facility owner about cancellation
      const facilityId =
        booking.facility._id?.toString() || booking.facility.toString();
      await notifyFacilityOwner({
        facilityId,
        type: "cancellation",
        title: "Đặt sân đã bị hủy",
        message: `Đặt sân ${
          booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()
        } tại ${booking.facility.name} đã bị hủy bởi người dùng.`,
        metadata: {
          bookingId: booking._id.toString(),
          bookingCode: booking.bookingCode,
          facilityId,
          cancellationReason: reason || "Người dùng tự hủy",
        },
      });

      // Notify facility room about cancelled booking slots
      const courtId = booking.court._id?.toString() || booking.court.toString();
      emitToFacility(facilityId, "booking:slot:cancelled", {
        bookingId: booking._id,
        facilityId,
        courtId,
        date: booking.date,
        timeSlots: booking.timeSlots,
      });

      res.json({
        success: true,
        message: "Đã hủy booking thành công",
        data: {
          booking,
          refundAmount,
          refundStatus: refundAmount > 0 ? "processing" : "not_eligible",
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/bookings/:id/payment-method
 * User chọn phương thức thanh toán
 */
router.patch(
  "/:id/payment-method",
  authenticateToken,
  checkBookingOwnership,
  async (req, res, next) => {
    try {
      const { paymentMethod } = req.body;

      // Validate payment method
      if (
        !paymentMethod ||
        !["momo", "vnpay", "cash"].includes(paymentMethod)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Phương thức thanh toán không hợp lệ. Vui lòng chọn: momo, vnpay, hoặc cash",
        });
      }

      const booking = req.booking;

      // Check if booking is already paid
      if (booking.paymentStatus === "paid") {
        return res.status(400).json({
          success: false,
          message: "Booking này đã được thanh toán",
        });
      }

      // Update payment method
      booking.paymentMethod = paymentMethod;

      // If cash payment, set status to "pending" (chờ owner xác nhận)
      // User will pay at the venue, owner will confirm later
      if (paymentMethod === "cash") {
        // Set status = "pending" (chờ owner xác nhận)
        booking.status = "pending";
        // Keep paymentStatus = "pending" (chưa thanh toán)
        // Clear holdUntil vì không cần countdown nữa
        booking.holdUntil = null;
        await booking.save();

        // Populate for response
        await booking.populate("court", "name type price");
        await booking.populate("facility", "name address location");

        // Create notification for user
        await createNotification({
          userId: booking.user._id?.toString() || booking.user.toString(),
          type: "booking",
          title: "Đã chọn thanh toán tiền mặt",
          message: `Bạn đã chọn thanh toán tiền mặt cho đặt sân ${
            booking.bookingCode ||
            booking._id.toString().slice(-8).toUpperCase()
          }. Đơn đặt sân đang chờ xác nhận từ chủ sân. Vui lòng thanh toán khi đến sân.`,
          metadata: {
            bookingId: booking._id.toString(),
            bookingCode: booking.bookingCode,
            facilityId:
              booking.facility._id?.toString() || booking.facility.toString(),
            paymentMethod: "cash",
            status: "pending",
          },
          priority: "normal",
        });

        // Notify facility owner
        await notifyFacilityOwner({
          facilityId:
            booking.facility._id?.toString() || booking.facility.toString(),
          type: "booking",
          title: "Đặt sân mới - Thanh toán tiền mặt",
          message: `Đặt sân ${
            booking.bookingCode ||
            booking._id.toString().slice(-8).toUpperCase()
          } tại ${
            booking.facility.name
          } đã chọn thanh toán tiền mặt. Vui lòng xác nhận đơn đặt sân khi khách đến sân và thanh toán.`,
          metadata: {
            bookingId: booking._id.toString(),
            bookingCode: booking.bookingCode,
            facilityId:
              booking.facility._id?.toString() || booking.facility.toString(),
            paymentMethod: "cash",
            status: "pending",
          },
        });

        return res.json({
          success: true,
          message:
            "Đã chọn thanh toán tiền mặt. Vui lòng thanh toán khi đến sân.",
          data: booking,
        });
      }

      // For online payment methods (momo/vnpay), just update paymentMethod
      // The actual payment will be handled by payment flow
      await booking.save();

      res.json({
        success: true,
        message: `Đã chọn phương thức thanh toán: ${paymentMethod}`,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/bookings/:id/checkin
 * Check-in booking (owner hoặc admin)
 */
router.post("/:id/checkin", authenticateToken, async (req, res, next) => {
  try {
    // Lấy booking và facility owner để kiểm tra quyền
    const booking = await Booking.findById(req.params.id).populate({
      path: "facility",
      select: "owner",
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy booking" });
    }

    // Xác thực quyền: chủ cơ sở chứa sân hoặc admin
    let facilityOwnerId = null;
    if (booking.facility && booking.facility.owner) {
      facilityOwnerId = booking.facility.owner._id
        ? booking.facility.owner._id.toString()
        : booking.facility.owner.toString();
    }

    const isFacilityOwner = facilityOwnerId === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isFacilityOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền check-in cho booking này",
      });
    }

    // Không cho check-in nếu đã hủy hoặc đã hoàn tất
    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Booking đã bị hủy" });
    }
    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking đã hoàn tất" });
    }

    // Kiểm tra điều kiện cơ bản: đã thanh toán hoặc đã được xác nhận
    if (!(booking.paymentStatus === "paid" || booking.status === "confirmed")) {
      return res.status(400).json({
        success: false,
        message: "Booking chưa đủ điều kiện check-in (cần paid hoặc confirmed)",
      });
    }

    // (Tuỳ chọn) Ràng buộc ngày: chỉ cho phép check-in trong ngày đặt
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDay = new Date(booking.date);
    bookingDay.setHours(0, 0, 0, 0);
    if (bookingDay > today) {
      return res
        .status(400)
        .json({ success: false, message: "Chưa đến ngày check-in" });
    }

    // Cập nhật check-in
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.user._id;
    booking.status = "completed"; // Đánh dấu hoàn tất khi check-in

    await booking.save();

    return res.json({
      success: true,
      message: "Check-in thành công",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookings/:id/pay-wallet
 * User thanh toán booking bằng ví
 */
router.post(
  "/:id/pay-wallet",
  authenticateToken,
  checkBookingOwnership, // Dùng lại middleware check quyền sở hữu
  asyncHandler(async (req, res, next) => {
    const booking = req.booking; // Lấy từ middleware checkBookingOwnership

    // 1. Kiểm tra booking đã thanh toán chưa
    if (booking.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Booking này đã được thanh toán" });
    }

    // 2. Kiểm tra số dư
    const user = await User.findById(req.user._id);
    const totalAmount = booking.totalAmount;

    if (user.walletBalance < totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Số dư ví không đủ" });
    }

    // 3. Trừ tiền (Sử dụng service đã có)
    await debit(user._id, totalAmount, "payment", {
      bookingId: booking._id,
      description: `Thanh toan don ${booking.bookingCode}`,
    });

    // 4. Tạo bản ghi Payment (để đồng bộ)
    const paymentId = `WALLET_${booking._id}_${new Date().getTime()}`;
    await Payment.create({
      user: user._id,
      booking: booking._id,
      amount: totalAmount,
      method: "wallet",
      status: "success",
      paymentId: paymentId,
      transactionId: paymentId, // Tự gán
      orderInfo: `Thanh toan bang vi cho ${booking.bookingCode}`,
      paidAt: new Date(),
    });

    // 5. Cập nhật Booking
    booking.paymentStatus = "paid";
    booking.status = "confirmed"; // Tự động xác nhận
    booking.paymentMethod = "wallet";
    await booking.save();

    // 6. Gửi thông báo (tương tự logic thanh toán online)
    await booking.populate("facility", "name");
    try {
      // Cần populate đầy đủ thông tin để render email template
      const fullBookingForEmail = await Booking.findById(booking._id)
        .populate("user", "name email phone")
        .populate("court", "name")
        .populate("facility", "name address");

      console.log("🔍 [WALLET] Đang gửi email biên lai...");
      await sendPaymentReceipt(fullBookingForEmail);
    } catch (emailError) {
      console.error("❌ [WALLET] Lỗi gửi email:", emailError);
    }
    await createNotification({
      userId: user._id.toString(),
      type: "payment",
      title: "Thanh toán thành công",
      message: `Thanh toán bằng ví cho mã ${booking.bookingCode} tại ${booking.facility.name} đã thành công.`,
      metadata: {
        bookingId: booking._id.toString(),
        paymentMethod: "wallet",
      },
    });

    emitToUser(user._id.toString(), "booking:status:updated", {
      booking: booking.toObject(),
      status: "confirmed",
      message: "Thanh toán bằng ví thành công!",
    });

    processBookingRewards(booking);

    // 7. Cộng tiền cho owner (sau khi thanh toán bằng ví thành công)
    try {
      await booking.populate("facility", "owner");
      if (booking.facility?.owner) {
        // Xử lý ownerId (có thể là ObjectId hoặc object đã populate)
        let ownerId = booking.facility.owner;
        if (ownerId._id) {
          ownerId = ownerId._id;
        } else if (typeof ownerId === 'object' && ownerId.toString) {
          ownerId = ownerId.toString();
        }
        
        // Lấy platformFee từ SystemConfig (hoặc dùng giá trị mặc định nếu có lỗi)
        const { getPlatformFee } = await import("../utils/systemConfigService.js");
        let platformFee = 0.1; // Fallback mặc định
        try {
          platformFee = await getPlatformFee();
        } catch (e) {
          console.warn("Không thể lấy platformFee từ SystemConfig, dùng giá trị mặc định 10%:", e);
        }
        
        await creditOwnerBalance(
          ownerId,
          booking.totalAmount
          // Không truyền platformFee, sẽ lấy từ SystemConfig trong creditOwnerBalance
        );
        
        console.log(`✅ [WALLET] Đã cộng ${(booking.totalAmount * (1 - platformFee)).toLocaleString("vi-VN")} VNĐ cho owner ${ownerId} (từ booking ${booking.totalAmount.toLocaleString("vi-VN")} VNĐ, phí ${(platformFee * 100).toFixed(0)}%)`);
      } else {
        console.warn(`⚠️ [WALLET] Booking ${booking._id} không có facility hoặc owner`);
      }
    } catch (e) {
      console.error("Lỗi cộng tiền cho owner (wallet):", e);
    }

    res.json({
      success: true,
      message: "Thanh toán bằng ví thành công",
      data: booking,
    });
  })
);

export default router;
