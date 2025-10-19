import React, { useState } from "react";
import { Save, RefreshCw } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "Dat San Online",
    siteDescription: "Hệ thống đặt sân bóng đá trực tuyến",
    contactEmail: "admin@datsanonline.com",
    contactPhone: "0901234567",
    commissionRate: 10,
    maxBookingDays: 30,
    autoConfirm: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    alert("Đã lưu cài đặt thành công!");
  };

  const handleReset = () => {
    if (confirm("Bạn có chắc chắn muốn reset về cài đặt mặc định?")) {
      setSettings({
        siteName: "Dat San Online",
        siteDescription: "Hệ thống đặt sân bóng đá trực tuyến",
        contactEmail: "admin@datsanonline.com",
        contactPhone: "0901234567",
        commissionRate: 10,
        maxBookingDays: 30,
        autoConfirm: false,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
      });
    }
  };

  const renderGeneralSettings = () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Thông tin cơ bản</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Tên website</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange("siteName", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Mô tả website</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleInputChange("siteDescription", e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                resize: "vertical"
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Email liên hệ</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Số điện thoại</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cài đặt kinh doanh</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Tỷ lệ hoa hồng (%)</label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => handleInputChange("commissionRate", Number(e.target.value))}
                min="0"
                max="100"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Số ngày đặt trước tối đa</label>
              <input
                type="number"
                value={settings.maxBookingDays}
                onChange={(e) => handleInputChange("maxBookingDays", Number(e.target.value))}
                min="1"
                max="365"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cài đặt thông báo</h3>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Tự động xác nhận đặt sân</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Tự động xác nhận các đặt sân mà không cần phê duyệt thủ công</div>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: 60, height: 34 }}>
            <input
              type="checkbox"
              checked={settings.autoConfirm}
              onChange={(e) => handleInputChange("autoConfirm", e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: settings.autoConfirm ? "#10b981" : "#ccc",
              transition: ".4s",
              borderRadius: 34,
            }}>
              <span style={{
                position: "absolute",
                content: '""',
                height: 26,
                width: 26,
                left: 4,
                bottom: 4,
                backgroundColor: "white",
                transition: ".4s",
                borderRadius: "50%",
                transform: settings.autoConfirm ? "translateX(26px)" : "translateX(0px)"
              }} />
            </span>
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Thông báo email</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Gửi thông báo qua email cho người dùng</div>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: 60, height: 34 }}>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: settings.emailNotifications ? "#10b981" : "#ccc",
              transition: ".4s",
              borderRadius: 34,
            }}>
              <span style={{
                position: "absolute",
                content: '""',
                height: 26,
                width: 26,
                left: 4,
                bottom: 4,
                backgroundColor: "white",
                transition: ".4s",
                borderRadius: "50%",
                transform: settings.emailNotifications ? "translateX(26px)" : "translateX(0px)"
              }} />
            </span>
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Thông báo SMS</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Gửi thông báo qua SMS cho người dùng</div>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: 60, height: 34 }}>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleInputChange("smsNotifications", e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: settings.smsNotifications ? "#10b981" : "#ccc",
              transition: ".4s",
              borderRadius: 34,
            }}>
              <span style={{
                position: "absolute",
                content: '""',
                height: 26,
                width: 26,
                left: 4,
                bottom: 4,
                backgroundColor: "white",
                transition: ".4s",
                borderRadius: "50%",
                transform: settings.smsNotifications ? "translateX(26px)" : "translateX(0px)"
              }} />
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cài đặt hệ thống</h3>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Chế độ bảo trì</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Tạm thời đóng website để bảo trì</div>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: 60, height: 34 }}>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: settings.maintenanceMode ? "#ef4444" : "#ccc",
              transition: ".4s",
              borderRadius: 34,
            }}>
              <span style={{
                position: "absolute",
                content: '""',
                height: 26,
                width: 26,
                left: 4,
                bottom: 4,
                backgroundColor: "white",
                transition: ".4s",
                borderRadius: "50%",
                transform: settings.maintenanceMode ? "translateX(26px)" : "translateX(0px)"
              }} />
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Cấu hình hệ thống</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#6b7280",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            <RefreshCw size={16}/> Reset
          </button>
          <button
            onClick={handleSave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#10b981",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            <Save size={16}/> Lưu cài đặt
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { id: "general", label: "Cài đặt chung" },
          { id: "notifications", label: "Thông báo" },
          { id: "system", label: "Hệ thống" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: activeTab === tab.id ? "#10b981" : "#fff",
              color: activeTab === tab.id ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && renderGeneralSettings()}
      {activeTab === "notifications" && renderNotificationSettings()}
      {activeTab === "system" && renderSystemSettings()}
    </div>
  );
};

export default Settings;
