import React from "react";
import { X, CheckCircle, Key } from "lucide-react";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const PasswordResetSuccessModal = ({ isOpen, onClose, item: staff = {} }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: "480px",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle size={20} color="#059669" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>
              Đặt lại mật khẩu thành công
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              padding: "4px",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={40} color="#059669" />
          </div>

          <h4 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px 0", color: "#111827" }}>
            Thành công!
          </h4>

          <p style={{ fontSize: 15, color: "#374151", marginBottom: 16, lineHeight: 1.6 }}>
            Đã đặt lại mật khẩu thành công cho nhân viên <strong>{staff?.name || ""}</strong>
          </p>

          {staff?.initialPassword && (
            <div
              style={{
                background: "#f0f9ff",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #bae6fd",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  justifyContent: "center",
                }}
              >
                <Key size={16} color="#0369a1" />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0369a1" }}>
                  Mật khẩu mới:
                </div>
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0284c7",
                  fontFamily: "monospace",
                  letterSpacing: 2,
                }}
              >
                {staff.initialPassword}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                ⚠️ Vui lòng ghi lại mật khẩu này và gửi cho nhân viên
              </div>
            </div>
          )}

          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 8,
              padding: 12,
              border: "1px solid #dcfce7",
            }}
          >
            <div style={{ fontSize: 13, color: "#059669", lineHeight: 1.6 }}>
              ✓ Mật khẩu mới đã được cập nhật vào hệ thống.
              <br />
              ✓ Nhân viên có thể sử dụng mật khẩu mới để đăng nhập.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "20px 24px",
            borderTop: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccessModal;

