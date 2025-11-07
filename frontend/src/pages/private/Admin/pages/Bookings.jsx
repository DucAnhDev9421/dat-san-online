import React, { useState, useMemo } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { bookingData } from "../data/mockData";
import BookingDetailModal from "../modals/BookingDetailModal";
import BookingFilters from "../components/Bookings/BookingFilters";
import BookingTable from "../components/Bookings/BookingTable";

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

  // Payment method map (statusMap không còn cần vì đã dùng StatusBadge từ shared)

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

  // Handlers
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
      booking.status === "confirmed" ? "Đã xác nhận" :
      booking.status === "pending" ? "Chờ xác nhận" :
      booking.status === "completed" ? "Đã hoàn thành" :
      booking.status === "cancelled" ? "Đã hủy" : booking.status,
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

      <BookingFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        facilityFilter={facilityFilter}
        customerFilter={customerFilter}
        dateFilter={dateFilter}
        uniqueFacilities={uniqueFacilities}
        uniqueCustomers={uniqueCustomers}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onFacilityChange={(value) => {
          setFacilityFilter(value);
          setPage(1);
        }}
        onCustomerChange={(value) => {
          setCustomerFilter(value);
          setPage(1);
        }}
        onDateChange={(value) => {
          setDateFilter(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <BookingTable
        bookings={bookingSlice}
        page={page}
        pageSize={pageSize}
        totalItems={filteredBookings.length}
        paymentMethodMap={paymentMethodMap}
        formatPrice={formatPrice}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleViewDetails}
      />

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        booking={selectedBooking}
      />
    </div>
  );
};

export default Bookings;

