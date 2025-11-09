import React from "react";
import { Key, Eye, EyeOff } from "lucide-react";

const APIKeysSettings = ({ settings, showPasswords, onInputChange, onTogglePassword }) => {
  return (
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              TMN Code
            </label>
            <input
              type="text"
              value={settings.vnpayTmnCode}
              onChange={(e) => onInputChange("vnpayTmnCode", e.target.value)}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Hash Secret
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPasswords.vnpayHashSecret ? "text" : "password"}
                value={settings.vnpayHashSecret}
                onChange={(e) => onInputChange("vnpayHashSecret", e.target.value)}
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
                onClick={() => onTogglePassword("vnpayHashSecret")}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Partner Code
            </label>
            <input
              type="text"
              value={settings.momoPartnerCode}
              onChange={(e) => onInputChange("momoPartnerCode", e.target.value)}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Access Key
            </label>
            <input
              type="text"
              value={settings.momoAccessKey}
              onChange={(e) => onInputChange("momoAccessKey", e.target.value)}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Secret Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPasswords.momoSecretKey ? "text" : "password"}
                value={settings.momoSecretKey}
                onChange={(e) => onInputChange("momoSecretKey", e.target.value)}
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
                onClick={() => onTogglePassword("momoSecretKey")}
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
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            API Key
          </label>
          <input
            type="text"
            value={settings.vietmapApiKey}
            onChange={(e) => onInputChange("vietmapApiKey", e.target.value)}
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
};

export default APIKeysSettings;

