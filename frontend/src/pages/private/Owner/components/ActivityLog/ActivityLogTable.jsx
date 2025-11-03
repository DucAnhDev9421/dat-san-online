import React from "react";
import ActivityLogRow from "./ActivityLogRow";
import Pagination from "../shared/Pagination";

const ActivityLogTable = ({
  logs = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  handlers,
}) => {
  const headers = ["Người dùng", "Hành động", "Mục tiêu", "Chi tiết", "IP", "Thời gian", "Trạng thái", "Hành động"];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", textAlign: "left" }}>
              {headers.map((h) => (
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
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
                  Không có hoạt động nào
                </td>
              </tr>
            ) : (
              logs.map((log) => <ActivityLogRow key={log.id} log={log} handlers={handlers} />)
            )}
          </tbody>
        </table>
      </div>

      {logs.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemsLabel="hoạt động"
        />
      )}
    </div>
  );
};

export default ActivityLogTable;

