import React, { useState, useMemo } from "react";
import { Download, Eye, Pencil, CheckCircle2, XCircle, Clock5 } from "lucide-react";
import { bookingData, courtData } from "../data/mockData";
import BookingDetailModal from "../modals/BookingDetailModal";
import BookingEditModal from "../modals/BookingEditModal";
import ConfirmBookingModal from "../modals/ConfirmBookingModal";
import CancelBookingModal from "../modals/CancelBookingModal";


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
      label: "Chờ xác nhận",
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  // local editable bookings state
  const [bookings, setBookings] = useState(bookingData);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const filteredBookings = useMemo(
    () =>
      bookings.filter((r) =>
        [r.id, r.customer, r.court, r.phone, r.email, r.courtType, r.notes]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery, bookings]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / pageSize)
  );
  const bookingSlice = filteredBookings.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // when a booking is selected, find the court info (images, etc.) from mock data
  const courtInfo = selectedBooking
    ? courtData.find((c) => c.name === selectedBooking.court)
    : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Đơn đặt sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xuất báo cáo đặt sân")}
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
            <div>
              <label style={{ marginRight: 8 }}>Hiển thị</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span style={{ marginLeft: 8 }}>bản ghi</span>
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
                  setPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã, khách hàng, sân, email…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
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
              {bookingSlice.map((r) => (
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
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.court}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{r.courtType}</div>
                      </div>
                    </div>
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
                      onClick={() => {
                        setSelectedBooking(r);
                        setIsDetailOpen(true);
                      }}
                      title="Xem chi tiết"
                    />
                    {r.status === "pending" && (
                      <>
                        <ActionButton
                          bg="#10b981"
                          Icon={CheckCircle2}
                          onClick={() => {
                            setSelectedBooking(r);
                            setIsConfirmOpen(true);
                          }}
                          title="Xác nhận"
                        />
                        <ActionButton
                          bg="#ef4444"
                          Icon={XCircle}
                          onClick={() => {
                            setSelectedBooking(r);
                            setIsCancelOpen(true);
                          }}
                          title="Hủy"
                        />
                      </>
                    )}
                    <ActionButton
                      bg="#6b7280"
                      Icon={Pencil}
                      onClick={() => {
                        setSelectedBooking(r);
                        setIsEditOpen(true);
                      }}
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
          }}
        >
          <div>
            Hiển thị {(page - 1) * pageSize + 1} đến{" "}
            {Math.min(page * pageSize, filteredBookings.length)} trong tổng số{" "}
            {filteredBookings.length} bản ghi
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Trước
            </button>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "#10b981",
                color: "#fff",
              }}
            >
              {page}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

        {/* Booking detail modal */}
        <BookingDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          courtInfo={courtInfo}
        />

        {/* Booking edit modal */}
        <BookingEditModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onSave={(updated) => {
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            setIsEditOpen(false);
            setSelectedBooking(null);
          }}
        />

        {/* Confirm booking modal */}
        <ConfirmBookingModal
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onConfirm={(bookingId) => {
            setBookings((prev) =>
              prev.map((b) => (b.id === bookingId ? { ...b, status: "confirmed" } : b))
            );
            setIsConfirmOpen(false);
            setSelectedBooking(null);
          }}
        />

        {/* Cancel booking modal */}
        <CancelBookingModal
          isOpen={isCancelOpen}
          onClose={() => {
            setIsCancelOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onCancel={(bookingId, reason) => {
            setBookings((prev) =>
              prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled", notes: reason } : b))
            );
            setIsCancelOpen(false);
            setSelectedBooking(null);
          }}
        />
    </div>
  );
};

export default Bookings;
