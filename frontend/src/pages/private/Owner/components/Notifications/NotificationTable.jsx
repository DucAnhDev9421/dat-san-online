import React from "react";
import NotificationRow from "./NotificationRow";
import Pagination from "../shared/Pagination";

const NotificationTable = ({
  notifications = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  handlers,
}) => {
  const headers = ["Tiêu đề", "Nội dung", "Loại", "Trạng thái", "Ngày tạo", "Hành động"];

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
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
                  Không có thông báo nào
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} handlers={handlers} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {notifications.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemsLabel="thông báo"
        />
      )}
    </div>
  );
};

export default NotificationTable;

