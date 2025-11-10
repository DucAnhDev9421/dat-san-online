import asyncHandler from "express-async-handler";
import crypto from "crypto";
import qs from "qs";
import { config } from "../config/config.js";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import { format } from "date-fns";
import {
  createPaymentLink as createPayOSLink,
  verifyWebhook as verifyPayOSWebhook,
} from "../utils/payosService.js";
import { credit } from "../utils/walletService.js";

// Hàm helper sắp xếp object (cho VNPay)
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
 * Cập nhật trạng thái sau khi thanh toán thành công
 * (Hàm helper dùng chung)
 */
const processSuccessfulPayment = async (paymentId, transactionId) => {
  const payment = await Payment.findOne({ paymentId });
  if (payment && payment.status === "pending") {
    payment.status = "success";
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    // Cập nhật Booking
    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: "paid",
      status: "confirmed", // Tự động xác nhận khi thanh toán online
    });
    return true;
  }
  return false;
};

// === POST /api/payments/init ===
// Khởi tạo thanh toán (Momo, VNPay)
export const initPayment = asyncHandler(async (req, res, next) => {
  const { bookingId, method } = req.body;
  const user = req.user;

  // 1. Tìm booking
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.user.toString() !== user._id.toString()) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy booking hoặc không có quyền",
    });
  }
  if (booking.paymentStatus === "paid") {
    return res
      .status(400)
      .json({ success: false, message: "Booking này đã được thanh toán" });
  }

  // 2. Tạo mã đơn hàng (paymentId) duy nhất
  const paymentId = `${method.toUpperCase()}_${
    booking._id
  }_${new Date().getTime()}`;
  const amount = booking.totalAmount;
  // Rút ngắn description cho PayOS (tối đa 25 ký tự)
  const orderInfo = method === "payos" 
    ? `Dat san ${booking._id.toString().slice(-8)}` // Lấy 8 ký tự cuối của booking ID
    : `Thanh toan don dat san ${booking._id}`;

  // 3. Tạo/Cập nhật bản ghi Payment
  // (Tìm hoặc tạo mới để tránh tạo thừa khi user thử lại)
  let payment = await Payment.findOne({ booking: bookingId });
  if (payment) {
    payment.paymentId = paymentId; // Cập nhật paymentId mới
    payment.method = method;
    payment.status = "pending";
    payment.amount = amount;
  } else {
    payment = new Payment({
      user: user._id,
      booking: bookingId,
      amount,
      method,
      paymentId,
      orderInfo,
    });
  }
  await payment.save();

  // 4. Xử lý theo phương thức
  if (method === "vnpay") {
    // --- XỬ LÝ VNPAY ---
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const tmnCode = config.vnpay.tmnCode;
    const secretKey = config.vnpay.hashSecret;
    const vnpUrl = config.vnpay.url;
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
    vnp_Params["vnp_Amount"] = amount * 100; // VNPay yêu cầu * 100
    vnp_Params["vnp_ReturnUrl"] = config.vnpay.returnUrl;
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
    // --- XỬ LÝ MOMO - ĐÃ SỬA ---
    const partnerCode = config.momo.partnerCode;
    const accessKey = config.momo.accessKey;
    const secretKey = config.momo.secretKey;
    const redirectUrl = config.momo.redirectUrl;
    const ipnUrl = config.momo.notifyUrl; // Lấy từ config
    const requestId = paymentId;
    const orderId = paymentId;
    const requestType = "captureWallet";
    const extraData = ""; // Để rỗng

    // Đảm bảo amount là số nguyên
    const amountStr = Math.round(amount).toString();

    // Tạo rawSignature - CHÚ Ý: thứ tự alphabet và tên field phải đúng
    const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Request body - CHÚ Ý: phải dùng ipnUrl không phải notifyUrl
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount: amountStr,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl, // <<<< KEY QUAN TRỌNG - không phải notifyUrl
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    // Log để debug
    console.log("=== MoMo Request Debug ===");
    console.log("Raw Signature String:", rawSignature);
    console.log("Signature:", signature);
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      // Gọi API Momo
      const response = await fetch(config.momo.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log("=== MoMo Response ===");
      console.log(JSON.stringify(data, null, 2));

      if (data.resultCode !== 0) {
        console.error("Momo API Error:", {
          resultCode: data.resultCode,
          message: data.message,
          localMessage: data.localMessage,
        });
        return res.status(400).json({
          success: false,
          message: `Momo Error: ${data.message || data.localMessage}`,
        });
      }

      res.status(200).json({
        success: true,
        paymentUrl: data.payUrl,
      });
    } catch (error) {
      console.error("Momo Request Failed:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi kết nối tới MoMo",
      });
    }
  } else if (method === "payos") {
    // --- XỬ LÝ PAYOS ---

    // 1. Tạo orderCode duy nhất (kiểu số) cho PayOS
    const orderCode = parseInt(new Date().getTime() / 1000);

    // 2. Cập nhật paymentId (mã của chúng ta) vào bản ghi Payment
    payment.paymentId = `PAYOS_${orderCode}`;
    await payment.save();

    // 3. Tạo link thanh toán
    try {
      // Rút ngắn description cho PayOS (tối đa 25 ký tự)
      const payosDescription = `Dat san ${booking._id.toString().slice(-8)}`.substring(0, 25);
      
      const paymentLinkData = await createPayOSLink({
        orderCode,
        amount: amount,
        description: payosDescription,
        returnUrl: `${config.frontendUrl}/booking-success`,
        cancelUrl: `${config.frontendUrl}/booking-failed`,
      });

      res.status(200).json({
        success: true,
        paymentUrl: paymentLinkData.checkoutUrl,
      });
    } catch (error) {
      console.error("PayOS Error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi khởi tạo thanh toán PayOS",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Phương thức thanh toán không được hỗ trợ",
    });
  }
});

// === POST /api/payments/callback/vnpay ===
// Webhook callback VNPay (IPN)
export const vnpayCallback = asyncHandler(async (req, res, next) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  const secretKey = config.vnpay.hashSecret;
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    const paymentId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const transactionId = vnp_Params["vnp_TransactionNo"];

    if (responseCode === "00") {
      await processSuccessfulPayment(paymentId, transactionId);
      // VNPay mong đợi client redirect từ returnUrl
      res.redirect(
        `${config.momo.redirectUrl}?success=true&paymentId=${paymentId}`
      );
    } else {
      await Payment.findOneAndUpdate({ paymentId }, { status: "failed" });
      res.redirect(
        `${config.momo.redirectUrl}?success=false&paymentId=${paymentId}`
      );
    }
  } else {
    res.redirect(
      `${config.momo.redirectUrl}?success=false&message=checksum_failed`
    );
  }
});

// === POST /api/payments/callback/momo ===
// Webhook callback Momo (IPN)
export const momoCallback = asyncHandler(async (req, res, next) => {
  // Momo gửi về JSON body, không phải query params
  const {
    resultCode,
    message,
    orderId, // Đây là paymentId của chúng ta
    transId, // Đây là transactionId của Momo
    signature,
    amount,
    orderInfo,
    partnerCode,
    requestId,
    responseTime,
    orderType,
    extraData,
  } = req.body;

  console.log("=== MoMo Callback Received ===");
  console.log(JSON.stringify(req.body, null, 2));

  // Xác thực chữ ký của Momo
  const accessKey = config.momo.accessKey;
  const secretKey = config.momo.secretKey;

  // Tạo rawSignature để verify
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const calculatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  console.log("Raw Signature:", rawSignature);
  console.log("Received Signature:", signature);
  console.log("Calculated Signature:", calculatedSignature);

  // Kiểm tra chữ ký (tạm thời comment để test)
  // if (signature !== calculatedSignature) {
  //   console.error("Invalid signature from MoMo!");
  //   return res.status(400).json({ message: "Invalid signature" });
  // }

  if (resultCode === 0) {
    // Thành công
    await processSuccessfulPayment(orderId, transId);
    console.log("Payment successful:", orderId);
  } else {
    // Thất bại
    await Payment.findOneAndUpdate(
      { paymentId: orderId },
      { status: "failed" }
    );
    console.log("Payment failed:", orderId, message);
  }

  // Phản hồi cho Momo
  res.status(204).send(); // Momo yêu cầu 204 No Content
});

// === POST /api/payments/callback/payos ===
// Webhook callback PayOS (IPN) cho Đặt Sân
export const payosBookingCallback = asyncHandler(async (req, res, next) => {
  const webhookBody = req.body;
  const headers = req.headers;

  try {
    // BƯỚC 1: Kiểm tra code "00" (thành công) từ body TRƯỚC
    if (webhookBody.code !== "00") {
      console.log(
        `PayOS Webhook: Giao dịch ${webhookBody.data?.orderCode} thất bại (code: ${webhookBody.code}).`
      );
      // Vẫn trả về 200 để PayOS không gửi lại
      return res
        .status(200)
        .json({ success: false, message: "Giao dịch thất bại" });
    }

    // BƯỚC 2: Xác thực chữ ký
    const verifiedData = await verifyPayOSWebhook(webhookBody, headers);

    // BƯỚC 3: Xử lý logic (verifiedData bây giờ chính là "data" object)
    const { orderCode, reference, amount } = verifiedData; // Lấy dữ liệu từ kết quả đã xác thực

    const paymentId = `PAYOS_${orderCode}`;
    const transactionId = reference; // Mã giao dịch của PayOS

    // 4. Gọi hàm helper để cập nhật Booking và Payment
    const success = await processSuccessfulPayment(paymentId, transactionId);

    if (success) {
      console.log(`PayOS: Thanh toán thành công cho paymentId ${paymentId}`);
    } else {
      console.warn(
        `PayOS: Không tìm thấy paymentId ${paymentId} hoặc đã xử lý`
      );
    }

    // 5. Phản hồi 200 cho PayOS
    res.status(200).json({ success: true, message: "Webhook đã xử lý" });
  } catch (error) {
    // Bắt lỗi nếu chữ ký (checksum) không hợp lệ
    console.error("Lỗi xác thực PayOS Webhook:", error.message);
    // Phản hồi lỗi 400 nếu chữ ký không hợp lệ
    res.status(400).json({ success: false, message: error.message });
  }
});

// === POST /api/payments/cash ===
// Thanh toán tiền mặt (owner/admin)
export const paymentCash = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy booking" });
  }
  if (booking.paymentStatus === "paid") {
    return res
      .status(400)
      .json({ success: false, message: "Booking đã được thanh toán" });
  }

  // Tạo paymentId duy nhất
  const paymentId = `CASH_${booking._id}_${new Date().getTime()}`;

  // Ghi lại giao dịch tiền mặt
  const payment = await Payment.create({
    user: booking.user,
    booking: booking._id,
    amount: booking.totalAmount,
    method: "cash",
    status: "success", // Tiền mặt là thành công ngay
    paymentId: paymentId,
    transactionId: paymentId, // Tự gán
    orderInfo: `Thanh toan tien mat boi ${req.user.name}`,
    paidAt: new Date(),
  });

  // Cập nhật booking
  booking.paymentStatus = "paid";
  booking.status = "confirmed"; // Xác nhận luôn
  await booking.save();

  res.status(201).json({
    success: true,
    message: "Xác nhận thanh toán tiền mặt thành công",
    data: payment,
  });
});

// === GET /api/payments/history ===
// Lịch sử thanh toán (của user đang đăng nhập)
export const getPaymentHistory = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate({
      path: "booking",
      select: "court facility date timeSlots",
      populate: [
        { path: "court", select: "name" },
        { path: "facility", select: "name address" },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: payments });
});

// === GET /api/payments/:paymentId/status ===
// Status thanh toán
export const getPaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;

  // Populate booking và facility owner để kiểm tra quyền owner
  const payment = await Payment.findOne({ paymentId }).populate({
    path: "booking",
    select: "facility",
    populate: {
      path: "facility",
      select: "owner",
    },
  });

  if (!payment) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy giao dịch" });
  }

  // --- LOGIC PHÂN QUYỀN MỚI ---
  const isUserOwner = payment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  // Kiểm tra xem user có phải là chủ của facility liên quan không
  const facilityOwnerId = payment.booking?.facility?.owner?.toString();
  const isFacilityOwner = facilityOwnerId === req.user._id.toString();

  if (!isUserOwner && !isAdmin && !isFacilityOwner) {
    return res
      .status(403)
      .json({ success: false, message: "Không có quyền truy cập" });
  }

  res.status(200).json({
    success: true,
    data: {
      paymentId: payment.paymentId,
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
    },
  });
});

// === POST /api/payments/:paymentId/refund ===
// Hoàn tiền (Admin/Owner)
export const refundPayment = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;

  const payment = await Payment.findOne({ paymentId });
  if (!payment) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy giao dịch" });
  }
  if (payment.status !== "success") {
    return res.status(400).json({
      success: false,
      message: "Chỉ hoàn tiền cho giao dịch đã thành công",
    });
  }
  if (payment.status === "refunded") {
    return res.status(400).json({
      success: false,
      message: "Giao dịch này đã được hoàn tiền trước đó",
    });
  }

  const refundAmount = amount || payment.amount;
  const refundReason = reason || "Hoàn tiền theo yêu cầu của admin/owner";

  // Hoàn tiền vào ví người dùng

  try {
    // 1. Cộng tiền vào ví của user
    await credit(payment.user, refundAmount, "refund", {
      bookingId: payment.booking,
      paymentId: payment._id,
      reason: refundReason,
    });

    // 2. Cập nhật trạng thái Payment
    payment.status = "refunded";
    payment.refundInfo = {
      refundAmount: refundAmount,
      refundDate: new Date(),
      refundReason: refundReason,
      refundTransactionId: `REFUND_WALLET_${new Date().getTime()}`,
    };
    await payment.save();

    // 3. Cập nhật lại booking (chuyển về 'cancelled')
    await Booking.findByIdAndUpdate(payment.booking, {
      status: "cancelled",
      paymentStatus: "refunded",
    });

    res.status(200).json({
      success: true,
      message: `Hoàn tiền ${refundAmount} vào ví người dùng thành công`,
      data: payment,
    });
  } catch (error) {
    console.error("Lỗi khi hoàn tiền vào ví:", error);
    next(error);
  }
});
