import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

// Tất cả các route thanh toán đều cần đăng nhập
router.use(authenticateToken);

// --- Giai đoạn 2 ---
// POST /api/payments/init - Khởi tạo payment (Momo, VNPay)
router.post("/init", paymentController.initPayment);

// --- Giai đoạn 2 ---
// POST /api/payments/callback/vnpay - Webhook callback VNPay
router.get("/callback/vnpay", paymentController.vnpayCallback); // VNPay dùng GET cho returnUrl

// POST /api/payments/callback/momo - Webhook callback Momo
router.post("/callback/momo", paymentController.momoCallback);

// --- Giai đoạn 1 ---
// POST /api/payments/cash - Thanh toán tiền mặt (owner/admin)
router.post(
  "/cash",
  authorize("owner", "admin"),
  paymentController.paymentCash
);

// GET /api/payments/history - Lịch sử thanh toán (của tôi)
router.get("/history", paymentController.getPaymentHistory);

// GET /api/payments/:paymentId/status - Status thanh toán
router.get("/:paymentId/status", paymentController.getPaymentStatus);

// POST /api/payments/:paymentId/refund - Hoàn tiền (owner/admin)
router.post(
  "/:paymentId/refund",
  authorize("owner", "admin"),
  paymentController.refundPayment
);

export default router;
