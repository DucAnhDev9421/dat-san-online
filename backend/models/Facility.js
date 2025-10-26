// models/Facility.js
import mongoose, { Schema } from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên cơ sở là bắt buộc"],
      trim: true,
    },
    // Owner (chủ cơ sở)
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
      trim: true,
    },
    // Ví dụ: 'Sân 5', 'Sân 7', 'Sân 11'
    type: {
      type: String,
      required: [true, "Loại cơ sở là bắt buộc"],
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: [true, "Giá mỗi giờ là bắt buộc"],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    // Trạng thái của cơ sở
    status: {
      type: String,
      enum: ["opening", "closed", "maintenance"],
      default: "opening",
    },
    // Mảng chứa các URL hình ảnh của cơ sở (liên kết với FieldImages)
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Tùy chọn, nếu dùng Cloudinary
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes để tối ưu hóa tìm kiếm
facilitySchema.index({ owner: 1 });
facilitySchema.index({ location: "text", name: "text" }); // Hỗ trợ tìm kiếm text
facilitySchema.index({ type: 1 });

export default mongoose.model("Facility", facilitySchema);
