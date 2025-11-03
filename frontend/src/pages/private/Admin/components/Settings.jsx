import React, { useState } from "react";
import {
  Save,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Mail,
  Key,
  FileText,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import ResetSettingsModal from "../modals/ResetSettingsModal";

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
    // TODO: Gửi API save settings
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

  const renderGeneralSettings = () => (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Logo & Favicon */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Logo & Favicon
        </h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Logo website
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 8,
              }}
            >
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  style={{
                    maxWidth: 200,
                    maxHeight: 60,
                    objectFit: "contain",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 8,
                  }}
                />
              )}
              <div>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  <Upload size={16} />
                  Tải lên Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("logo", e.target.files[0])
                    }
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Khuyến nghị: 200x60px, định dạng PNG/JPG
            </div>
          </div>

          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Favicon
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 8,
              }}
            >
              {settings.faviconUrl && (
                <img
                  src={settings.faviconUrl}
                  alt="Favicon"
                  style={{
                    width: 32,
                    height: 32,
                    objectFit: "contain",
                    border: "1px solid #e5e7eb",
                    borderRadius: 4,
                    padding: 4,
                  }}
                />
              )}
              <div>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  <Upload size={16} />
                  Tải lên Favicon
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("favicon", e.target.files[0])
                    }
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Khuyến nghị: 32x32px, định dạng ICO/PNG
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Thông tin cơ bản
        </h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Tên website
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange("siteName", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Mô tả website
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) =>
                handleInputChange("siteDescription", e.target.value)
              }
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                resize: "vertical",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSMTPSettings = () => (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Cấu hình Email (SMTP)
      </h3>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              SMTP Host
            </label>
              <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => handleInputChange("smtpHost", e.target.value)}
              placeholder="smtp.gmail.com"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                fontSize: 14,
                }}
              />
            </div>
            <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              SMTP Port
            </label>
              <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) =>
                handleInputChange("smtpPort", Number(e.target.value))
              }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                fontSize: 14,
                }}
              />
            </div>
          </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={settings.smtpSecure}
            onChange={(e) =>
              handleInputChange("smtpSecure", e.target.checked)
            }
            style={{ width: 18, height: 18 }}
          />
          <label style={{ fontWeight: 600 }}>
            Sử dụng SSL/TLS (thường dùng cho port 465)
          </label>
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
          >
            SMTP Username
          </label>
          <input
            type="text"
            value={settings.smtpUser}
            onChange={(e) => handleInputChange("smtpUser", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
          >
            SMTP Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPasswords.smtpPassword ? "text" : "password"}
              value={settings.smtpPassword}
              onChange={(e) =>
                handleInputChange("smtpPassword", e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px 40px 12px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
            <button
              onClick={() => togglePasswordVisibility("smtpPassword")}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              {showPasswords.smtpPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </button>
        </div>
      </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Tên người gửi
            </label>
              <input
              type="text"
              value={settings.smtpFromName}
              onChange={(e) =>
                handleInputChange("smtpFromName", e.target.value)
              }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                fontSize: 14,
                }}
              />
            </div>
            <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Email người gửi
            </label>
              <input
              type="email"
              value={settings.smtpFromEmail}
              onChange={(e) =>
                handleInputChange("smtpFromEmail", e.target.value)
              }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                fontSize: 14,
                }}
              />
            </div>
          </div>

        <div
          style={{
            padding: 12,
            background: "#fef3c7",
            borderRadius: 8,
            fontSize: 13,
            color: "#92400e",
          }}
        >
          <strong>Lưu ý:</strong> Sau khi cấu hình, hãy kiểm tra bằng cách gửi
          email test để đảm bảo cấu hình đúng.
        </div>
      </div>
    </div>
  );

  const renderServiceFeeSettings = () => (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Tỷ lệ phí dịch vụ
      </h3>
      <div style={{ display: "grid", gap: 16 }}>
          <div>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
          >
            Tỷ lệ phí nền tảng (%)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="number"
              value={settings.serviceFeePercent}
              onChange={(e) =>
                handleInputChange(
                  "serviceFeePercent",
                  Number(e.target.value)
                )
              }
              min="0"
              max="100"
              step="0.1"
              style={{
                width: 200,
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 600, color: "#059669" }}>
              %
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Phí này sẽ được tính trên mỗi đơn đặt sân thành công
          </div>
        </div>

        <div
          style={{
            padding: 16,
            background: "#f9fafb",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Ví dụ:
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            Nếu khách hàng đặt sân với giá <strong>500,000 VNĐ</strong>
            <br />
            Phí nền tảng: {settings.serviceFeePercent}% ={" "}
            <strong>
              {(
                (500000 * settings.serviceFeePercent) /
                100
              ).toLocaleString("vi-VN")}{" "}
              VNĐ
            </strong>
            <br />
            Chủ sân nhận được:{" "}
            <strong>
              {(
                500000 -
                (500000 * settings.serviceFeePercent) / 100
              ).toLocaleString("vi-VN")}{" "}
              VNĐ
            </strong>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIKeysSettings = () => (
    <div style={{ display: "grid", gap: 24 }}>
      {/* VNPay */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Key size={20} color="#059669" />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>VNPay</h3>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              TMN Code
            </label>
            <input
              type="text"
              value={settings.vnpayTmnCode}
              onChange={(e) =>
                handleInputChange("vnpayTmnCode", e.target.value)
              }
              placeholder="Nhập TMN Code từ VNPay"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Hash Secret
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPasswords.vnpayHashSecret ? "text" : "password"}
                value={settings.vnpayHashSecret}
                onChange={(e) =>
                  handleInputChange("vnpayHashSecret", e.target.value)
                }
                placeholder="Nhập Hash Secret từ VNPay"
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
              <button
                onClick={() => togglePasswordVisibility("vnpayHashSecret")}
                style={{
              position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
              cursor: "pointer",
                  padding: 4,
                }}
              >
                {showPasswords.vnpayHashSecret ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </button>
            </div>
          </div>
        </div>
        </div>

      {/* Momo */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Key size={20} color="#c41e3a" />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>MoMo</h3>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Partner Code
            </label>
            <input
              type="text"
              value={settings.momoPartnerCode}
              onChange={(e) =>
                handleInputChange("momoPartnerCode", e.target.value)
              }
              placeholder="Nhập Partner Code từ MoMo"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Access Key
            </label>
            <input
              type="text"
              value={settings.momoAccessKey}
              onChange={(e) =>
                handleInputChange("momoAccessKey", e.target.value)
              }
              placeholder="Nhập Access Key từ MoMo"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Secret Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPasswords.momoSecretKey ? "text" : "password"}
                value={settings.momoSecretKey}
                onChange={(e) =>
                  handleInputChange("momoSecretKey", e.target.value)
                }
                placeholder="Nhập Secret Key từ MoMo"
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
              <button
                onClick={() => togglePasswordVisibility("momoSecretKey")}
                style={{
              position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
              cursor: "pointer",
                  padding: 4,
                }}
              >
                {showPasswords.momoSecretKey ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VietMap */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Key size={20} color="#3b82f6" />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>VietMap</h3>
        </div>
        <div>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
          >
            API Key
          </label>
          <input
            type="text"
            value={settings.vietmapApiKey}
            onChange={(e) =>
              handleInputChange("vietmapApiKey", e.target.value)
            }
            placeholder="Nhập API Key từ VietMap"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Dùng để hiển thị bản đồ và tính toán khoảng cách
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicySettings = () => (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Điều khoản sử dụng
        </h3>
        <textarea
          value={settings.termsOfService}
          onChange={(e) =>
            handleInputChange("termsOfService", e.target.value)
          }
          rows={12}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Chính sách bảo mật
        </h3>
        <textarea
          value={settings.privacyPolicy}
          onChange={(e) => handleInputChange("privacyPolicy", e.target.value)}
          rows={12}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Chính sách hoàn tiền
        </h3>
        <textarea
          value={settings.refundPolicy}
          onChange={(e) => handleInputChange("refundPolicy", e.target.value)}
          rows={12}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );

  const renderSupportSettings = () => (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Thông tin liên hệ hỗ trợ
      </h3>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Email hỗ trợ
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                handleInputChange("supportEmail", e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              value={settings.supportPhone}
              onChange={(e) =>
                handleInputChange("supportPhone", e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
          >
            Địa chỉ
          </label>
          <input
            type="text"
            value={settings.supportAddress}
            onChange={(e) =>
              handleInputChange("supportAddress", e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
          >
            Giờ hỗ trợ
          </label>
          <input
            type="text"
            value={settings.supportHours}
            onChange={(e) =>
              handleInputChange("supportHours", e.target.value)
            }
            placeholder="VD: Thứ 2 - Chủ nhật: 8:00 - 22:00"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "general", label: "Cài đặt chung", icon: ImageIcon },
    { id: "smtp", label: "Email (SMTP)", icon: Mail },
    { id: "serviceFee", label: "Phí dịch vụ", icon: FileText },
    { id: "apiKeys", label: "API Keys", icon: Key },
    { id: "policy", label: "Chính sách & Điều khoản", icon: FileText },
    { id: "support", label: "Liên hệ hỗ trợ", icon: Phone },
  ];

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

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: activeTab === tab.id ? "#10b981" : "#fff",
              color: activeTab === tab.id ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && renderGeneralSettings()}
      {activeTab === "smtp" && renderSMTPSettings()}
      {activeTab === "serviceFee" && renderServiceFeeSettings()}
      {activeTab === "apiKeys" && renderAPIKeysSettings()}
      {activeTab === "policy" && renderPolicySettings()}
      {activeTab === "support" && renderSupportSettings()}

      {/* Reset Modal */}
      <ResetSettingsModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default Settings;
