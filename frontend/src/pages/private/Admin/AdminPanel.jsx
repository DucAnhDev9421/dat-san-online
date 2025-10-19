import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  UserCheck,
  CreditCard,
  UserCog,
  Bell,
  Activity,
  BarChart3,
  Settings,
} from "lucide-react";
import AdminHeader from "../../../component/admin/AdminHeader";

// Import các component đã tách
import Dashboard from "./components/Dashboard";
import Facilities from "./components/Facilities";
import Bookings from "./components/Bookings";
import Customers from "./components/Customers";
import Payments from "./components/Payments";
import Owners from "./components/Owners";
import Notifications from "./components/Notifications";
import ActivityLog from "./components/ActivityLog";
import Reports from "./components/Reports";
import SettingsComponent from "./components/Settings";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "facilities", label: "Quản lý sân", icon: Building2 },
    { id: "bookings", label: "Quản lý lịch đặt sân", icon: Calendar },
    { id: "customers", label: "Quản lý người dùng", icon: UserCheck },
    { id: "payments", label: "Quản lý thanh toán & Hóa đơn", icon: CreditCard },
    { id: "owners", label: "Quản lý chủ sân", icon: UserCog },
    { id: "notifications", label: "Quản lý thông báo", icon: Bell },
    { id: "activity_log", label: "Nhật ký hoạt động", icon: Activity },
    { id: "reports", label: "Báo cáo & thống kê", icon: BarChart3 },
    { id: "settings", label: "Cấu hình hệ thống", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "facilities":
        return <Facilities />;
      case "bookings":
        return <Bookings />;
      case "customers":
        return <Customers />;
      case "payments":
        return <Payments />;
      case "owners":
        return <Owners />;
      case "notifications":
        return <Notifications />;
      case "activity_log":
        return <ActivityLog />;
      case "reports":
        return <Reports />;
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        {/* Sidebar */}
        <div
          style={{
          width: isSidebarOpen ? 280 : 0,
            background: "#fff",
          borderRight: "1px solid #e5e7eb",
            transition: "width 0.3s ease",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
        <div style={{ padding: "24px 0" }}>
              <div style={{ padding: "0 24px", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                DS
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
                  Admin Panel
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
                        background: activeTab === item.id ? "#e6f9f0" : "transparent",
                        color: activeTab === item.id ? "#10b981" : "#6b7280",
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <AdminHeader 
            onToggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen}
            currentTabTitle={menuItems.find(item => item.id === activeTab)?.label}
          />

        {/* Content Area */}
        <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;