import React, { useState, useMemo } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { facilityData } from "../data/mockData";
import FacilityDetailModal from "../modals/FacilityDetailModal";
import FacilityEditModal from "../modals/FacilityEditModal";
import FacilityDeleteModal from "../modals/FacilityDeleteModal";
import FacilityAddModal from "../modals/FacilityAddModal";

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

const Facilities = () => {

  // -- 2. LƯU DATA VÀO STATE ĐỂ CÓ THỂ CẬP NHẬT --
  const [facilities, setFacilities] = useState(facilityData);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // -- STATE CHO MODAL --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // -- THÊM STATE CHO MODAL CHỈNH SỬA --
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [facilityToEdit, setFacilityToEdit] = useState(null);

  // -- THÊM STATE CHO MODAL XÓA --
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);

  // -- THÊM STATE CHO MODAL THÊM MỚI --
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredFacilities = useMemo(
    () =>
      facilities.filter((r) =>
        [r.name, r.address, r.owner, r.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [facilities, searchQuery]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFacilities.length / pageSize)
  );
  const facilitySlice = filteredFacilities.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // -- HÀM ĐIỀU KHIỂN MODAL --
  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFacility(null);
  };

  // -- 5. THÊM HÀM CHO MODAL CHỈNH SỬA --
  const handleOpenEditModal = (facility) => {
    setFacilityToEdit(facility);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setFacilityToEdit(null);
  };

  const handleSaveFacility = (updatedFacility) => {
    // Cập nhật mảng 'facilities' trong state
    setFacilities(currentFacilities =>
      currentFacilities.map(f =>
        f.id === updatedFacility.id ? updatedFacility : f
      )
    );
    handleCloseEditModal(); // Đóng modal sau khi lưu
  };

  // -- THÊM CÁC HÀM XỬ LÝ XÓA --
  const handleOpenDeleteModal = (facility) => {
    setFacilityToDelete(facility);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setFacilityToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (facilityToDelete) {
      setFacilities((currentFacilities) =>
        currentFacilities.filter((f) => f.id !== facilityToDelete.id)
      );
      handleCloseDeleteModal();
    }
  };

  // -- THÊM HÀM CHO MODAL THÊM MỚI --
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddNewFacility = (newFacility) => {
    // Thêm sân mới vào đầu danh sách
    setFacilities((currentFacilities) => [newFacility, ...currentFacilities]);
    handleCloseAddModal();
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
          onClick={handleOpenAddModal}
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
          <Plus size={16} /> Thêm sân
        </button>
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
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span style={{ marginLeft: 8 }}>entries</span>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Search:</label>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tên sân, địa chỉ, chủ sân…"
              style={{
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã sân",
                  "Tên sân",
                  "Địa chỉ",
                  "Chủ sân",
                  "Số sân",
                  "Tình trạng",
                  "Doanh thu",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 12,
                      fontSize: 13,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilitySlice.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12 }}>
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                  <td
                    style={{
                      padding: 12,
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={r.address}
                  >
                    {r.address}
                  </td>
                  <td style={{ padding: 12 }}>{r.owner}</td>
                  <td style={{ padding: 12 }}>{r.courts}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          r.status === "active" ? "#e6f9f0" : "#fee2e2",
                        color: r.status === "active" ? "#059669" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {r.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td
                    style={{ padding: 12, fontWeight: 600, color: "#059669" }}
                  >
                    {(r.revenue / 1e6).toFixed(1)}M VNĐ
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => handleViewDetails(r)}
                      title="Xem"
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => handleOpenEditModal(r)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => handleOpenDeleteModal(r)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!facilitySlice.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không có dữ liệu
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
            {Math.min(page * pageSize, filteredFacilities.length)} of{" "}
            {filteredFacilities.length} entries
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
                cursor: "pointer",
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
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* -- RENDER MODAL -- */}
      <FacilityDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        facility={selectedFacility}
      />

      <FacilityEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveFacility}
        facility={facilityToEdit}
      />
      <FacilityDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        facility={facilityToDelete}
      />
      <FacilityAddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleAddNewFacility}
      />
    </div>
  );
};

export default Facilities;
