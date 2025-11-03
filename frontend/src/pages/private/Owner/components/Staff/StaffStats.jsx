import React from "react";

const StaffStats = ({ staff = [] }) => {
  const total = staff.length;
  const active = staff.filter((s) => s.status === "active").length;
  const inactive = total - active;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
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
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng nhân viên</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{total}</div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đang hoạt động</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{active}</div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tạm ngưng</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{inactive}</div>
      </div>
    </div>
  );
};

export default StaffStats;

