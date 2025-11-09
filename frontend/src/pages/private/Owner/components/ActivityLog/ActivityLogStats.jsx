import React from "react";

const ActivityLogStats = ({ logs = [], filteredLogs = [] }) => {
  const total = filteredLogs.length;
  const today = filteredLogs.filter((log) => log.timestamp?.startsWith(new Date().toISOString().split("T")[0])).length;
  const success = filteredLogs.filter((log) => log.status === "success").length;

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
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng hoạt động</div>
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
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Hôm nay</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{today}</div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Thành công</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{success}</div>
      </div>
    </div>
  );
};

export default ActivityLogStats;

