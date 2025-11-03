import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, FileText } from "lucide-react";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const BookingEditModal = ({ isOpen, onClose, booking = {}, onSave }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      setFormData({
        date: booking.date || "",
        time: booking.time || "",
        notes: booking.notes || "",
      });
      setErrors({});
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.date.trim()) newErrors.date = "Ngày không được để trống";
    if (!formData.time.trim()) newErrors.time = "Khung giờ không được để trống";
    // Validate time format (should be like "17:00-19:00")
    if (formData.time && !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Định dạng khung giờ không đúng (VD: 17:00-19:00)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedBooking = {
        ...booking,
        ...formData,
      };
      if (onSave) {
        await onSave(updatedBooking);
      }
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving booking:", error);
    } finally {
      setLoading(false);
    }
  };

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
        ref={modalRef}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
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
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>
              Chỉnh sửa đơn đặt sân
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0 0" }}>
              {booking.id} • {booking.customer}
            </p>
          </div>
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

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                <Calendar size={16} />
                Ngày đặt sân <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.date ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.date ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.date && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.date}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                <Clock size={16} />
                Khung giờ <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                placeholder="VD: 17:00-19:00"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.time ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.time ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.time && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.time}
                </div>
              )}
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Định dạng: HH:mm-HH:mm (VD: 17:00-19:00)
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                <FileText size={16} />
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Thêm ghi chú cho đơn đặt sân..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px",
                  borderRadius: 8,
                  border: "2px solid #e5e7eb",
                  fontSize: 14,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              padding: "20px 24px",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 24px",
                background: "#fff",
                color: "#374151",
                border: "2px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                background: loading ? "#9ca3af" : "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingEditModal;

