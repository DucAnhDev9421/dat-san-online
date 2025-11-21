import User from "../models/User.js";
import LoyaltyTransaction from "../models/LoyaltyTransaction.js";
import Referral from "../models/Referral.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../socket/index.js";

// === CẤU HÌNH TÍCH ĐIỂM ===
const POINT_CONVERSION_RATE = 10000; // 10.000 VNĐ = 1 điểm cơ bản

// === CẤU HÌNH HẠNG THÀNH VIÊN ===
const TIERS = {
  DIAMOND: { threshold: 10000, multiplier: 1.5, name: "Kim Cương" },
  GOLD: { threshold: 5000, multiplier: 1.2, name: "Vàng" },
  SILVER: { threshold: 1000, multiplier: 1.1, name: "Bạc" },
  MEMBER: { threshold: 0, multiplier: 1.0, name: "Thành viên" },
};

// Helper: Lấy thông tin hạng dựa trên điểm tích lũy trọn đời
const getTierInfo = (lifetimePoints) => {
  if (lifetimePoints >= TIERS.DIAMOND.threshold) return TIERS.DIAMOND;
  if (lifetimePoints >= TIERS.GOLD.threshold) return TIERS.GOLD;
  if (lifetimePoints >= TIERS.SILVER.threshold) return TIERS.SILVER;
  return TIERS.MEMBER;
};

export const processBookingRewards = async (booking) => {
  try {
    console.log(
      `🎁 Processing rewards for booking ${
        booking.bookingCode || booking._id
      }...`
    );

    // === PHẦN 1: TÍNH ĐIỂM THƯỞNG BOOKING ===

    // 1.1. Lấy thông tin user để biết hạng hiện tại
    const user = await User.findById(booking.user);
    if (!user) {
      console.warn(`User not found for booking ${booking._id}`);
      return;
    }

    // 1.2. Tính điểm cơ bản (Làm tròn xuống)
    // Ví dụ: 250.000 / 10.000 = 25 điểm
    const basePoints = Math.floor(booking.totalAmount / POINT_CONVERSION_RATE);

    if (basePoints > 0) {
      // 1.3. Lấy hệ số nhân theo hạng
      const currentTier = getTierInfo(user.lifetimePoints || 0);
      const multiplier = currentTier.multiplier;

      // 1.4. Tính điểm thực nhận
      // Ví dụ: Hạng Bạc (x1.1) -> 25 * 1.1 = 27.5 -> Lấy 27 điểm
      const finalPoints = Math.floor(basePoints * multiplier);

      // 1.5. Cập nhật User
      // loyaltyPoints: Điểm dùng để đổi quà
      // lifetimePoints: Điểm dùng để xét hạng (tăng lên chứ không bao giờ giảm)
      await User.findByIdAndUpdate(user._id, {
        $inc: {
          loyaltyPoints: finalPoints,
          lifetimePoints: finalPoints,
        },
      });

      // 1.6. Lưu lịch sử Loyalty
      await LoyaltyTransaction.create({
        user: user._id,
        type: "EARN",
        amount: finalPoints,
        description: `Tích điểm đặt sân (Hạng ${currentTier.name} - x${multiplier})`,
        source: { sourceType: "Booking", sourceId: booking._id },
        metadata: {
          bookingId: booking._id,
          bookingAmount: booking.totalAmount,
          basePoints: basePoints,
          tierMultiplier: multiplier,
          tierName: currentTier.name,
        },
      });

      // 1.7. Gửi thông báo Socket
      emitToUser(user._id.toString(), "loyalty:update", {
        pointsAdded: finalPoints,
        currentPoints: (user.loyaltyPoints || 0) + finalPoints,
        message: `Bạn nhận được ${finalPoints} điểm thưởng!`,
      });

      console.log(
        `✅ [Reward] User ${user.name} earned ${finalPoints} points.`
      );
    }

    // === PHẦN 2: XỬ LÝ REFERRAL (GIỮ NGUYÊN LOGIC CŨ) ===
    // (Chỉ thưởng nếu đây là đơn hoàn thành ĐẦU TIÊN của người này)

    const referral = await Referral.findOne({
      referee: booking.user,
      status: "PENDING",
    });

    if (referral) {
      console.log(
        `🔗 Found pending referral for user ${booking.user}. Processing...`
      );

      const REFERRAL_REWARD = 500; // Điểm thưởng cố định cho người giới thiệu

      // Cập nhật trạng thái Referral
      referral.status = "COMPLETED";
      referral.completedAt = new Date();
      referral.rewardEarned = REFERRAL_REWARD;
      await referral.save();

      // Cộng điểm cho người giới thiệu (Referrer)
      const referrer = await User.findByIdAndUpdate(referral.referrer, {
        $inc: {
          loyaltyPoints: REFERRAL_REWARD,
          lifetimePoints: REFERRAL_REWARD, // Điểm giới thiệu cũng tính vào hạng
        },
      });

      if (referrer) {
        // Lưu lịch sử Loyalty cho người giới thiệu
        await LoyaltyTransaction.create({
          user: referrer._id,
          type: "EARN",
          amount: REFERRAL_REWARD,
          description: `Thưởng giới thiệu bạn bè thành công`,
          source: { sourceType: "Referral", sourceId: referral._id },
        });

        // Tạo thông báo lưu DB
        await Notification.create({
          user: referrer._id,
          type: "promotion",
          title: "Nhận thưởng giới thiệu",
          message: `Bạn nhận được ${REFERRAL_REWARD} điểm vì bạn bè được giới thiệu đã đặt sân lần đầu!`,
          isRead: false,
          priority: "high",
        });

        // Bắn socket
        emitToUser(referrer._id.toString(), "notification:new", {
          title: "Nhận thưởng giới thiệu",
          message: `Bạn nhận được ${REFERRAL_REWARD} điểm!`,
        });
      }
    }
  } catch (error) {
    console.error("❌ Error processing booking rewards:", error);
    // Không throw error để tránh làm rollback giao dịch thanh toán chính
  }
};
