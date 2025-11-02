import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare, Tag } from "lucide-react";

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
const FormInput = ({ label, value, name, onChange }) => (
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
      type="text"
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
  
// Component con cho Textarea
const FormTextarea = ({ label, value, name, onChange, rows = 4 }) => (
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
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
          background: "#fff",
          boxSizing: "border-box",
          fontFamily: "inherit"
        }}
      />
    </div>
)

// Dữ liệu ban đầu cho thông báo mới
const getInitialData = () => {
    const now = new Date();
    return {
        id: `N${Math.floor(100 + Math.random() * 900)}`, // Tạo ID ngẫu nhiên
        title: "",
        message: "",
        type: "report", // Mặc định là 'Báo cáo' hoặc 'Chung'
        status: "unread",
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
    };
};

// Component Modal chính
const NotificationSendModal = ({ isOpen, onClose, onSend }) => {
  const [formData, setFormData] = useState(getInitialData());

  // Reset form mỗi khi modal được mở
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialData());
    }
  }, [isOpen]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý gửi
  const handleSend = () => {
    onSend(formData);
  };

  if (!isOpen) return null;

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
          maxWidth: "550px",
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
            borderBottom: "1px solid #e5e7eb",
            background: BG_HEADER,
          }}
        >
          <h2
            style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937", display: "flex", alignItems: "center", gap: 8 }}
          >
            <Send size={18} /> Gửi thông báo mới
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
          {/* Card: Nội dung */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={MessageSquare} title="Nội dung" />
            <div style={{ padding: 20 }}>
                <FormInput label="Tiêu đề" name="title" value={formData.title} onChange={handleChange} />
                <FormTextarea label="Nội dung" name="message" value={formData.message} onChange={handleChange} />
            </div>
          </div>

          {/* Card: Cấu hình */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={Tag} title="Cấu hình" />
            <div style={{ padding: 20 }}>
                <FormSelect
                    label="Loại thông báo"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={[
                        { value: "report", label: "Báo cáo / Chung" },
                        { value: "booking", label: "Đặt sân" },
                        { value: "payment", label: "Thanh toán" },
                        { value: "cancellation", label: "Hủy đặt sân" },
                        { value: "registration", label: "Đăng ký" },
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
            onClick={handleSend}
            style={{
              background: "#10b981", // Màu xanh lá
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
            <Send size={16} />
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSendModal;