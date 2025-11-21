import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    // Cơ sở cung cấp phần thưởng
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    //  Tên phần thưởng
    name: { type: String, required: true },
    description: { type: String },
    pointCost: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      enum: ["VOUCHER", "ITEM", "SERVICE"],
      required: true,
    },
    // Giá trị voucher (nếu là loại VOUCHER)
    voucherValue: { type: Number, default: 0 },
    voucherType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },

    isActive: { type: Boolean, default: true },
    stock: { type: Number, default: null }, // null = vô hạn
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
