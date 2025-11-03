// models/AuditLog.js
import mongoose, { Schema } from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGIN_GOOGLE",
        "LOGOUT",
        "REFRESH_TOKEN",
        "REGISTER",
        "REGISTER_PENDING",
        "VERIFY_OTP",
        "FORGOT_PASSWORD",
        "RESET_PASSWORD",
        "CHANGE_PASSWORD",
        "UPDATE_PROFILE",
        "UPDATE_AVATAR",
        "DELETE_AVATAR",
        "CHANGE_ROLE",
        "LOCK_USER",
        "UNLOCK_USER",
        "DELETE_USER",
        "RESTORE_USER",
        "CREATE_SPORT_CATEGORY",
        "UPDATE_SPORT_CATEGORY",
        "DELETE_SPORT_CATEGORY",
        "CREATE_COURT_TYPE",
        "UPDATE_COURT_TYPE",
        "DELETE_COURT_TYPE",
      ],
    },
    ipAddress: {
      type: String,
    },
    details: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });

export default mongoose.model("AuditLog", auditLogSchema);
