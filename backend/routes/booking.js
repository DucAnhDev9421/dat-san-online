// routes/booking.js
import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import Facility from "../models/Facility.js";
import User from "../models/User.js";
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
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    // Convert to total minutes for easier calculation
    let openMinutes = openHour * 60 + openMinute;
    let closeMinutes = closeHour * 60 + closeMinute;

    // Use query params if provided (override facility hours, but within valid range)
    if (timeStart) {
      const [startHour, startMinute] = timeStart.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      if (startMinutes >= openMinutes && startMinutes < closeMinutes) {
        openMinutes = startMinutes;
      }
    }

    if (timeEnd) {
      const [endHour, endMinute] = timeEnd.split(':').map(Number);
      const endMinutes = endHour * 60 + endMinute;
      if (endMinutes <= closeMinutes && endMinutes > openMinutes) {
        closeMinutes = endMinutes;
      }
    }

    // Get existing bookings for this date
    const existingBookings = await Booking.find({
      court: courtId,
      date: bookingDate,
      status: { $in: ["pending", "confirmed"] },
    });

    // Generate time slots based on operating hours
    const allSlots = [];
    let currentMinutes = openMinutes;

    while (currentMinutes < closeMinutes) {
      const currentHour = Math.floor(currentMinutes / 60);
      const currentMin = currentMinutes % 60;
      const nextMinutes = currentMinutes + 60; // Each slot is 1 hour
      const nextHour = Math.floor(nextMinutes / 60);
      const nextMin = nextMinutes % 60;

      // Don't exceed close time
      if (nextMinutes > closeMinutes) {
        break;
      }

      const startTime = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
      const endTime = `${String(nextHour).padStart(2, "0")}:${String(nextMin).padStart(2, "0")}`;
      const slotString = `${startTime}-${endTime}`;

      // Check if this slot is booked
      const isBooked = existingBookings.some((booking) =>
        booking.timeSlots.includes(slotString)
      );

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

    // Calculate total amount if not provided
    let calculatedAmount = totalAmount;
    if (!calculatedAmount) {
      calculatedAmount = court.price * timeSlots.length;
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      court: courtId,
      facility: facilityId,
      date: bookingDate,
      timeSlots,
      contactInfo,
      totalAmount: calculatedAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    await booking.save();

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
    emitToUser(req.user._id.toString(), 'booking:created', {
      booking: booking.toObject(),
      message: 'Đặt sân thành công! Vui lòng thanh toán để hoàn tất.',
    });

    // Create notification for user
    await createNotification({
      userId: req.user._id.toString(),
      type: 'booking',
      title: 'Đặt sân thành công',
      message: `Bạn đã đặt sân thành công tại ${booking.facility.name}. Mã đặt sân: ${booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()}. Vui lòng thanh toán để hoàn tất.`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId: facilityId.toString(),
        courtId: courtId.toString(),
      },
      priority: 'high',
    });

    // Notify facility owner about new booking
    await notifyFacilityOwner({
      facilityId: facilityId.toString(),
      type: 'booking',
      title: 'Có đặt sân mới',
      message: `Có đặt sân mới tại ${booking.facility.name}. Mã đặt sân: ${booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()}.`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId: facilityId.toString(),
        courtId: courtId.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Notify all users in facility room about slot update
    emitToFacility(facilityId, 'booking:slot:booked', {
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
      
      // If booking date has passed and status is still pending/confirmed, update to completed
      if (bookingDate < today && (booking.status === 'pending' || booking.status === 'confirmed')) {
        booking.status = 'completed';
        booking.completedAt = new Date();
        updatePromises.push(booking.save());
      }
    }
    
    // Wait for all updates to complete (don't block response)
    if (updatePromises.length > 0) {
      Promise.all(updatePromises).catch(err => {
        console.error('Error auto-updating booking statuses:', err);
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

      if (req.query.date) {
        filter.date = new Date(req.query.date);
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

      // Get bookings
      const bookings = await Booking.find(filter)
        .populate("court", "name type price")
        .populate("user", "name email phone avatar")
        .sort({ date: 1, createdAt: -1 })
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
        if (bookingDate < today && (booking.status === 'pending' || booking.status === 'confirmed')) {
          booking.status = 'completed';
          booking.completedAt = new Date();
          updatePromises.push(booking.save());
        }
      }
      
      // Wait for all updates to complete (don't block response)
      if (updatePromises.length > 0) {
        Promise.all(updatePromises).catch(err => {
          console.error('Error auto-updating booking statuses:', err);
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
    const isOwner = booking.user && booking.user._id.toString() === req.user._id.toString();
    
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

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
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
    emitToUser(userId, 'booking:status:updated', {
      booking: booking.toObject(),
      status,
      message: `Trạng thái booking đã được cập nhật thành: ${status}`,
    });

    // Status messages
    const statusMessages = {
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Đã hoàn thành',
      pending: 'Đang chờ xử lý',
    };

    const statusTitles = {
      confirmed: 'Đặt sân đã được xác nhận',
      cancelled: 'Đặt sân đã bị hủy',
      completed: 'Đặt sân đã hoàn thành',
      pending: 'Đặt sân đang chờ xử lý',
    };

    // Create notification for user
    await createNotification({
      userId,
      type: status === 'cancelled' ? 'cancellation' : 'booking',
      title: statusTitles[status] || 'Trạng thái đặt sân đã thay đổi',
      message: `Đặt sân ${booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()} tại ${booking.facility.name} đã được ${statusMessages[status] || status}.`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId: booking.facility._id?.toString() || booking.facility.toString(),
        status,
        notes,
      },
      priority: status === 'cancelled' ? 'high' : 'normal',
    });

    // Notify facility room
    const facilityId = booking.facility._id?.toString() || booking.facility.toString();
    emitToFacility(facilityId, 'booking:status:updated', {
      bookingId: booking._id,
      courtId: booking.court._id?.toString() || booking.court.toString(),
      status,
      date: booking.date,
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
router.patch("/:id/cancel", authenticateToken, checkBookingOwnership, async (req, res, next) => {
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

    // Update status
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || "Người dùng tự hủy";

    // Check if eligible for refund
    let refundAmount = 0;
    if (booking.paymentStatus === "paid") {
      // Calculate refund based on cancellation time
      const bookingDateTime = new Date(`${booking.date.toISOString().split("T")[0]} ${booking.timeSlots[0].split("-")[0]}`);
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
    const facilityId = booking.facility._id?.toString() || booking.facility.toString();
    await notifyFacilityOwner({
      facilityId,
      type: 'cancellation',
      title: 'Đặt sân đã bị hủy',
      message: `Đặt sân ${booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()} tại ${booking.facility.name} đã bị hủy bởi người dùng.`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingCode,
        facilityId,
        cancellationReason: reason || "Người dùng tự hủy",
      },
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
});

/**
 * PATCH /api/bookings/:id/payment-method
 * User chọn phương thức thanh toán
 */
router.patch("/:id/payment-method", authenticateToken, checkBookingOwnership, async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    
    // Validate payment method
    if (!paymentMethod || !['momo', 'vnpay', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Phương thức thanh toán không hợp lệ. Vui lòng chọn: momo, vnpay, hoặc cash",
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
    
    // If cash payment, keep paymentStatus as "pending" and status as "pending"
    // User will pay at the venue, owner will confirm later
    if (paymentMethod === 'cash') {
      // Keep paymentStatus = "pending" (chưa thanh toán)
      // Keep status = "pending" (chờ xác nhận)
      // Just update paymentMethod
      await booking.save();
      
      // Populate for response
      await booking.populate("court", "name type price");
      await booking.populate("facility", "name address location");
      
      // Create notification for user
      await createNotification({
        userId: booking.user._id?.toString() || booking.user.toString(),
        type: 'booking',
        title: 'Đã chọn thanh toán tiền mặt',
        message: `Bạn đã chọn thanh toán tiền mặt cho đặt sân ${booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()}. Vui lòng thanh toán khi đến sân.`,
        metadata: {
          bookingId: booking._id.toString(),
          bookingCode: booking.bookingCode,
          facilityId: booking.facility._id?.toString() || booking.facility.toString(),
          paymentMethod: 'cash',
        },
        priority: 'normal',
      });
      
      // Notify facility owner
      await notifyFacilityOwner({
        facilityId: booking.facility._id?.toString() || booking.facility.toString(),
        type: 'booking',
        title: 'Đặt sân chọn thanh toán tiền mặt',
        message: `Đặt sân ${booking.bookingCode || booking._id.toString().slice(-8).toUpperCase()} tại ${booking.facility.name} đã chọn thanh toán tiền mặt. Vui lòng xác nhận khi khách đến sân.`,
        metadata: {
          bookingId: booking._id.toString(),
          bookingCode: booking.bookingCode,
          facilityId: booking.facility._id?.toString() || booking.facility.toString(),
          paymentMethod: 'cash',
        },
      });
      
      return res.json({
        success: true,
        message: "Đã chọn thanh toán tiền mặt. Vui lòng thanh toán khi đến sân.",
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
});

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
      return res.status(404).json({ success: false, message: "Không tìm thấy booking" });
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
      return res.status(403).json({ success: false, message: "Bạn không có quyền check-in cho booking này" });
    }

    // Không cho check-in nếu đã hủy hoặc đã hoàn tất
    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking đã bị hủy" });
    }
    if (booking.status === "completed") {
      return res.status(400).json({ success: false, message: "Booking đã hoàn tất" });
    }

    // Kiểm tra điều kiện cơ bản: đã thanh toán hoặc đã được xác nhận
    if (!(booking.paymentStatus === "paid" || booking.status === "confirmed")) {
      return res.status(400).json({ success: false, message: "Booking chưa đủ điều kiện check-in (cần paid hoặc confirmed)" });
    }

    // (Tuỳ chọn) Ràng buộc ngày: chỉ cho phép check-in trong ngày đặt
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDay = new Date(booking.date);
    bookingDay.setHours(0, 0, 0, 0);
    if (bookingDay > today) {
      return res.status(400).json({ success: false, message: "Chưa đến ngày check-in" });
    }

    // Cập nhật check-in
    booking.checkedInAt = new Date();
    booking.checkedInBy = req.user._id;
    booking.status = "completed"; // Đánh dấu hoàn tất khi check-in

    await booking.save();

    return res.json({ success: true, message: "Check-in thành công", data: booking });
  } catch (error) {
    next(error);
  }
});

export default router;

