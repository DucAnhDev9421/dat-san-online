import React, { useState, useEffect } from "react";

// <-- 1. THÊM COMPONENT TIMEPICKER MỚI (DÙNG INLINE STYLE) -->
const FormTimePicker = ({ label, value, onChange }) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: 13,
        color: "#6b7280",
        fontWeight: 600,
        marginBottom: 6,
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          paddingRight: 14,
          pointerEvents: "none",
        }}
      >
        <svg
          style={{ width: 16, height: 16, color: "#6b7280" }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="time"
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#f9fafb", // Giống màu nền input "Chỉ xem"
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
    </div>
  </div>
);
// -----------------------------------------------------------------

const EditBookingModal = ({ isOpen, onClose, booking = {}, onSave }) => {
  const [form, setForm] = useState({});

  // <-- 2. CẬP NHẬT LOGIC STATE: TÁCH GIỜ KHI MỞ -->
  useEffect(() => {
    // Tách chuỗi "18:00–20:00" thành 2 phần
    // Dùng '–' (en dash) vì nó có trong mockData
    const [startTime = "18:00", endTime = "20:00"] = (booking.time || "–").split('–');

    setForm({
      id: booking.id || "",
      customer: booking.customer || "",
      phone: booking.phone || "",
      email: booking.email || "",
      court: booking.court || "",
      date: booking.date || "",
      // time: booking.time || "", // Sẽ được xử lý bởi startTime/endTime
      startTime, // Thêm state mới
      endTime,   // Thêm state mới
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

  // <-- 3. CẬP NHẬT LOGIC LƯU: GHÉP GIỜ LẠI -->
  const handleSave = () => {
    // basic validation
    if (!form.id) return;
    
    // Ghép 2 trường giờ lại thành một chuỗi
    const combinedTime = `${form.startTime || "00:00"}–${form.endTime || "00:00"}`;

    const updated = { 
      ...booking, 
      ...form, 
      time: combinedTime, // Ghi đè 'time' bằng chuỗi đã ghép
      price: Number(form.price) 
    };
    
    // Xóa các trường tạm
    delete updated.startTime;
    delete updated.endTime;

    onSave?.(updated);
    onClose?.();
  };

  return (
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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* ... (Phần Header không đổi) ... */}
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Chỉnh sửa đơn {form.id}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {/* ... (Các trường Khách hàng, SĐT, Email, Sân, Ngày không đổi) ... */}
          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Khách hàng
            </div>
            <input
              value={form.customer || ""}
              readOnly
              title="Chỉ xem"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Số điện thoại
            </div>
            <input
              value={form.phone || ""}
              readOnly
              title="Chỉ xem"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Email
            </div>
            <input
              value={form.email || ""}
              readOnly
              title="Chỉ xem"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Sân
            </div>
            <input
              value={form.court || ""}
              onChange={handleChange("court")}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Ngày
            </div>
            <input
              type="date"
              value={form.date || ""}
              onChange={handleChange("date")}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
          
          {/* <-- 4. THAY THẾ HOÀN TOÀN KHỐI TIMEPICKER BỊ HỎNG --> */}
          {/* Chúng ta sẽ dùng 1 ô cho "Giờ bắt đầu" và 1 ô cho "Giờ kết thúc" */}
          {/* Tuy nhiên, grid của bạn đang là 2 cột, nên tôi sẽ đặt chúng lồng nhau */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormTimePicker
                    label="Giờ bắt đầu"
                    value={form.startTime || "00:00"}
                    onChange={handleChange("startTime")}
                />
                <FormTimePicker
                    label="Giờ kết thúc"
                    value={form.endTime || "00:00"}
                    onChange={handleChange("endTime")}
                />
            </div>
          </div>
          {/* ---------------------------------------------------- */}

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Giá (VNĐ)
            </div>
            <input
              type="number"
              value={form.price || 0}
              onChange={handleChange("price")}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Trạng thái
            </div>
            <select
              value={form.status || "pending"}
              onChange={handleChange("status")}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              Ghi chú (Chỉ xem)
            </div>
            <textarea
              value={form.notes || ""}
              readOnly 
              title="Chỉ xem"
              style={{
                width: "100%",
                minHeight: 80,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f9fafb", 
                cursor: "not-allowed", 
              }}
            />
          </div>
        </div>

        {/* ... (Phần Footer và các nút không đổi) ... */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: 16,
            borderTop: "1px solid #eee",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: "#10b981",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;