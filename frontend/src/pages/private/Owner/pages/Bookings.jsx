import React, { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { bookingData, courtData } from "../data/mockData";
import BookingDetailModal from "../modals/BookingDetailModal";
import BookingEditModal from "../modals/BookingEditModal";
import ConfirmBookingModal from "../modals/ConfirmBookingModal";
import CancelBookingModal from "../modals/CancelBookingModal";
import BookingFilters from "../components/Bookings/BookingFilters";
import BookingTable from "../components/Bookings/BookingTable";

const Bookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState(bookingData);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search query with status filter
  const finalSearchQuery = useMemo(() => {
    if (statusFilter !== "all") {
      return statusFilter;
    }
    return searchQuery;
  }, [searchQuery, statusFilter]);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((r) => {
        // Status filter
        if (statusFilter !== "all" && r.status !== statusFilter) {
          return false;
        }
        // Search filter
        if (statusFilter === "all" && searchQuery) {
          return [r.id, r.customer, r.court, r.phone, r.email, r.courtType, r.notes]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return true;
      }),
    [searchQuery, statusFilter, bookings]
  );

  const bookingSlice = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  // when a booking is selected, find the court info (images, etc.) from mock data
  const courtInfo = selectedBooking ? courtData.find((c) => c.name === selectedBooking.court) : null;

  // Handlers
  const handlers = {
    onView: (booking) => {
      setSelectedBooking(booking);
      setIsDetailOpen(true);
    },
    onEdit: (booking) => {
      setSelectedBooking(booking);
      setIsEditOpen(true);
    },
    onConfirm: (booking) => {
      setSelectedBooking(booking);
      setIsConfirmOpen(true);
    },
    onCancel: (booking) => {
      setSelectedBooking(booking);
      setIsCancelOpen(true);
    },
  };

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
              fontWeight: 700,
            }}
          >
            <Download size={16} /> Xuất báo cáo
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 16,
        }}
      >
        <BookingFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          totalCount={filteredBookings.length}
        />
      </div>

      <BookingTable
        bookings={bookingSlice}
        page={page}
        pageSize={pageSize}
        total={filteredBookings.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        handlers={handlers}
      />

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
