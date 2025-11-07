import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { ActionButton } from "../shared";

const NotificationRow = ({ notification, handlers }) => {
  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ padding: 12, fontWeight: 600 }}>{notification.title}</td>
      <td style={{ padding: 12, fontSize: 14, color: "#6b7280" }}>{notification.message}</td>
      <td style={{ padding: 12 }}>
        <span
          style={{
            background:
              notification.type === "info"
                ? "#e6effe"
                : notification.type === "success"
                ? "#e6f9f0"
                : notification.type === "warning"
                ? "#fef3c7"
                : "#fee2e2",
            color:
              notification.type === "info"
                ? "#4338ca"
                : notification.type === "success"
                ? "#059669"
                : notification.type === "warning"
                ? "#d97706"
                : "#ef4444",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {notification.type === "info"
            ? "Thông tin"
            : notification.type === "success"
            ? "Thành công"
            : notification.type === "warning"
            ? "Cảnh báo"
            : "Lỗi"}
        </span>
      </td>
      <td style={{ padding: 12 }}>
        <span
          style={{
            background: notification.status === "sent" ? "#e6f9f0" : "#fee2e2",
            color: notification.status === "sent" ? "#059669" : "#ef4444",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {notification.status === "sent" ? "Đã gửi" : "Nháp"}
        </span>
      </td>
      <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{notification.createdAt}</td>
      <td style={{ padding: 12, whiteSpace: "nowrap" }}>
        <ActionButton
          bg="#06b6d4"
          Icon={Eye}
          onClick={() => handlers.onView(notification)}
          title="Xem chi tiết"
        />
        <ActionButton
          bg="#ef4444"
          Icon={Trash2}
          onClick={() => handlers.onDelete(notification)}
          title="Xóa"
        />
      </td>
    </tr>
  );
};

export default NotificationRow;

