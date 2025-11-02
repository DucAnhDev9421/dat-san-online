import React, { useState, useMemo } from "react";
import { Calendar, Download, Eye, Pencil, CheckCircle2, XCircle, Clock5 } from "lucide-react";
import { bookingData } from "../data/mockData";
import BookingDetailModal from "../modals/BookingDetailModal";
import BookingEditModal from "../modals/BookingEditModal";
import BookingScheduleModal from "../modals/BookingScheduleModal";
const ActionButton = ({ bg, Icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: bg,
      color: "#fff",
      border: 0,
      borderRadius: 8,
      padding: 8,
      marginRight: 6,
      cursor: "pointer",
    }}
  >
    <Icon size={16} />
  </button>
);

const Status = ({ value }) => {
  const map = {
    pending: {
      bg: "#e6effe",
      color: "#4338ca",
      icon: <Clock5 size={14} />,
      label: "Chờ xử lý",
    },
    confirmed: {
      bg: "#e6f9f0",
      color: "#059669",
      icon: <CheckCircle2 size={14} />,
      label: "Đã xác nhận",
    },
    cancelled: {
      bg: "#fee2e2",
      color: "#ef4444",
      icon: <XCircle size={14} />,
      label: "Đã hủy",
    },
    completed: {
      bg: "#e6f9f0",
      color: "#059669",
      icon: <CheckCircle2 size={14} />,
      label: "Hoàn thành",
    },
    "no-show": {
      bg: "#fee2e2",
      color: "#ef4444",
      icon: <XCircle size={14} />,
      label: "Không đến",
    },
  };

  const config = map[value] || map.pending;

  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

const Bookings = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // -- LƯU DATA VÀO STATE ĐỂ CÓ THỂ CẬP NHẬT --
  const [bookings, setBookings] = useState(bookingData);

  // -- THÊM STATE CHO MODAL --
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // -- THÊM STATE CHO MODAL CHỈNH SỬA --
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState(null);

  // -- THÊM STATE CHO MODAL LỊCH BIỂU --
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((r) =>
        [r.id, r.customer, r.facility, r.court, r.phone, r.email, r.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [bookings, searchQuery]
  );

  // -- THÊM HÀM ĐIỀU KHIỂN MODAL --
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedBooking(null);
  };

  // -- THÊM HÀM CHO MODAL CHỈNH SỬA --
  const handleOpenEditModal = (booking) => {
    setBookingToEdit(booking);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setBookingToEdit(null);
  };

  const handleSaveBooking = (updatedBooking) => {
    // Cập nhật mảng 'bookings' trong state
    setBookings(currentBookings =>
      currentBookings.map(b =>
        b.id === updatedBooking.id ? updatedBooking : b
      )
    );
    handleCloseEditModal();
  };

  // -- THÊM HÀM CHO MODAL LỊCH BIỂU --
  const handleOpenScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý lịch đặt sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleOpenScheduleModal}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: "#3b82f6", 
              color: "#fff", 
              border: 0, 
              borderRadius: 10, 
              padding: "10px 14px", 
              cursor: "pointer", 
              fontWeight: 700 
            }}
          >
            <Calendar size={16}/> Xem lịch biểu
          </button>
          <button
            onClick={() => alert("TODO: Xuất báo cáo")}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: "#10b981", 
              color: "#fff", 
              border: 0, 
              borderRadius: 10, 
              padding: "10px 14px", 
              cursor: "pointer", 
              fontWeight: 700 
            }}
          >
            <Download size={16}/> Xuất báo cáo
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredBookings.length} đơn đặt sân
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="no-show">Không đến</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã, khách hàng, sân, email, trạng thái…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã đặt",
                  "Khách hàng",
                  "Liên hệ",
                  "Sân",
                  "Ngày đặt",
                  "Khung giờ",
                  "Giá (VNĐ)",
                  "Thanh toán",
                  "Trạng thái",
                  "Ghi chú",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 12,
                      fontSize: 13,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.customer}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{r.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{r.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Đặt: {r.bookingDate}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.facility}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.court}</div>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.date}</td>
                  <td style={{ padding: 12, color: "#059669", fontWeight: 600 }}>{r.time}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {r.price.toLocaleString()}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.pay === "paid" ? "#e6f9f0" : 
                                 r.pay === "pending" ? "#fef3c7" : "#fee2e2",
                      color: r.pay === "paid" ? "#059669" : 
                            r.pay === "pending" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "capitalize"
                    }}>
                      {r.pay === "paid" ? "Đã thanh toán" : 
                       r.pay === "pending" ? "Chờ thanh toán" : "Hoàn tiền"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <Status value={r.status} />
                  </td>
                  <td style={{ padding: 12, maxWidth: "150px" }}>
                    {r.notes ? (
                      <div style={{ 
                        fontSize: 12, 
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }} title={r.notes}>
                        {r.notes}
                      </div>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => handleViewDetails(r)}
                      title="Xem chi tiết"
                    />
                    {r.status === "pending" && (
                      <>
                        <ActionButton
                          bg="#10b981"
                          Icon={CheckCircle2}
                          onClick={() => alert("Xác nhận " + r.id)}
                          title="Xác nhận"
                        />
                        <ActionButton
                          bg="#ef4444"
                          Icon={XCircle}
                          onClick={() => alert("Hủy " + r.id)}
                          title="Hủy"
                        />
                      </>
                    )}
                    <ActionButton
                      bg="#6b7280"
                      Icon={Pencil}
                      onClick={() => handleOpenEditModal(r)}
                      title="Sửa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredBookings.length && (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>📅</div>
                    Không có dữ liệu đặt sân
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -- RENDER MODAL TẠI ĐÂY -- */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        booking={selectedBooking}
      />

      <BookingEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveBooking}
        booking={bookingToEdit}
      />

      <BookingScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
      />
    </div>
  );
};

export default Bookings;
