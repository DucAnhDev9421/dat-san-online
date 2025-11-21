// models/Booking.js
import mongoose, { Schema } from "mongoose";
import BookingSequence from "./BookingSequence.js";

const bookingSchema = new mongoose.Schema(
  {
    // User đặt sân
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người dùng là bắt buộc"],
    },

    // Sân được đặt
    court: {
      type: Schema.Types.ObjectId,
      ref: "Court",
      required: [true, "Sân là bắt buộc"],
    },

    // Cơ sở chứa sân
    facility: {
      type: Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Cơ sở là bắt buộc"],
    },

    // Ngày đặt sân
    date: {
      type: Date,
      required: [true, "Ngày là bắt buộc"],
    },

    // Các khung giờ đặt (ví dụ: ["18:00-19:00", "19:00-20:00"])
    timeSlots: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    // Trạng thái booking
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // Trạng thái thanh toán
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      enum: ["momo", "vnpay", "cash", "payos", "wallet"],
      default: null,
    },

    // Tổng tiền
    totalAmount: {
      type: Number,
      required: [true, "Tổng tiền là bắt buộc"],
      min: [0, "Tổng tiền không được âm"],
    },

    // Thông tin liên hệ
    contactInfo: {
      name: {
        type: String,
        required: [true, "Tên người đặt là bắt buộc"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Số điện thoại là bắt buộc"],
        trim: true,
        match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      notes: {
        type: String,
        trim: true,
      },
    },

    // Thời gian hủy (nếu có)
    cancelledAt: {
      type: Date,
      default: null,
    },

    // Lý do hủy
    cancellationReason: {
      type: String,
      trim: true,
    },

    // Thời gian hoàn thành
    completedAt: {
      type: Date,
      default: null,
    },

    // Ghi chú từ chủ sân
    ownerNotes: {
      type: String,
      trim: true,
    },
    // Mã đặt sân (format: BK-YYYYMMDD-XXXX)
    bookingCode: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng unique nếu có giá trị
      trim: true,
      uppercase: true,
    },
    // Mã QR điện tử Booking (base64)
    qrCode: {
      type: String,
      default: null,
    },
    // Thời điểm check-in tại cơ sở
    checkedInAt: {
      type: Date,
      default: null,
    },
    // Người thực hiện check-in (owner/admin)
    checkedInBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes để tối ưu hóa tìm kiếm
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ facility: 1, date: 1 }); // Compound index cho facility và date (cũng hỗ trợ query theo date)
bookingSchema.index({ court: 1, date: 1 }); // Compound index cho court và date (cũng hỗ trợ query theo date)
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
// Note: bookingCode index được tạo tự động bởi unique: true trong field definition
// Note: date index không cần thiết vì đã có trong compound indexes ở trên

// Pre-save hook để generate booking code
bookingSchema.pre("save", async function (next) {
  // Chỉ generate nếu chưa có bookingCode và đây là document mới
  if (!this.bookingCode && this.isNew) {
    try {
      // Lấy ngày từ createdAt hoặc date
      const date = this.createdAt || this.date || new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

      // Get or create sequence for today
      let sequence = await BookingSequence.findOneAndUpdate(
        { date: dateStr },
        { $inc: { sequence: 1 } },
        { upsert: true, new: true }
      );

      const seqNum = sequence.sequence.toString().padStart(4, "0");
      this.bookingCode = `BK-${dateStr}-${seqNum}`;
    } catch (error) {
      // Nếu có lỗi, vẫn tiếp tục nhưng không có bookingCode
      console.error("Error generating booking code:", error);
    }
  }
  next();
});

// Virtual field để lấy tổng số khung giờ
bookingSchema.virtual("duration").get(function () {
  return this.timeSlots.length;
});

// Virtual method để lấy display code (fallback về _id nếu không có bookingCode)
bookingSchema.virtual("displayCode").get(function () {
  return this.bookingCode || this._id.toString().slice(-8).toUpperCase();
});

// Method để check xem booking có đang pending không
bookingSchema.methods.isPending = function () {
  return this.status === "pending";
};

// Method để check xem booking có thể cancel không
bookingSchema.methods.canCancel = function () {
  return this.status === "pending" || this.status === "confirmed";
};

// Method để check xem booking có thể refund không
bookingSchema.methods.isEligibleForRefund = function () {
  return this.paymentStatus === "paid" && this.canCancel();
};

// Static method để lấy bookings theo user
bookingSchema.statics.findByUser = function (userId, filters = {}) {
  return this.find({ user: userId, ...filters })
    .populate("court", "name type price")
    .populate("facility", "name address location")
    .sort({ createdAt: -1 });
};

// Static method để lấy bookings theo facility
bookingSchema.statics.findByFacility = function (facilityId, filters = {}) {
  return this.find({ facility: facilityId, ...filters })
    .populate("court", "name type price")
    .populate("user", "name email phone avatar")
    .sort({ date: 1, createdAt: -1 });
};

// Static method để check availability
bookingSchema.statics.checkAvailability = async function (
  courtId,
  date,
  timeSlots
) {
  const bookings = await this.find({
    court: courtId,
    date: new Date(date),
    status: { $in: ["pending", "confirmed"] },
    timeSlots: { $in: timeSlots },
  });

  return bookings.length === 0;
};

export default mongoose.model("Booking", bookingSchema);
