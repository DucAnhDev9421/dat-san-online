import React from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const ConfirmBookingModal = ({ isOpen, onClose, booking = {}, onConfirm }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    if (onConfirm && booking?.id) {
      onConfirm(booking.id);
    }
    if (onClose) onClose();
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
          maxWidth: "480px",
          overflow: "hidden",
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
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle size={20} color="#059669" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>
              Xác nhận đơn đặt sân
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
        <div style={{ padding: "24px" }}>
          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              border: "1px solid #dcfce7",
              display: "flex",
              gap: 8,
            }}
          >
            <AlertCircle size={18} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#059669", marginBottom: 4 }}>
                Xác nhận đơn đặt sân
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                Đơn đặt sân sẽ được xác nhận và khách hàng sẽ nhận được thông báo.
              </div>
            </div>
          </div>

          <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Thông tin đơn đặt:</div>
            <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.8 }}>
              <div><strong>Mã đặt:</strong> {booking.id}</div>
              <div><strong>Khách hàng:</strong> {booking.customer}</div>
              <div><strong>Sân:</strong> {booking.court}</div>
              <div><strong>Ngày:</strong> {booking.date}</div>
              <div><strong>Khung giờ:</strong> {booking.time}</div>
              <div><strong>Giá:</strong> {booking.price ? `${booking.price.toLocaleString()} VNĐ` : "Chưa có"}</div>
            </div>
          </div>

          <p style={{ fontSize: 15, color: "#374151", margin: 0, lineHeight: 1.6 }}>
            Bạn có chắc muốn xác nhận đơn đặt sân <strong>{booking.id}</strong>?
          </p>
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
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "10px 24px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingModal;

