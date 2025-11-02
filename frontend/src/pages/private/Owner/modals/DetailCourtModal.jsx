import React, { useState } from "react";
// 1. Thêm các icon cho CardHeader
import { X, Image, Info, DollarSign } from "lucide-react";

// 2. Component con cho Tiêu đề Card (Giống các modal khác)
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
    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
      {title}
    </h3>
  </div>
);

// 3. Component con để hiển thị từng hàng chi tiết (Giống các modal khác)
const DetailRow = ({ label, value, isBadge = false, badgeData = {} }) => (
  <div style={{ marginBottom: 16 }}>
    <div
      style={{
        fontSize: 13,
        color: "#374151",
        fontWeight: 600,
        marginBottom: 6,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    {isBadge ? (
      <span
        style={{
          background: badgeData.bg,
          color: badgeData.color,
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "capitalize",
        }}
      >
        {value}
      </span>
    ) : (
      <div
        style={{
          fontSize: 15,
          color: "#1f2937",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value || "Chưa có thông tin"}
      </div>
    )}
  </div>
);


const DetailCourtModal = ({ isOpen, onClose, court = {} }) => {
  const {
    images = [],
    name = "",
    type = "",
    capacity = "",
    price = "",
    description = "",
    status = "inactive",
  } = court;

  const [idx, setIdx] = useState(0);

  if (!isOpen) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setIdx((i) => (i <= 0 ? images.length - 1 : i - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setIdx((i) => (i >= images.length - 1 ? 0 : i + 1));
  };

  // 4. Định nghĩa màu sắc trạng thái nhất quán
  const statusMap = {
    active: { bg: "#e6f9f0", color: "#059669", text: "Hoạt động" },
    maintenance: { bg: "#fef3c7", color: "#d97706", text: "Bảo trì" },
    inactive: { bg: "#fee2e2", color: "#ef4444", text: "Tạm ngưng" },
  };
  const statusConfig = statusMap[status] || statusMap.inactive;


  return (
    // Backdrop
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
      {/* 5. Cập nhật Modal Container (nền trắng, flex-column) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 600, // Thu hẹp lại cho giao diện card
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header (Nền trắng) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937" }}>
            Chi tiết sân con: <span style={{ color: "#3b82f6" }}>{name}</span>
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#6b7280",
            }}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* 6. Body (Nền xám) */}
        <div
          style={{
            padding: 24,
            background: "#f9fafb",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Card 1: Hình ảnh */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={Image} title="Hình ảnh" />
            <div style={{ padding: 20 }}>
              {/* Image Slider (giữ nguyên logic) */}
              <div
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#f3f4f6",
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[idx]}
                    alt={`${name} ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: 320,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 320,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                    }}
                  >
                    Không có ảnh
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      style={{
                        position: "absolute",
                        left: 12, top: "50%", transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.45)", color: "#fff",
                        border: "none", borderRadius: "50%", cursor: "pointer",
                        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                      }}
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      onClick={handleNext}
                      style={{
                        position: "absolute",
                        right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.45)", color: "#fff",
                        border: "none", borderRadius: "50%", cursor: "pointer",
                        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                      }}
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnails (giữ nguyên logic) */}
              {images.length > 1 && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      style={{
                        border: idx === i ? "2px solid #3b82f6" : "2px solid transparent",
                        padding: 0, borderRadius: 6, overflow: "hidden", cursor: "pointer",
                        width: 72, height: 48, background: "#fff",
                      }}
                    >
                      <img src={src} alt={`thumb-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Thông tin chi tiết */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={Info} title="Thông tin chi tiết" />
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <DetailRow label="Loại sân" value={type} />
                <DetailRow label="Sức chứa" value={capacity ? `${capacity} người` : ""} />
              </div>
              <DetailRow label="Mô tả" value={description} />
            </div>
          </div>

          {/* Card 3: Tình trạng & Giá */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <CardHeader Icon={DollarSign} title="Tình trạng & Giá" />
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <DetailRow 
                label="Giá/giờ" 
                value={`${price?.toLocaleString?.() ?? price} VNĐ`} 
              />
              <DetailRow
                label="Trạng thái"
                value={statusConfig.text}
                isBadge={true}
                badgeData={{ bg: statusConfig.bg, color: statusConfig.color }}
              />
            </div>
          </div>
        </div>

        {/* 7. Footer (Nền trắng) */}
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
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCourtModal;