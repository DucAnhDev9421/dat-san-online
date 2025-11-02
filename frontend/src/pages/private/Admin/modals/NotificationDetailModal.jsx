import React from "react";
import { X, Bell } from "lucide-react";

const BG_HEADER = "#eef2ff"; 
// Component con để hiển thị từng hàng chi tiết (Không đổi)
const DetailRow = ({ label, value, isBadge = false, badgeData = {} }) => (
  <div style={{ marginBottom: 16 }}>
    <div
      style={{
        fontSize: 13,
        color: "#374151",
        fontWeight: 600,
        marginBottom: 6,
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
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "capitalize",
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
const NotificationDetailModal = ({ isOpen, onClose, notification }) => {
  if (!isOpen || !notification) return null;

  // Định nghĩa màu sắc cho Loại thông báo
  const typeColors = {
    booking: { bg: "#e6f3ff", color: "#1d4ed8", text: "Đặt sân" },
    payment: { bg: "#e6f9f0", color: "#059669", text: "Thanh toán" },
    cancellation: { bg: "#fee2e2", color: "#ef4444", text: "Hủy đặt sân" },
    registration: { bg: "#fef3c7", color: "#d97706", text: "Đăng ký" },
    report: { bg: "#e6f3ff", color: "#1d4ed8", text: "Báo cáo" },
  };

  // Định nghĩa màu sắc cho Trạng thái
  const statusColors = {
    unread: { bg: "#e6f3ff", color: "#1d4ed8", text: "Chưa đọc" },
    read: { bg: "#e6f9f0", color: "#059669", text: "Đã đọc" },
  };

  const typeConfig = typeColors[notification.type] || { bg: "#e5e7eb", color: "#374151", text: notification.type };
  const statusConfig = statusColors[notification.status] || { bg: "#e5e7eb", color: "#374151", text: notification.status };

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
      onClick={onClose}
    >
      {/* Nội dung Modal */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header*/}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
            background: BG_HEADER,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937", display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={20} color={typeConfig.color} />
            {notification.title}
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

        {/* Body (Nền xám nhạt) */}
        <div
          style={{
            padding: 24,
            background: "#f9fafb",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Khung nội dung */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 16 }}>
                <DetailRow
                    label="Loại"
                    value={typeConfig.text}
                    isBadge={true}
                    badgeData={{ bg: typeConfig.bg, color: typeConfig.color }}
                />
                <DetailRow
                    label="Trạng thái"
                    value={statusConfig.text}
                    isBadge={true}
                    badgeData={{ bg: statusConfig.bg, color: statusConfig.color }}
                />
            </div>

            <DetailRow label="Mã" value={notification.id} />

            <DetailRow label="Thời gian" value={`${notification.date} lúc ${notification.time}`} />
            
            <DetailRow label="Tiêu đề" value={notification.title} />
            
            <DetailRow label="Nội dung" value={notification.message} />
          </div>
        </div>

        {/* Footer (Không đổi) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
            background: "#fff",
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
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;