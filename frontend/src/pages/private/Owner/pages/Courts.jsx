import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { courtApi } from "../../../../api/courtApi";
import { facilityApi } from "../../../../api/facilityApi";
import { useAuth } from "../../../../contexts/AuthContext";
import AddCourtModal from "../modals/AddCourtModal";
import DetailCourtModal from "../modals/DetailCourtModal";
import ActivateCourtModal from "../modals/ActivateCourtModal";
import EditCourtModal from "../modals/EditCourtModal";
import DeleteCourtModal from "../modals/DeleteCourtModal";
import SetMaintenanceModal from "../modals/SetMaintenanceModal";
import ScheduleMaintenanceModal from "../modals/ScheduleMaintenanceModal";
import CourtStats from "../components/Courts/CourtStats";
import CourtFilters from "../components/Courts/CourtFilters";
import CourtTable from "../components/Courts/CourtTable";

const Courts = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // local courts state
  const [courts, setCourts] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // added state for detail modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSetMaintenanceOpen, setIsSetMaintenanceOpen] = useState(false);
  const [isScheduleMaintenanceOpen, setIsScheduleMaintenanceOpen] = useState(false);

  // Fetch facilities and courts
  useEffect(() => {
    if (user) {
      fetchFacilities();
      fetchCourts();
    }
  }, [user]);

  const fetchFacilities = async () => {
    try {
      if (!user) return;
      const ownerId = user._id || user.id;
      const result = await facilityApi.getFacilities({ ownerId });
      if (result.success && result.data?.facilities) {
        setFacilities(result.data.facilities);
      }
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  const fetchCourts = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user) return;
      const ownerId = user._id || user.id;

      // Get facilities of owner first
      const facilitiesResult = await facilityApi.getFacilities({ ownerId, limit: 100 });
      if (!facilitiesResult.success || !facilitiesResult.data?.facilities?.length) {
        setCourts([]);
        setLoading(false);
        return;
      }

      const facilities = facilitiesResult.data.facilities;
      const facilityIds = facilities.map((f) => f._id || f.id);

      // Fetch courts for all facilities - try to fetch all at once if possible
      const allCourts = [];
      for (const facilityId of facilityIds) {
        try {
          const result = await courtApi.getCourts({ facility: facilityId, limit: 100 });
          if (result.success && result.data?.courts) {
            allCourts.push(...result.data.courts);
          }
        } catch (err) {
          console.error(`Error fetching courts for facility ${facilityId}:`, err);
        }
      }

      setCourts(allCourts);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách sân");
      console.error("Error fetching courts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourts = useMemo(
    () =>
      courts.filter((c) => {
        const matchesSearch =
          !searchQuery ||
          [c.name, c.type, c.description, c.status].join(" ").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFacility =
          selectedFacilityFilter === "all" ||
          c.facility?._id === selectedFacilityFilter ||
          c.facility === selectedFacilityFilter;

        const matchesStatus = selectedStatusFilter === "all" || c.status === selectedStatusFilter;

        return matchesSearch && matchesFacility && matchesStatus;
      }),
    [searchQuery, courts, selectedFacilityFilter, selectedStatusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / pageSize));
  const courtSlice = filteredCourts.slice((page - 1) * pageSize, page * pageSize);

  const handleSaveCourt = async (updatedCourt) => {
    // Refresh list sau khi Add hoặc Edit thành công
    // AddCourtModal và EditCourtModal đã tự gọi API rồi
    try {
      await fetchCourts();
      setIsModalOpen(false);
      setSelectedCourt(null);
    } catch (err) {
      console.error("Error refreshing courts:", err);
    }
  };

  // Handlers for actions
  const handlers = {
    onView: (court) => {
      setSelectedCourt(court);
      setIsDetailOpen(true);
    },
    onEdit: (court) => {
      setSelectedCourt(court);
      setIsModalOpen(true);
    },
    onActivate: (court) => {
      setSelectedCourt(court);
      setIsActivateOpen(true);
    },
    onSetMaintenance: (court) => {
      setSelectedCourt(court);
      setIsSetMaintenanceOpen(true);
    },
    onScheduleMaintenance: (court) => {
      setSelectedCourt(court);
      setIsScheduleMaintenanceOpen(true);
    },
    onDelete: (court) => {
      setSelectedCourt(court);
      setIsDeleteOpen(true);
    },
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý sân</h1>
        <button
          onClick={() => {
            setSelectedCourt(null);
            setIsModalOpen(true);
          }}
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
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#059669")}
          onMouseLeave={(e) => (e.target.style.background = "#10b981")}
        >
          <Plus size={16} /> Thêm sân mới
        </button>
      </div>

      {/* Summary Cards */}
      <CourtStats courts={filteredCourts} />

      {/* Filters */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 16,
        }}
      >
        <CourtFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          facilities={facilities}
          selectedFacilityFilter={selectedFacilityFilter}
          onFacilityFilterChange={(value) => {
            setSelectedFacilityFilter(value);
            setPage(1);
          }}
          selectedStatusFilter={selectedStatusFilter}
          onStatusFilterChange={(value) => {
            setSelectedStatusFilter(value);
            setPage(1);
          }}
          totalCount={filteredCourts.length}
        />
      </div>

      {/* Table */}
      <CourtTable
        courts={courtSlice}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        total={filteredCourts.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        handlers={handlers}
      />

      {/* Add modal (used when selectedCourt is null) */}
      <AddCourtModal
        isOpen={isModalOpen && !selectedCourt}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourt(null);
        }}
        onSave={handleSaveCourt}
      />

      {/* Edit modal (used when selectedCourt is set) */}
      <EditCourtModal
        isOpen={isModalOpen && !!selectedCourt}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourt(null);
        }}
        initialData={selectedCourt}
        onSave={handleSaveCourt}
      />

      {/* Activate modal */}
      <ActivateCourtModal
        isOpen={isActivateOpen}
        onClose={() => {
          setIsActivateOpen(false);
          setSelectedCourt(null);
        }}
        court={selectedCourt}
        onConfirm={async (c) => {
          try {
            const courtId = c._id || c.id;
            await courtApi.updateStatus(courtId, "active");
            await fetchCourts();
          } catch (err) {
            alert(err.message || "Không thể kích hoạt sân");
          }
        }}
      />

      {/* Delete modal */}
      <DeleteCourtModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedCourt(null);
        }}
        court={selectedCourt}
        onConfirm={async (c) => {
          try {
            const courtId = c._id || c.id;
            await courtApi.deleteCourt(courtId);
            await fetchCourts();
          } catch (err) {
            alert(err.message || "Không thể xóa sân");
          }
        }}
      />

      {/* Detail modal */}
      <DetailCourtModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCourt(null);
        }}
        court={selectedCourt || {}}
      />

      {/* Set maintenance (quick) modal */}
      <SetMaintenanceModal
        isOpen={isSetMaintenanceOpen}
        onClose={() => {
          setIsSetMaintenanceOpen(false);
          setSelectedCourt(null);
        }}
        court={selectedCourt}
        onConfirm={async (c) => {
          try {
            const courtId = c._id || c.id;
            await courtApi.updateStatus(courtId, "maintenance");
            // Update maintenance info if provided
            if (c.maintenance) {
              await courtApi.updateCourt(courtId, { maintenance: c.maintenance });
            }
            await fetchCourts();
          } catch (err) {
            alert(err.message || "Không thể đặt bảo trì");
          }
        }}
      />

      {/* Schedule maintenance modal */}
      <ScheduleMaintenanceModal
        isOpen={isScheduleMaintenanceOpen}
        onClose={() => {
          setIsScheduleMaintenanceOpen(false);
          setSelectedCourt(null);
        }}
        court={selectedCourt}
        onConfirm={async (c) => {
          try {
            const courtId = c._id || c.id;
            const updateData = {};
            if (c.maintenance) updateData.maintenance = c.maintenance;
            if (c.status) updateData.status = c.status;
            await courtApi.updateCourt(courtId, updateData);
            await fetchCourts();
          } catch (err) {
            alert(err.message || "Không thể lên lịch bảo trì");
          }
        }}
      />
    </div>
  );
};

export default Courts;
