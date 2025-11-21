import express from "express";
import * as loyaltyController from "../controllers/loyaltyController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/summary", loyaltyController.getSummary);
router.get("/transactions", loyaltyController.getHistory);
router.get("/rewards", loyaltyController.getRewards);
router.get("/tiers", loyaltyController.getTiers);
router.post("/redeem", loyaltyController.redeemReward);

export default router;
