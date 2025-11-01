import React from "react";
import { X, Lock, Unlock, AlertTriangle } from "lucide-react";


const PRIMARY_COLOR = "#3b82f6"; 
const DANGER_COLOR = "#ef4444"; 
const WARNING_COLOR = "#f97316";  
const SUCCESS_COLOR = "#10b981"; 
const BORDER_COLOR = "#e5e7eb";
const TEXT_COLOR = "#1f2937";
const MUTED_TEXT_COLOR = "#6b7280";
const WHITE_BG = "#fff";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBoxStyle = {
  width: 400,
  background: WHITE_BG,
  borderRadius: 12,
  boxShadow: "0 15px 45px rgba(2,6,23,0.25)", 
  maxHeight: "90vh",
  overflowY: "auto",
  border: `1px solid #f3f4f6`,
};

const headerStyle = () => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  // Không dùng background màu nhạt ở đây, để trắng sạch sẽ hơn
  borderBottom: `1px solid ${BORDER_COLOR}`,
});

const contentStyle = {
  padding: 30, // Tăng padding
  display: "flex",
  flexDirection: "column",
  gap: 15,
  textAlign: "center",
};

const ToggleStatusStaffModal = ({
  isOpen,
  item,
  onClose,
  onToggle,
  actionType,
}) => {
  if (!isOpen || !item) return null;

  const isLock = actionType === "lock";

  // ⭐️ Tinh chỉnh màu sắc và nội dung cho Lock/Unlock
  const title = isLock ? "Khóa Tài khoản" : "Mở khóa Tài khoản";
  const buttonText = isLock ? "Xác nhận Khóa" : "Xác nhận Mở khóa";
  const buttonColor = isLock ? WARNING_COLOR : SUCCESS_COLOR;
  const iconColor = isLock ? WARNING_COLOR : SUCCESS_COLOR;
  const Icon = isLock ? Lock : Unlock;

  const handleAction = () => {
    onToggle(item.id, actionType);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        {/* ⭐️ Header - Đơn giản, Tiêu đề In đậm */}
        <div style={headerStyle(isLock)}>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: TEXT_COLOR,
            }}
          >
            <Icon size={20} style={{ marginRight: 8, color: iconColor }} />{" "}
            {title}
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

        {/* ⭐️ Content - Bố cục phân cấp thông tin */}
        <div style={contentStyle}>
          {/* Icon cảnh báo to, màu nhấn mạnh */}
          <AlertTriangle
            size={48}
            style={{ margin: "0 auto", color: iconColor }}
          />

          {/* Nội dung chính (In đậm) */}
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: TEXT_COLOR,
              marginTop: 5,
            }}
          >
            Bạn có chắc chắn muốn{" "}
            <span style={{ color: iconColor }}>
              {isLock ? "khóa" : "mở khóa"}
            </span>{" "}
            tài khoản này?
          </div>

          {/* Thông tin phụ (Chữ thường, màu xám) */}
          <div
            style={{ fontSize: 14, color: MUTED_TEXT_COLOR, lineHeight: 1.5 }}
          >
            Nhân viên:{" "}
            <span style={{ fontWeight: 700, color: TEXT_COLOR }}>
              {item.name}
            </span>{" "}
            (<span style={{ color: PRIMARY_COLOR }}>{item.id}</span>)
          </div>

          {/* Cảnh báo nhỏ (Chữ nhỏ hơn, màu đỏ) */}
          <div style={{ fontSize: 13, color: DANGER_COLOR, fontWeight: 500 }}>
            {isLock
              ? "Tài khoản bị khóa sẽ không thể đăng nhập."
              : "Tài khoản sẽ trở lại trạng thái Hoạt động."}
          </div>

          {/* Nút Hành động */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 10,
              gap: 12,
            }}
          >
            {/* Nút Hủy bỏ */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#e5e7eb",
                color: TEXT_COLOR,
                border: 0,
                borderRadius: 10,
                padding: "10px 20px", // Tăng padding
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Hủy bỏ
            </button>

            {/* Nút Xác nhận Khóa/Mở khóa */}
            <button
              type="button"
              onClick={handleAction}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: buttonColor,
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "10px 20px", // Tăng padding
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 16,
                boxShadow: `0 4px 10px ${buttonColor}50`,
              }}
            >
              <Icon size={18} /> {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleStatusStaffModal;
