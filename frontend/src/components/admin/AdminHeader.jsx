import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserMenu from "../header/UserMenu";
import NotificationDropdown from "../header/NotificationDropdown";

export default function AdminHeader({ onToggleSidebar, isSidebarOpen, currentTabTitle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "Đơn đặt sân mới",
      message: "Có 3 đơn đặt sân mới cần xử lý", 
      time: "5 phút trước", 
      type: "booking",
      icon: Bell,
      iconColor: "#3b82f6",
      isRead: false
    },
    { 
      id: 2, 
      title: "Bảo trì sân bóng",
      message: "Sân 2 cần bảo trì", 
      time: "1 giờ trước", 
      type: "maintenance",
      icon: Settings,
      iconColor: "#f59e0b",
      isRead: false
    },
    { 
      id: 3, 
      title: "Báo cáo sẵn sàng",
      message: "Báo cáo tháng 1 đã sẵn sàng", 
      time: "2 giờ trước", 
      type: "report",
      icon: User,
      iconColor: "#10b981",
      isRead: true
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      await logout();
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setIsProfileOpen(false);
    navigate("/profile?tab=settings");
  };

  const handleBookingHistoryClick = () => {
    setIsProfileOpen(false);
    navigate("/profile?tab=bookings");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const handleNotificationItemClick = (notification) => {
    // Mark as read if unread
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    setIsNotificationOpen(false);
    // Navigate based on type
    if (notification.type === 'booking') {
      navigate('/admin');
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleViewAllNotifications = () => {
    setIsNotificationOpen(false);
    navigate('/admin');
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

        <button
          onClick={handleLogoClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 8,
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
          title="Quay về trang chủ"
        >
          <img 
            src="/Logo.png" 
            alt="Dat San Online Logo" 
            style={{ 
              height: "32px", 
              width: "auto",
              objectFit: "contain"
            }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Đặt Sân Online
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Admin Panel
            </div>
          </div>
        </button>
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
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={handleNotificationClick}
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
            {unreadCount > 0 && (
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
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationItemClick}
            onMarkAllAsRead={markAllAsRead}
            onViewAll={handleViewAllNotifications}
          />
        </div>

        {/* Profile dropdown - Using UserMenu component */}
        <UserMenu
          user={user}
          isOpen={isProfileOpen}
          onToggle={() => setIsProfileOpen(!isProfileOpen)}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onSettingsClick={handleSettingsClick}
          onBookingHistoryClick={handleBookingHistoryClick}
        />
      </div>
    </header>
  );
}
