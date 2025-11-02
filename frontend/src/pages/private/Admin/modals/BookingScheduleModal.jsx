import React, { useMemo } from "react";
import { X, Calendar } from "lucide-react";
import { bookingData } from "../data/mockData"; // Import data để biết ngày nào có lịch

const BG_HEADER = "#eef2ff"; 
// Component Modal
const BookingScheduleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Lấy danh sách các ngày có lịch đặt (unique)
  // Chúng ta dùng useMemo để việc này không chạy lại mỗi lần render
  const bookedDates = useMemo(() => {
    const dates = new Set();
    bookingData.forEach(booking => {
        // Chỉ lấy những lịch đã xác nhận hoặc chờ xử lý
        if (booking.status === 'confirmed' || booking.status === 'pending') {
            dates.add(booking.date);
        }
    });
    return dates;
  }, []); // Chạy 1 lần

  // --- Logic để render lịch cho Tháng 1/2025 ---
  // (Dựa trên mockData của bạn)
  const monthName = "Tháng 1, 2025";
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  
  // Ngày 1/1/2025 là Thứ Tư (index = 3)
  const firstDayOfMonth = 3; 
  const daysInMonth = 31;

  // Tạo các ô trống cho các ngày trước ngày 1
  const emptyDays = Array(firstDayOfMonth).fill(null);
  
  // Tạo các ô cho các ngày trong tháng
  const dateCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Gộp lại
  const allCells = [...emptyDays, ...dateCells];
  // ---------------------------------------------

  // Kiểu dáng cho các ô
  const cellStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '100%',
    textAlign: 'center',
    borderRadius: '50%',
  };
  
  return (
    // Backdrop
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      {/* Nội dung Modal */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
          width: "90%",
          maxWidth: "500px", // Kích thước vừa phải cho lịch
          maxHeight: "85vh",
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
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
            background: BG_HEADER,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1f2937", display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} color="#3b82f6" />
            Lịch biểu đặt sân
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: 0,
              cursor: "pointer",
              color: "#6b7280",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Nền xám nhạt) */}
        <div
          style={{
            padding: 24,
            background: "#f9fafb",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Khung lịch */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
            {/* Tên tháng */}
            <div style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>
              {monthName}
            </div>
            
            {/* Tiêu đề Thứ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {daysOfWeek.map(day => (
                <div key={day} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Các ngày */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {allCells.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} style={cellStyle}></div>;
                }

                // Kiểm tra xem ngày này có lịch không
                const dateString = `2025-01-${String(day).padStart(2, '0')}`;
                const isBooked = bookedDates.has(dateString);

                return (
                  <div 
                    key={day}
                    style={{
                      ...cellStyle,
                      background: isBooked ? '#e6f9f0' : 'transparent', // Nền xanh lá nếu có lịch
                      color: isBooked ? '#059669' : '#1f2937',
                      fontWeight: isBooked ? 700 : 400,
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
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

export default BookingScheduleModal;