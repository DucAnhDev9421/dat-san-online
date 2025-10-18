import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";

export default function AdminHeader({ onToggleSidebar, isSidebarOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const notifications = [
    { id: 1, message: "Có 3 đơn đặt sân mới cần xử lý", time: "5 phút trước", type: "booking" },
    { id: 2, message: "Sân 2 cần bảo trì", time: "1 giờ trước", type: "maintenance" },
    { id: 3, message: "Báo cáo tháng 1 đã sẵn sàng", time: "2 giờ trước", type: "report" },
  ];

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // TODO: Implement logout logic
      alert("Đăng xuất thành công!");
    }
  };

  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left side - Logo and Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: "none",
            border: "none",
            padding: 8,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#f3f4f6";
            e.target.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "none";
            e.target.style.color = "#6b7280";
          }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img 
            src="/Logo.png" 
            alt="Booking Sport Logo" 
            style={{ 
              height: "32px", 
              width: "auto",
              objectFit: "contain"
            }}
          />
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: 0 }}>
              Đặt Sân Online
            </h1>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div style={{ flex: 1, maxWidth: 400, margin: "0 24px" }}>
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm đơn đặt, khách hàng, sân bóng..."
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 14,
              background: "#f9fafb",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.background = "#fff";
              e.target.style.borderColor = "#10b981";
            }}
            onBlur={(e) => {
              e.target.style.background = "#f9fafb";
              e.target.style.borderColor = "#e5e7eb";
            }}
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Dark mode toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: "none",
            border: "none",
            padding: 8,
            borderRadius: 8,
            cursor: "pointer",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 8,
              borderRadius: 8,
              cursor: "pointer",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f3f4f6";
              e.target.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.color = "#6b7280";
            }}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Profile dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#374151",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              A
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
                Admin User
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Quản trị viên
              </div>
            </div>
            <ChevronDown size={16} color="#6b7280" />
          </button>

          {/* Profile dropdown menu */}
          {isProfileOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                boxShadow: "0 10px 25px rgba(0,0,0,.15)",
                minWidth: 200,
                zIndex: 1000,
              }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
                  Admin User
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  admin@datsanonline.com
                </div>
              </div>
              
              <div style={{ padding: 8 }}>
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "none",
                    background: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#374151",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
                  }}
                >
                  <User size={16} />
                  Thông tin cá nhân
                </button>
                
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "none",
                    background: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#374151",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
                  }}
                >
                  <Settings size={16} />
                  Cài đặt
                </button>
                
                <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
                
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    border: "none",
                    background: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#ef4444",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
                  }}
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
}
