import React from "react";
import { X, CheckCircle } from "lucide-react";

const SUCCESS_COLOR = "#10b981"; // Màu xanh lá cho thành công
const BORDER_COLOR = "#e5e7eb";
const TEXT_COLOR = "#1f2937";
const WHITE_BG = "#fff"; 

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
  width: 380,
  background: WHITE_BG,
  borderRadius: 8,
  boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  maxHeight: "90vh",
  overflowY: "auto",
  textAlign: "center",
};

const contentStyle = {
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 15,
};

const footerStyle = {
    padding: "0 20px 20px 20px",
    borderTop: `1px solid ${BORDER_COLOR}`,
};

const PasswordResetSuccessModal = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        
        {/* Content */}
        <div style={contentStyle}>
            <CheckCircle size={48} color={SUCCESS_COLOR} style={{ marginBottom: 10 }} />

            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: SUCCESS_COLOR }}>
                Thành công!
            </h3>
            
            <div style={{ fontSize: 15, color: TEXT_COLOR, lineHeight: 1.5 }}>
                Mật khẩu của nhân viên <span style={{fontWeight: 700}}>"{item.name}"</span> đã được đặt lại thành công.
            </div>
            
            <div style={{ fontSize: 13, color: SUCCESS_COLOR, fontWeight: 500, fontStyle: 'italic' }}>
                Vui lòng thông báo mật khẩu mới cho nhân viên.
            </div>
        </div>

        {/* Footer - Nút Đóng */}
        <div style={footerStyle}>
            <button
                type="button"
                onClick={onClose}
                style={{
                    width: '100%',
                    background: SUCCESS_COLOR,
                    color: "#fff",
                    border: 0,
                    borderRadius: 4,
                    padding: "10px 15px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 15,
                }}
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccessModal;