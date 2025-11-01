import React, { useState, useMemo, useEffect } from "react";
import { Download, Eye, Pencil, CheckCircle2, XCircle, Clock5 } from "lucide-react";
import { bookingData, courtData } from "../data/mockData";
import EditBookingModal from "../modals/EditBookingModal";


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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailImageIdx, setDetailImageIdx] = useState(0);
  // local editable bookings state so edit modal can persist changes locally
  const [bookings, setBookings] = useState(bookingData);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);


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

  // when a booking is selected, find the court info (images, etc.) from mock data
  const courtInfo = selectedBooking
    ? courtData.find((c) => c.name === selectedBooking.court)
    : null;

  // reset selected image index when user opens a different booking
  useEffect(() => {
    setDetailImageIdx(0);
  }, [selectedBooking]);

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
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã, khách hàng, sân, email…"
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
                      onClick={() => {
                        setEditingBooking(r);
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
      </div>

        {/* Booking detail modal */}
        {isDetailOpen && selectedBooking && (
          <div
            onClick={() => {
              setIsDetailOpen(false);
              setSelectedBooking(null);
            }}
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
                maxWidth: 640,
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottom: "1px solid #eee" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Chi tiết đơn {selectedBooking.id}</h3>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{selectedBooking.customer}</div>
                </div>
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    setSelectedBooking(null);
                  }}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", gap: 16, padding: 12, flexWrap: "wrap" }}>
                {/* Left: image gallery */}
                <div style={{ flex: "0 0 280px", minWidth: 220 }}>
                  <div style={{ borderRadius: 8, overflow: "hidden", background: "#f3f4f6" }}>
                    {courtInfo?.images && courtInfo.images.length > 0 ? (
                      <img
                        src={courtInfo.images[detailImageIdx]}
                        alt={`${selectedBooking.court} - ${detailImageIdx + 1}`}
                        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                        Không có ảnh sân
                      </div>
                    )}
                  </div>

                  {courtInfo?.images && courtInfo.images.length > 1 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      {courtInfo.images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setDetailImageIdx(i)}
                          style={{
                            border: detailImageIdx === i ? "2px solid #10b981" : "2px solid transparent",
                            padding: 0,
                            borderRadius: 6,
                            overflow: "hidden",
                            cursor: "pointer",
                            width: 84,
                            height: 56,
                            background: "#fff",
                          }}
                        >
                          <img src={src} alt={`thumb-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: booking info stacked (contact, court, date/time/price, notes) */}
                <div style={{ flex: "1 1 320px", minWidth: 260, display: "flex", flexDirection: "column" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Liên hệ</div>
                    <div style={{ fontWeight: 700 }}>{selectedBooking.phone}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{selectedBooking.email}</div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Sân</div>
                    <div style={{ fontWeight: 700 }}>{selectedBooking.court}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{selectedBooking.courtType}</div>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Ngày</div>
                      <div style={{ fontWeight: 700 }}>{selectedBooking.date}</div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Khung giờ</div>
                      <div style={{ fontWeight: 700, color: "#059669" }}>{selectedBooking.time}</div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Giá</div>
                      <div style={{ fontWeight: 700 }}>{selectedBooking.price.toLocaleString()} VNĐ</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Ghi chú</div>
                    <div style={{ fontSize: 14, color: "#374151", whiteSpace: "pre-wrap" }}>{selectedBooking.notes || '-'}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: 16, borderTop: "1px solid #eee" }}>
                <button onClick={() => { setIsDetailOpen(false); setSelectedBooking(null); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Đóng</button>
              </div>
            </div>
          </div>
        )}
        {/* Edit booking modal */}
        {isEditOpen && editingBooking && (
          <EditBookingModal
            isOpen={isEditOpen}
            booking={editingBooking}
            onClose={() => {
              setIsEditOpen(false);
              setEditingBooking(null);
            }}
            onSave={(updated) => {
              // update local bookings array
              setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
              // if detail modal showing this booking, update it too
              if (selectedBooking?.id === updated.id) setSelectedBooking(updated);
            }}
          />
        )}
    </div>
  );
};

export default Bookings;
