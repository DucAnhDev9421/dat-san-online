import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const AddCourtModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    price: "",
    description: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit form data to API
    alert("Thêm sân thành công!");
    onClose();
    setFormData({ name: "", type: "", capacity: "", price: "", description: "", status: "active" });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Thêm sân mới</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              padding: "4px",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>
              Tên sân *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "2px solid #e5e7eb",
                fontSize: 15,
              }}
              placeholder="VD: Sân bóng đá A1"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>
                Loại sân *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  fontSize: 15,
                }}
              >
                <option value="">Chọn loại</option>
                <option value="5 người">5 người</option>
                <option value="7 người">7 người</option>
                <option value="11 người">11 người</option>
                <option value="Tennis">Tennis</option>
                <option value="Bóng rổ">Bóng rổ</option>
                <option value="Cầu lông">Cầu lông</option>
                <option value="Bóng chuyền">Bóng chuyền</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>
                Sức chứa *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  fontSize: 15,
                }}
                placeholder="VD: 10"
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>
              Giá/giờ (VNĐ) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "2px solid #e5e7eb",
                fontSize: 15,
              }}
              placeholder="VD: 150000"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "2px solid #e5e7eb",
                fontSize: 15,
                resize: "vertical",
              }}
              placeholder="Mô tả về sân..."
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>
              Trạng thái *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "2px solid #e5e7eb",
                fontSize: 15,
              }}
            >
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                background: "#fff",
                color: "#374151",
                border: "2px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Plus size={18} />
              Thêm sân
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourtModal;

