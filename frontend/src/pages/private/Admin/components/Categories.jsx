import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Filter } from "lucide-react";
import { sportsCategoriesData, courtTypesData } from "../data/mockData";

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

const Categories = () => {
  const [activeTab, setActiveTab] = useState("sports"); // "sports" hoặc "courtTypes"
  const [sportsCategories, setSportsCategories] = useState(sportsCategoriesData);
  const [courtTypes, setCourtTypes] = useState(courtTypesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // all, visible, hidden
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get current data based on tab
  const currentData = activeTab === "sports" ? sportsCategories : courtTypes;
  const setCurrentData = activeTab === "sports" ? setSportsCategories : setCourtTypes;

  // Filter data
  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        [item.name, item.description, item.sport || ""]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && item.isVisible) ||
        (visibilityFilter === "hidden" && !item.isVisible);

      return matchesSearch && matchesVisibility;
    });
  }, [currentData, searchQuery, visibilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const dataSlice = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAdd = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa danh mục "${item.name}"?`
      )
    ) {
      setCurrentData((current) =>
        current.filter((i) => i.id !== item.id)
      );
    }
  };

  const handleToggleVisibility = (item) => {
    setCurrentData((current) =>
      current.map((i) =>
        i.id === item.id ? { ...i, isVisible: !i.isVisible } : i
      )
    );
  };

  const handleSave = (itemData) => {
    if (selectedItem) {
      // Edit
      setCurrentData((current) =>
        current.map((i) =>
          i.id === selectedItem.id ? { ...itemData, id: selectedItem.id } : i
        )
      );
      setIsEditModalOpen(false);
    } else {
      // Add
      const newItem = {
        ...itemData,
        id: activeTab === "sports" 
          ? `SC${String(sportsCategories.length + 1).padStart(3, "0")}`
          : `CT${String(courtTypes.length + 1).padStart(3, "0")}`,
        facilities: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCurrentData((current) => [newItem, ...current]);
      setIsAddModalOpen(false);
    }
    setSelectedItem(null);
  };

  const resetFilters = () => {
    setVisibilityFilter("all");
    setSearchQuery("");
    setPage(1);
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý danh mục</h1>
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

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: "#fff",
          padding: 8,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <button
          onClick={() => {
            setActiveTab("sports");
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: activeTab === "sports" ? "#10b981" : "transparent",
            color: activeTab === "sports" ? "#fff" : "#6b7280",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s",
          }}
        >
          Môn thể thao ({sportsCategories.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("courtTypes");
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: activeTab === "courtTypes" ? "#10b981" : "transparent",
            color: activeTab === "courtTypes" ? "#fff" : "#6b7280",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s",
          }}
        >
          Loại sân ({courtTypes.length})
        </button>
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
          {(visibilityFilter !== "all" || searchQuery) && (
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
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Tên, mô tả..."
                style={{
                  width: "100%",
                  padding: "8px 8px 8px 36px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
            </div>
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
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value);
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
              <option value="visible">Đang hiển thị</option>
              <option value="hidden">Đã ẩn</option>
            </select>
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
            Hiển thị {filteredData.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {(activeTab === "sports"
                  ? [
                      "Mã",
                      "Tên môn thể thao",
                      "Mô tả",
                      "Số cơ sở",
                      "Trạng thái",
                      "Ngày tạo",
                      "Hành động",
                    ]
                  : [
                      "Mã",
                      "Tên loại sân",
                      "Mô tả",
                      "Môn thể thao",
                      "Số cơ sở",
                      "Trạng thái",
                      "Ngày tạo",
                      "Hành động",
                    ]
                ).map((h) => (
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
              {dataSlice.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    opacity: !item.isVisible ? 0.6 : 1,
                  }}
                >
                  <td style={{ padding: 12 }}>
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {item.description}
                  </td>
                  {activeTab === "courtTypes" && (
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background: "#e6f9f0",
                          color: "#059669",
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {item.sport}
                      </span>
                    </td>
                  )}
                  <td style={{ padding: 12 }}>{item.facilities}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background: item.isVisible ? "#e6f9f0" : "#f3f4f6",
                        color: item.isVisible ? "#059669" : "#6b7280",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {item.isVisible ? "Đang hiển thị" : "Đã ẩn"}
                    </span>
                  </td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {item.createdAt}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg={item.isVisible ? "#6b7280" : "#10b981"}
                      Icon={item.isVisible ? EyeOff : Eye}
                      onClick={() => handleToggleVisibility(item)}
                      title={item.isVisible ? "Ẩn danh mục" : "Hiển thị danh mục"}
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => handleEdit(item)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => handleDelete(item)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!dataSlice.length && (
                <tr>
                  <td
                    colSpan={activeTab === "sports" ? 7 : 8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy danh mục nào
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
            {Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length} entries
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

      {/* Modal thêm/sửa */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              {selectedItem ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const itemData = {
                  name: formData.get("name"),
                  description: formData.get("description"),
                  sport: formData.get("sport") || null,
                  isVisible: formData.get("isVisible") === "true",
                };
                handleSave(itemData);
              }}
            >
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Tên danh mục *
                  </label>
                  <input
                    name="name"
                    defaultValue={selectedItem?.name || ""}
                    required
                    style={{
                      width: "100%",
                      padding: 10,
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
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedItem?.description || ""}
                    required
                    rows={3}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                      resize: "vertical",
                    }}
                  />
                </div>
                {activeTab === "courtTypes" && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      Môn thể thao *
                    </label>
                    <select
                      name="sport"
                      defaultValue={selectedItem?.sport || ""}
                      required
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 14,
                      }}
                    >
                      <option value="">Chọn môn thể thao</option>
                      {sportsCategories
                        .filter((s) => s.isVisible)
                        .map((sport) => (
                          <option key={sport.id} value={sport.name}>
                            {sport.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Trạng thái hiển thị
                  </label>
                  <select
                    name="isVisible"
                    defaultValue={selectedItem?.isVisible !== undefined ? String(selectedItem.isVisible) : "true"}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    <option value="true">Đang hiển thị</option>
                    <option value="false">Đã ẩn</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#fff",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {selectedItem ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

