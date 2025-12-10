import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema(
  {
    // Platform fee (phí dịch vụ) - từ 0 đến 1 (ví dụ: 0.1 = 10%)
    platformFee: {
      type: Number,
      default: 0.1, // 10% mặc định
      min: 0,
      max: 1,
      required: true,
    },
    // Các settings khác có thể thêm sau
    // siteName, siteDescription, logo, etc.
  },
  {
    timestamps: true,
  }
);

// Chỉ cho phép 1 document duy nhất
systemConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = new this({ platformFee: 0.1 });
    await config.save();
  }
  return config;
};

export default mongoose.model("SystemConfig", systemConfigSchema);

