import React from "react";
import { Eye, Pencil, Key, Lock, Unlock, Trash2 } from "lucide-react";
import { ActionButton } from "../shared";
import StatusBadge from "../shared/StatusBadge";

const StaffRow = ({ staff, handlers }) => {
  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{staff.id}</td>
      <td style={{ padding: 12 }}>
        <div style={{ fontWeight: 600 }}>{staff.name}</div>
      </td>
      <td style={{ padding: 12 }}>
        <div style={{ fontSize: 14 }}>{staff.email}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{staff.phone}</div>
      </td>
      <td style={{ padding: 12 }}>{staff.position}</td>
      <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
        {(staff.salary / 1e6).toFixed(1)}M VNĐ
      </td>
      <td style={{ padding: 12 }}>{staff.joinDate}</td>
      <td style={{ padding: 12 }}>
        <StatusBadge value={staff.status} type="staff" />
      </td>
      <td style={{ padding: 12 }}>
        <span
          style={{
            background:
              staff.performance === "Tốt"
                ? "#e6f9f0"
                : staff.performance === "Trung bình"
                ? "#fef3c7"
                : "#fee2e2",
            color:
              staff.performance === "Tốt"
                ? "#059669"
                : staff.performance === "Trung bình"
                ? "#d97706"
                : "#ef4444",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {staff.performance}
        </span>
      </td>
      <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{staff.lastLogin}</td>
      <td style={{ padding: 12, whiteSpace: "nowrap" }}>
        <ActionButton bg="#06b6d4" Icon={Eye} onClick={() => handlers.onView(staff)} title="Xem chi tiết" />
        <ActionButton bg="#22c55e" Icon={Pencil} onClick={() => handlers.onEdit(staff)} title="Sửa" />
        <ActionButton bg="#6b7280" Icon={Key} onClick={() => handlers.onResetPass(staff)} title="Đặt lại mật khẩu" />
        {staff.status === "active" ? (
          <ActionButton bg="#f59e0b" Icon={Lock} onClick={() => handlers.onLock(staff)} title="Khóa tài khoản" />
        ) : (
          <ActionButton bg="#10b981" Icon={Unlock} onClick={() => handlers.onUnlock(staff)} title="Mở khóa tài khoản" />
        )}
        <ActionButton bg="#ef4444" Icon={Trash2} onClick={() => handlers.onDelete(staff)} title="Xóa" />
      </td>
    </tr>
  );
};

export default StaffRow;

