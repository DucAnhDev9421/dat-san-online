import React from "react";
// 1. Thêm các icon cho tiêu đề card
import { X, Info, Briefcase, DollarSign } from "lucide-react";

const BG_HEADER = "#eef2ff"; 
// Component con để hiển thị từng hàng chi tiết (Điều chỉnh màu label)
const DetailRow = ({ label, value, isBadge = false, badgeData = {} }) => (
  <div style={{ marginBottom: 16 }}>
    <div
      style={{
        fontSize: 13,
        color: "#374151", // <-- Đổi màu label cho đậm hơn
        fontWeight: 600,
        marginBottom: 6,
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

// 2. Component con cho Tiêu đề Card (giống trong ảnh)
const CardHeader = ({ Icon, title }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "16px 20px",
      borderBottom: "1px solid #e5e7eb",

      color: "#374151",
    }}
  >
    <Icon size={18} />
    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
      {title}
    </h3>
  </div>
);

// Component Modal
const FacilityDetailModal = ({ isOpen, onClose, facility }) => {
  if (!isOpen || !facility) return null;

  const statusColors =
    facility.status === "active"
      ? { bg: "#e6f9f0", color: "#059669", text: "Hoạt động" }
      : { bg: "#fee2e2", color: "#ef4444", text: "Ngừng hoạt động" };

  // 3. Cập nhật kiểu dáng cho Card (nền trắng, không padding)
  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden", // Để giữ bo góc cho header
  };

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
          background: BG_HEADER, // <-- Header và Footer sẽ có nền trắng
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
          width: "90%",
          maxWidth: "550px",
          maxHeight: "85vh",
          display: "flex", // <-- Dùng flex-column để đẩy footer xuống
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Nền trắng) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* 4. Cập nhật tiêu đề giống ảnh */}
          <h2 style={{fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937" }}>
            Chi tiết sân:{" "}
            <span style={{ color: "#3b82f6" }}>{facility.name}</span>
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

        {/* 5. Body (Nền xám nhạt) */}
        <div
          style={{
            padding: 24,
            background: "#f9fafb", // <-- Nền xám nhạt cho body
            overflowY: "auto", // <-- Chỉ body cuộn
            flex: 1, // <-- Để body chiếm không gian
          }}
        >
          {/* Card 1: Thông tin chung */}
          <div style={cardStyle}>
            <CardHeader Icon={Info} title="Thông tin chung" />
            <div style={{ padding: 20 }}>
              <DetailRow label="Tên sân" value={facility.name} />
              <DetailRow label="Mã sân" value={facility.id} />
              <DetailRow label="Địa chỉ" value={facility.address} />
            </div>
          </div>

          {/* Card 2: Thông tin hoạt động */}
          <div style={cardStyle}>
            <CardHeader Icon={Briefcase} title="Thông tin hoạt động" />
            <div
              style={{
                padding: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 20px",
              }}
            >
              <DetailRow label="Chủ sân" value={facility.owner} />
              <DetailRow label="Số sân" value={facility.courts.toString()} />
              <DetailRow
                label="Trạng thái"
                value={statusColors.text}
                isBadge={true}
                badgeData={{ bg: statusColors.bg, color: statusColors.color }}
              />
            </div>
          </div>

          {/* Card 3: Thông tin tài chính */}
          <div style={cardStyle}>
            <CardHeader Icon={DollarSign} title="Thông tin tài chính" />
            <div style={{ padding: 20 }}>
              <DetailRow
                label="Doanh thu"
                value={`${(facility.revenue / 1e6).toFixed(1)}M VNĐ`}
              />
            </div>
          </div>
        </div>

        {/* 6. Footer với nút Đóng (mới) */}
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

export default FacilityDetailModal;