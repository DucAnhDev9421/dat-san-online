import React, { useState, useEffect } from "react";
import { X, Key, Save } from "lucide-react";

const PRIMARY_COLOR = "#3b82f6";
const DANGER_COLOR = "#ef4444";
const BORDER_COLOR = "#e5e7eb";
const TEXT_COLOR = "#1f2937";
const MUTED_TEXT_COLOR = "#6b7280";
const BG_HEADER = "#eef2ff";

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
  width: 450,
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
  padding: "16px 24px",
  borderBottom: `1px solid ${BORDER_COLOR}`,
  background: BG_HEADER,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
};

const formStyle = {
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

// Component cho trường nhập mật khẩu
const PasswordField = ({ label, name, value, onChange, error }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 13, color: MUTED_TEXT_COLOR, fontWeight: 600 }}>
      {label}
    </label>
    <input
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${error ? DANGER_COLOR : BORDER_COLOR}`,
        fontSize: 15,
        color: TEXT_COLOR,
      }}
    />
    {error && (
      <div style={{ fontSize: 12, color: DANGER_COLOR, marginTop: 2 }}>
        {error}
      </div>
    )}
  </div>
);

const ResetPasswordStaffModal = ({ isOpen, item, onClose, onReset }) => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset state khi modal đóng hoặc mở cho nhân viên khác
    setPasswords({ newPassword: "", confirmPassword: "" });
    setErrors({});
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Gọi hàm onReset từ Staff.jsx
      onReset(item.id, passwords.newPassword);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: TEXT_COLOR,
            }}
          >
            <Key size={20} style={{ marginRight: 8, color: PRIMARY_COLOR }} />
            Đặt lại mật khẩu
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

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div style={formStyle}>
            <div
              style={{
                padding: "0 0 10px 0",
                borderBottom: `1px dashed ${BORDER_COLOR}`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                Nhân viên:{" "}
                <span style={{ color: PRIMARY_COLOR }}>{item.name}</span>
              </div>
              <div style={{ fontSize: 13, color: MUTED_TEXT_COLOR }}>
                Mã: {item.id}
              </div>
            </div>

            <PasswordField
              label="Mật khẩu mới"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
            />
            <PasswordField
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 10,
                gap: 12,
              }}
            >
              {/* Nút Hủy */}
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

              {/* Nút Lưu */}
              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: PRIMARY_COLOR,
                  color: "#fff",
                  border: 0,
                  borderRadius: 10,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
                }}
              >
                <Save size={18} /> Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordStaffModal;
