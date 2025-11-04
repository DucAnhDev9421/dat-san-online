import React, { useState, useEffect } from "react";
import { Plus, X, Loader } from "lucide-react";
import { toast } from "react-toastify";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";
import { courtApi } from "../../../../api/courtApi";
import { facilityApi } from "../../../../api/facilityApi";
import { categoryApi } from "../../../../api/categoryApi";
import { useAuth } from "../../../../contexts/AuthContext";

const AddCourtModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  
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
  });

  const [facilityId, setFacilityId] = useState(null);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [courtTypes, setCourtTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFacility, setLoadingFacility] = useState(true);
  const [loadingCourtTypes, setLoadingCourtTypes] = useState(false);
  const [errors, setErrors] = useState({});

  // Lấy facility đầu tiên của owner khi modal mở
  useEffect(() => {
    const fetchFacility = async () => {
      if (!isOpen || !user) return;
      
      setLoadingFacility(true);
      try {
        const ownerId = user._id || user.id;
        const result = await facilityApi.getFacilities({ ownerId, limit: 1 });
        
        if (result.success && result.data?.facilities?.length > 0) {
          const facility = result.data.facilities[0];
          setFacilityId(facility._id || facility.id);
          // Hỗ trợ cả type (cũ) và types (mới)
          const types = facility.types || (facility.type ? [facility.type] : []);
          setFacilityTypes(types);
        } else {
          toast.error("Bạn chưa có cơ sở. Vui lòng tạo cơ sở trước.");
          onClose();
        }
      } catch (error) {
        console.error("Error fetching facility:", error);
        toast.error("Không thể lấy thông tin cơ sở");
        onClose();
      } finally {
        setLoadingFacility(false);
      }
    };

    fetchFacility();
  }, [isOpen, user, onClose]);

  // Lấy danh sách court types theo sport categories (hỗ trợ nhiều loại)
  useEffect(() => {
    const fetchCourtTypes = async () => {
      if (!facilityTypes || facilityTypes.length === 0) return;
      
      setLoadingCourtTypes(true);
      try {
        // Lấy tất cả sport categories
        const categoriesResult = await categoryApi.getSportCategories();
        
        // Tìm tất cả sport categories khớp với các types trong facility
        const matchingCategories = categoriesResult.data?.filter(
          cat => facilityTypes.includes(cat.name)
        ) || [];
        
        if (matchingCategories.length > 0) {
          // Lấy court types từ tất cả các sport categories tương ứng
          const courtTypesPromises = matchingCategories.map(category =>
            categoryApi.getCourtTypes({
              sportCategory: category._id,
              status: 'active'
            })
          );
          
          const results = await Promise.all(courtTypesPromises);
          
          // Hợp nhất tất cả court types và loại bỏ trùng lặp
          const allCourtTypes = results
            .flatMap(result => result.data || [])
            .filter((courtType, index, self) =>
              index === self.findIndex(t => t._id === courtType._id)
            );
          
          setCourtTypes(allCourtTypes);
        } else {
          setCourtTypes([]);
        }
      } catch (error) {
        console.error("Error fetching court types:", error);
        toast.error("Không thể lấy danh sách loại sân");
        setCourtTypes([]);
      } finally {
        setLoadingCourtTypes(false);
      }
    };

    fetchCourtTypes();
  }, [facilityTypes]);

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

    if (!facilityId) {
      toast.error("Không tìm thấy cơ sở");
      return;
    }

    setLoading(true);

    try {
      // Chuẩn bị dữ liệu để gửi API
      const courtData = {
        facility: facilityId,
        name: formData.name.trim(),
        type: formData.type,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
      };

      console.log("Creating court with data:", courtData);

      // Gọi API tạo court
      const result = await courtApi.createCourt(courtData);

      console.log("Court creation response:", result);

      if (result.success && result.data) {
        const court = result.data;
        
        console.log("Court created successfully:", court);
        toast.success(result.message || "Thêm sân thành công!");

        // Reset form
        setFormData({
          name: "",
          type: "",
          capacity: "",
          price: "",
        });
        setErrors({});

        // Call onSave callback if provided (to refresh list)
        if (onSave && typeof onSave === 'function') {
          onSave(court);
        }

        // Close modal
        onClose();
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi tạo sân");
      }
    } catch (error) {
      console.error("Error creating court:", error);
      
      // Xử lý lỗi từ handleApiError
      let errorMessage = "Có lỗi xảy ra khi tạo sân";
      
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
          {/* Loading state khi đang lấy facility */}
          {loadingFacility && (
            <div style={{ padding: "24px", textAlign: "center" }}>
              <Loader size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
              <p style={{ color: "#6b7280", fontSize: 14 }}>Đang tải thông tin...</p>
            </div>
          )}

          {/* Form chỉ hiển thị khi đã có facility */}
          {!loadingFacility && facilityId && (
            <>
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
                disabled={loadingCourtTypes}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: errors.type ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  fontSize: 15,
                  opacity: loadingCourtTypes ? 0.6 : 1,
                  cursor: loadingCourtTypes ? "not-allowed" : "pointer",
                }}
              >
                <option value="">{loadingCourtTypes ? "Đang tải..." : "Chọn loại"}</option>
                {courtTypes.map((courtType) => (
                  <option key={courtType._id} value={courtType.name}>
                    {courtType.name}
                  </option>
                ))}
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

          <div style={{ marginBottom: 24 }}>
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
            </>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || loadingFacility}
              style={{
                padding: "12px 24px",
                background: "#fff",
                color: "#374151",
                border: "2px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || loadingFacility ? "not-allowed" : "pointer",
                opacity: loading || loadingFacility ? 0.5 : 1,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || loadingFacility || !facilityId}
              style={{
                padding: "12px 24px",
                background: loading || loadingFacility || !facilityId
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || loadingFacility || !facilityId ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Thêm sân
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

export default AddCourtModal;

