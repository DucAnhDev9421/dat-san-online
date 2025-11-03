import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { ActionButton } from "../shared";

const ActivityLogRow = ({ log, handlers }) => {
  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ padding: 12, fontWeight: 600 }}>{log.user}</td>
      <td style={{ padding: 12 }}>{log.action}</td>
      <td style={{ padding: 12 }}>{log.target}</td>
      <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{log.details || "-"}</td>
      <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{log.ip}</td>
      <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{log.timestamp}</td>
      <td style={{ padding: 12 }}>
        <span
          style={{
            background: log.status === "success" ? "#e6f9f0" : "#fee2e2",
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
          onClick={() => handlers.onView(log)}
          title="Xem chi tiết"
        />
        <ActionButton
          bg="#ef4444"
          Icon={Trash2}
          onClick={() => handlers.onDelete(log)}
          title="Xóa"
        />
      </td>
    </tr>
  );
};

export default ActivityLogRow;

