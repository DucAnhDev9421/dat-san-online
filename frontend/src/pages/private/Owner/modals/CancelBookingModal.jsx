import React, { useState } from "react";
import { X, XCircle, AlertTriangle } from "lucide-react";
import { bookingApi } from "../../../../api/bookingApi";
import { toast } from "react-toastify";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const CancelBookingModal = ({ isOpen, onClose, booking = {}, onCancel }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const cancelReasons = [
    "Khách hàng yêu cầu hủy",
    "Sân không khả dụng",
    "Thời tiết không phù hợp",
    "Bảo trì đột xuất",
    "Lý do khác",
  ];

  const handleConfirm = async () => {
    if (!reason) {
      toast.error("Vui lòng chọn lý do hủy đơn");
      return;
    }

    // Dùng bookingId (MongoDB _id) cho API, bookingCode chỉ để hiển thị
    const bookingId = booking._original?._id || booking._original?.id || booking.bookingId || booking.id;
    
    if (!bookingId) {
      toast.error('Không tìm thấy ID đơn đặt sân');
      return;
    }

    setLoading(true);
    try {
      const result = await bookingApi.updateBookingStatus(bookingId, 'cancelled', reason);
      
      if (result.success) {
        toast.success('Hủy đơn đặt sân thành công');
        if (onCancel) {
          await onCancel(bookingId, reason);
        }
        setReason("");
        if (onClose) onClose();
      } else {
        toast.error(result.message || 'Không thể hủy đơn đặt sân');
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || 'Không thể hủy đơn đặt sân');
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
          maxWidth: "500px",
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
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <XCircle size={20} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#111827" }}>
              Hủy đơn đặt sân
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
              background: "#fef2f2",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              border: "1px solid #fee2e2",
              display: "flex",
              gap: 8,
            }}
          >
            <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", marginBottom: 4 }}>
                Cảnh báo
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                Hủy đơn đặt sân sẽ thay đổi trạng thái đơn và có thể ảnh hưởng đến doanh thu.
                Khách hàng sẽ nhận được thông báo về việc hủy đơn.
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
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Lý do hủy <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: reason ? "2px solid #e5e7eb" : "2px solid #ef4444",
                fontSize: 14,
                outline: "none",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = reason ? "#e5e7eb" : "#ef4444";
              }}
            >
              <option value="">Chọn lý do hủy</option>
              {cancelReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {!reason && (
              <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                Vui lòng chọn lý do hủy
              </div>
            )}
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
            Đóng
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !reason}
            style={{
              padding: "10px 24px",
              background: loading || !reason ? "#9ca3af" : "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading || !reason ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang hủy..." : "Xác nhận hủy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;

