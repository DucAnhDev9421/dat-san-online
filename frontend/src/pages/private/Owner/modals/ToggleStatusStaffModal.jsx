import React from "react";
import { X, Lock, Unlock, AlertTriangle } from "lucide-react";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const ToggleStatusStaffModal = ({ isOpen, onClose, item: staff = {}, actionType = "lock", onToggle }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  if (!isOpen || !staff) return null;

  const isLock = actionType === "lock";
  const title = isLock ? "Khóa tài khoản" : "Mở khóa tài khoản";
  const message = isLock
    ? `Bạn có chắc muốn khóa tài khoản của nhân viên ${staff.name}?`
    : `Bạn có chắc muốn mở khóa tài khoản của nhân viên ${staff.name}?`;
  const warningMessage = isLock
    ? "Nhân viên sẽ không thể đăng nhập vào hệ thống cho đến khi được mở khóa."
    : "Nhân viên sẽ có thể đăng nhập và sử dụng hệ thống bình thường.";

  const handleConfirm = () => {
    if (onToggle && staff?.id) {
      onToggle(staff.id, actionType);
    }
    if (onClose) onClose();
  };

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
                background: isLock ? "#fee2e2" : "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLock ? (
                <Lock size={20} color="#ef4444" />
              ) : (
                <Unlock size={20} color="#059669" />
              )}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>
              {title}
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
        <div style={{ padding: "24px" }}>
          <div
            style={{
              background: isLock ? "#fef2f2" : "#f0fdf4",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              border: `1px solid ${isLock ? "#fee2e2" : "#dcfce7"}`,
              display: "flex",
              gap: 8,
            }}
          >
            <AlertTriangle
              size={18}
              color={isLock ? "#ef4444" : "#059669"}
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: isLock ? "#ef4444" : "#059669", marginBottom: 4 }}>
                {title}
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                {warningMessage}
              </div>
            </div>
          </div>

          <p style={{ fontSize: 15, color: "#374151", margin: 0, lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "20px 24px",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "10px 24px",
              background: isLock ? "#ef4444" : "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isLock ? "Khóa tài khoản" : "Mở khóa tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleStatusStaffModal;

