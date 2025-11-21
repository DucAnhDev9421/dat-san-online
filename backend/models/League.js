// models/League.js
import mongoose, { Schema } from "mongoose";

const leagueSchema = new mongoose.Schema(
  {
    // Tên giải đấu
    name: {
      type: String,
      required: [true, "Tên giải đấu là bắt buộc"],
      trim: true,
    },
    // Người tạo giải đấu
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Hình thức giải đấu (ví dụ: "Loại Trực Tiếp", "Vòng tròn", "Hỗn hợp")
    format: {
      type: String,
      required: [true, "Hình thức giải đấu là bắt buộc"],
      trim: true,
    },
    // Môn thể thao (ví dụ: "Bóng Đá Sân 11", "Bóng đá", "Bóng chuyền")
    sport: {
      type: String,
      required: [true, "Môn thể thao là bắt buộc"],
      trim: true,
    },
    // Tên người tạo (có thể lưu để hiển thị nhanh)
    creatorName: {
      type: String,
      trim: true,
    },
    // Số điện thoại liên hệ
    phone: {
      type: String,
      trim: true,
    },
    // Loại giải đấu: team (đồng đội) hoặc individual (cá nhân)
    tournamentType: {
      type: String,
      enum: ["team", "individual"],
      default: "individual",
    },
    // Số lượng người mỗi đội
    membersPerTeam: {
      type: Number,
      min: 2,
      max: 20,
    },
    // Ảnh đại diện
    image: {
      type: String,
      default: null,
    },
    // Ảnh banner
    banner: {
      type: String,
      default: null,
    },
    // Ngày bắt đầu
    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu là bắt buộc"],
    },
    // Ngày kết thúc
    endDate: {
      type: Date,
      required: [true, "Ngày kết thúc là bắt buộc"],
    },
    // Địa điểm (tên địa điểm)
    location: {
      type: String,
      trim: true,
    },
    // Địa chỉ chi tiết
    address: {
      type: String,
      trim: true,
    },
    // Số đội tham gia hiện tại
    participants: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Số đội tối đa
    maxParticipants: {
      type: Number,
      required: [true, "Số đội tối đa là bắt buộc"],
      min: 1,
    },
    // Giải thưởng
    prize: {
      type: String,
      trim: true,
    },
    // Trạng thái: upcoming, ongoing, completed, cancelled
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    // Mô tả ngắn
    description: {
      type: String,
      trim: true,
    },
    // Mô tả đầy đủ
    fullDescription: {
      type: String,
      trim: true,
    },
    // Hạn đăng ký
    registrationDeadline: {
      type: Date,
    },
    // Số lượt xem
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Danh sách đội tham gia
    teams: [
      {
        id: {
          type: Number,
        },
        teamNumber: {
          type: String,
          trim: true,
        },
        logo: {
          type: String,
          default: null,
        },
        contactPhone: {
          type: String,
          trim: true,
        },
        contactName: {
          type: String,
          trim: true,
        },
        wins: {
          type: Number,
          default: 0,
        },
        draws: {
          type: Number,
          default: 0,
        },
        losses: {
          type: Number,
          default: 0,
        },
        members: [
          {
            name: {
              type: String,
              trim: true,
            },
            phone: {
              type: String,
              trim: true,
            },
            position: {
              type: String,
              trim: true,
            },
            avatar: {
              type: String,
              default: null,
            },
          },
        ],
      },
    ],
    // Lịch đấu (matches)
    matches: [
      {
        stage: {
          type: String,
          enum: ["semi", "final"],
        },
        matchNumber: {
          type: Number,
        },
        team1Id: {
          type: Number,
        },
        team2Id: {
          type: Number,
        },
        date: {
          type: Date,
        },
        time: {
          type: String,
        },
        score1: {
          type: Number,
          default: null,
        },
        score2: {
          type: Number,
          default: null,
        },
      },
    ],
    // Loại giải đấu: PRIVATE (nội bộ)
    type: {
      type: String,
      enum: ["PRIVATE", "PUBLIC"],
      default: "PRIVATE",
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Index để tìm kiếm nhanh
leagueSchema.index({ creator: 1 });
leagueSchema.index({ status: 1 });
leagueSchema.index({ startDate: 1 });
leagueSchema.index({ createdAt: -1 });

// Middleware để tự động cập nhật số đội tham gia
leagueSchema.pre("save", function (next) {
  if (this.teams && Array.isArray(this.teams)) {
    // Đếm số đội có thông tin đầy đủ (có teamNumber hoặc contactPhone)
    const validTeams = this.teams.filter(
      (team) => team.teamNumber || team.contactPhone
    );
    this.participants = validTeams.length;
  }
  next();
});

// Method để kiểm tra quyền sở hữu
leagueSchema.methods.isOwner = function (userId) {
  return this.creator.toString() === userId.toString();
};

const League = mongoose.model("League", leagueSchema);

export default League;

