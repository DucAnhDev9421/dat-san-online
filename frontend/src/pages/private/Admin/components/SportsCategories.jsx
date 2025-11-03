import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryApi } from "../../../../api/categoryApi";
import SportCategoryModal from "../modals/SportCategoryModal";
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

const SportsCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      const result = await categoryApi.getSportCategories(params);
      setCategories(result.data || []);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách danh mục");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((r) =>
    [r.name, r.description, r.status]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  );
  const categorySlice = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCategory) {
        // Update
        await categoryApi.updateSportCategory(selectedCategory._id, formData);
      } else {
        // Create
        await categoryApi.createSportCategory(formData);
      }
      await fetchCategories();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      try {
        await categoryApi.deleteSportCategory(selectedCategory._id);
        await fetchCategories();
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
      } catch (err) {
        alert(err.message || "Không thể xóa danh mục");
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Danh mục môn thể thao</h1>
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
          <Plus size={16} /> Thêm danh mục
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
              placeholder="Tìm kiếm danh mục..."
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
                  "Icon",
                  "Tên danh mục",
                  "Mô tả",
                  "Số cơ sở",
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
                    {h === "Icon" ? "" : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : categorySlice.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                categorySlice.map((r, idx) => (
                  <tr key={r._id || r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12 }}>
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td style={{ padding: 12 }}></td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {r.description}
                  </td>
                    <td style={{ padding: 12 }}>{r.facilities || 0}</td>
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
            {Math.min(page * pageSize, filteredCategories.length)} of{" "}
            {filteredCategories.length} entries
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
      <SportCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
        category={selectedCategory}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục"
        message="Bạn có chắc muốn xóa danh mục"
        itemName={selectedCategory?.name}
        warningMessage="Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default SportsCategories;

