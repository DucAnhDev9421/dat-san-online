import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Court from "../models/Court.js";
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
 * Thống kê từng sân: lượt đặt, doanh thu
 */
export const getOwnerCourts = asyncHandler(async (req, res) => {
  const facilityId = req.facilityId;
  const facilityObjectId = new mongoose.Types.ObjectId(facilityId);

  // 1. Lấy thông tin các sân
  const courts = await Court.find({ facility: facilityId }).lean();

  // 2. Lấy thống kê booking (chỉ tính các booking đã trả tiền)
  const courtStats = await Booking.aggregate([
    {
      $match: {
        facility: facilityObjectId,
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: "$court", // Nhóm theo courtId
        totalRevenue: { $sum: "$totalAmount" },
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  // 3. Map (ánh xạ) thống kê vào danh sách sân
  const statsMap = new Map(
    courtStats.map((stat) => [stat._id.toString(), stat])
  );

  const courtsWithStats = courts.map((court) => {
    const stats = statsMap.get(court._id.toString());
    return {
      ...court,
      totalRevenue: stats?.totalRevenue || 0,
      totalBookings: stats?.totalBookings || 0,
    };
  });

  res.json({
    success: true,
    data: courtsWithStats,
  });
});
