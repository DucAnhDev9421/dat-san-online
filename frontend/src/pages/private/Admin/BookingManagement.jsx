import React, { useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock5,
  XCircle,
} from "lucide-react";

const init = [
  {
    id: "BK001",
    customer: "Nguyễn Văn An",
    phone: "0901234567",
    court: "Sân 1",
    date: "2025-01-15",
    time: "18:00–20:00",
    price: 500000,
    status: "confirmed",
    pay: "paid",
  },
  {
    id: "BK002",
    customer: "Trần Thị Bình",
    phone: "0909998888",
    court: "Sân 2",
    date: "2025-01-16",
    time: "19:00–21:00",
    price: 600000,
    status: "pending",
    pay: "unpaid",
  },
  {
    id: "BK003",
    customer: "Lê Hoàng",
    phone: "0912223333",
    court: "Sân 3",
    date: "2025-01-16",
    time: "17:00–19:00",
    price: 500000,
    status: "cancelled",
    pay: "refund",
  },
];

const Status = ({ value }) => {
  const map = {
    confirmed: {
      bg: "#e6f9f0",
      color: "#059669",
      icon: <CheckCircle2 size={14} />,
      label: "Xác nhận",
    },
    pending: {
      bg: "#e6effe",
      color: "#4338ca",
      icon: <Clock5 size={14} />,
      label: "Chờ",
    },
    cancelled: {
      bg: "#fee2e2",
      color: "#ef4444",
      icon: <XCircle size={14} />,
      label: "Hủy",
    },
  };
  const s = map[value] || map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontWeight: 700,
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
};

export default function BookingManagement() {
  const [rows, setRows] = useState(init);
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        [r.id, r.customer, r.court, r.phone]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [rows, q]
  );

  const action = (bg, Icon, onClick) => (
    <button
      onClick={onClick}
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

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
        Quản lý đặt sân
      </h1>

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
            padding: 12,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <strong>Tổng:</strong> {filtered.length} bookings
          </div>
          <input
            placeholder="Tìm mã / khách / sân…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Khách hàng",
                  "SĐT",
                  "Sân",
                  "Ngày",
                  "Khung giờ",
                  "Giá (đ)",
                  "Thanh toán",
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
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.customer}</td>
                  <td style={{ padding: 12 }}>{r.phone}</td>
                  <td style={{ padding: 12 }}>{r.court}</td>
                  <td style={{ padding: 12 }}>{r.date}</td>
                  <td style={{ padding: 12 }}>{r.time}</td>
                  <td style={{ padding: 12 }}>{r.price.toLocaleString()}</td>
                  <td style={{ padding: 12, textTransform: "capitalize" }}>
                    {r.pay}
                  </td>
                  <td style={{ padding: 12 }}>
                    <Status value={r.status} />
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {action("#06b6d4", Eye, () => alert("Xem " + r.id))}
                    {action("#22c55e", Pencil, () => alert("Sửa " + r.id))}
                    {action("#ef4444", Trash2, () =>
                      setRows(rows.filter((x) => x.id !== r.id))
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
