import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import LoyaltyTransaction from "../models/LoyaltyTransaction.js";
import Reward from "../models/Reward.js";
import Promotion from "../models/Promotion.js"; // Tận dụng model Promotion có sẵn để tạo Voucher

// Helper tính hạng
const calculateTier = (points) => {
  if (points >= 10000) return { id: "gold", name: "Vàng", next: null };
  if (points >= 5000) return { id: "silver", name: "Bạc", next: 10000 };
  return { id: "bronze", name: "Đồng", next: 5000 };
};

export const getSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const tierInfo = calculateTier(user.lifetimePoints);

  res.json({
    success: true,
    data: {
      current_points: user.loyaltyPoints,
      lifetime_points: user.lifetimePoints,
      current_tier: {
        id: tierInfo.id,
        name: tierInfo.name,
        icon_url: `https://your-domain.com/assets/tiers/${tierInfo.id}.png`, // Mock URL
      },
      next_tier: tierInfo.next
        ? {
            id: tierInfo.id === "bronze" ? "silver" : "gold",
            points_required: tierInfo.next,
            progress_percentage: Math.min(
              100,
              (user.lifetimePoints / tierInfo.next) * 100
            ),
          }
        : null,
    },
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const type = req.query.type; // EARN hoặc REDEEM

  const query = { user: req.user._id };
  if (type) query.type = type;

  const transactions = await LoyaltyTransaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await LoyaltyTransaction.countDocuments(query);

  res.json({
    success: true,
    data: { transactions, pagination: { page, limit, total } },
  });
});

export const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({ isActive: true });
  res.json({ success: true, data: rewards });
});

export const getTiers = asyncHandler(async (req, res) => {
  // Dữ liệu tĩnh hoặc lấy từ DB cấu hình
  res.json({
    success: true,
    data: [
      { id: "bronze", name: "Đồng", min_points: 0, benefits: ["Tích điểm 1%"] },
      {
        id: "silver",
        name: "Bạc",
        min_points: 5000,
        benefits: ["Tích điểm 2%", "Ưu tiên đặt sân"],
      },
      {
        id: "gold",
        name: "Vàng",
        min_points: 10000,
        benefits: ["Tích điểm 3%", "Nước uống miễn phí"],
      },
    ],
  });
});

export const redeemReward = asyncHandler(async (req, res) => {
  const { rewardId } = req.body;
  const user = await User.findById(req.user._id);
  const reward = await Reward.findById(rewardId);

  if (!reward || !reward.isActive) {
    return res
      .status(404)
      .json({ success: false, message: "Quà không tồn tại hoặc đã hết hạn" });
  }

  if (user.loyaltyPoints < reward.pointCost) {
    return res
      .status(400)
      .json({ success: false, message: "Không đủ điểm để đổi quà" });
  }

  // 1. Trừ điểm User
  user.loyaltyPoints -= reward.pointCost;
  await user.save();

  // 2. Lưu lịch sử giao dịch
  await LoyaltyTransaction.create({
    user: user._id,
    type: "REDEEM",
    amount: -reward.pointCost,
    description: `Đổi quà: ${reward.name}`,
    source: { sourceType: "Reward", sourceId: reward._id },
  });

  // 3. Xử lý trao quà (Ví dụ: Tạo Voucher vào ví voucher của user)
  // Ở đây ta sẽ mock việc tạo voucher bằng cách tạo một Promotion code riêng cho user
  let rewardData = {};
  if (reward.type === "VOUCHER") {
    // Tạo mã voucher unique
    const voucherCode = `VOUCHER-${user._id.toString().slice(-4)}-${Date.now()
      .toString()
      .slice(-4)}`;

    // Lưu vào bảng Promotion (hoặc bảng UserVoucher riêng nếu có)
    // Giả sử hệ thống Promotion của bạn hỗ trợ
    // const newVoucher = await Promotion.create({...})

    rewardData = { code: voucherCode, value: reward.voucherValue };
  }

  res.json({
    success: true,
    message: "Đổi quà thành công",
    data: {
      remaining_points: user.loyaltyPoints,
      reward_detail: rewardData,
    },
  });
});
