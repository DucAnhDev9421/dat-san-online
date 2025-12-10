import asyncHandler from "express-async-handler";
import SystemConfig from "../models/SystemConfig.js";
import { clearConfigCache } from "../utils/systemConfigService.js";

/**
 * GET /api/system-config
 * Lấy cấu hình hệ thống (chỉ admin)
 */
export const getSystemConfig = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Chỉ admin mới có quyền xem cấu hình hệ thống",
    });
  }

  const config = await SystemConfig.getConfig();

  res.json({
    success: true,
    data: {
      platformFee: config.platformFee,
      serviceFeePercent: config.platformFee * 100, // Convert sang phần trăm cho frontend
    },
  });
});

/**
 * PUT /api/system-config
 * Cập nhật cấu hình hệ thống (chỉ admin)
 */
export const updateSystemConfig = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Chỉ admin mới có quyền cập nhật cấu hình hệ thống",
    });
  }

  const { platformFee, serviceFeePercent } = req.body;

  // Hỗ trợ cả platformFee (0-1) và serviceFeePercent (0-100)
  let feeValue;
  if (serviceFeePercent !== undefined) {
    feeValue = serviceFeePercent / 100; // Convert từ phần trăm sang decimal
  } else if (platformFee !== undefined) {
    feeValue = platformFee;
  } else {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp platformFee hoặc serviceFeePercent",
    });
  }

  // Validate
  if (feeValue < 0 || feeValue > 1) {
    return res.status(400).json({
      success: false,
      message: "Phí dịch vụ phải từ 0% đến 100%",
    });
  }

  // Lấy hoặc tạo config
  let config = await SystemConfig.findOne();
  if (!config) {
    config = new SystemConfig({ platformFee: feeValue });
  } else {
    config.platformFee = feeValue;
  }

  await config.save();

  // Xóa cache để các request sau sẽ lấy giá trị mới
  clearConfigCache();

  res.json({
    success: true,
    message: "Cập nhật cấu hình hệ thống thành công",
    data: {
      platformFee: config.platformFee,
      serviceFeePercent: config.platformFee * 100,
    },
  });
});

