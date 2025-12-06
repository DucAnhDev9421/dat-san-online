// utils/emailService.js
import nodemailer from "nodemailer";

// !! CẤU HÌNH NODEMAILER !!
// Bạn cần cấu hình transporter này với dịch vụ mail của bạn
// (ví dụ: Gmail, SendGrid, Mailgun)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ntducanh9421@gmail.com",
    pass: "vnhg hbwh mvyo rujy",
  },
  // ---- HOẶC DÙNG DỊCH VỤ SMTP TEST (ví dụ: Mailtrap) ----
  // host: "sandbox.smtp.mailtrap.io",
  //port: 2525,
  //auth: {
  //  user: "your_mailtrap_user",
  //  pass: "your_mailtrap_pass",
  //},
});

/**
 * Gửi email
 * @param {Object} options
 * @param {string} options.to - Email người nhận
 * @param {string} options.subject - Tiêu đề email
 * @param {string} options.html - Nội dung HTML của email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: '"DAT-SAN-ONLINE" <no-reply@datsan.com>',
      to,
      subject,
      html,
    };

    // Chỉ gửi mail nếu không phải môi trường test
    if (process.env.NODE_ENV !== "test") {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent: ${info.messageId}`);
    } else {
      console.log(`📧 (Test Mode) Email to ${to} with subject "${subject}"`);
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

/**
 * Gửi email biên lai thanh toán
 * @param {Object} booking - Object Booking đã populate đầy đủ thông tin
 */
export const sendPaymentReceipt = async (booking) => {
  try {
    if (!booking || !booking.user) return;

    // Lấy email: ưu tiên trong contactInfo, nếu không có thì lấy của tài khoản User
    const recipientEmail = booking.contactInfo?.email || booking.user.email;

    if (!recipientEmail) {
      console.log("⚠️ Không tìm thấy email người nhận biên lai.");
      return;
    }

    // Format tiền và ngày
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(booking.totalAmount);

    const bookingDate = new Date(booking.date).toLocaleDateString("vi-VN");

    // Mẫu Email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2e7d32; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">THANH TOÁN THÀNH CÔNG</h2>
          <p>Mã đơn: <strong>${
            booking.bookingCode ||
            booking._id.toString().slice(-6).toUpperCase()
          }</strong></p>
        </div>
        <div style="padding: 20px;">
          <p>Xin chào <strong>${
            booking.contactInfo?.name || booking.user.name
          }</strong>,</p>
          <p>Cảm ơn bạn đã đặt sân. Dưới đây là biên lai điện tử của bạn:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">Sân:</td><td style="font-weight: bold; text-align: right;">${
              booking.court?.name || "Sân bóng"
            }</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">Cơ sở:</td><td style="text-align: right;">${
              booking.facility?.name || "Sân bóng"
            }</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">Ngày:</td><td style="text-align: right;">${bookingDate}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">Giờ:</td><td style="text-align: right;">${booking.timeSlots.join(
              ", "
            )}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Tổng tiền:</td><td style="text-align: right; color: #d32f2f; font-weight: bold; font-size: 18px;">${formattedAmount}</td></tr>
          </table>

          <p style="text-align: center; color: #666; font-size: 13px; margin-top: 30px;">
            Vui lòng đưa mã đơn hàng này cho nhân viên khi đến sân.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: recipientEmail,
      subject: `[DAT-SAN-ONLINE] Biên lai thanh toán #${
        booking.bookingCode || booking._id
      }`,
      html: htmlContent,
    });

    console.log(`📧 Đã gửi biên lai tới: ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Lỗi gửi biên lai:", error);
  }
};
