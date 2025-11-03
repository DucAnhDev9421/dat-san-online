import React, { useState, useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";
import { activityLogData } from "../data/mockData";
import ActivityLogDetailModal from "../modals/ActivityLogDetailModal";
import ActivityLogDeleteModal from "../modals/ActivityLogDeleteModal";

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

  // -- LƯU DATA VÀO STATE ĐỂ CÓ THỂ CẬP NHẬT --
  const [logs, setLogs] = useState(activityLogData);

  const [searchQuery, setSearchQuery] = useState("");

  // -- THÊM STATE CHO MODAL --
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // -- THÊM STATE CHO MODAL XÓA --
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  const filteredActivityLog = useMemo(
    () =>
      logs.filter((r) =>
        [r.user, r.action, r.target, r.details, r.ip]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [logs, searchQuery]
  );

  // -- THÊM HÀM ĐIỀU KHIỂN MODAL --
  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLog(null);
  };

  // -- THÊM CÁC HÀM XỬ LÝ XÓA --
  const handleOpenDeleteModal = (log) => {
    setLogToDelete(log);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setLogToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (logToDelete) {
      setLogs((currentLogs) =>
        currentLogs.filter((log) => log.id !== logToDelete.id)
      );
      handleCloseDeleteModal();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
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
              fontWeight: 700 
            }}
          >
            📄 Xuất nhật ký
          </button>
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
              <strong>Tổng:</strong> {filteredActivityLog.length} hoạt động
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả người dùng</option>
                <option value="Admin">Admin</option>
                <option value="Owner">Chủ sân</option>
                <option value="System">Hệ thống</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo người dùng, hành động, mục tiêu…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
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
              {filteredActivityLog.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.user === "Admin" ? "#e6f3ff" : 
                                 r.user === "Owner" ? "#fef3c7" : "#e6f9f0",
                      color: r.user === "Admin" ? "#1d4ed8" : 
                            r.user === "Owner" ? "#d97706" : "#059669",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {r.user}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.action}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#3b82f6" }}>{r.target}</td>
                  <td style={{ padding: 12, maxWidth: "300px" }}>
                    <div style={{ 
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }} title={r.details}>
                      {r.details}
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {r.ip}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{r.date}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.time}</div>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => handleViewDetails(r)}
                      title="Xem chi tiết"
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
              {!filteredActivityLog.length && (
                <tr>
                  <td
                    colSpan={8}
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
      </div>

      {/* -- RENDER MODAL TẠI ĐÂY -- */}
      <ActivityLogDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        log={selectedLog}
      />

      <ActivityLogDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        log={logToDelete}
      />
    </div>
  );
};

export default ActivityLog;

