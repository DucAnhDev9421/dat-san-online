import { PayOS } from "@payos/node";
import { config } from "../config/config.js";

// Khởi tạo đối tượng PayOS (Không cần .default)
const payOS = new PayOS(
  config.payos.clientId,
  config.payos.apiKey,
  config.payos.checksumKey
);

/**
 * Tạo link thanh toán PayOS
 * @param {number} orderCode - Mã đơn hàng (duy nhất, kiểu số)
 * @param {number} amount - Số tiền
 * @param {string} description - Mô tả
 * @param {string} returnUrl - URL trả về sau khi thanh toán
 * @param {string} cancelUrl - URL hủy bỏ
 * @returns {Promise<object>} - Thông tin link thanh toán
 */
export const createPaymentLink = async ({
  orderCode,
  amount,
  description,
  returnUrl,
  cancelUrl,
}) => {
  try {
    const paymentData = {
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
      expiredAt: Math.floor((Date.now() + 15 * 60 * 1000) / 1000), // Hết hạn sau 15 phút
    };

    // SỬA 3: Hàm đúng là "paymentRequests.create", không phải "createPaymentLink"
    const paymentLink = await payOS.paymentRequests.create(paymentData);
    return paymentLink;
  } catch (error) {
    console.error("Lỗi khi tạo link PayOS:", error);
    throw new Error("Không thể tạo link thanh toán PayOS");
  }
};

/**
 * Xác thực Webhook (IPN) từ PayOS
 * @param {object} webhookBody - Dữ liệu PayOS gửi về
 * @returns {Promise<object>} - Dữ liệu đã xác thực
 */
export const verifyWebhook = async (webhookBody, headers) => {
  try {
    const verifiedData = payOS.webhooks.verify(webhookBody, headers);
    return verifiedData;
  } catch (error) {
    console.error("Lỗi xác thực webhook PayOS:", error.message);
    throw new Error("Chữ ký webhook không hợp lệ");
  }
};

export default payOS;
