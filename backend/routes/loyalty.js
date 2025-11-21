import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getSummary,
  getHistory,
  getRewards,
  getTiers,
  redeemReward,
  createReward,
  getRewardsByFacility,
} from "../controllers/loyaltyController.js";

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả các route bên dưới
router.use(authenticateToken);

// === Các Route cho User ===
router.get("/summary", getSummary);
router.get("/transactions", getHistory);
router.get("/rewards", getRewards); // Lấy danh sách quà chung (nếu có)
router.get("/tiers", getTiers);
router.post("/redeem", redeemReward);
router.get("/rewards/facility/:facilityId", getRewardsByFacility);

// === Route cho Owner (Tạo quà) ===
// (authenticateToken đã được dùng chung ở trên nên không cần khai báo lại,
// nhưng nếu muốn chắc chắn quyền Owner thì logic đó đã nằm trong controller)
router.post("/rewards", createReward);

export default router;
