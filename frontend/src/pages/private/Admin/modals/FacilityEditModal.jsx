import React, { useState, useEffect } from "react";
import { X, Save, Building2, User, Settings } from "lucide-react";

const BG_HEADER = "#eef2ff";
// Component con cho Tiêu đề Card
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

// Component con cho Input
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
        boxSizing: "border-box", // Đảm bảo padding không làm vỡ layout
      }}
    />
  </div>
);

// Component con cho Select
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
const FacilityEditModal = ({ isOpen, onClose, onSave, facility }) => {
  const [formData, setFormData] = useState(null);

  // Khi prop `facility` thay đổi (khi mở modal),
  // cập nhật state `formData` của modal
  useEffect(() => {
    if (facility) {
      setFormData({ ...facility });
    }
  }, [facility]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý lưu
  const handleSave = () => {
    onSave(formData); // Gửi dữ liệu đã cập nhật ra ngoài
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
        zIndex: 1010, // Đảm bảo modal này ở trên modal chi tiết
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
          maxWidth: "600px", // Rộng hơn một chút cho form
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: BG_HEADER,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937" }}
          >
            Chỉnh sửa sân:{" "}
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
          {/* Card 1: Thông tin chung */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <CardHeader Icon={Building2} title="Thông tin chung" />
            <div style={{ padding: 20 }}>
              <FormInput label="Mã sân" value={formData.id} readOnly={true} />
              <FormInput
                label="Tên sân"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <FormInput
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card 2: Thông tin chủ sân */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <CardHeader Icon={User} title="Thông tin chủ sân" />
            <div style={{ padding: 20 }}>
              <FormInput
                label="Tên chủ sân"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
              />
              <FormInput
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card 3: Thông tin hoạt động */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <CardHeader Icon={Settings} title="Thông tin hoạt động" />
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormInput
                label="Số sân con"
                name="courts"
                value={formData.courts}
                onChange={handleChange}
                type="number"
              />
              <FormSelect
                label="Trạng thái"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngừng hoạt động" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
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
              background: "#3b82f6", // Màu xanh dương cho "Lưu"
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

export default FacilityEditModal;