import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Wrench,
} from "lucide-react";
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
      const facilityIds = facilities.map(f => f._id || f.id);
      
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
          [c.name, c.type, c.description, c.status]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesFacility =
          selectedFacilityFilter === "all" ||
          c.facility?._id === selectedFacilityFilter ||
          c.facility === selectedFacilityFilter;

        const matchesStatus =
          selectedStatusFilter === "all" || c.status === selectedStatusFilter;

        return matchesSearch && matchesFacility && matchesStatus;
      }),
    [searchQuery, courts, selectedFacilityFilter, selectedStatusFilter]
  );

  const handleSaveCourt = async (updated) => {
    try {
      if (updated._id || updated.id) {
        // Update existing court
        const courtId = updated._id || updated.id;
        const payload = {
          name: updated.name,
          type: updated.type,
          capacity: Number(updated.capacity),
          price: Number(updated.price),
          description: updated.description,
          status: updated.status,
          maintenance: updated.maintenance || "Không có lịch bảo trì",
          services: updated.services || [],
        };

        await courtApi.updateCourt(courtId, payload);
        await fetchCourts();
      } else {
        // New court created via AddCourtModal (already saved via API)
        await fetchCourts();
      }
      setIsModalOpen(false);
      setSelectedCourt(null);
    } catch (err) {
      console.error("Error saving court:", err);
      alert(err.message || "Có lỗi xảy ra khi lưu sân");
    }
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Tổng sân
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
            {filteredCourts.length}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Đang hoạt động
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredCourts.filter((c) => c.status === "active").length}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Bảo trì
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredCourts.filter((c) => c.status === "maintenance").length}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Tạm ngưng
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {filteredCourts.filter((c) => c.status === "inactive").length}
          </div>
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
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredCourts.length} sân
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={selectedFacilityFilter}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
                onChange={(e) => setSelectedFacilityFilter(e.target.value)}
              >
                <option value="all">Tất cả cơ sở</option>
                {facilities.map((facility) => (
                  <option key={facility._id || facility.id} value={facility._id || facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatusFilter}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tên, loại, mô tả…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Tên sân",
                  "Loại",
                  "Sức chứa",
                  "Giá/giờ",
                  "Trạng thái",
                  "Bảo trì",
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
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
                    Đang tải...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              ) : filteredCourts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
                    Không có sân nào
                  </td>
                </tr>
              ) : (
                filteredCourts.map((court) => (
                  <tr
                    key={court._id || court.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: 12, fontWeight: 600 }}>{court.name}</td>
                    <td style={{ padding: 12 }}>{court.type}</td>
                    <td style={{ padding: 12 }}>{court.capacity} người</td>
                    <td
                      style={{ padding: 12, fontWeight: 600, color: "#059669" }}
                    >
                      {(court.price || 0).toLocaleString()} VNĐ
                    </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          court.status === "active"
                            ? "#e6f9f0"
                            : court.status === "maintenance"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          court.status === "active"
                            ? "#059669"
                            : court.status === "maintenance"
                            ? "#d97706"
                            : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {court.status === "active"
                        ? "Hoạt động"
                        : court.status === "maintenance"
                        ? "Bảo trì"
                        : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {court.maintenance}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {/* Open detail modal on Eye click */}
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => {
                        setSelectedCourt(court);
                        setIsDetailOpen(true);
                      }}
                      title="Xem"
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => {
                        // open modal in edit mode
                        setSelectedCourt(court);
                        setIsModalOpen(true);
                      }}
                      title="Sửa"
                    />
                    {court.status === "active" ? (
                      <ActionButton
                        bg="#f59e0b"
                        Icon={PowerOff}
                        onClick={() => {
                          // open quick set-to-maintenance confirmation
                          setSelectedCourt(court);
                          setIsSetMaintenanceOpen(true);
                        }}
                        title="Đặt bảo trì"
                      />
                    ) : (
                      <ActionButton
                        bg="#10b981"
                        Icon={Power}
                        onClick={() => {
                          setSelectedCourt(court);
                          setIsActivateOpen(true);
                        }}
                        title="Kích hoạt"
                      />
                    )}
                    <ActionButton
                      bg="#6b7280"
                      Icon={Wrench}
                      onClick={() => {
                        setSelectedCourt(court);
                        setIsScheduleMaintenanceOpen(true);
                      }}
                      title="Lên lịch bảo trì"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => {
                        setSelectedCourt(court);
                        setIsDeleteOpen(true);
                      }}
                      title="Xóa"
                    />
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
