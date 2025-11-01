import React, { useState } from "react";
import { X, UserPlus, Save, User, Briefcase } from "lucide-react"; 

// Định nghĩa bảng màu và styles cơ bản
const PRIMARY_COLOR = "#3b82f6"; 
const DANGER_COLOR = "#ef4444";
const BORDER_COLOR = "#e5e7eb";
const TEXT_COLOR = "#1f2937";
const MUTED_TEXT_COLOR = "#6b7280";
const BG_HEADER = "#eef2ff"; 
const BG_BODY = "#eef2ff";

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
  width: 850, 
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

// Bố cục tổng thể 2 cột
const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  padding: 24,
  background: BG_BODY,
};

const columnCardStyle = {
    background: '#fff',
    padding: 20,
    borderRadius: 8,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
};

const columnHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: `1px solid ${BORDER_COLOR}`,
};

// Component cho từng trường nhập liệu
const FormField = ({ label, name, value, onChange, type = "text", error = null, options = [], placeholder = '', disabled = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 13, color: MUTED_TEXT_COLOR, fontWeight: 600 }}>
      {label}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: `1px solid ${error ? DANGER_COLOR : BORDER_COLOR}`,
          fontSize: 15,
          color: TEXT_COLOR,
          background: disabled ? '#f3f4f6' : '#fff',
          appearance: 'none',
        }}
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
        placeholder={placeholder}
        disabled={disabled}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: `1px solid ${error ? DANGER_COLOR : BORDER_COLOR}`,
          fontSize: 15,
          color: TEXT_COLOR,
          background: disabled ? '#f3f4f6' : '#fff',
        }}
      />
    )}
    {error && <div style={{ fontSize: 12, color: DANGER_COLOR, marginTop: 2 }}>{error}</div>}
  </div>
);

// ⭐️ SỬA LỖI 1: Thêm initialPassword vào state
const initialNewStaff = {
    name: '',
    phone: '',
    initialPassword: '',
    position: 'Nhân viên',
    salary: '5000000',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    performance: 'Tốt', 
};

const AddStaffModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState(initialNewStaff);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = null;
    if (name === 'phone' && value && !/^\d{10,11}$/.test(value)) {
      error = "SĐT phải có 10-11 chữ số.";
    }
    if (name === 'name' && !value) {
      error = "Bắt buộc.";
    }
    // ⭐️ SỬA LỖI 2: Thêm validation cho mật khẩu
    if (name === 'initialPassword' && (!value || value.length < 6)) {
      error = "Mật khẩu phải ít nhất 6 ký tự.";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const currentErrors = {};

    // Validate tất cả các trường bắt buộc
    if (!formData.name) { currentErrors.name = "Bắt buộc"; isValid = false; }
    if (validateField('phone', formData.phone)) { currentErrors.phone = validateField('phone', formData.phone); isValid = false; }
    // ⭐️ SỬA LỖI 3: Thêm validation mật khẩu khi submit
    if (validateField('initialPassword', formData.initialPassword)) { currentErrors.initialPassword = validateField('initialPassword', formData.initialPassword); isValid = false; }
    
    setErrors(currentErrors);
    return isValid && Object.values(currentErrors).every(err => err === null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        salary: Number(formData.salary),
      };
      
      onAdd(dataToSave);
      setFormData(initialNewStaff);
    //   onClose(); // Đã được xử lý trong Staff.jsx
    } else {
        alert("Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT_COLOR }}>
            <UserPlus size={20} style={{marginRight: 8, color: PRIMARY_COLOR}} /> Thêm Nhân viên Mới
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
          <div style={mainGridStyle}>
            
            {/* Cột 1: Thông tin Cá nhân */}
            <div style={columnCardStyle}>
                <div style={columnHeaderStyle}>
                    <User size={18} style={{marginRight: 8, color: PRIMARY_COLOR}}/>
                    <h4 style={{margin: 0, fontSize: 16, fontWeight: 700}}>Thông tin cá nhân</h4>
                </div>
                
                <FormField 
                    label="Họ tên (*)" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    error={errors.name}
                    placeholder="Nhập họ tên đầy đủ"
                />
                <FormField 
                    label="Liên hệ (SĐT) (*)" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    error={errors.phone}
                    placeholder="Nhập SĐT hợp lệ"
                />
                {/* ⭐️ SỬA LỖI 4: Mở khóa trường Mật khẩu */}
                <FormField 
                    label="Mật khẩu ban đầu (*)" 
                    name="initialPassword" 
                    value={formData.initialPassword} // 🚨 SỬA: Lấy từ state
                    onChange={handleChange} // 🚨 THÊM: Cho phép thay đổi
                    type="text" // (Bạn có thể đổi sang type="password")
                    disabled={false} // 🚨 SỬA: Mở khóa (disabled=false)
                    error={errors.initialPassword}
                />
            </div>

            {/* Cột 2: Công việc & Quyền hạn */}
            <div style={columnCardStyle}>
                <div style={columnHeaderStyle}>
                    <Briefcase size={18} style={{marginRight: 8, color: PRIMARY_COLOR}}/>
                    <h4 style={{margin: 0, fontSize: 16, fontWeight: 700}}>Công việc & Quyền hạn</h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <FormField 
                        label="Chức vụ" 
                        name="position" 
                        value={formData.position} 
                        onChange={handleChange} 
                        type="select"
                        options={[
                            { value: 'Quản lý sân', label: 'Quản lý sân' },
                            { value: 'Nhân viên', label: 'Nhân viên' },
                            { value: 'Nhân viên bảo trì', label: 'Nhân viên bảo trì' },
                            { value: 'Nhân viên thu ngân', label: 'Nhân viên thu ngân' },
                        ]}
                    />
                    <FormField 
                        label="Lương (VNĐ)" 
                        name="salary" 
                        value={formData.salary} 
                        onChange={handleChange} 
                        type="number"
                        placeholder="VD: 7000000"
                    />
                    <FormField 
                        label="Ngày vào làm" 
                        name="joinDate" 
                        value={formData.joinDate} 
                        onChange={handleChange} 
                        type="date"
                    />
                    <FormField 
                        label="Trạng thái ban đầu" 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        type="select"
                        options={[
                            { value: 'active', label: 'Hoạt động' },
                            { value: 'inactive', label: 'Tạm ngưng' },
                        ]}
                    />
                    
                    {/* (Vấn đề Hiệu suất) - Code này đã đúng */}
                    <FormField 
                        label="Hiệu suất ban đầu" 
                        name="performance" 
                        value={formData.performance} 
                        onChange={handleChange} 
                        type="select"
                        options={[
                            { value: 'Tốt', label: 'Tốt' },
                            { value: 'Trung bình', label: 'Trung bình' },
                            { value: 'Thấp', label: 'Thấp' },
                            { value: 'N/A', label: 'Chưa đánh giá' },
                        ]}
                    />
                    
                    <div></div> 
                </div>
            </div>
          </div>
          
          {/* Footer - Nút Hành động (Full Width) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', gap: 12, borderTop: `1px solid ${BORDER_COLOR}`, background: '#fff' }}>
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
                <Save size={18} /> Thêm nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;