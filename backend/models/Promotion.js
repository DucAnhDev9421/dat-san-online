import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // Giảm theo % hoặc số tiền cố định
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number, // Giảm tối đa bao nhiêu tiền (dùng cho loại percentage)
      default: 0,
    },
    minOrderValue: {
      type: Number, // Giá trị đơn hàng tối thiểu để áp dụng
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number, // Giới hạn số lần sử dụng (0 là không giới hạn)
      default: 0,
    },
    usedCount: {
      type: Number, // Số lần đã sử dụng
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Áp dụng cho các cơ sở cụ thể (nếu mảng rỗng thì áp dụng toàn hệ thống)
    applicableFacilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Method kiểm tra mã còn hiệu lực không
promotionSchema.methods.isValid = function () {
  const now = new Date();
  if (!this.isActive) return false;
  if (now < this.startDate || now > this.endDate) return false;
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return false;
  return true;
};

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
