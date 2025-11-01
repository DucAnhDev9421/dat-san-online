// File: DeleteNotificationModal.jsx

import React from "react";

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const box = {
  width: 480,
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 10px 40px rgba(2,6,23,0.2)",
};

// Đã đổi prop court thành notification
const DeleteNotificationModal = ({ isOpen, onClose, notification, onConfirm }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    // Logic sử dụng notification thay vì court
    if (onConfirm && notification) onConfirm(notification);
    if (onClose) onClose();
  };
  return (
    <div style={overlay}>
      <div style={box}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Xóa thông báo</h3> {/* Cập nhật tiêu đề */}
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>
          {/* Cập nhật nội dung hiển thị tiêu đề thông báo */}
          Bạn có chắc muốn xóa thông báo <strong>{notification?.title || notification?.id || "-"}</strong>?
        </div>

        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>
          Hành động này không thể hoàn tác.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 14,
          }}
        >
          <button
            onClick={() => onClose && onClose()}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: 0,
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNotificationModal;