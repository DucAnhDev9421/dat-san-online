// models/Court.js
import mongoose, { Schema } from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    // Tham chiếu đến Facility (cơ sở chứa sân)
    facility: {
      type: Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Cơ sở là bắt buộc"],
    },
    name: {
      type: String,
      required: [true, "Tên sân là bắt buộc"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Loại sân là bắt buộc"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Sức chứa là bắt buộc"],
      min: [1, "Sức chứa phải lớn hơn 0"],
    },
    price: {
      type: Number,
      required: [true, "Giá thuê là bắt buộc"],
      min: [0, "Giá thuê không được âm"],
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
    },
    // Dịch vụ của sân
    services: [
      {
        type: String,
        trim: true,
      },
    ],
    // Hình ảnh của sân
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    maintenance: {
      type: String,
      default: "Không có lịch bảo trì",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để tối ưu hóa tìm kiếm
courtSchema.index({ facility: 1 });
courtSchema.index({ status: 1 });
courtSchema.index({ type: 1 });
courtSchema.index({ name: "text" }); // Hỗ trợ tìm kiếm text

export default mongoose.model("Court", courtSchema);

