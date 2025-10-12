//Trang đối tác
import React from "react";

export default function Partner() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fafbfc" }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>Hợp tác cùng Đặt Sân Thể Thao</h1>
        <p style={{ fontSize: 20, color: "#555", marginBottom: 32, maxWidth: 600 }}>
          Trang Đối tác là nơi kết nối giữa <b>chủ sân</b> và <b>admin</b> của hệ thống Đặt Sân Thể Thao.<br />
          Nếu bạn là chủ sân thể thao, hãy hợp tác với chúng tôi để quản lý sân dễ dàng, tiếp cận nhiều khách hàng hơn và tối ưu hiệu quả kinh doanh.<br /><br />
          Đội ngũ admin sẽ hỗ trợ bạn trong quá trình đăng ký, quản lý lịch đặt sân, quảng bá sân bãi và giải đáp mọi thắc mắc.
        </p>
        <div style={{ marginBottom: 16, color: "#222", fontWeight: 500 }}>
          Đăng ký trở thành đối tác ngay hôm nay!
        </div>
        <form style={{ display: "flex", justifyContent: "center", gap: 0 }}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "6px 0 0 6px",
              fontSize: 16,
              outline: "none",
              width: 280,
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 28px",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "0 6px 6px 0",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Đăng ký hợp tác <span style={{ fontSize: 18 }}>→</span>
          </button>
        </form>
      </main>
    </div>
  );
}