import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import LoyaltyTransaction from "../models/LoyaltyTransaction.js";
import Reward from "../models/Reward.js";
import Facility from "../models/Facility.js";
import Promotion from "../models/Promotion.js";

// === 1. HELPER TÍNH HẠNG ===
const calculateTier = (points) => {
  if (points >= 10000)
    return { id: "diamond", name: "Kim Cương", next: null, multiplier: 1.5 };
  if (points >= 5000)
    return { id: "gold", name: "Vàng", next: 10000, multiplier: 1.2 };
  if (points >= 1000)
    return { id: "silver", name: "Bạc", next: 5000, multiplier: 1.1 };
  return { id: "member", name: "Thành viên", next: 1000, multiplier: 1.0 };
};

const getNextTierId = (currentId) => {
  const map = {
    member: "silver",
    silver: "gold",
    gold: "diamond",
    diamond: null,
  };
  return map[currentId];
};

// === 2. CÁC API CHO NGƯỜI DÙNG (USER) ===

export const getSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const tierInfo = calculateTier(user.lifetimePoints || 0);
  const nextTierId = getNextTierId(tierInfo.id);

  res.json({
    success: true,
    data: {
      current_points: user.loyaltyPoints,
      lifetime_points: user.lifetimePoints,
      current_tier: {
        id: tierInfo.id,
        name: tierInfo.name,
        multiplier: tierInfo.multiplier,
        icon_url: `https://your-domain.com/assets/tiers/${tierInfo.id}.png`,
      },
      next_tier: tierInfo.next
        ? {
            id: nextTierId,
            points_required: tierInfo.next,
            points_missing: tierInfo.next - user.lifetimePoints,
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
  const type = req.query.type;

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

export const getTiers = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "member",
        name: "Thành viên",
        min_points: 0,
        benefits: ["Tích điểm cơ bản (10k = 1 điểm)"],
      },
      {
        id: "silver",
        name: "Bạc",
        min_points: 1000,
        benefits: ["Nhân 1.1 lần điểm tích lũy", "Ưu tiên đặt sân"],
      },
      {
        id: "gold",
        name: "Vàng",
        min_points: 5000,
        benefits: ["Nhân 1.2 lần điểm tích lũy", "Nước uống miễn phí"],
      },
      {
        id: "diamond",
        name: "Kim Cương",
        min_points: 10000,
        benefits: [
          "Nhân 1.5 lần điểm tích lũy",
          "Check-in VIP",
          "Quà tặng đặc biệt",
        ],
      },
    ],
  });
});

// === ĐÂY LÀ HÀM BỊ THIẾU ===
export const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({
    isActive: true,
    $or: [{ stock: null }, { stock: { $gt: 0 } }],
  }).sort({ pointCost: 1 });
  res.json({ success: true, data: rewards });
});
// ==========================

export const getRewardsByFacility = asyncHandler(async (req, res) => {
  const { facilityId } = req.params;

  const rewards = await Reward.find({
    facility: facilityId,
    isActive: true,
    $or: [{ stock: null }, { stock: { $gt: 0 } }],
  }).sort({ pointCost: 1 });

  res.json({ success: true, data: rewards });
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

  if (reward.stock !== null && reward.stock <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Quà tặng đã hết hàng" });
  }

  if (user.loyaltyPoints < reward.pointCost) {
    return res
      .status(400)
      .json({ success: false, message: "Không đủ điểm để đổi quà" });
  }

  user.loyaltyPoints -= reward.pointCost;
  await user.save();

  if (reward.stock !== null) {
    reward.stock -= 1;
    await reward.save();
  }

  await LoyaltyTransaction.create({
    user: user._id,
    type: "REDEEM",
    amount: -reward.pointCost,
    description: `Đổi quà: ${reward.name}`,
    source: { sourceType: "Reward", sourceId: reward._id },
  });

  let rewardData = {};
  if (reward.type === "VOUCHER") {
    const voucherCode = `VOUCHER-${user._id.toString().slice(-4)}-${Date.now()
      .toString()
      .slice(-4)}`;
    rewardData = {
      code: voucherCode,
      value: reward.voucherValue,
      type: reward.voucherType,
    };
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

// === 3. CÁC API CHO CHỦ SÂN (OWNER) ===

export const createReward = asyncHandler(async (req, res) => {
  const {
    facilityId,
    name,
    description,
    pointCost,
    type,
    voucherValue,
    voucherType,
    stock,
    image,
  } = req.body;

  if (!facilityId || !name || !pointCost || !type) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin bắt buộc (facilityId, name, pointCost, type)",
    });
  }

  const facility = await Facility.findById(facilityId);
  if (!facility) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy cơ sở" });
  }

  if (
    facility.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Bạn không phải chủ sở hữu của cơ sở này",
    });
  }

  const newReward = new Reward({
    facility: facilityId,
    name,
    description,
    pointCost,
    type,
    voucherValue: type === "VOUCHER" ? voucherValue : 0,
    voucherType: type === "VOUCHER" ? voucherType : "fixed",
    stock: stock || null,
    image,
  });

  await newReward.save();

  res.status(201).json({
    success: true,
    message: "Tạo quà tặng thành công",
    data: newReward,
  });
});

export const deleteReward = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reward = await Reward.findById(id).populate("facility");
  if (!reward) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy quà tặng" });
  }

  if (
    reward.facility.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Không có quyền truy cập" });
  }

  reward.isActive = false;
  await reward.save();

  res.json({ success: true, message: "Đã xóa (vô hiệu hóa) quà tặng" });
});
