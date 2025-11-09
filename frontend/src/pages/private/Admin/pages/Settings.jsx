import React, { useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import ResetSettingsModal from "../modals/ResetSettingsModal";
import SettingsTabs from "../components/Settings/SettingsTabs";
import GeneralSettings from "../components/Settings/GeneralSettings";
import SMTPSettings from "../components/Settings/SMTPSettings";
import ServiceFeeSettings from "../components/Settings/ServiceFeeSettings";
import APIKeysSettings from "../components/Settings/APIKeysSettings";
import PolicySettings from "../components/Settings/PolicySettings";
import SupportSettings from "../components/Settings/SupportSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General
    siteName: "Dat San Online",
    siteDescription: "Hệ thống đặt sân bóng đá trực tuyến",
    logo: null,
    favicon: null,
    logoUrl: "https://via.placeholder.com/200x60",
    faviconUrl: "https://via.placeholder.com/32x32",

    // SMTP
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "noreply@datsanonline.com",
    smtpPassword: "",
    smtpFromName: "Dat San Online",
    smtpFromEmail: "noreply@datsanonline.com",

    // Service Fee
    serviceFeePercent: 10,

    // API Keys
    vnpayTmnCode: "",
    vnpayHashSecret: "",
    momoPartnerCode: "",
    momoAccessKey: "",
    momoSecretKey: "",
    vietmapApiKey: "",

    // Policy & Terms
    termsOfService: "Điều khoản sử dụng...",
    privacyPolicy: "Chính sách bảo mật...",
    refundPolicy: "Chính sách hoàn tiền...",

    // Support Contact
    supportEmail: "support@datsanonline.com",
    supportPhone: "1900123456",
    supportAddress: "123 Đường ABC, Quận 1, TP.HCM",
    supportHours: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
  });

  const [showPasswords, setShowPasswords] = useState({
    smtpPassword: false,
    vnpayHashSecret: false,
    momoSecretKey: false,
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({
          ...prev,
          [field]: file,
          [`${field}Url`]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    alert("Đã lưu cài đặt thành công!");
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    setSettings({
      siteName: "Dat San Online",
      siteDescription: "Hệ thống đặt sân bóng đá trực tuyến",
      logo: null,
      favicon: null,
      logoUrl: "https://via.placeholder.com/200x60",
      faviconUrl: "https://via.placeholder.com/32x32",
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "noreply@datsanonline.com",
      smtpPassword: "",
      smtpFromName: "Dat San Online",
      smtpFromEmail: "noreply@datsanonline.com",
      serviceFeePercent: 10,
      vnpayTmnCode: "",
      vnpayHashSecret: "",
      momoPartnerCode: "",
      momoAccessKey: "",
      momoSecretKey: "",
      vietmapApiKey: "",
      termsOfService: "Điều khoản sử dụng...",
      privacyPolicy: "Chính sách bảo mật...",
      refundPolicy: "Chính sách hoàn tiền...",
      supportEmail: "support@datsanonline.com",
      supportPhone: "1900123456",
      supportAddress: "123 Đường ABC, Quận 1, TP.HCM",
      supportHours: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
    });
    setIsResetModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
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
              fontWeight: 700,
            }}
          >
            <RefreshCw size={16} /> Reset
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
              fontWeight: 700,
            }}
          >
            <Save size={16} /> Lưu cài đặt
          </button>
        </div>
      </div>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "general" && (
        <GeneralSettings
          settings={settings}
          onInputChange={handleInputChange}
          onFileUpload={handleFileUpload}
        />
      )}
      {activeTab === "smtp" && (
        <SMTPSettings
          settings={settings}
          showPasswords={showPasswords}
          onInputChange={handleInputChange}
          onTogglePassword={togglePasswordVisibility}
        />
      )}
      {activeTab === "serviceFee" && (
        <ServiceFeeSettings
          settings={settings}
          onInputChange={handleInputChange}
        />
      )}
      {activeTab === "apiKeys" && (
        <APIKeysSettings
          settings={settings}
          showPasswords={showPasswords}
          onInputChange={handleInputChange}
          onTogglePassword={togglePasswordVisibility}
        />
      )}
      {activeTab === "policy" && (
        <PolicySettings settings={settings} onInputChange={handleInputChange} />
      )}
      {activeTab === "support" && (
        <SupportSettings settings={settings} onInputChange={handleInputChange} />
      )}

      <ResetSettingsModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default Settings;

