import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MapPin,
  Phone,
  Clock,
  Camera,
  Upload,
  Save,
  X,
  FileText,
  Building2,
  ScrollText,
  CircleDot,
  Target,
  DollarSign,
  Loader,
} from "lucide-react";
import { api } from "../../../api/axiosClient";

const SetupVenue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", // Tên cơ sở
    address: "", // Địa chỉ chi tiết (số nhà, tên đường)
    city: "", // Tỉnh/Thành phố
    district: "", // Quận/Huyện
    phoneNumber: "", // Số điện thoại
    type: "", // Loại cơ sở (required)
    pricePerHour: "", // Giá mỗi giờ (required)
    description: "", // Mô tả
    services: [], // Tiện ích
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const sportTypes = [
    "Bóng đá",
    "Bóng rổ",
    "Cầu lông",
    "Tennis",
    "Bóng chuyền",
    "Bóng bàn",
    "Khác",
  ];

  const facilities = [
    "Nhà tắm",
    "Phòng thay đồ",
    "Căng tin",
    "Bãi đỗ xe",
    "WiFi",
    "Điều hòa",
    "Nhân viên",
    "An ninh 24/7",
  ];

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://provinces.open-api.vn/api/v1/?depth=2"
        );
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when city/province changes
  useEffect(() => {
    if (formData.city && provinces.length > 0) {
      const province = provinces.find((p) => p.name === formData.city);
      if (province && province.districts) {
        setDistricts(province.districts);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [formData.city, provinces]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset district when city changes
      if (name === "city") {
        updated.district = "";
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckbox = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      }
      return { ...prev, [field]: [...currentArray, value] };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;
    if (files.length > remainingSlots) {
      toast.warning(`Chỉ có thể tải lên tối đa ${remainingSlots} ảnh`);
      files.splice(remainingSlots);
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên cơ sở";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.city.trim()) newErrors.city = "Vui lòng chọn Tỉnh/Thành phố";
    if (!formData.district.trim())
      newErrors.district = "Vui lòng chọn Quận/Huyện";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!/^[0-9]{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";
    if (!formData.type.trim())
      newErrors.type = "Vui lòng chọn loại cơ sở";
    if (!formData.pricePerHour || Number(formData.pricePerHour) <= 0)
      newErrors.pricePerHour = "Vui lòng nhập giá mỗi giờ hợp lệ";
    if (!formData.description.trim())
      newErrors.description = "Vui lòng nhập mô tả";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async (facilityId) => {
    if (images.length === 0) return [];

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      // Upload từng ảnh lên endpoint
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await api.upload(`/facilities/${facilityId}/upload`, formData);
      
      if (response.data?.success) {
        // API trả về facility với images đã upload
        return response.data.data.images || [];
      }
      return [];
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Có lỗi khi upload ảnh. Bạn có thể upload sau.");
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);

    try {
      // Ghép địa chỉ đầy đủ
      const fullAddress = `${formData.address}, ${formData.district}, ${formData.city}`;

      // Chuẩn bị dữ liệu để gửi API
      const facilityData = {
        name: formData.name.trim(),
        address: fullAddress,
        type: formData.type,
        pricePerHour: Number(formData.pricePerHour),
        phoneNumber: formData.phoneNumber.trim(),
        description: formData.description.trim(),
        services: formData.services,
        // operatingHours sẽ dùng default từ model
        // images sẽ upload sau khi tạo facility
      };

      // Gọi API tạo facility
      const response = await api.post("/facilities", facilityData);

      if (response.data?.success) {
        const facility = response.data.data;
        toast.success("Tạo cơ sở thành công!");

        // Upload ảnh nếu có
        if (images.length > 0) {
          await uploadImagesToCloudinary(facility._id || facility.id);
          toast.success("Upload ảnh thành công!");
        }

        // Redirect về owner panel
        navigate("/owner");
      } else {
        toast.error(response.data?.message || "Có lỗi xảy ra khi tạo cơ sở");
      }
    } catch (error) {
      console.error("Error creating facility:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tạo cơ sở";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Building2 size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
              Thiết lập cơ sở của bạn
            </h1>
            <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>
              Nhập thông tin cơ sở để bắt đầu quản lý
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            background: "#e5e7eb",
            height: 6,
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              height: "100%",
              width: "70%",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Thông tin cơ bản */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FileText size={20} color="#3b82f6" /> Thông tin cơ bản
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: errors.name ? "#ef4444" : "#374151",
              }}
            >
              Tên cơ sở *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Sân bóng đá ABC"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: `2px solid ${errors.name ? "#ef4444" : "#e5e7eb"}`,
                fontSize: 15,
                transition: "border-color 0.2s",
              }}
            />
            {errors.name && (
              <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: errors.address ? "#ef4444" : "#374151",
              }}
            >
              Địa chỉ chi tiết *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà, tên đường"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: `2px solid ${errors.address ? "#ef4444" : "#e5e7eb"}`,
                fontSize: 15,
                transition: "border-color 0.2s",
              }}
            />
            {errors.address && (
              <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                {errors.address}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: errors.city ? "#ef4444" : "#374151",
                }}
              >
                Thành phố/Tỉnh *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `2px solid ${errors.city ? "#ef4444" : "#e5e7eb"}`,
                  fontSize: 15,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                  paddingRight: "40px",
                }}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                  {errors.city}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: errors.district ? "#ef4444" : "#374151",
                }}
              >
                Quận/Huyện *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.city}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `2px solid ${errors.district ? "#ef4444" : "#e5e7eb"}`,
                  fontSize: 15,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                  paddingRight: "40px",
                  opacity: formData.city ? 1 : 0.6,
                  cursor: formData.city ? "pointer" : "not-allowed",
                }}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                  {errors.district}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: errors.type ? "#ef4444" : "#374151",
                }}
              >
                Loại cơ sở *
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
                  border: `2px solid ${errors.type ? "#ef4444" : "#e5e7eb"}`,
                  fontSize: 15,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                  paddingRight: "40px",
                }}
              >
                <option value="">Chọn loại cơ sở</option>
                {sportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                  {errors.type}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: errors.pricePerHour ? "#ef4444" : "#374151",
                }}
              >
                Giá mỗi giờ (VNĐ) *
              </label>
              <div style={{ position: "relative" }}>
                <DollarSign
                  size={20}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  placeholder="VD: 200000"
                  min="0"
                  step="1000"
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: 10,
                    border: `2px solid ${errors.pricePerHour ? "#ef4444" : "#e5e7eb"}`,
                    fontSize: 15,
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              {errors.pricePerHour && (
                <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                  {errors.pricePerHour}
                </div>
              )}
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Ví dụ: 200,000 VNĐ/giờ
              </div>
            </div>
          </div>
        </div>

        {/* Liên hệ */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Phone size={20} color="#059669" /> Thông tin liên hệ
          </h2>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: errors.phoneNumber ? "#ef4444" : "#374151",
              }}
            >
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="VD: 0901234567"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: `2px solid ${errors.phoneNumber ? "#ef4444" : "#e5e7eb"}`,
                fontSize: 15,
              }}
            />
            {errors.phoneNumber && (
              <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                {errors.phoneNumber}
              </div>
            )}
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              Số điện thoại liên hệ của cơ sở (10-11 chữ số)
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ScrollText size={20} color="#7c3aed" /> Mô tả cơ sở
          </h2>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: errors.description ? "#ef4444" : "#374151",
              }}
            >
              Mô tả chi tiết *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả về cơ sở của bạn..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: `2px solid ${errors.description ? "#ef4444" : "#e5e7eb"}`,
                fontSize: 15,
                resize: "vertical",
              }}
            />
            {errors.description && (
              <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                {errors.description}
              </div>
            )}
          </div>
        </div>

        {/* Tiện ích */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Target size={20} color="#10b981" /> Tiện ích
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {facilities.map((facility) => (
              <label
                key={facility}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px",
                  border: `2px solid ${
                    formData.services.includes(facility) ? "#10b981" : "#e5e7eb"
                  }`,
                  borderRadius: 10,
                  cursor: "pointer",
                  background: formData.services.includes(facility)
                    ? "#f0fdf4"
                    : "#fff",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(facility)}
                  onChange={() => handleCheckbox("services", facility)}
                  style={{ margin: 0 }}
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Hình ảnh */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Camera size={20} color="#ef4444" /> Hình ảnh cơ sở (Tối đa 5 ảnh)
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 16,
            }}
          >
            {images.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: 10,
                  padding: "40px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#f9fafb",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                <Upload size={32} color="#9ca3af" />
                <span style={{ color: "#6b7280", fontSize: 14 }}>
                  Tải ảnh lên
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
            Ảnh sẽ được upload sau khi tạo cơ sở thành công
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => navigate("/owner")}
            disabled={loading}
            style={{
              padding: "14px 32px",
              background: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: loading ? 0.5 : 1,
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            style={{
              padding: "14px 32px",
              background:
                loading || uploadingImages
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading || uploadingImages ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
              boxShadow:
                loading || uploadingImages
                  ? "none"
                  : "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            {loading || uploadingImages ? (
              <>
                <Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
                {uploadingImages ? "Đang upload ảnh..." : "Đang tạo cơ sở..."}
              </>
            ) : (
              <>
                <Save size={20} />
                Lưu & Tiếp tục
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
  );
};

export default SetupVenue;
