import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  CreditCard,
  MessageSquare,
  BarChart3,
  Bell,
  Users2,
  History,
  Settings,
} from "lucide-react";
import OwnerHeader from "../../../component/owner/OwnerHeader";

// Import các component đã tách
import Dashboard from "./components/Dashboard";
import Courts from "./components/Courts";
import Bookings from "./components/Bookings";
import Reports from "./components/Reports";
import Reviews from "./components/Reviews";
import Analytics from "./components/Analytics";
import Notifications from "./components/Notifications";
import Staff from "./components/Staff";
import ActivityLog from "./components/ActivityLog";
import SettingsComponent from "./components/Settings";

const OwnerPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "courts", label: "Quản lý sân", icon: Building2 },
    { id: "bookings", label: "Đơn đặt sân", icon: BookOpen },
    { id: "reports", label: "Doanh thu & Thanh toán", icon: CreditCard },
    { id: "reviews", label: "Đánh giá & Phản hồi", icon: MessageSquare },
    { id: "analytics", label: "Báo cáo & Thống kê", icon: BarChart3 },
    { id: "notifications", label: "Quản lý thông báo", icon: Bell },
    { id: "staff", label: "Quản lý nhân sự", icon: Users2 },
    { id: "activity", label: "Nhật ký hoạt động", icon: History },
    { id: "settings", label: "Cấu hình & Hệ thống", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "courts":
        return <Courts />;
      case "bookings":
        return <Bookings />;
      case "reports":
        return <Reports />;
      case "reviews":
        return <Reviews />;
      case "analytics":
        return <Analytics />;
      case "notifications":
        return <Notifications />;
      case "staff":
        return <Staff />;
      case "activity":
        return <ActivityLog />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: isSidebarOpen ? 280 : 0,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          transition: "width 0.3s ease",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
        }}
      >
        <div style={{ padding: "24px 0", overflowY: "auto", height: "100%" }}>
          <div style={{ padding: "0 24px", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                OS
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
                  Owner Panel
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Dat San Online
                </div>
              </div>
            </div>
          </div>

          <nav>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 24px",
                    border: "none",
                    background: activeTab === item.id ? "#e6f0ff" : "transparent",
                    color: activeTab === item.id ? "#3b82f6" : "#6b7280",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: activeTab === item.id ? 600 : 400,
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div 
        style={{ 
          marginLeft: isSidebarOpen ? 280 : 0,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div style={{ 
          position: "sticky", 
          top: 0, 
          zIndex: 90,
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <OwnerHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: "24px" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerPanel;