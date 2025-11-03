import React from "react";
import { Upload } from "lucide-react";

const GeneralSettings = ({ settings, onInputChange, onFileUpload }) => {
  return (
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
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
                    onChange={(e) => onFileUpload("logo", e.target.files[0])}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
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
                    onChange={(e) => onFileUpload("favicon", e.target.files[0])}
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
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Tên website
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => onInputChange("siteName", e.target.value)}
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
              Mô tả website
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => onInputChange("siteDescription", e.target.value)}
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
};

export default GeneralSettings;

