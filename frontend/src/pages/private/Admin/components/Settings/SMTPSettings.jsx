import React from "react";
import { Eye, EyeOff } from "lucide-react";

const SMTPSettings = ({ settings, showPasswords, onInputChange, onTogglePassword }) => {
  return (
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => onInputChange("smtpHost", e.target.value)}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => onInputChange("smtpPort", Number(e.target.value))}
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
            onChange={(e) => onInputChange("smtpSecure", e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <label style={{ fontWeight: 600 }}>
            Sử dụng SSL/TLS (thường dùng cho port 465)
          </label>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            SMTP Username
          </label>
          <input
            type="text"
            value={settings.smtpUser}
            onChange={(e) => onInputChange("smtpUser", e.target.value)}
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
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            SMTP Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPasswords.smtpPassword ? "text" : "password"}
              value={settings.smtpPassword}
              onChange={(e) => onInputChange("smtpPassword", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 40px 12px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
            <button
              onClick={() => onTogglePassword("smtpPassword")}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Tên người gửi
            </label>
            <input
              type="text"
              value={settings.smtpFromName}
              onChange={(e) => onInputChange("smtpFromName", e.target.value)}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Email người gửi
            </label>
            <input
              type="email"
              value={settings.smtpFromEmail}
              onChange={(e) => onInputChange("smtpFromEmail", e.target.value)}
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
          <strong>Lưu ý:</strong> Sau khi cấu hình, hãy kiểm tra bằng cách gửi email
          test để đảm bảo cấu hình đúng.
        </div>
      </div>
    </div>
  );
};

export default SMTPSettings;

