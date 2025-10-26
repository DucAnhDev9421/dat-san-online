import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Camera, Upload, Save, X, FileText, Building2, ScrollText, CircleDot, Target, ImageIcon, CheckCircle } from "lucide-react";

const SetupVenue = () => {
  const [formData, setFormData] = useState({
    venueName: "",
    address: "",
    district: "",
    city: "",
    phone: "",
    email: "",
    description: "",
    openingHours: "06:00 - 22:00",
    facilities: [],
    sportTypes: [],
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const sports = ["Bóng đá", "Bóng rổ", "Cầu lông", "Tennis", "Bóng chuyền", "Khác"];
  const facilities = ["Nhà tắm", "Phòng thay đồ", "Căng tin", "Bãi đỗ xe", "WiFi", "Điều hòa", "Nhân viên", "An ninh 24/7"];

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/v1/?depth=2');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when city/province changes
  useEffect(() => {
    if (formData.city && provinces.length > 0) {
      const province = provinces.find(p => p.name === formData.city);
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
      if (name === 'city') {
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
        return { ...prev, [field]: currentArray.filter((item) => item !== value) };
      }
      return { ...prev, [field]: [...currentArray, value] };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files.slice(0, 5 - prev.length)]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.venueName.trim()) newErrors.venueName = "Vui lòng nhập tên cơ sở";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.city.trim()) newErrors.city = "Vui lòng chọn Tỉnh/Thành phố";
    if (!formData.district.trim()) newErrors.district = "Vui lòng chọn Quận/Huyện";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
    if (formData.sportTypes.length === 0) newErrors.sportTypes = "Vui lòng chọn ít nhất 1 loại sân";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // TODO: Call API to save venue data
      alert("Thiết lập cơ sở thành công!");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
          <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12, 
          marginBottom: 16 
        }}>
          <div style={{
            width: 50,
            height: 50,
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff"
          }}>
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
        <div style={{
          background: "#e5e7eb",
          height: 6,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 32
        }}>
          <div style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            height: "100%",
            width: "70%",
            transition: "width 0.3s"
          }} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Thông tin cơ bản */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={20} color="#3b82f6" /> Thông tin cơ bản
          </h2>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 600,
              color: errors.venueName ? "#ef4444" : "#374151"
            }}>
              Tên cơ sở *
            </label>
            <input
              type="text"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              placeholder="VD: Sân bóng đá ABC"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: `2px solid ${errors.venueName ? "#ef4444" : "#e5e7eb"}`,
                fontSize: 15,
                transition: "border-color 0.2s"
              }}
            />
            {errors.venueName && (
              <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                {errors.venueName}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 600,
              color: errors.address ? "#ef4444" : "#374151"
            }}>
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
                transition: "border-color 0.2s"
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
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
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
                  paddingRight: "40px"
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
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
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
                  cursor: formData.city ? "pointer" : "not-allowed"
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
        </div>

        {/* Liên hệ */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Phone size={20} color="#059669" /> Thông tin liên hệ
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: 8, 
                fontWeight: 600,
                color: errors.phone ? "#ef4444" : "#374151"
              }}>
                Số điện thoại *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="VD: 0901234567"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `2px solid ${errors.phone ? "#ef4444" : "#e5e7eb"}`,
                  fontSize: 15
                }}
              />
              {errors.phone && (
                <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                  {errors.phone}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="VD: info@venuename.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  fontSize: 15
                }}
              />
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <ScrollText size={20} color="#7c3aed" /> Mô tả cơ sở
          </h2>
          
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 600,
              color: errors.description ? "#ef4444" : "#374151"
            }}>
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
                resize: "vertical"
              }}
            />
            {errors.description && (
              <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
                {errors.description}
              </div>
            )}
          </div>
        </div>

        {/* Loại sân */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <CircleDot size={20} color="#f59e0b" /> Loại sân thể thao *
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 12
          }}>
            {sports.map((sport) => (
              <label key={sport} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px",
                border: `2px solid ${formData.sportTypes.includes(sport) ? "#10b981" : "#e5e7eb"}`,
                borderRadius: 10,
                cursor: "pointer",
                background: formData.sportTypes.includes(sport) ? "#f0fdf4" : "#fff",
                transition: "all 0.2s"
              }}>
                <input
                  type="checkbox"
                  checked={formData.sportTypes.includes(sport)}
                  onChange={() => handleCheckbox("sportTypes", sport)}
                  style={{ margin: 0 }}
                />
                <span>{sport}</span>
              </label>
            ))}
          </div>
          {errors.sportTypes && (
            <div style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>
              {errors.sportTypes}
            </div>
          )}
        </div>

        {/* Tiện ích */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={20} color="#10b981" /> Tiện ích
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12
          }}>
            {facilities.map((facility) => (
              <label key={facility} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px",
                border: `2px solid ${formData.facilities.includes(facility) ? "#10b981" : "#e5e7eb"}`,
                borderRadius: 10,
                cursor: "pointer",
                background: formData.facilities.includes(facility) ? "#f0fdf4" : "#fff",
                transition: "all 0.2s"
              }}>
                <input
                  type="checkbox"
                  checked={formData.facilities.includes(facility)}
                  onChange={() => handleCheckbox("facilities", facility)}
                  style={{ margin: 0 }}
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Hình ảnh */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Camera size={20} color="#ef4444" /> Hình ảnh cơ sở (Tối đa 5 ảnh)
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 16
          }}>
            {images.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: 10
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
                    justifyContent: "center"
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label style={{
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
                transition: "all 0.2s"
              }}>
                <Upload size={32} color="#9ca3af" />
                <span style={{ color: "#6b7280", fontSize: 14 }}>Tải ảnh lên</span>
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
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <button
            type="button"
            style={{
              padding: "14px 32px",
              background: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Bỏ qua
          </button>
          <button
            type="submit"
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
            }}
          >
            <Save size={20} />
            Lưu & Tiếp tục
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupVenue;

