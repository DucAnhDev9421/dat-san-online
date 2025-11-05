import React, { useState, useMemo, useEffect } from "react";
import { Download } from "lucide-react";
import { courtData } from "../data/mockData";
import { bookingApi } from "../../../../api/bookingApi";
import { facilityApi } from "../../../../api/facilityApi";
import { useAuth } from "../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import BookingDetailModal from "../modals/BookingDetailModal";
import ConfirmBookingModal from "../modals/ConfirmBookingModal";
import CancelBookingModal from "../modals/CancelBookingModal";
import BookingFilters from "../components/Bookings/BookingFilters";
import BookingTable from "../components/Bookings/BookingTable";

const Bookings = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // For forcing refresh

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch owner's facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      if (!user?._id) return;
      
      try {
        const result = await facilityApi.getFacilities({ ownerId: user._id });
        if (result.success && result.data?.facilities) {
          const facilitiesList = result.data.facilities;
          setFacilities(facilitiesList);
          
          // Auto-select first facility if available and no facility is selected
          if (facilitiesList.length > 0 && !selectedFacilityId) {
            setSelectedFacilityId(facilitiesList[0]._id || facilitiesList[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast.error('Không thể tải danh sách cơ sở');
      }
    };

    fetchFacilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Fetch bookings when facility is selected
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedFacilityId) {
        setBookings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = {
          page,
          limit: pageSize,
        };

        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        // Search functionality - backend will search in user name, email, phone, etc.
        if (searchQuery) {
          params.search = searchQuery;
        }

        const result = await bookingApi.getFacilityBookings(selectedFacilityId, params);
        
        if (result.success && result.data) {
          // Transform API data to match component format
          const transformedBookings = result.data.bookings.map(booking => ({
            id: booking.bookingCode || booking._id || booking.id, // Ưu tiên bookingCode
            bookingId: booking._id || booking.id, // Giữ _id cho API calls
            customer: booking.user?.name || booking.contactInfo?.name || 'N/A',
            phone: booking.user?.phone || booking.contactInfo?.phone || 'N/A',
            email: booking.user?.email || booking.contactInfo?.email || 'N/A',
            court: booking.court?.name || 'N/A',
            courtType: booking.court?.type || 'N/A',
            date: booking.date ? new Date(booking.date).toLocaleDateString('vi-VN') : 'N/A',
            time: Array.isArray(booking.timeSlots) ? booking.timeSlots.join(', ') : booking.timeSlots || 'N/A',
            price: booking.totalAmount || 0,
            status: booking.status || 'pending',
            pay: booking.paymentStatus || 'pending',
            bookingDate: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('vi-VN') : 'N/A',
            notes: booking.contactInfo?.notes || booking.ownerNotes || '',
            // Keep original booking data for API calls
            _original: booking
          }));

          setBookings(transformedBookings);
          setTotal(result.data.pagination?.total || 0);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Không thể tải danh sách đơn đặt sân');
        setBookings([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedFacilityId, page, pageSize, statusFilter, searchQuery, refreshKey]);

  // Client-side filtering for search (if backend doesn't support search)
  const filteredBookings = useMemo(
    () => {
      // If backend supports search, no need to filter again
      if (searchQuery) {
        return bookings;
      }
      
      return bookings.filter((r) => {
        // Status filter is already handled by backend
        return true;
      });
    },
    [bookings, searchQuery]
  );

  const bookingSlice = filteredBookings;

  // when a booking is selected, find the court info (images, etc.) from mock data
  // Note: This might need to be updated to fetch from API if court images are needed
  const courtInfo = selectedBooking ? courtData.find((c) => c.name === selectedBooking.court) : null;

  // Handlers
  const handlers = {
    onView: (booking) => {
      setSelectedBooking(booking);
      setIsDetailOpen(true);
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

      {/* Facility Selector */}
      {facilities.length > 1 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            marginBottom: 16,
            padding: "16px",
          }}
        >
          <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
            Chọn cơ sở:
          </label>
          <select
            value={selectedFacilityId || ""}
            onChange={(e) => {
              setSelectedFacilityId(e.target.value);
              setPage(1); // Reset to first page when facility changes
            }}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "10px 12px",
              borderRadius: 8,
              border: "2px solid #e5e7eb",
              fontSize: 14,
              outline: "none",
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
            }}
          >
            <option value="">Chọn cơ sở</option>
            {facilities.map((facility) => (
              <option key={facility._id || facility.id} value={facility._id || facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {!selectedFacilityId && facilities.length === 0 && !loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            padding: "24px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Bạn chưa có cơ sở nào. Vui lòng tạo cơ sở trước.
        </div>
      )}

      {loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#6b7280" }}>Đang tải...</div>
        </div>
      )}

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
          totalCount={total}
        />
      </div>

      {!loading && selectedFacilityId && (
        <BookingTable
          bookings={bookingSlice}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          handlers={handlers}
        />
      )}

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

      {/* Confirm booking modal */}
      <ConfirmBookingModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirm={async (bookingId) => {
          // Refresh bookings after confirmation
          setIsConfirmOpen(false);
          setSelectedBooking(null);
          // Trigger refresh
          setRefreshKey((prev) => prev + 1);
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
        onCancel={async (bookingId, reason) => {
          // Refresh bookings after cancellation
          setIsCancelOpen(false);
          setSelectedBooking(null);
          // Trigger refresh
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default Bookings;
