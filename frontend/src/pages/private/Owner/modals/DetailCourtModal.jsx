import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

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
          maxWidth: 800,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            borderBottom: "1px solid #eee",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "#374151",
            }}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{ display: "flex", gap: 20, padding: 20, flexWrap: "wrap" }}
        >
          {/* Images */}
          <div style={{ flex: "1 1 360px", minWidth: 280 }}>
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
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 8px",
                      cursor: "pointer",
                    }}
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNext}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 8px",
                      cursor: "pointer",
                    }}
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    style={{
                      border:
                        idx === i
                          ? "2px solid #10b981"
                          : "2px solid transparent",
                      padding: 0,
                      borderRadius: 6,
                      overflow: "hidden",
                      cursor: "pointer",
                      width: 72,
                      height: 48,
                      background: "#fff",
                    }}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              flex: "1 1 320px",
              minWidth: 260,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
                Giá/giờ
              </div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {price?.toLocaleString?.() ?? price} VNĐ
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
                Mô tả
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                }}
              >
                {description || "Không có mô tả."}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
                Trạng thái
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 13,
                  color: status === "active" ? "#065f46" : "#6b7280",
                  background: status === "active" ? "#bbf7d0" : "#f3f4f6",
                }}
              >
                {status === "active"
                  ? "Hoạt động"
                  : status === "maintenance"
                  ? "Bảo trì"
                  : "Tạm ngưng"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
              {type} • {capacity} người
            </div>
            </div>
            

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "10px 16px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCourtModal;
