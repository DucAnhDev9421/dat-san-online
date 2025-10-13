import React, { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const init = [
  {
    id: "C001",
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an@example.com",
    totalBookings: 5,
    totalSpend: 2500000,
  },
  {
    id: "C002",
    name: "Trần Thị Bình",
    phone: "0909998888",
    email: "binh@example.com",
    totalBookings: 3,
    totalSpend: 1500000,
  },
  {
    id: "C003",
    name: "Lê Hoàng",
    phone: "0912223333",
    email: "hoang@example.com",
    totalBookings: 8,
    totalSpend: 4200000,
  },
];

export default function CustomerManagement() {
  const [rows, setRows] = useState(init);
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        [r.name, r.phone, r.email, r.id]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [rows, q]
  );

  const btn = (bg, Icon, onClick) => (
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
        Quản lý khách hàng
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
            <strong>Tổng:</strong> {filtered.length} khách
          </div>
          <input
            placeholder="Tìm tên / SĐT / email…"
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
                  "Họ tên",
                  "SĐT",
                  "Email",
                  "Số lần đặt",
                  "Tổng chi (đ)",
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
                  <td style={{ padding: 12 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.phone}</td>
                  <td style={{ padding: 12 }}>{r.email}</td>
                  <td style={{ padding: 12 }}>{r.totalBookings}</td>
                  <td style={{ padding: 12 }}>
                    {r.totalSpend.toLocaleString()}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {btn("#06b6d4", Eye, () => alert("Xem " + r.name))}
                    {btn("#22c55e", Pencil, () => alert("Sửa " + r.name))}
                    {btn("#ef4444", Trash2, () =>
                      setRows(rows.filter((x) => x.id !== r.id))
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td
                    colSpan={7}
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
