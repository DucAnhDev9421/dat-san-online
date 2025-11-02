import React, { useState, useMemo } from "react";
import { Download, Eye, Filter, FileSpreadsheet } from "lucide-react";
import { bookingData } from "../data/mockData";
import BookingDetailModal from "../modals/BookingDetailModal";

const Bookings = () => {
  const [bookings, setBookings] = useState(bookingData);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bộ lọc
  const [statusFilter, setStatusFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Lấy danh sách duy nhất
  const uniqueFacilities = useMemo(() => {
    return [...new Set(bookings.map((b) => b.facility))].sort();
  }, [bookings]);

  const uniqueCustomers = useMemo(() => {
    return [...new Set(bookings.map((b) => b.customer))].sort();
  }, [bookings]);

  // Status map
  const statusMap = {
    confirmed: { label: "Đã đặt", color: "#059669", bg: "#e6f9f0" },
    pending: { label: "Đã đặt", color: "#d97706", bg: "#fef3c7" },
    completed: { label: "Hoàn thành", color: "#059669", bg: "#e6f9f0" },
    cancelled: { label: "Đã hủy", color: "#ef4444", bg: "#fee2e2" },
  };

  const paymentMethodMap = {
    Momo: { label: "Momo", color: "#ea4c89", bg: "#fce7f3" },
    VNPay: { label: "VNPay", color: "#0052d9", bg: "#e6f0ff" },
    "Tiền mặt": { label: "Tiền mặt", color: "#059669", bg: "#e6f9f0" },
  };

  // Lọc dữ liệu
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        searchQuery === "" ||
        [
          booking.id,
          booking.customer,
          booking.facility,
          booking.phone,
          booking.email,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && booking.status === "confirmed") ||
        (statusFilter === "pending" && booking.status === "pending") ||
        (statusFilter === "completed" && booking.status === "completed") ||
        (statusFilter === "cancelled" && booking.status === "cancelled");

      const matchesFacility =
        facilityFilter === "all" || booking.facility === facilityFilter;

      const matchesCustomer =
        customerFilter === "all" || booking.customer === customerFilter;

      const matchesDate = !dateFilter || booking.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFacility &&
        matchesCustomer &&
        matchesDate
      );
    });
  }, [
    bookings,
    searchQuery,
    statusFilter,
    facilityFilter,
    customerFilter,
    dateFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / pageSize)
  );
  const bookingSlice = filteredBookings.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Hàm xem chi tiết
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedBooking(null);
  };

  // Hàm xuất Excel/CSV
  const exportToCSV = () => {
    const headers = [
      "Mã đơn đặt sân",
      "Tên sân",
      "Người đặt",
      "Thời gian bắt đầu",
      "Thời gian kết thúc",
      "Trạng thái",
      "Phương thức thanh toán",
      "Tổng tiền (VNĐ)",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.facility,
      booking.customer,
      `${booking.date} ${booking.startTime}`,
      `${booking.date} ${booking.endTime}`,
      statusMap[booking.status]?.label || booking.status,
      booking.paymentMethod || "N/A",
      booking.price.toLocaleString("vi-VN"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `danh-sach-dat-san-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Gọi CSV vì Excel có thể mở CSV
    exportToCSV();
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setFacilityFilter("all");
    setCustomerFilter("all");
    setDateFilter("");
    setSearchQuery("");
    setPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý đặt sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={exportToCSV}
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
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <Download size={16} /> Xuất CSV
          </button>
          <button
            onClick={exportToExcel}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#059669",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <FileSpreadsheet size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Filter size={18} color="#6b7280" />
          <span style={{ fontWeight: 600, color: "#374151" }}>Bộ lọc</span>
          {(statusFilter !== "all" ||
            facilityFilter !== "all" ||
            customerFilter !== "all" ||
            dateFilter ||
            searchQuery) && (
            <button
              onClick={resetFilters}
              style={{
                marginLeft: "auto",
                padding: "6px 12px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Tìm kiếm
            </label>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Mã đơn, tên sân, người đặt..."
              style={{
                width: "100%",
                padding: 8,
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
                color: "#6b7280",
              }}
            >
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              <option value="all">Tất cả</option>
              <option value="confirmed">Đã đặt</option>
              <option value="pending">Đã đặt (Chờ xử lý)</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Tên sân
            </label>
            <select
              value={facilityFilter}
              onChange={(e) => {
                setFacilityFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              <option value="all">Tất cả sân</option>
              {uniqueFacilities.map((facility) => (
                <option key={facility} value={facility}>
                  {facility}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Người đặt
            </label>
            <select
              value={customerFilter}
              onChange={(e) => {
                setCustomerFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              <option value="all">Tất cả người đặt</option>
              {uniqueCustomers.map((customer) => (
                <option key={customer} value={customer}>
                  {customer}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Ngày đặt
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
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
            padding: 12,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <label style={{ marginRight: 8 }}>Show</label>
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
            <span style={{ marginLeft: 8 }}>entries</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            Hiển thị {filteredBookings.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã đơn đặt sân",
                  "Tên sân",
                  "Người đặt",
                  "Thời gian bắt đầu / kết thúc",
                  "Trạng thái",
                  "Phương thức thanh toán",
                  "Tổng tiền",
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
              {bookingSlice.map((booking, idx) => {
                const status = statusMap[booking.status] || {
                  label: booking.status,
                  color: "#6b7280",
                  bg: "#f3f4f6",
                };
                const paymentMethod = paymentMethodMap[booking.paymentMethod] || {
                  label: booking.paymentMethod || "N/A",
                  color: "#6b7280",
                  bg: "#f3f4f6",
                };

                return (
                  <tr
                    key={booking.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>
                      {booking.id}
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>
                      {booking.facility}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{booking.customer}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {booking.phone}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {booking.date}
                        </div>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background: status.bg,
                          color: status.color,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background: paymentMethod.bg,
                          color: paymentMethod.color,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {paymentMethod.label}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 12,
                        fontWeight: 700,
                        color: "#059669",
                      }}
                    >
                      {formatPrice(booking.price)} VNĐ
                    </td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleViewDetails(booking)}
                        style={{
                          background: "#06b6d4",
                          color: "#fff",
                          border: 0,
                          borderRadius: 8,
                          padding: "8px 12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={14} />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!bookingSlice.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy đơn đặt sân nào
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
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filteredBookings.length)} of{" "}
            {filteredBookings.length} entries
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
              Previous
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
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal chi tiết */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        booking={selectedBooking}
      />
    </div>
  );
};

export default Bookings;
