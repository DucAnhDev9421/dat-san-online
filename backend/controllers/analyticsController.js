import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Court from "../models/Court.js";
import User from "../models/User.js";
import Facility from "../models/Facility.js";
import mongoose from "mongoose";

/**
 * Hàm helper: Lấy khoảng thời gian (startDate, endDate) dựa trên 'period'
 */
const getPeriodDates = (period) => {
  const now = new Date();
  let startDate,
    endDate = new Date(now); // endDate là hiện tại

  // Đặt endDate về cuối ngày (23:59:59.999)
  endDate.setHours(23, 59, 59, 999);

  switch (period) {
    case "day":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0); // Bắt đầu từ 00:00 hôm nay
      break;
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // 7 ngày trước
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Ngày đầu tiên của tháng này
      startDate.setHours(0, 0, 0, 0);
      break;
  }
  return { startDate, endDate };
};

/**
 * Helper: Định dạng ngày từ query params (nếu có)
 */
const parseDateRange = (startDateStr, endDateStr) => {
  const startDate = startDateStr
    ? new Date(startDateStr)
    : new Date(new Date().setHours(0, 0, 0, 0));
  if (!isNaN(startDate.getTime())) {
    startDate.setHours(0, 0, 0, 0);
  }

  const endDate = endDateStr ? new Date(endDateStr) : new Date();
  if (!isNaN(endDate.getTime())) {
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

// --- API FUNCTIONS ---

/**
 * API 1: GET /api/analytics/owner/dashboard
 * Thống kê tổng quan (Dashboard)
 */
export const getOwnerDashboard = asyncHandler(async (req, res) => {
  // req.facilityId đã được validate bởi middleware
  const facilityId = req.facilityId;
  const { period = "month" } = req.query;
  const { startDate, endDate } = getPeriodDates(period);

  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // 1. Tổng doanh thu & Tổng booking (ĐÃ THANH TOÁN) trong kỳ
  // Chúng ta sẽ tính dựa trên 'date' (ngày đặt sân), không phải 'createdAt'
  const revenueStats = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        paymentStatus: "paid",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  // 2. Tổng booking đang chờ (PENDING) - (tất cả, không theo kỳ)
  const pendingBookings = await Booking.countDocuments({
    facility: facilityObjectId,
    status: "pending",
  });

  // 3. Đánh giá mới & Rating trung bình
  const reviewStats = await Review.aggregate([
    {
      $match: { facility: facilityObjectId, isDeleted: false },
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        newReviews: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", startDate] }, 1, 0],
          },
        },
      },
    },
  ]);

  // 4. Dữ liệu biểu đồ doanh thu (theo ngày)
  const revenueChart = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        paymentStatus: "paid",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        dailyRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      period,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      totalBookings: revenueStats[0]?.totalBookings || 0,
      pendingBookings,
      averageRating: reviewStats[0]?.averageRating
        ? Math.round(reviewStats[0].averageRating * 10) / 10
        : 0,
      totalReviews: reviewStats[0]?.totalReviews || 0,
      newReviews: reviewStats[0]?.newReviews || 0,
      revenueChart,
    },
  });
});

/**
 * API 2: GET /api/analytics/owner/revenue
 * Thống kê doanh thu theo khoảng thời gian
 */
export const getOwnerRevenue = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const { startDate, endDate } = parseDateRange(
    req.query.startDate,
    req.query.endDate
  );
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // Phân nhóm doanh thu theo ngày
  const revenueByDay = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        paymentStatus: "paid",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Tính tổng
  const totalRevenue = revenueByDay.reduce((acc, day) => acc + day.total, 0);
  const totalBookings = revenueByDay.reduce((acc, day) => acc + day.count, 0);

  res.json({
    success: true,
    data: {
      startDate,
      endDate,
      totalRevenue,
      totalBookings,
      dailyData: revenueByDay,
    },
  });
});

/**
 * API 3: GET /api/analytics/owner/bookings
 * Thống kê booking (theo status, theo ngày)
 */
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const { startDate, endDate } = parseDateRange(
    req.query.startDate,
    req.query.endDate
  );
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // 1. Thống kê theo status
  const bookingsByStatus = Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // 2. Thống kê theo ngày (tất cả status)
  const bookingsByDay = Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Thực thi song song 2 query
  const [statusStats, dayStats] = await Promise.all([
    bookingsByStatus,
    bookingsByDay,
  ]);

  res.json({
    success: true,
    data: {
      startDate,
      endDate,
      statusStats: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      dayStats,
    },
  });
});

/**
 * API 4: GET /api/analytics/owner/courts
 * Thống kê từng sân: lượt đặt, doanh thu, tỷ lệ lấp đầy
 */
export const getOwnerCourts = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const { startDate, endDate } = parseDateRange(
    req.query.startDate,
    req.query.endDate
  );
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // 1. Lấy facility để có operatingHours
  const facility = await Facility.findById(facilityId).select("operatingHours");

  // 2. Lấy thông tin các sân
  const courts = await Court.find({ facility: facilityId }).lean();

  // 3. Tính tổng số slots có thể đặt trong khoảng thời gian
  const calculateAvailableSlots = (startDate, endDate, operatingHours) => {
    let totalSlots = 0;
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const dayName = dayNames[dayOfWeek];
      const dayHours = operatingHours?.[dayName];
      
      if (dayHours && dayHours.isOpen) {
        const [openHour, openMin] = (dayHours.open || "06:00").split(":").map(Number);
        const [closeHour, closeMin] = (dayHours.close || "22:00").split(":").map(Number);
        
        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;
        
        // Mỗi slot là 1 giờ (60 phút)
        const slotsPerDay = Math.floor((closeMinutes - openMinutes) / 60);
        totalSlots += slotsPerDay;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return totalSlots;
  };

  // 4. Lấy thống kê booking với tổng số time slots (chỉ tính booking đã thanh toán trong khoảng thời gian)
  const courtStats = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        paymentStatus: "paid",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$court", // Nhóm theo courtId
        totalRevenue: { $sum: "$totalAmount" },
        totalBookings: { $sum: 1 },
        totalTimeSlots: { $sum: { $size: "$timeSlots" } }, // Tổng số time slots đã đặt
      },
    },
  ]);

  // 5. Tính tổng slots có thể đặt
  const totalAvailableSlots = calculateAvailableSlots(
    startDate,
    endDate,
    facility?.operatingHours
  );

  // 6. Map (ánh xạ) thống kê vào danh sách sân
  const statsMap = new Map(
    courtStats.map((stat) => [stat._id.toString(), stat])
  );

  const courtsWithStats = courts.map((court) => {
    const stats = statsMap.get(court._id.toString());
    const bookedSlots = stats?.totalTimeSlots || 0;
    
    // Tính tỷ lệ lấp đầy
    const occupancyRate = totalAvailableSlots > 0
      ? ((bookedSlots / totalAvailableSlots) * 100).toFixed(1)
      : 0;

    return {
      ...court,
      totalRevenue: stats?.totalRevenue || 0,
      totalBookings: stats?.totalBookings || 0,
      totalTimeSlots: bookedSlots,
      availableSlots: totalAvailableSlots,
      occupancyRate: parseFloat(occupancyRate),
    };
  });

  res.json({
    success: true,
    data: courtsWithStats,
  });
});

/**
 * API 5: GET /api/analytics/owner/peak-hours
 * Thống kê giờ cao điểm (theo timeSlots)
 */
export const getOwnerPeakHours = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const { startDate, endDate } = parseDateRange(
    req.query.startDate,
    req.query.endDate
  );
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // Lấy tất cả bookings đã thanh toán trong khoảng thời gian
  const bookings = await Booking.find({
    facility: facilityObjectId,
    paymentStatus: "paid",
    date: { $gte: startDate, $lte: endDate },
  }).select("timeSlots totalAmount");

  // Phân tích theo giờ (từ timeSlots)
  const hourStats = {};
  
  bookings.forEach((booking) => {
    booking.timeSlots.forEach((slot) => {
      // Parse time slot: "18:00-19:00" -> lấy giờ bắt đầu "18:00"
      const [startTime] = slot.split("-");
      // startTime đã có format "HH:MM", ta chỉ cần lấy phần giờ và thêm ":00"
      // Ví dụ: "18:00" -> "18:00", "08:00" -> "08:00"
      const hourKey = startTime.trim(); // startTime đã là "HH:MM" format
      
      if (!hourStats[hourKey]) {
        hourStats[hourKey] = {
          hour: hourKey,
          slotCount: 0, // Số lượng time slots đã đặt trong giờ này
          revenue: 0,
        };
      }
      
      // Tính revenue cho slot này (chia đều totalAmount cho số slots)
      const revenuePerSlot = booking.totalAmount / booking.timeSlots.length;
      hourStats[hourKey].slotCount += 1;
      hourStats[hourKey].revenue += revenuePerSlot;
    });
  });

  // Chuyển đổi thành array và sắp xếp theo giờ
  const peakHoursData = Object.values(hourStats)
    .sort((a, b) => a.hour.localeCompare(b.hour))
    .map((stat) => ({
      hour: stat.hour,
      bookings: stat.slotCount, // Số lượng time slots đã đặt trong giờ này
      revenue: Math.round(stat.revenue),
      type: stat.slotCount >= 10 ? "Cao điểm" : stat.slotCount >= 5 ? "Trung bình" : "Thấp điểm",
    }));

  res.json({
    success: true,
    data: {
      startDate,
      endDate,
      peakHours: peakHoursData,
    },
  });
});

/**
 * API 6: GET /api/analytics/owner/loyal-customers
 * Thống kê khách hàng trung thành
 */
export const getOwnerLoyalCustomers = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // Thống kê theo user (chỉ tính booking đã thanh toán)
  const customerStats = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: "$user",
        totalBookings: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
        lastBooking: { $max: "$date" },
      },
    },
    {
      $sort: { totalSpent: -1 },
    },
    {
      $limit: 20, // Top 20 khách hàng
    },
  ]);

  // Populate user info
  const loyalCustomers = await Promise.all(
    customerStats.map(async (stat) => {
      const user = await User.findById(stat._id).select("name email phone");
      
      // Tính loyalty score (dựa trên số lần đặt và tổng chi tiêu)
      const bookingScore = Math.min(stat.totalBookings * 10, 50); // Max 50 điểm
      const spendingScore = Math.min((stat.totalSpent / 1000000) * 10, 50); // Max 50 điểm
      const loyaltyScore = Math.round(bookingScore + spendingScore);
      
      // Xác định tier
      let tier = "Silver";
      if (loyaltyScore >= 80) tier = "VIP";
      else if (loyaltyScore >= 60) tier = "Gold";

      return {
        customer: user?.name || "Khách vãng lai",
        email: user?.email || "",
        phone: user?.phone || "",
        totalBookings: stat.totalBookings,
        totalSpent: stat.totalSpent,
        lastBooking: stat.lastBooking,
        loyaltyScore,
        tier,
      };
    })
  );

  res.json({
    success: true,
    data: loyalCustomers,
  });
});

/**
 * API 7: GET /api/analytics/owner/cancellations
 * Thống kê tỷ lệ hủy theo sân
 */
export const getOwnerCancellations = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const { startDate, endDate } = parseDateRange(
    req.query.startDate,
    req.query.endDate
  );
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // Lấy thông tin các sân
  const courts = await Court.find({ facility: facilityId }).lean();

  // Thống kê booking theo court và status
  const cancellationStats = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          court: "$court",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Tính tỷ lệ hủy cho từng sân
  const courtCancellationMap = new Map();
  
  cancellationStats.forEach((stat) => {
    const courtId = stat._id.court.toString();
    if (!courtCancellationMap.has(courtId)) {
      courtCancellationMap.set(courtId, {
        totalBookings: 0,
        cancelled: 0,
        noShow: 0, // Có thể thêm logic để detect no-show
      });
    }
    
    const stats = courtCancellationMap.get(courtId);
    stats.totalBookings += stat.count;
    
    if (stat._id.status === "cancelled") {
      stats.cancelled += stat.count;
    }
    // Có thể thêm logic để detect no-show (ví dụ: booking confirmed nhưng không đến)
  });

  // Map vào danh sách sân
  const cancellationData = courts.map((court) => {
    const stats = courtCancellationMap.get(court._id.toString()) || {
      totalBookings: 0,
      cancelled: 0,
      noShow: 0,
    };
    
    const cancellationRate = stats.totalBookings > 0
      ? ((stats.cancelled / stats.totalBookings) * 100).toFixed(1)
      : 0;
    
    const noShowRate = stats.totalBookings > 0
      ? ((stats.noShow / stats.totalBookings) * 100).toFixed(1)
      : 0;

    let status = "Tốt";
    if (parseFloat(cancellationRate) > 20) status = "Cần cải thiện";
    else if (parseFloat(cancellationRate) > 10) status = "Trung bình";

    return {
      court: court.name || `Sân ${court.courtNumber || ""}`,
      totalBookings: stats.totalBookings,
      cancelled: stats.cancelled,
      noShow: stats.noShow,
      cancellationRate: parseFloat(cancellationRate),
      noShowRate: parseFloat(noShowRate),
      status,
    };
  });

  res.json({
    success: true,
    data: {
      startDate,
      endDate,
      cancellations: cancellationData,
    },
  });
});