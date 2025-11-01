import React, { useState, useEffect } from "react";

const EditCourtModal = ({ isOpen, onClose, initialData = {}, onSave }) => {
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

  useEffect(() => {
    setForm({
      id: initialData?.id ?? "",
      name: initialData?.name ?? "",
      type: initialData?.type ?? "",
      capacity: initialData?.capacity ?? "",
      price: initialData?.price ?? 0,
      status: initialData?.status ?? "inactive",
      description: initialData?.description ?? "",
      maintenance: initialData?.maintenance ?? "",
    });
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSave = () => {
    // basic validation
    if (!form.name) return alert("Vui lòng nhập tên sân");

    const payload = {
      ...form,
      capacity: Number(form.capacity) || form.capacity,
      price: Number(form.price) || 0,
    };

    onSave?.(payload);
    onClose?.();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 1000 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{form.id ? `Chỉnh sửa sân: ${form.name}` : "Thêm sân mới"}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}>✕</button>
        </div>

        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Tên sân</div>
            <input value={form.name} onChange={handleChange("name")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Loại</div>
            <input value={form.type} onChange={handleChange("type")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Sức chứa</div>
            <input type="number" value={form.capacity} onChange={handleChange("capacity")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Giá/giờ (VNĐ)</div>
            <input type="number" value={form.price} onChange={handleChange("price")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Mô tả</div>
            <textarea value={form.description} onChange={handleChange("description")} style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Trạng thái</div>
            <select value={form.status} onChange={handleChange("status")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Lịch bảo trì (miêu tả)</div>
            <input value={form.maintenance} onChange={handleChange("maintenance")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: 16, borderTop: "1px solid #eee" }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Hủy</button>
          <button onClick={handleSave} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default EditCourtModal;
