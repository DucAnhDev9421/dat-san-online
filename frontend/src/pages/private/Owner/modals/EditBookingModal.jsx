import React, { useState, useEffect } from "react";

const EditBookingModal = ({ isOpen, onClose, booking = {}, onSave }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      id: booking.id || "",
      customer: booking.customer || "",
      phone: booking.phone || "",
      email: booking.email || "",
      court: booking.court || "",
      date: booking.date || "",
      time: booking.time || "",
      price: booking.price || 0,
      status: booking.status || "pending",
      notes: booking.notes || "",
    });
  }, [booking]);

  if (!isOpen) return null;

  const handleChange = (k) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [k]: val }));
  };

  const handleSave = () => {
    // basic validation
    if (!form.id) return;
    const updated = { ...booking, ...form, price: Number(form.price) };
    onSave?.(updated);
    onClose?.();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 1000 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 640, background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Chỉnh sửa đơn {form.id}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}>✕</button>
        </div>

        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Khách hàng</div>
            <input
              value={form.customer || ""}
              readOnly
              title="Chỉ xem"
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "not-allowed" }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Số điện thoại</div>
            <input
              value={form.phone || ""}
              readOnly
              title="Chỉ xem"
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "not-allowed" }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Email</div>
            <input
              value={form.email || ""}
              readOnly
              title="Chỉ xem"
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "not-allowed" }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Sân</div>
            <input value={form.court || ""} onChange={handleChange("court")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Ngày</div>
            <input type="date" value={form.date || ""} onChange={handleChange("date")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Khung giờ</div>
            <input value={form.time || ""} onChange={handleChange("time")} placeholder="17:00-19:00" style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Giá (VNĐ)</div>
            <input type="number" value={form.price || 0} onChange={handleChange("price")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Trạng thái</div>
            <select value={form.status || "pending"} onChange={handleChange("status")} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Ghi chú</div>
            <textarea value={form.notes || ""} onChange={handleChange("notes")} style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
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

export default EditBookingModal;
