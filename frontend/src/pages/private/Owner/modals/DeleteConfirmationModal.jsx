import React from "react";
import { X, AlertTriangle } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, logId }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1010, // Đảm bảo modal này ở trên modal chi tiết
      }}
      onClick={onClose}
    >
      {/* Nội dung Modal */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
          width: "90%",
          maxWidth: "450px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#ef4444" }}>
            Xác nhận xóa
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: 0,
              cursor: "pointer",
              color: "#6b7280",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div 
            style={{ 
              background: "#fee2e2", 
              color: "#ef4444", 
              borderRadius: "50%", 
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2937" }}>
              Bạn có chắc chắn muốn xóa không?
            </div>
            <div style={{ fontSize: 14, color: "#4b5563" }}>
              Hành động này sẽ xóa vĩnh viễn nhật ký
              <strong style={{ margin: "0 4px" }}>{logId}</strong>.
              Bạn không thể hoàn tác hành động này.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "16px 24px",
            background: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;