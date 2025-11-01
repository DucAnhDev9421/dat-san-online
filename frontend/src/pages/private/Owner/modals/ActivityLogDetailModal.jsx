import React from "react";
import { X } from "lucide-react";

// Component con để hiển thị từng hàng chi tiết
const DetailRow = ({ label, value, isBadge = false, badgeData = {} }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        fontSize: 13,
        color: "#6b7280",
        fontWeight: 600,
        marginBottom: 4,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    {isBadge ? (
      <span
        style={{
          background: badgeData.bg,
          color: badgeData.color,
          padding: "4px 8px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    ) : (
      <div
        style={{
          fontSize: 15,
          color: "#1f2937",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    )}
  </div>
);

// Component Modal
const ActivityLogDetailModal = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  // Định nghĩa màu sắc cho trạng thái
  const statusColors =
    log.status === "success"
      ? { bg: "#e6f9f0", color: "#059669", text: "Thành công" }
      : { bg: "#fee2e2", color: "#ef4444", text: "Thất bại" };

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
        zIndex: 1000,
      }}
      onClick={onClose} // Đóng khi nhấp vào backdrop
    >
      {/* Nội dung Modal */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi nhấp vào nội dung
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
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Chi tiết hoạt động: {log.id}
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
        <div style={{ padding: 24 }}>
          <DetailRow label="Mã" value={log.id} />
          <DetailRow
            label="Người dùng"
            value={`${log.user} (ID: ${log.userId})`}
          />
          <DetailRow label="Hành động" value={log.action} />
          <DetailRow label="Mục tiêu" value={log.target} />
          <DetailRow label="Chi tiết" value={log.details} />
          <DetailRow label="Địa chỉ IP" value={log.ip} />
          <DetailRow label="Thời gian" value={log.timestamp} />
          <DetailRow
            label="Trạng thái"
            value={statusColors.text}
            isBadge={true}
            badgeData={{ bg: statusColors.bg, color: statusColors.color }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogDetailModal;
