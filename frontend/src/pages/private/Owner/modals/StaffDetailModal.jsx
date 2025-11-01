import React from "react";
import { X, User, Briefcase, TrendingUp } from "lucide-react";

const PRIMARY_COLOR = "#3b82f6";
const BORDER_COLOR = "#e5e7eb";
const TEXT_COLOR = "#1f2937";
const MUTED_TEXT_COLOR = "#6b7280";
const BG_COLOR = "#f9fafb";
const BG_HEADER = "#eef2ff";
const BG_BODY = "#eef2ff"; 

// Định nghĩa style cơ bản cho Modal
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBoxStyle = {
  width: 600,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 10px 40px rgba(2,6,23,0.2)",
  maxHeight: "90vh",
  overflowY: "auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  background: BG_HEADER,
  borderBottom: `1px solid ${BORDER_COLOR}`,
};

const contentStyle = {
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 20,
  background: BG_COLOR,
};

const CardStyle = {
  background: "#fff",
  borderRadius: 8,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const CardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: 16,
  paddingBottom: 8,
  borderBottom: `1px solid ${BORDER_COLOR}`,
};

const DetailItem = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
      paddingBottom: 4,
      borderBottom: `1px dashed #f3f4f6`,
    }}
  >
    <div
      style={{
        fontSize: 14,
        color: MUTED_TEXT_COLOR,
        fontWeight: 500,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 15, color: TEXT_COLOR, fontWeight: 600 }}>
      {value}
    </div>
  </div>
);

// Component Badge cho Trạng thái và Hiệu suất
const StatusBadge = ({ value, type }) => {
  let bgColor, color;

  if (type === "status") {
    if (value === "Hoạt động") {
      color = "#1f2937";
    } else {  
      color = "#1f2937";
    }
  } else if (type === "performance") {
    if (value === "Tốt") {
      color = "#1f2937";
    } else if (value === "Trung bình") {
      color = "#1f2937";
    } else {
      color = "#1f2937";
    }
  }

  return (
    <span
      style={{
        background: bgColor,
        color: color,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {value}
    </span>
  );
};

const StaffDetailModal = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  // Xử lý dữ liệu
  const displayStatus = item.status === "active" ? "Hoạt động" : "Tạm ngưng";

  const formattedSalary = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(item.salary);

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: TEXT_COLOR,
            }}
          >
            Chi tiết Nhân viên:{" "}
            <span style={{ color: PRIMARY_COLOR }}>{item.name || "N/A"}</span>
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: 0,
              cursor: "pointer",
              color: MUTED_TEXT_COLOR,
              padding: 4,
              borderRadius: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Chia thành các Card */}
        <div style={contentStyle}>
          {/* 1. Thông tin cá nhân */}
          <div style={CardStyle}>
            <div style={CardHeaderStyle}>
              <User size={18} style={{ marginRight: 8 }} />
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Thông tin cá nhân
              </h4>
            </div>
            <DetailItem label="Mã" value={item.id} />
            <DetailItem label="Họ tên" value={item.name} />
            <DetailItem label="Liên hệ" value={item.phone} />
            <DetailItem label="Đăng nhập cuối" value={item.lastLogin} />
          </div>

          {/* 2. Thông tin công việc */}
          <div style={CardStyle}>
            <div style={CardHeaderStyle}>
              <Briefcase size={18} style={{ marginRight: 8 }} />
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Thông tin công việc
              </h4>
            </div>
            <DetailItem label="Chức vụ" value={item.position} />
            <DetailItem label="Ngày vào làm" value={item.joinDate} />
          </div>

          {/* 3. Tài chính & Hiệu suất */}
          <div style={CardStyle}>
            <div style={CardHeaderStyle}>
              <TrendingUp size={18} style={{ marginRight: 8 }} />
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Tài chính & Hiệu suất
              </h4>
            </div>
            <DetailItem
              label="Lương"
              value={
                <span
                  style={{ color: "#1f2937", fontWeight: 800, fontSize: 16 }}
                >
                  {formattedSalary}
                </span>
              }
            />
            <DetailItem
              label="Trạng thái"
              value={<StatusBadge value={displayStatus} type="status" />}
            />
            <DetailItem
              label="Hiệu suất"
              value={
                <StatusBadge value={item.performance} type="performance" />
              }
            />
          </div>
          {/* Nút Đóng */}
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#e5e7eb",
                color: TEXT_COLOR,
                border: 0,
                borderRadius: 10,
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailModal;
