import React, { useState, useEffect } from "react";
import { X, Save, User, Briefcase, Settings } from "lucide-react";

const PRIMARY_COLOR = "#3b82f6"; 
const DANGER_COLOR = "#ef4444"; 
const SUCCESS_COLOR = "#059669"; 
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
  width: 700,
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

const formSectionStyle = {
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 20, // Khoảng cách giữa các Card
};

const CardStyle = {
    background: "#fff",
    border: `1px solid ${BORDER_COLOR}`,
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

const GridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Chia form thành 2 cột
    gap: "16px 20px",
};

const fullWidth = {
  gridColumn: "span 2",
};

// Component cho từng trường nhập liệu
const FormField = ({ label, name, value, onChange, type = "text", disabled = false, options = [], error = null }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 13, color: MUTED_TEXT_COLOR, fontWeight: 600 }}>
      {label}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: `1px solid ${error ? DANGER_COLOR : BORDER_COLOR}`,
          fontSize: 15,
          color: TEXT_COLOR,
          background: disabled ? '#f3f4f6' : '#fff',
          cursor: disabled ? 'not-allowed' : 'auto',
          appearance: 'none', // Tắt mũi tên mặc định trên select
        }}
        disabled={disabled}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: `1px solid ${error ? DANGER_COLOR : BORDER_COLOR}`,
          fontSize: 15,
          color: TEXT_COLOR,
          background: disabled ? '#f3f4f6' : '#fff',
          cursor: disabled ? 'not-allowed' : 'auto',
        }}
        disabled={disabled}
      />
    )}
    {error && <div style={{ fontSize: 12, color: DANGER_COLOR, marginTop: 2 }}>{error}</div>}
  </div>
);

// Component Badge cho Trạng thái
const StatusBadge = ({ status }) => {
    const isSuccess = status === 'active';
    const bgColor = isSuccess ? "#e6f9f0" : "#f3f4f6"; 
    const color = isSuccess ? SUCCESS_COLOR : MUTED_TEXT_COLOR; 

    return (
        <span
            style={{
                background: bgColor,
                color: color,
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                display: 'inline-block',
                minWidth: 100,
                textAlign: 'center'
            }}
        >
            {status === 'active' ? "Hoạt động" : "Tạm ngưng"}
        </span>
    );
};

const StaffEditModal = ({ isOpen, item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        salary: item.salary.toString(), // Chuyển lương sang chuỗi để input type="number" không lỗi
        permissions: Array.isArray(item.permissions) ? item.permissions.join(', ') : item.permissions,
      });
      setErrors({});
    }
  }, [item]);

  if (!isOpen || !item) return null;
    
  const validateField = (name, value) => {
    let error = null;
    if (name === 'phone' && value && !/^\d{10,11}$/.test(value)) {
      error = "SĐT phải có 10-11 chữ số.";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra tất cả các lỗi trước khi lưu
    const hasErrors = Object.values(errors).some(err => err !== null);
    if (hasErrors) {
        alert("Vui lòng sửa các lỗi nhập liệu trước khi lưu.");
        return;
    }

    const dataToSave = {
        ...formData,
        salary: Number(formData.salary), // Đảm bảo lương là số
        permissions: formData.permissions.split(',').map(p => p.trim()).filter(p => p),
    };

    onSave(dataToSave); // Gọi hàm lưu từ component cha
    // Không đóng modal ở đây, để hàm onSave trong Staff.jsx xử lý toast và đóng
  };

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: TEXT_COLOR }}>
            <span style={{fontSize: 20, marginRight: 8}}></span> Chỉnh sửa Nhân viên: <span style={{color: PRIMARY_COLOR}}>{item.name || "N/A"}</span>
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
          <div style={formSectionStyle}>
            
            {/* 1. Thông tin cá nhân */}
            <div style={CardStyle}>
                <div style={CardHeaderStyle}>
                    <User size={18} style={{marginRight: 8}}/>
                    <h4 style={{margin: 0, fontSize: 16, fontWeight: 700}}>Thông tin cá nhân</h4>
                </div>
                <div style={GridContainerStyle}>
                    <FormField 
                        label="Mã" 
                        name="id" 
                        value={formData.id || ''} 
                        onChange={handleChange} 
                        disabled={true} 
                    />
                    <FormField 
                        label="Họ tên" 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleChange} 
                    />
                    <FormField 
                        label="Liên hệ (SĐT)" 
                        name="phone" 
                        value={formData.phone || ''} 
                        onChange={handleChange} 
                        error={errors.phone} // Thêm feedback
                    />
                </div>
            </div>

            {/* 2. Thông tin công việc */}
            <div style={CardStyle}>
                <div style={CardHeaderStyle}>
                    <Briefcase size={18} style={{marginRight: 8}}/>
                    <h4 style={{margin: 0, fontSize: 16, fontWeight: 700}}>Thông tin công việc</h4>
                </div>
                <div style={GridContainerStyle}>
                    <FormField 
                        label="Chức vụ" 
                        name="position" 
                        value={formData.position || ''} 
                        onChange={handleChange} 
                    />
                    <FormField 
                        label="Lương (VNĐ)" 
                        name="salary" 
                        value={formData.salary || ''} 
                        onChange={handleChange} 
                        type="number"
                    />
                    <FormField 
                        label="Ngày vào làm" 
                        name="joinDate" 
                        value={formData.joinDate || ''} 
                        onChange={handleChange} 
                        type="date"
                    />
                    <FormField 
                        label="Trạng thái" 
                        name="status" 
                        value={formData.status || 'active'} 
                        onChange={handleChange} 
                        type="select"
                        options={[
                            { value: 'active', label: 'Hoạt động' },
                            { value: 'inactive', label: 'Tạm ngưng' },
                        ]}
                    />
                </div>
                
            </div>

            {/* Footer / Nút hành động */}
            <div style={{...fullWidth, display: 'flex', justifyContent: 'flex-end', paddingTop: 10, gap: 12}}>
                {/* Nút Hủy (nhỏ, xám) */}
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        background: '#e5e7eb',
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

                {/* Nút Lưu (lớn, primary) */}
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
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                    }}
                >
                    <Save size={18} /> Lưu thay đổi
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffEditModal;