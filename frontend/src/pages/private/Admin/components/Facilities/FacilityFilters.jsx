import React from "react";
import { Search } from "lucide-react";

const FacilityFilters = ({ searchQuery, onSearchChange, totalResults }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, maxWidth: "400px", position: "relative" }}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm tên cơ sở, địa chỉ, chủ sân, môn thể thao..."
            style={{
              width: "100%",
              padding: "10px 10px 10px 36px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
        </div>
        <div style={{ color: "#6b7280", fontSize: 14 }}>
          Hiển thị {totalResults} kết quả
        </div>
      </div>
    </div>
  );
};

export default FacilityFilters;

