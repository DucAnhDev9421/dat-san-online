import express from "express";
import * as walletController from "../controllers/walletController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// === CÁC ROUTE WEBHOOK (PUBLIC) ===
// (Phải đặt trước authenticateToken)
router.get("/callback/vnpay", walletController.vnpayCallback);
router.post("/callback/momo", walletController.momoCallback);

// === CÁC ROUTE CẦN ĐĂNG NHẬP ===
router.use(authenticateToken);

// GET /api/wallet/balance - Lấy số dư
router.get("/balance", walletController.getBalance);

// GET /api/wallet/history - Lấy lịch sử giao dịch
router.get("/history", walletController.getHistory);

// POST /api/wallet/top-up - Khởi tạo nạp tiền
router.post("/top-up", walletController.initTopUp);

export default router;
