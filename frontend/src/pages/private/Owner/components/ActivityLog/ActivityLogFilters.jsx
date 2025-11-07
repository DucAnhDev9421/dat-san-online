import React from "react";
import SearchBar from "../shared/SearchBar";

const ActivityLogFilters = ({
  searchQuery,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  pageSize,
  onPageSizeChange,
  totalCount,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottom: "1px solid #e5e7eb",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <strong>Tổng:</strong> {totalCount} hoạt động
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Hiển thị</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: 6,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
              background: "#fff",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span style={{ marginLeft: 8 }}>bản ghi</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
              background: "#fff",
              cursor: "pointer",
              outline: "none",
            }}
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
          >
            <option value="all">Tất cả hành động</option>
            <option value="CREATE">Tạo mới</option>
            <option value="UPDATE">Cập nhật</option>
            <option value="DELETE">Xóa</option>
            <option value="LOGIN">Đăng nhập</option>
          </select>
        </div>
      </div>
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Tìm theo người dùng, hành động, mục tiêu…"
        style={{ minWidth: 300 }}
      />
    </div>
  );
};

export default ActivityLogFilters;

