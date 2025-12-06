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
    // 1. Format dữ liệu hiển thị
    const bookingDate = format(new Date(booking.date), "dd/MM/yyyy");
    const totalAmountStr = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(booking.totalAmount);

    // Ưu tiên gửi về email trong contactInfo, nếu không có thì lấy email của User account
    const recipientEmail = booking.contactInfo?.email || booking.user?.email;

    if (!recipientEmail) {
      console.log("⚠️ Không tìm thấy email người nhận, bỏ qua gửi biên lai.");
      return;
    }

    // 2. Nội dung HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2e7d32; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">THANH TOÁN THÀNH CÔNG</h1>
          <p style="margin: 10px 0 0;">Mã đặt sân: <strong>${
            booking.bookingCode || booking._id
          }</strong></p>
        </div>
        
        <div style="padding: 20px;">
          <p>Xin chào <strong>${
            booking.contactInfo?.name || booking.user?.name
          }</strong>,</p>
          <p>Cảm ơn bạn đã đặt sân tại <strong>${
            booking.facility?.name
          }</strong>. Đơn đặt sân của bạn đã được xác nhận.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Chi tiết đặt sân</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Sân:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${
                  booking.court?.name
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Ngày đá:</td>
                <td style="padding: 8px 0; text-align: right;">${bookingDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Khung giờ:</td>
                <td style="padding: 8px 0; text-align: right;">
                  ${booking.timeSlots
                    .map(
                      (slot) =>
                        `<span style="background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 5px;">${slot}</span>`
                    )
                    .join("")}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Cơ sở:</td>
                <td style="padding: 8px 0; text-align: right;">${
                  booking.facility?.address
                }</td>
              </tr>
            </table>
          </div>

          <div style="text-align: right; margin-bottom: 20px;">
            <span style="font-size: 16px; color: #333;">Tổng thanh toán:</span>
            <span style="font-size: 24px; color: #d32f2f; font-weight: bold; margin-left: 10px;">${totalAmountStr}</span>
          </div>

          <p style="text-align: center; color: #666; font-size: 14px;">
            Vui lòng đến sân sớm 15 phút và xuất trình Mã đặt sân hoặc QR Code cho nhân viên.
          </p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          Đây là email tự động từ hệ thống Dat San Online. Vui lòng không trả lời email này.
        </div>
      </div>
    `;

    // 3. Gọi hàm sendEmail có sẵn
    await sendEmail({
      to: recipientEmail,
      subject: `[DAT-SAN-ONLINE] Xác nhận thanh toán #${
        booking.bookingCode || booking._id
      }`,
      html: htmlContent,
    });

    console.log(`✅ Đã gửi biên lai tới ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Lỗi gửi email biên lai:", error);
    // Không throw error để tránh làm lỗi luồng thanh toán chính
  }
};
