import React, { useState, useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";
import { activityLogData } from "../data/mockData";
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

const ActivityLog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // -- LƯU LOGS VÀO STATE ĐỂ CÓ THỂ XÓA --
  const [logs, setLogs] = useState(activityLogData);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredActivityLogs = useMemo(
    () =>
      logs.filter((log) =>
        [log.user, log.action, log.target, log.details, log.ip]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [logs, searchQuery]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivityLogs.length / pageSize)
  );
  const logSlice = filteredActivityLogs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalLogs = filteredActivityLogs.length;
  const todayLogs = filteredActivityLogs.filter((log) =>
    log.timestamp.startsWith("2025-01-16")
  ).length;

  // -- 3. THÊM HÀM ĐIỀU KHIỂN MODAL --
  const handleViewDetails = (log) => {
    alert(`Chi tiết hoạt động:\nNgười dùng: ${log.user}\nHành động: ${log.action}\nMục tiêu: ${log.target}\nChi tiết: ${log.details}\nIP: ${log.ip}\nThời gian: ${log.timestamp}\nTrạng thái: ${log.status}`);
  };

  // Các hàm xử lý xóa
  const handleDeleteLog = (log) => {
    if (window.confirm(`Bạn có chắc muốn xóa log "${log.action}"?`)) {
      handleConfirmDelete(log);
    }
  };

  const handleConfirmDelete = (log) => {
    if (log) {
      // Lọc ra log cần xóa khỏi state 'logs'
      setLogs((currentLogs) =>
        currentLogs.filter((l) => l.id !== log.id)
      );
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Nhật ký hoạt động</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xuất nhật ký")}
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
            📄 Xuất nhật ký
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Tổng hoạt động
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
            {totalLogs}
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
            Hôm nay
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {todayLogs}
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
            Thành công
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>
            {
              filteredActivityLogs.filter((log) => log.status === "success")
                .length
            }
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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredActivityLogs.length} hoạt động
            </div>
            <div>
              <label style={{ marginRight: 8 }}>Hiển thị</label>
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
              <span style={{ marginLeft: 8 }}>bản ghi</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                  setPage(1);
                }}
              >
                <option value="all">Tất cả người dùng</option>
                <option value="Nguyễn Văn Chủ">Chủ sân</option>
                <option value="Nguyễn Thị Lan">Nhân viên</option>
                <option value="Trần Văn Minh">Nhân viên</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo người dùng, hành động, mục tiêu…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
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
                  "Mã",
                  "Người dùng",
                  "Hành động",
                  "Mục tiêu",
                  "Chi tiết",
                  "IP",
                  "Thời gian",
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
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logSlice.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td
                    style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}
                  >
                    {log.id}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          log.user === "Nguyễn Văn Chủ"
                            ? "#e6f3ff"
                            : log.user.includes("Nguyễn Thị") ||
                              log.user.includes("Trần Văn")
                            ? "#fef3c7"
                            : "#e6f9f0",
                        color:
                          log.user === "Nguyễn Văn Chủ"
                            ? "#1d4ed8"
                            : log.user.includes("Nguyễn Thị") ||
                              log.user.includes("Trần Văn")
                            ? "#d97706"
                            : "#059669",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {log.user}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{log.action}</td>
                  <td
                    style={{ padding: 12, fontWeight: 600, color: "#3b82f6" }}
                  >
                    {log.target}
                  </td>
                  <td style={{ padding: 12, maxWidth: "300px" }}>
                    <div
                      style={{
                        fontSize: 14,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={log.details}
                    >
                      {log.details}
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {log.ip}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{log.timestamp}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          log.status === "success" ? "#e6f9f0" : "#fee2e2",
                        color: log.status === "success" ? "#059669" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {log.status === "success" ? "Thành công" : "Thất bại"}
                    </span>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => handleViewDetails(log)}
                      title="Xem chi tiết"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => handleDeleteLog(log)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredActivityLogs.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>📋</div>
                    Không có dữ liệu nhật ký
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
            Hiển thị {(page - 1) * pageSize + 1} đến{" "}
            {Math.min(page * pageSize, filteredActivityLogs.length)} trong tổng số{" "}
            {filteredActivityLogs.length} bản ghi
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
              Trước
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
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modals temporarily disabled - will be implemented later */}
    </div>
  );
};

export default ActivityLog;
