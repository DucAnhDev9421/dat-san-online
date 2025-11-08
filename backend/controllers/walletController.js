import asyncHandler from "express-async-handler";
import crypto from "crypto";
import qs from "qs";
import { format } from "date-fns";
import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { config } from "../config/config.js";

// Hàm helper sắp xếp object (lấy từ paymentController)
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

/**
 * GET /api/wallet/balance
 * Lấy số dư ví
 */
export const getBalance = asyncHandler(async (req, res) => {
  // req.user được lấy từ authenticateToken
  const user = await User.findById(req.user._id).select("walletBalance");
  res.json({
    success: true,
    data: {
      balance: user.walletBalance,
    },
  });
});

/**
 * GET /api/wallet/history
 * Lấy lịch sử giao dịch ví (có phân trang)
 */
export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };

  const transactions = await WalletTransaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await WalletTransaction.countDocuments(filter);

  res.json({
    success: true,
    data: transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * POST /api/wallet/top-up
 * Khởi tạo giao dịch nạp tiền (Momo, VNPay)
 */
export const initTopUp = asyncHandler(async (req, res) => {
  const { amount, method } = req.body;
  const user = req.user;

  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Số tiền không hợp lệ" });
  }
  if (!["momo", "vnpay"].includes(method)) {
    return res
      .status(400)
      .json({ success: false, message: "Phương thức không hợp lệ" });
  }

  // 1. Tạo một giao dịch ví (WalletTransaction) ở trạng thái PENDING
  const transaction = new WalletTransaction({
    user: user._id,
    amount,
    type: "top-up",
    status: "pending",
    metadata: {
      topUpMethod: method,
    },
  });
  await transaction.save();

  // 2. Sử dụng _id của transaction làm mã giao dịch (paymentId)
  const paymentId = `WALLET_${transaction._id.toString()}`;
  const orderInfo = `Nap tien vao vi ${user.email} - ${transaction._id}`;

  // 3. Xử lý logic cổng thanh toán (tương tự paymentController)

  if (method === "vnpay") {
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const tmnCode = config.vnpay.tmnCode;
    const secretKey = config.vnpay.hashSecret;
    const vnpUrl = config.vnpay.url;
    // GHI CHÚ: returnUrl phải trỏ về một callback DÀNH RIÊNG CHO VÍ
    const returnUrl = `http://localhost:3000/api/wallet/callback/vnpay`;
    const createDate = format(new Date(), "yyyyMMddHHmmss");

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = paymentId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100; // VNPay * 100
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl =
      vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });
    res.status(200).json({ success: true, paymentUrl });
  } else if (method === "momo") {
    // Tương tự, bạn cần một IPN (notifyUrl) DÀNH RIÊNG CHO VÍ
    const ipnUrl = `http://localhost:3000/api/wallet/callback/momo`;
    // ... (Toàn bộ logic tạo signature của Momo như trong paymentController) ...

    // (Giả lập logic Momo - bạn có thể copy từ paymentController)
    res
      .status(501)
      .json({
        success: false,
        message: "Momo top-up chưa được triển khai (cần tạo IPN riêng)",
      });
  }
});

/**
 * POST /api/wallet/callback/momo
 * Webhook (IPN) nạp tiền từ Momo
 */
export const momoCallback = asyncHandler(async (req, res) => {
  // ... (Logic xác thực chữ ký của Momo) ...

  const { orderId, resultCode, transId } = req.body; // orderId là paymentId

  // Tách lấy transactionId từ "WALLET_..."
  const transactionId = orderId.replace("WALLET_", "");

  if (resultCode === 0) {
    // Nạp tiền thành công
    const transaction = await WalletTransaction.findById(transactionId);
    if (transaction && transaction.status === "pending") {
      // Dùng service để cộng tiền và lưu lịch sử
      await credit(transaction.user, transaction.amount, "top-up", {
        ...transaction.metadata,
        transactionCode: transId,
      });
      // Xóa giao dịch pending (vì credit đã tạo giao dịch success mới)
      // Hoặc cập nhật status (tùy logic của bạn)
      transaction.status = "success";
      transaction.metadata.transactionCode = transId;
      await transaction.save();
    }
  } else {
    // Thất bại
    await WalletTransaction.findByIdAndUpdate(transactionId, {
      status: "failed",
    });
  }

  res.status(204).send(); // Phản hồi cho Momo
});

/**
 * GET /api/wallet/callback/vnpay
 * Webhook (IPN) nạp tiền từ VNPay
 */
export const vnpayCallback = asyncHandler(async (req, res) => {
  // ... (Logic xác thực chữ ký VNPay) ...

  const vnp_Params = req.query;
  const paymentId = vnp_Params["vnp_TxnRef"];
  const responseCode = vnp_Params["vnp_ResponseCode"];
  const transactionCode = vnp_Params["vnp_TransactionNo"];

  const transactionId = paymentId.replace("WALLET_", "");

  if (responseCode === "00") {
    // Nạp tiền thành công
    const transaction = await WalletTransaction.findById(transactionId);
    if (transaction && transaction.status === "pending") {
      // Cộng tiền
      await credit(transaction.user, transaction.amount, "top-up", {
        ...transaction.metadata,
        transactionCode: transactionCode,
      });
      // Cập nhật giao dịch
      transaction.status = "success";
      transaction.metadata.transactionCode = transactionCode;
      await transaction.save();
    }
    res.redirect(`${config.momo.redirectUrl}?success=true&type=wallet_topup`);
  } else {
    // Thất bại
    await WalletTransaction.findByIdAndUpdate(transactionId, {
      status: "failed",
    });
    res.redirect(`${config.momo.redirectUrl}?success=false&type=wallet_topup`);
  }
});
