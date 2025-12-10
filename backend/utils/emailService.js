// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// !! CẤU HÌNH NODEMAILER !!
// Bạn cần cấu hình transporter này với dịch vụ mail của bạn
// (ví dụ: Gmail, SendGrid, Mailgun)

// Kiểm tra xem có credentials không
const hasEmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD;

let transporter = null;

if (hasEmailCredentials) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
} else {
  console.warn("⚠️ [EMAIL] Chưa cấu hình EMAIL_USER hoặc EMAIL_APP_PASSWORD. Email sẽ không được gửi.");
}

// ---- HOẶC DÙNG DỊCH VỤ SMTP TEST (ví dụ: Mailtrap) ----
// host: "sandbox.smtp.mailtrap.io",
//port: 2525,
//auth: {
//  user: "your_mailtrap_user",
//  pass: "your_mailtrap_pass",
//},

/**
 * Gửi email
 * @param {Object} options
 * @param {string} options.to - Email người nhận
 * @param {string} options.subject - Tiêu đề email
 * @param {string} options.html - Nội dung HTML của email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Kiểm tra xem có transporter không
    if (!transporter) {
      console.warn(`⚠️ [EMAIL] Không thể gửi email tới ${to} - Chưa cấu hình email credentials`);
      return;
    }

    const mailOptions = {
      from: `"DAT-SAN-ONLINE" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    if (process.env.NODE_ENV === "test") {
      console.log(`📧 (Test Mode) Email to ${to} with subject "${subject}"`);
      return;
    }

    console.log(`📬 Đang bắt đầu gửi email tới: ${to}`);

    // 2. Gọi hàm từ biến transporter đã khởi tạo ở trên
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
  } catch (error) {
    // Log lỗi nhưng không throw - để không làm gián đoạn flow thanh toán
    console.error("❌ Error sending email:", error.message || error);
    // Không throw error để không làm gián đoạn các process khác (như cộng tiền cho owner)
  }
};

/**
 * Gửi email biên lai thanh toán
 * @param {Object} booking - Object Booking đã populate đầy đủ thông tin
 */
export const sendPaymentReceipt = async (booking) => {
  try {
    if (!booking) return;

    // Logic thông minh: Lấy email người điền form HOẶC email tài khoản
    const recipientEmail = booking.contactInfo?.email || booking.user?.email;

    if (!recipientEmail) {
      console.warn(
        `⚠️ [EMAIL] Không tìm thấy email nhận cho đơn ${
          booking.bookingCode || booking._id
        }`
      );
      return;
    }

    // Format tiền
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(booking.totalAmount);

    const bookingDate = new Date(booking.date).toLocaleDateString("vi-VN");
    const bookingCode =
      booking.bookingCode || booking._id.toString().slice(-6).toUpperCase();

    // Nội dung HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #1a4d2e; padding: 20px; text-align: center; color: white;">
          <h2>THANH TOÁN THÀNH CÔNG</h2>
          <p>Mã đặt sân: <strong>${bookingCode}</strong></p>
        </div>
        <div style="padding: 20px;">
          <p>Xin chào quý khách,</p>
          <p>Hệ thống đã nhận được thanh toán <strong>${formattedAmount}</strong>.</p>
          <p><strong>Thông tin đặt sân:</strong></p>
          <ul>
            <li>Sân: ${booking.court?.name || "Sân bóng"}</li>
            <li>Ngày: ${bookingDate}</li>
            <li>Khung giờ: ${booking.timeSlots.join(", ")}</li>
          </ul>
          <p>Vui lòng đưa mã này cho nhân viên khi nhận sân.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: recipientEmail,
      subject: `[DAT-SAN] Xác nhận thanh toán #${bookingCode}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Lỗi logic gửi biên lai:", error);
  }
};
