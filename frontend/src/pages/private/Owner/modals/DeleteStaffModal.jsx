import React from "react";
import { X, Trash2 } from "lucide-react";

// 🎨 Định nghĩa bảng màu và styles cơ bản
const DANGER_COLOR = "#ef4444"; // Đỏ đậm (cho nút Xóa)
const BORDER_COLOR = "#e5e7eb";
const TEXT_COLOR = "#1f2937";
const MUTED_TEXT_COLOR = "#6b7280";
const WHITE_BG = "#fff"; 

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)", // Giảm độ mờ nhẹ
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBoxStyle = {
  width: 380, // Chiều rộng hẹp hơn
  background: WHITE_BG,
  borderRadius: 8, // Giảm bo tròn
  boxShadow: "0 5px 15px rgba(0,0,0,0.15)", // Box shadow nhẹ nhàng hơn
  maxHeight: "90vh",
  overflowY: "auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px", // Padding vừa phải
  borderBottom: `1px solid ${BORDER_COLOR}`,
};

const contentStyle = {
  padding: "20px 20px 0 20px", // Giữ khoảng trống ở dưới cho nút
  display: "flex",
  flexDirection: "column",
  gap: 15,
};

const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: 20,
    gap: 10,
    borderTop: `1px solid ${BORDER_COLOR}`, // Tùy chọn: Thêm đường viền mỏng
};

const DeleteStaffModal = ({ isOpen, item, onClose, onDelete }) => {
  if (!isOpen || !item) return null;

  const handleAction = () => {
    onDelete(item.id); // Gọi hàm xóa từ component cha
    // onClose() được gọi trong hàm onDelete của Staff.jsx
  };

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        {/* Header - Chỉ tiêu đề và nút đóng */}
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: TEXT_COLOR }}>
            Xóa Nhân viên
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

        {/* Content - Nội dung tối giản */}
        <div style={contentStyle}>
            
            <div style={{ fontSize: 15, color: TEXT_COLOR }}>
                Bạn có chắc chắn muốn xóa nhân viên <span style={{fontWeight: 700}}>"{item.name}"</span> (Mã: {item.id})?
            </div>
            
            <div style={{ fontSize: 13, color: DANGER_COLOR, fontWeight: 500, marginBottom: 10 }}>
                Hành động này không thể hoàn tác.
            </div>
        </div>

        {/* Footer - Nút Hủy và Xóa */}
        <div style={footerStyle}>
            {/* Nút Hủy bỏ */}
            <button
                type="button"
                onClick={onClose}
                style={{
                    background: WHITE_BG,
                    color: TEXT_COLOR,
                    border: `1px solid ${BORDER_COLOR}`,
                    borderRadius: 4,
                    padding: "8px 15px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 15,
                }}
            >
                Hủy
            </button>

            {/* Nút Xác nhận Xóa */}
            <button
                type="button"
                onClick={handleAction}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: DANGER_COLOR,
                    color: "#fff",
                    border: 0,
                    borderRadius: 4,
                    padding: "8px 15px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 15,
                }}
            >
                <Trash2 size={16} /> Xóa
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;