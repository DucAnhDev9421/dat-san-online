import mongoose from "mongoose";
import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";

/**
 * Cộng tiền vào ví của người dùng (An toàn)
 * @param {string} userId - ID người dùng
 * @param {number} amount - Số tiền (phải > 0)
 * @param {string} type - Loại giao dịch ('top-up', 'refund', 'adjustment')
 * @param {object} metadata - Thông tin thêm
 */
export const credit = async (userId, amount, type, metadata = {}) => {
  if (amount <= 0) {
    throw new Error("Số tiền phải là số dương");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Cập nhật số dư của User
    // Dùng $inc để đảm bảo an toàn (atomic update)
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: amount } },
      { new: true, session }
    );

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // 2. Tạo bản ghi giao dịch
    const transaction = new WalletTransaction({
      user: userId,
      amount,
      type,
      status: "success",
      metadata,
    });
    await transaction.save({ session });

    await session.commitTransaction();
    return { user, transaction };
  } catch (error) {
    await session.abortTransaction();
    console.error("Lỗi khi cộng tiền vào ví:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Trừ tiền từ ví (Sẽ dùng nếu bạn muốn cho phép 'thanh toán bằng ví')
 * @param {string} userId - ID người dùng
 * @param {number} amount - Số tiền (phải > 0)
 * @param {string} type - Loại giao dịch ('payment', 'adjustment')
 * @param {object} metadata - Thông tin thêm
 */
export const debit = async (userId, amount, type, metadata = {}) => {
  if (amount <= 0) {
    throw new Error("Số tiền phải là số dương");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tìm user VÀ kiểm tra số dư
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    if (user.walletBalance < amount) {
      throw new Error("Số dư không đủ");
    }

    // 2. Cập nhật số dư ($inc với số âm)
    user.walletBalance -= amount;
    await user.save({ session });

    // 3. Tạo bản ghi giao dịch
    const transaction = new WalletTransaction({
      user: userId,
      amount,
      type,
      status: "success",
      metadata,
    });
    await transaction.save({ session });

    await session.commitTransaction();
    return { user, transaction };
  } catch (error) {
    await session.abortTransaction();
    console.error("Lỗi khi trừ tiền ví:", error);
    throw error;
  } finally {
    session.endSession();
  }
};
