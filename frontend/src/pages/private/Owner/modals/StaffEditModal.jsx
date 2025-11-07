import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Briefcase, DollarSign } from "lucide-react";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const StaffEditModal = ({ isOpen, onClose, item: staff = {}, onSave }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    performance: "Tốt",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        position: staff.position || "",
        salary: staff.salary || "",
        performance: staff.performance || "Tốt",
      });
      setErrors({});
    }
  }, [isOpen, staff]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (!formData.position.trim()) newErrors.position = "Chức vụ không được để trống";
    if (!formData.salary || formData.salary <= 0) newErrors.salary = "Lương phải lớn hơn 0";

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
      const updatedStaff = {
        ...staff,
        ...formData,
        salary: Number(formData.salary),
      };
      if (onSave) {
        await onSave(updatedStaff);
      }
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving staff:", error);
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <User size={20} color="#22c55e" />
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>
              Chỉnh sửa nhân viên
            </h3>
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
                <User size={16} />
                Họ tên <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.name ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.name && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.name}
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
                <Mail size={16} />
                Email <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.email ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.email && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.email}
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
                <Phone size={16} />
                Số điện thoại <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.phone ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.phone ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.phone && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.phone}
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
                <Briefcase size={16} />
                Chức vụ <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.position ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.position ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.position && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.position}
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
                <DollarSign size={16} />
                Lương (VNĐ) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                min="0"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: errors.salary ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.salary ? "#ef4444" : "#e5e7eb";
                }}
              />
              {errors.salary && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  {errors.salary}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Hiệu suất
              </label>
              <select
                value={formData.performance}
                onChange={(e) => handleChange("performance", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "2px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                }}
              >
                <option value="Tốt">Tốt</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Yếu">Yếu</option>
              </select>
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

export default StaffEditModal;

