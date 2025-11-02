import React, { useState, useEffect } from "react";
import { X, Save, Info, Settings, MessageSquare } from "lucide-react";
import { courtApi } from "../../../../api/courtApi";

// 2. Component con cho Tiêu đề Card
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

// 3. Component con cho Input
const FormInput = ({ label, value, name, onChange, type = "text" }) => (
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

// 4. Component con cho Select
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

// 5. Component con cho Textarea
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


// Component Modal chính
const EditCourtModal = ({ isOpen, onClose, initialData = {}, onSave }) => {
  // 6. Giữ nguyên logic state và các hàm xử lý
  const [form, setForm] = useState({
    id: "",
    name: "",
    type: "",
    capacity: "",
    price: 0,
    status: "inactive",
    description: "",
    maintenance: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData._id || initialData.id || "",
        name: initialData.name || "",
        type: initialData.type || "",
        capacity: initialData.capacity || "",
        price: initialData.price || 0,
        status: initialData.status || "inactive",
        description: initialData.description || "",
        maintenance: initialData.maintenance || "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name) {
      alert("Vui lòng nhập tên sân");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity) || form.capacity,
        price: Number(form.price) || 0,
        _id: form.id, // Preserve ID for API call
      };
      
      // Call onSave which will handle API call
      await onSave?.(payload);
      onClose?.();
    } catch (err) {
      console.error("Error saving court:", err);
      alert(err.message || "Có lỗi xảy ra khi lưu sân");
    } finally {
      setLoading(false);
    }
  };

  // 7. Xây dựng lại toàn bộ JSX
  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1000,
      }}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 600, // Thu hẹp lại một chút cho đẹp
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header (Nền trắng) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937" }}
          >
            {form.id ? `Chỉnh sửa sân: ` : "Thêm sân mới"}
            {form.id && <span style={{ color: "#3b82f6" }}>{form.name}</span>}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#6b7280",
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
          {/* Card 1: Thông tin cơ bản */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={Info} title="Thông tin cơ bản" />
            <div style={{ padding: 20 }}>
                <FormInput label="Tên sân" name="name" value={form.name} onChange={handleChange("name")} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                    <FormInput label="Loại (ví dụ: Sân 5, Sân 7)" name="type" value={form.type} onChange={handleChange("type")} />
                    <FormInput label="Sức chứa (người)" name="capacity" value={form.capacity} onChange={handleChange("capacity")} type="number" />
                </div>
            </div>
          </div>

          {/* Card 2: Vận hành & Giá cả */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={Settings} title="Vận hành & Giá cả" />
            <div style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                    <FormInput label="Giá/giờ (VNĐ)" name="price" value={form.price} onChange={handleChange("price")} type="number" />
                    <FormSelect
                        label="Trạng thái"
                        name="status"
                        value={form.status}
                        onChange={handleChange("status")}
                        options={[
                            { value: "active", label: "Hoạt động" },
                            { value: "maintenance", label: "Bảo trì" },
                            { value: "inactive", label: "Tạm ngưng" },
                        ]}
                    />
                </div>
                <FormInput label="Lịch bảo trì (miêu tả)" name="maintenance" value={form.maintenance} onChange={handleChange("maintenance")} />
            </div>
          </div>
          
          {/* Card 3: Mô tả */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={MessageSquare} title="Mô tả" />
            <div style={{ padding: 20 }}>
                <FormTextarea label="Mô tả chi tiết" name="description" value={form.description} onChange={handleChange("description")} />
            </div>
          </div>
        </div>

        {/* Footer (Nền trắng) */}
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
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              background: loading ? "#9ca3af" : "rgb(59, 130, 246)",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Save size={16} />
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourtModal;