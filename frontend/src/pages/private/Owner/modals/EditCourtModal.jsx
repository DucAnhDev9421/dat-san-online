import React, { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import { toast } from "react-toastify";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";
import { courtApi } from "../../../../api/courtApi";



// Component Modal chính
const EditCourtModal = ({ isOpen, onClose, initialData = {}, onSave }) => {
  // Lock body scroll
  useBodyScrollLock(isOpen)
  
  // Handle escape key
  useEscapeKey(onClose, isOpen)
  
  // Handle click outside
  const modalRef = useClickOutside(onClose, isOpen)

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    price: "",
    status: "active",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        capacity: initialData.capacity?.toString() || "",
        price: initialData.price?.toString() || "",
        status: initialData.status || "active",
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Tên sân là bắt buộc";
    }
    
    if (!formData.type) {
      newErrors.type = "Loại sân là bắt buộc";
    }
    
    if (!formData.capacity || Number(formData.capacity) < 1) {
      newErrors.capacity = "Sức chứa phải lớn hơn 0";
    }
    
    if (!formData.price || Number(formData.price) < 0) {
      newErrors.price = "Giá thuê không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const courtId = initialData._id || initialData.id;
    if (!courtId) {
      toast.error("Không tìm thấy ID sân");
      return;
    }

    setLoading(true);

    try {
      // Chuẩn bị dữ liệu để gửi API
      const courtData = {
        name: formData.name.trim(),
        type: formData.type,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        status: formData.status || "active",
      };

      console.log("Updating court with data:", courtData);

      // Gọi API cập nhật court
      const result = await courtApi.updateCourt(courtId, courtData);

      console.log("Court update response:", result);

      if (result.success && result.data) {
        const court = result.data;
        
        console.log("Court updated successfully:", court);
        toast.success(result.message || "Cập nhật sân thành công!");

        // Call onSave callback if provided (to refresh list)
        if (onSave && typeof onSave === 'function') {
          onSave(court);
        }

        // Close modal
        onClose();
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi cập nhật sân");
      }
    } catch (error) {
      console.error("Error updating court:", error);
      
      // Xử lý lỗi từ handleApiError
      let errorMessage = "Có lỗi xảy ra khi cập nhật sân";
      
      if (error.status === 0) {
        // Network error
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        errorMessage = error.message || errorMessage;
        
        // Hiển thị lỗi validation nếu có
        if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
          const validationErrors = error.errors.map(err => err.msg || err.message || err).join(", ");
          errorMessage = validationErrors || errorMessage;
        }
      }
      
      toast.error(errorMessage);
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
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Chỉnh sửa sân</h2>
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
                border: errors.name ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: 15,
              }}
              placeholder="VD: Sân bóng đá A1"
            />
            {errors.name && (
              <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.name}</p>
            )}
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
                  border: errors.type ? "2px solid #ef4444" : "2px solid #e5e7eb",
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
              {errors.type && (
                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.type}</p>
              )}
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
                  border: errors.capacity ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 15,
                }}
                placeholder="VD: 10"
              />
              {errors.capacity && (
                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.capacity}</p>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
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
                  border: errors.price ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 15,
                }}
                placeholder="VD: 150000"
              />
              {errors.price && (
                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.price}</p>
              )}
            </div>
            <div>
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
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "#fff",
                color: "#374151",
                border: "2px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
          
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </form>
      </div>
    </div>
  );
};

export default EditCourtModal;