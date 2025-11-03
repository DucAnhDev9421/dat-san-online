import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryApi } from "../../../../api/categoryApi";
import CourtTypeModal from "../modals/CourtTypeModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

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

const CourtTypes = () => {
  const [courtTypes, setCourtTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourtType, setSelectedCourtType] = useState(null);
  const [error, setError] = useState("");

  // Fetch court types
  useEffect(() => {
    fetchCourtTypes();
  }, [searchQuery]);

  const fetchCourtTypes = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      const result = await categoryApi.getCourtTypes(params);
      setCourtTypes(result.data || []);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách loại sân");
      console.error("Error fetching court types:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourtTypes = courtTypes.filter((r) =>
    [r.name, r.description, r.sportCategory?.name, r.status]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourtTypes.length / pageSize)
  );
  const courtTypeSlice = filteredCourtTypes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAdd = () => {
    setSelectedCourtType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (courtType) => {
    setSelectedCourtType(courtType);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCourtType) {
        // Update
        await categoryApi.updateCourtType(selectedCourtType._id, formData);
      } else {
        // Create
        await categoryApi.createCourtType(formData);
      }
      await fetchCourtTypes();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = (courtType) => {
    setSelectedCourtType(courtType);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCourtType) {
      try {
        await categoryApi.deleteCourtType(selectedCourtType._id);
        await fetchCourtTypes();
        setIsDeleteModalOpen(false);
        setSelectedCourtType(null);
      } catch (err) {
        alert(err.message || "Không thể xóa loại sân");
        setIsDeleteModalOpen(false);
        setSelectedCourtType(null);
      }
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Loại sân thể thao</h1>
        <button
          onClick={handleAdd}
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
          <Plus size={16} /> Thêm loại sân
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
              placeholder="Tìm kiếm loại sân..."
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
                  "Mã",
                  "Tên loại sân",
                  "Danh mục thể thao",
                  "Mô tả",
                  "Đặc điểm",
                  "Số sân",
                  "Trạng thái",
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
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : courtTypeSlice.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    {error || "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                courtTypeSlice.map((r, idx) => (
                  <tr key={r._id || r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12 }}>
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: 12 }}>
                      {r.sportCategory?.name || "N/A"}
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {r.description || "-"}
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {Array.isArray(r.features) && r.features.length > 0
                        ? r.features.join(", ")
                        : "-"}
                    </td>
                    <td style={{ padding: 12 }}>{r.courts || 0}</td>
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
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <ActionButton
                        bg="#22c55e"
                        Icon={Pencil}
                        onClick={() => handleEdit(r)}
                        title="Sửa"
                      />
                      <ActionButton
                        bg="#ef4444"
                        Icon={Trash2}
                        onClick={() => handleDelete(r)}
                        title="Xóa"
                      />
                    </td>
                  </tr>
                ))
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
            {Math.min(page * pageSize, filteredCourtTypes.length)} of{" "}
            {filteredCourtTypes.length} entries
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

      {/* Modal */}
      <CourtTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourtType(null);
        }}
        onSave={handleSave}
        courtType={selectedCourtType}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCourtType(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa loại sân"
        message="Bạn có chắc muốn xóa loại sân"
        itemName={selectedCourtType?.name}
        warningMessage="Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default CourtTypes;

