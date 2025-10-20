// utils/emailService.js
import nodemailer from "nodemailer";

// !! CẤU HÌNH NODEMAILER !!
// Bạn cần cấu hình transporter này với dịch vụ mail của bạn
// (ví dụ: Gmail, SendGrid, Mailgun)
const transporter = nodemailer.createTransport({
  // service: 'gmail',
  // auth: {
  //   user: 'YOUR_EMAIL@gmail.com',
  //   pass: 'YOUR_APP_PASSWORD',
  // },
  // ---- HOẶC DÙNG DỊCH VỤ SMTP TEST (ví dụ: Mailtrap) ----
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "your_mailtrap_user",
    pass: "your_mailtrap_pass",
  },
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
