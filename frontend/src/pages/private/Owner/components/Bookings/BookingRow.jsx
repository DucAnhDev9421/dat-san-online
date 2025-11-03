import React from "react";
import { Eye, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { ActionButton } from "../shared";
import StatusBadge from "../shared/StatusBadge";

const BookingRow = ({ booking, handlers }) => {
  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{booking.id}</td>
      <td style={{ padding: 12 }}>
        <div>
          <div style={{ fontWeight: 600 }}>{booking.customer}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{booking.email}</div>
        </div>
      </td>
      <td style={{ padding: 12 }}>
        <div style={{ fontSize: 14 }}>{booking.phone}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>Đặt: {booking.bookingDate}</div>
      </td>
      <td style={{ padding: 12 }}>
        <div>
          <div style={{ fontWeight: 600 }}>{booking.court}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{booking.courtType}</div>
        </div>
      </td>
      <td style={{ padding: 12, fontWeight: 600 }}>{booking.date}</td>
      <td style={{ padding: 12, color: "#059669", fontWeight: 600 }}>{booking.time}</td>
      <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
        {booking.price.toLocaleString()}
      </td>
      <td style={{ padding: 12 }}>
        <span
          style={{
            background:
              booking.pay === "paid"
                ? "#e6f9f0"
                : booking.pay === "pending"
                ? "#fef3c7"
                : "#fee2e2",
            color:
              booking.pay === "paid"
                ? "#059669"
                : booking.pay === "pending"
                ? "#d97706"
                : "#ef4444",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {booking.pay === "paid"
            ? "Đã thanh toán"
            : booking.pay === "pending"
            ? "Chờ thanh toán"
            : "Hoàn tiền"}
        </span>
      </td>
      <td style={{ padding: 12 }}>
        <StatusBadge value={booking.status} type="booking" />
      </td>
      <td style={{ padding: 12, maxWidth: "150px" }}>
        {booking.notes ? (
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={booking.notes}
          >
            {booking.notes}
          </div>
        ) : (
          <span style={{ color: "#9ca3af" }}>-</span>
        )}
      </td>
      <td style={{ padding: 12, whiteSpace: "nowrap" }}>
        <ActionButton
          bg="#06b6d4"
          Icon={Eye}
          onClick={() => handlers.onView(booking)}
          title="Xem"
        />
        <ActionButton
          bg="#22c55e"
          Icon={Pencil}
          onClick={() => handlers.onEdit(booking)}
          title="Sửa"
        />
        {booking.status === "pending" && (
          <ActionButton
            bg="#10b981"
            Icon={CheckCircle2}
            onClick={() => handlers.onConfirm(booking)}
            title="Xác nhận"
          />
        )}
        {booking.status !== "cancelled" && (
          <ActionButton
            bg="#ef4444"
            Icon={XCircle}
            onClick={() => handlers.onCancel(booking)}
            title="Hủy"
          />
        )}
      </td>
    </tr>
  );
};

export default BookingRow;

