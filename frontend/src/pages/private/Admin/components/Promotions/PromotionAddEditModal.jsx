import React from "react";
import { X } from "lucide-react";

const PromotionAddEditModal = ({
  isOpen,
  isEdit,
  promotion,
  selectedFacilities,
  uniqueFacilities,
  onFacilitiesChange,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const promotionData = {
      code: formData.get("code").toUpperCase(),
      name: formData.get("name"),
      discountType: formData.get("discountType"),
      discountValue: Number(formData.get("discountValue")),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      applicableFacilities:
        selectedFacilities.length > 0 ? selectedFacilities : ["Tất cả sân"],
      applicableAreas: formData
        .get("applicableAreas")
        ?.split(",")
        .map((a) => a.trim())
        .filter((a) => a) || [],
      maxUsage: formData.get("maxUsage")
        ? Number(formData.get("maxUsage"))
        : null,
      usageCount: promotion?.usageCount || 0,
    };
    onSave(promotionData);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 0 }}>
            {isEdit ? "Sửa chương trình khuyến mãi" : "Tạo chương trình khuyến mãi mới"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Mã khuyến mãi *
              </label>
              <input
                name="code"
                defaultValue={promotion?.code || ""}
                required
                placeholder="VD: HELLO2025"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Tên chương trình *
              </label>
              <input
                name="name"
                defaultValue={promotion?.name || ""}
                required
                placeholder="VD: Khuyến mãi chào năm mới"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Loại giảm giá *
                </label>
                <select
                  name="discountType"
                  defaultValue={promotion?.discountType || "percentage"}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                  }}
                >
                  <option value="percentage">Theo phần trăm (%)</option>
                  <option value="fixed">Theo số tiền (VNĐ)</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Mức giảm *
                </label>
                <input
                  name="discountValue"
                  type="number"
                  defaultValue={promotion?.discountValue || ""}
                  required
                  min="1"
                  placeholder="20 hoặc 50000"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Ngày bắt đầu *
                </label>
                <input
                  name="startDate"
                  type="date"
                  defaultValue={promotion?.startDate || ""}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Ngày kết thúc *
                </label>
                <input
                  name="endDate"
                  type="date"
                  defaultValue={promotion?.endDate || ""}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Áp dụng cho sân *
              </label>
              <select
                name="applicableFacilities"
                multiple
                size={5}
                value={selectedFacilities}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  onFacilitiesChange(values);
                }}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              >
                {uniqueFacilities.map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Giữ Ctrl/Cmd để chọn nhiều sân, hoặc chọn "Tất cả sân"
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Áp dụng cho khu vực (tùy chọn)
              </label>
              <input
                name="applicableAreas"
                defaultValue={promotion?.applicableAreas?.join(", ") || ""}
                placeholder="VD: Quận 1, Quận 2 (phân cách bằng dấu phẩy)"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Số lượt sử dụng tối đa (tùy chọn)
              </label>
              <input
                name="maxUsage"
                type="number"
                defaultValue={promotion?.maxUsage || ""}
                min="1"
                placeholder="Để trống nếu không giới hạn"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                background: "#fff",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionAddEditModal;

