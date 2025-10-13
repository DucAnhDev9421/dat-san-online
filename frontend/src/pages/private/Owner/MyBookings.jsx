//Trang quản lý đặt sân của chủ sân
import React from "react";
import { XCircle } from "lucide-react";

const my = [
  {
    id: "BK101",
    court: "Sân 2",
    date: "2025-01-18",
    time: "18:00–20:00",
    price: 600000,
    status: "Xác nhận",
  },
  {
    id: "BK102",
    court: "Sân 1",
    date: "2025-01-20",
    time: "17:00–19:00",
    price: 500000,
    status: "Chờ",
  },
];

export default function MyBookings() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
        Đơn đặt sân của tôi
      </h1>

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
                {[
                  "Mã",
                  "Sân",
                  "Ngày",
                  "Khung giờ",
                  "Giá (đ)",
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
              {my.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.court}</td>
                  <td style={{ padding: 12 }}>{r.date}</td>
                  <td style={{ padding: 12 }}>{r.time}</td>
                  <td style={{ padding: 12 }}>{r.price.toLocaleString()}</td>
                  <td style={{ padding: 12 }}>{r.status}</td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => alert("Hủy đơn " + r.id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: 0,
                        borderRadius: 8,
                        padding: "8px 10px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <XCircle size={16} /> Hủy
                    </button>
                  </td>
                </tr>
              ))}
              {!my.length && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Chưa có đơn
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
