//Trang đối tác
import React, { useState } from "react";

const benefits = [
  {
    icon: "📈",
    title: "Tăng doanh thu",
    description: "Tiếp cận hàng nghìn khách hàng tiềm năng, tăng tỷ lệ lấp đầy sân lên đến 300%"
  },
  {
    icon: "⚡",
    title: "Quản lý dễ dàng",
    description: "Hệ thống quản lý tự động, theo dõi đặt sân, thanh toán và báo cáo chi tiết"
  },
  {
    icon: "🎯",
    title: "Marketing miễn phí",
    description: "Quảng bá sân bãi của bạn trên nền tảng với hàng nghìn lượt truy cập mỗi ngày"
  },
  {
    icon: "💰",
    title: "Thanh toán nhanh",
    description: "Thanh toán tự động, minh bạch và nhanh chóng qua nhiều hình thức"
  },
  {
    icon: "📊",
    title: "Báo cáo chi tiết",
    description: "Thống kê doanh thu, lượt đặt sân và phân tích xu hướng khách hàng"
  },
  {
    icon: "🤝",
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi"
  }
];

const steps = [
  { number: "1", title: "Đăng ký thông tin", description: "Điền form đăng ký với thông tin sân của bạn" },
  { number: "2", title: "Xác minh & Duyệt", description: "Đội ngũ admin sẽ xác minh và duyệt hồ sơ trong 24h" },
  { number: "3", title: "Thiết lập sân", description: "Cập nhật thông tin chi tiết, hình ảnh và giá sân" },
  { number: "4", title: "Bắt đầu kinh doanh", description: "Nhận đặt sân và bắt đầu tăng doanh thu ngay" }
];

const stats = [
  { number: "1000+", label: "Đối tác" },
  { number: "50K+", label: "Lượt đặt sân/tháng" },
  { number: "98%", label: "Hài lòng" },
  { number: "24/7", label: "Hỗ trợ" }
];

export default function Partner() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    facilityName: "",
    address: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
        padding: "80px 24px",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          opacity: 0.4
        }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 2, marginBottom: 16, opacity: 0.9 }}>
            CHƯƠNG TRÌNH ĐỐI TÁC
          </div>
          <h1 style={{ 
            fontSize: 52, 
            fontWeight: 800, 
            marginBottom: 24,
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            Cùng Phát Triển Với Đặt Sân Thể Thao
          </h1>
          <p style={{ fontSize: 20, marginBottom: 40, opacity: 0.95, lineHeight: 1.6 }}>
            Đưa sân thể thao của bạn lên một tầm cao mới. Tiếp cận hàng nghìn khách hàng, 
            tăng doanh thu và quản lý hiệu quả với nền tảng hàng đầu Việt Nam.
          </p>
          <button style={{
            background: "#fff",
            color: "#16a34a",
            padding: "16px 48px",
            fontSize: 18,
            fontWeight: 700,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
          }}
          onClick={() => document.getElementById('register-form').scrollIntoView({ behavior: 'smooth' })}>
            Đăng Ký Ngay →
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        background: "#fff",
        padding: "48px 24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: 48, 
                fontWeight: 800, 
                color: "#16a34a",
                marginBottom: 8
              }}>
                {stat.number}
              </div>
              <div style={{ fontSize: 16, color: "#6b7280", fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ 
            fontSize: 42, 
            fontWeight: 700, 
            color: "#1f2937",
            marginBottom: 16
          }}>
            Lợi Ích Khi Trở Thành Đối Tác
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 600, margin: "0 auto" }}>
            Tham gia cùng hàng ngàn đối tác đang phát triển thành công trên nền tảng của chúng tôi
          </p>
        </div>

        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32
        }}>
          {benefits.map((benefit, index) => (
            <div key={index} style={{
              background: "#fff",
              padding: 32,
              borderRadius: 20,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: "1px solid #f3f4f6",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,163,74,0.15)";
              e.currentTarget.style.borderColor = "#16a34a";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
              e.currentTarget.style.borderColor = "#f3f4f6";
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{benefit.icon}</div>
              <h3 style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: "#1f2937",
                marginBottom: 12
              }}>
                {benefit.title}
              </h3>
              <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        padding: "80px 24px",
        background: "#f9fafb"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ 
              fontSize: 42, 
              fontWeight: 700, 
              color: "#1f2937",
              marginBottom: 16
            }}>
              Quy Trình Đăng Ký Đơn Giản
            </h2>
            <p style={{ fontSize: 18, color: "#6b7280" }}>
              Chỉ 4 bước để bắt đầu kinh doanh cùng chúng tôi
            </p>
          </div>

          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{ position: "relative" }}>
                {index < steps.length - 1 && (
                  <div style={{
                    position: "absolute",
                    top: 40,
                    left: "calc(50% + 40px)",
                    width: "calc(100% - 80px)",
                    height: 3,
                    background: "linear-gradient(to right, #16a34a, #bbf7d0)",
                    zIndex: 0
                  }} />
                )}
                <div style={{ 
                  background: "#fff",
                  padding: 24,
                  borderRadius: 16,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                  border: "2px solid #e5e7eb",
                  height: "100%"
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    color: "#fff",
                    fontSize: 32,
                    fontWeight: 800,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 4px 16px rgba(22,163,74,0.25)"
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{ 
                    fontSize: 18, 
                    fontWeight: 700, 
                    color: "#1f2937",
                    marginBottom: 12
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register-form" style={{ 
        padding: "80px 24px",
        background: "#fff"
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ 
              fontSize: 42, 
              fontWeight: 700, 
              color: "#1f2937",
              marginBottom: 16
            }}>
              Đăng Ký Trở Thành Đối Tác
            </h2>
            <p style={{ fontSize: 18, color: "#6b7280" }}>
              Điền thông tin bên dưới và chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{
            background: "#fafbfc",
            padding: 48,
            borderRadius: 24,
            border: "2px solid #e5e7eb",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
          }}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 8
              }}>
                Họ và tên <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 16,
                  border: "2px solid #e5e7eb",
                  borderRadius: 12,
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              <div>
                <label style={{ 
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8
                }}>
                  Email <span style={{ color: "#dc2626" }}>*</span>
                </label>
          <input
            type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 16,
                    border: "2px solid #e5e7eb",
                    borderRadius: 12,
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "#16a34a"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label style={{ 
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8
                }}>
                  Số điện thoại <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 16,
                    border: "2px solid #e5e7eb",
                    borderRadius: 12,
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "#16a34a"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 8
              }}>
                Tên sân thể thao <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.facilityName}
                onChange={e => setFormData({...formData, facilityName: e.target.value})}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 16,
                  border: "2px solid #e5e7eb",
                  borderRadius: 12,
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                placeholder="Sân thể thao XYZ"
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ 
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 8
              }}>
                Địa chỉ sân <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
            style={{
                  width: "100%",
                  padding: "14px 16px",
              fontSize: 16,
                  border: "2px solid #e5e7eb",
                  borderRadius: 12,
              outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
            }}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
          />
            </div>

          <button
            type="submit"
            style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff",
                fontSize: 18,
                fontWeight: 700,
              border: "none",
                borderRadius: 12,
              cursor: "pointer",
                boxShadow: "0 4px 16px rgba(22,163,74,0.25)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,163,74,0.25)";
              }}
            >
              Gửi Đăng Ký →
          </button>

            <p style={{ 
              fontSize: 13, 
              color: "#6b7280", 
              textAlign: "center",
              marginTop: 16,
              lineHeight: 1.5
            }}>
              Bằng việc đăng ký, bạn đồng ý với <a href="#" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>Điều khoản dịch vụ</a> và <a href="#" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>Chính sách bảo mật</a> của chúng tôi
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}