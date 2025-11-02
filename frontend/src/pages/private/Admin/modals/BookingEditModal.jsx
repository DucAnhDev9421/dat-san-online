import React, { useState, useEffect } from "react";
import { X, Save, User, Calendar, DollarSign, ClipboardList } from "lucide-react";

const BG_HEADER = "#eef2ff"; 
// ... (Component CardHeader không đổi) ...
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

// ... (Component FormInput không đổi) ...
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

// ... (Component FormSelect không đổi) ...
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

// ... (Component FormTextarea không đổi) ...
const FormTextarea = ({ label, value, name, onChange }) => (
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
        rows={3}
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
);

// <-- 1. THÊM COMPONENT MỚI CHO TIMEPICKER VỚI GIAO DIỆN SÁNG MÀU -->
const FormTimePicker = ({ label, value, name, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label
      style={{
        display: "block",
        fontSize: 13,
        color: "#374151", // text-gray-900
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
          paddingRight: 14, // pe-3.5
          pointerEvents: "none",
        }}
      >
        <svg
          style={{
            width: 16, // w-4
            height: 16, // h-4
            color: "#6b7280", // text-gray-500
          }}
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
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 12px", // p-2.5
          borderRadius: 8, // rounded-lg
          border: "1px solid #d1d5db", // border-gray-300
          fontSize: 14, // text-sm
          background: "#f9fafb", // bg-gray-50
          color: "#1f2937", // text-gray-900
          boxSizing: "border-box",
          // Chúng ta không thể thêm style 'focus:' bằng inline-style,
          // nhưng trình duyệt sẽ tự thêm viền xanh (hoặc màu accent) khi focus.
        }}
      />
    </div>
  </div>
);
// -----------------------------------------------------------------

// Component Modal chính
const BookingEditModal = ({ isOpen, onClose, onSave, booking }) => {
  const [formData, setFormData] = useState(null);

  // <-- 2. Logic tách/ghép giờ (không đổi) -->
  useEffect(() => {
    if (booking) {
      const [startTime = "18:00", endTime = "20:00"] = (booking.time || "–").split('–');
      setFormData({ 
        ...booking,
        startTime,
        endTime
      });
    }
  }, [booking]);

  // ... (Hàm handleChange không đổi) ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
        setFormData(prev => ({ ...prev, price: parseInt(value) || 0 }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ... (Hàm handleSave không đổi) ...
  const handleSave = () => {
    const updatedBooking = {
      ...formData,
      time: `${formData.startTime}–${formData.endTime}`
    };
    delete updatedBooking.startTime;
    delete updatedBooking.endTime;
    onSave(updatedBooking);
  };

  if (!isOpen || !formData) return null;

  return (
    // ... (Backdrop không đổi) ...
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

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
          width: "90%",
          maxWidth: "600px",
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
            style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937" }}
          >
            Chỉnh sửa đặt sân:{" "}
            <span style={{ color: "#3b82f6" }}>{formData.id}</span>
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
          {/* ... (Card 1: Thông tin khách hàng không đổi) ... */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={User} title="Thông tin khách hàng" />
            <div style={{ padding: 20 }}>
              <FormInput label="Mã đặt sân" value={formData.id} readOnly={true} />
              <FormInput label="Tên khách hàng" name="customer" value={formData.customer} onChange={handleChange} />
              <FormInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
              <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          {/* Card 2: Thông tin đặt sân */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={Calendar} title="Thông tin đặt sân" />
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormInput label="Sân" name="facility" value={formData.facility} onChange={handleChange} />
              <FormInput label="Sân con" name="court" value={formData.court} onChange={handleChange} />
              <FormInput label="Ngày chơi" name="date" value={formData.date} onChange={handleChange} type="date" />
              
              {/* <-- 3. SỬ DỤNG COMPONENT MỚI --> */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  <FormTimePicker
                    label="Giờ bắt đầu"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                  <FormTimePicker
                    label="Giờ kết thúc"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ... (Card 3: Thanh toán & Trạng thái không đổi) ... */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={DollarSign} title="Thanh toán & Trạng thái" />
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormInput label="Giá (VNĐ)" name="price" value={formData.price} onChange={handleChange} type="number" />
              <FormSelect
                label="Trạng thái đặt sân"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                    { value: "pending", label: "Chờ xử lý" },
                    { value: "confirmed", label: "Đã xác nhận" },
                    { value: "completed", label: "Hoàn thành" },
                    { value: "cancelled", label: "Đã hủy" },
                    { value: "no-show", label: "Không đến" },
                ]}
              />
              <FormSelect
                label="Trạng thái thanh toán"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
                options={[
                    { value: "pending", label: "Chờ thanh toán" },
                    { value: "paid", label: "Đã thanh toán" },
                    { value: "refunded", label: "Đã hoàn tiền" },
                ]}
              />
            </div>
          </div>

          {/* ... (Card 4: Ghi chú không đổi) ... */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={ClipboardList} title="Ghi chú" />
            <div style={{ padding: 20 }}>
              <FormTextarea label="Ghi chú" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ... (Footer không đổi) ... */}
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

export default BookingEditModal;