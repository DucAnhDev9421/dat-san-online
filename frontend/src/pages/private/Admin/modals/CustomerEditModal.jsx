import React, { useState, useEffect } from "react";
import { X, Save, User, Settings, DollarSign, BarChart3 } from "lucide-react";

const BG_HEADER = "#eef2ff"; 
// Component con cho Tiêu đề Card (Không đổi)
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
    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
  </div>
);

// Component con cho Input (Không đổi)
const FormInput = ({ label, value, name, onChange, readOnly = false, type = "text" }) => (
  <div style={{ marginBottom: 16 }}>
    <label
      style={{
        display: "block",
        fontSize: 13,
        color: "#374151",
        fontWeight: 600,
        marginBottom: 6,
      }}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        fontSize: 14,
        background: readOnly ? "#f3f4f6" : "#fff",
        boxSizing: "border-box",
      }}
    />
  </div>
);

// Component con cho Select (Không đổi)
const FormSelect = ({ label, value, name, onChange, options }) => (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          color: "#374151",
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
          background: "#fff",
          boxSizing: "border-box",
        }}
      >
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

// Component Modal chính
const CustomerEditModal = ({ isOpen, onClose, onSave, customer }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (customer) {
      setFormData({ ...customer });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Xử lý riêng cho các trường số
    const numberFields = ['totalBookings', 'totalSpent'];
    if (numberFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen || !formData) return null;

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
        zIndex: 1010,
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
          maxWidth: "550px", // Giữ nguyên kích thước
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Không đổi) */}
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
          <h2
            style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937" }}
          >
            Chỉnh sửa người dùng:{" "}
            <span style={{ color: "#3b82f6" }}>{formData.name}</span>
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

        {/* Body (Nền xám) */}
        <div
          style={{
            padding: 24,
            background: "#f9fafb",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Card 1: Thông tin cá nhân (Không đổi) */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={User} title="Thông tin cá nhân" />
            <div style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                    <FormInput label="Mã" value={formData.id} readOnly={true} />
                    <FormInput label="Họ tên" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} />
                <FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          {/* 2. CẬP NHẬT Card 2: Thông tin hoạt động */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={BarChart3} title="Thông tin hoạt động" />
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormInput 
                label="Ngày tham gia" 
                name="joinDate" 
                value={formData.joinDate} 
                onChange={handleChange} 
                type="date"
              />
              <FormInput 
                label="Đăng nhập cuối" 
                name="lastLogin" 
                value={formData.lastLogin} 
                onChange={handleChange}
                readOnly={true} // Thường là read-only
              />
              <FormSelect
                label="Trạng thái"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Không hoạt động" },
                ]}
              />
            </div>
          </div>
          
          {/* 3. THÊM MỚI Card 3: Thông tin chi tiêu */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={DollarSign} title="Thông tin chi tiêu" />
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormInput 
                label="Số lượt đặt (lượt)" 
                name="totalBookings" 
                value={formData.totalBookings} 
                onChange={handleChange} 
                type="number"
                readOnly={true} // Thường là read-only
              />
              <FormInput 
                label="Tổng chi tiêu (VNĐ)" 
                name="totalSpent" 
                value={formData.totalSpent} 
                onChange={handleChange} 
                type="number"
                readOnly={true} // Thường là read-only
              />
            </div>
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
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Save size={16} />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerEditModal;