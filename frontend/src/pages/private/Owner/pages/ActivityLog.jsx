import React, { useState, useMemo } from "react";
import { activityLogData } from "../data/mockData";
import ActivityLogStats from "../components/ActivityLog/ActivityLogStats";
import ActivityLogFilters from "../components/ActivityLog/ActivityLogFilters";
import ActivityLogTable from "../components/ActivityLog/ActivityLogTable";

const ActivityLog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [logs, setLogs] = useState(activityLogData);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredActivityLogs = useMemo(
    () =>
      logs.filter((log) => {
        if (actionFilter !== "all" && log.action !== actionFilter) {
          return false;
        }
        if (searchQuery) {
          return [log.user, log.action, log.target, log.details, log.ip]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return true;
      }),
    [logs, searchQuery, actionFilter]
  );

  const logSlice = filteredActivityLogs.slice((page - 1) * pageSize, page * pageSize);

  const handlers = {
    onView: (log) => {
      alert(
        `Chi tiết hoạt động:\nNgười dùng: ${log.user}\nHành động: ${log.action}\nMục tiêu: ${log.target}\nChi tiết: ${log.details}\nIP: ${log.ip}\nThời gian: ${log.timestamp}\nTrạng thái: ${log.status}`
      );
    },
    onDelete: (log) => {
      if (window.confirm(`Bạn có chắc muốn xóa log "${log.action}"?`)) {
        setLogs((currentLogs) => currentLogs.filter((l) => l.id !== log.id));
      }
    },
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

      <ActivityLogStats logs={logs} filteredLogs={filteredActivityLogs} />

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 16,
        }}
      >
        <ActivityLogFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          actionFilter={actionFilter}
          onActionFilterChange={(value) => {
            setActionFilter(value);
            setPage(1);
          }}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          totalCount={filteredActivityLogs.length}
        />
      </div>

      <ActivityLogTable
        logs={logSlice}
        page={page}
        pageSize={pageSize}
        total={filteredActivityLogs.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        handlers={handlers}
      />
    </div>
  );
};

export default ActivityLog;
