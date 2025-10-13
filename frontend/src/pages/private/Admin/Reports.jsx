//Trang báo cáo
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Download } from "lucide-react";

const base = [
  { month: "01", bookings: 120, revenue: 56 },
  { month: "02", bookings: 98, revenue: 49 },
  { month: "03", bookings: 140, revenue: 68 },
  { month: "04", bookings: 160, revenue: 75 },
  { month: "05", bookings: 170, revenue: 82 },
  { month: "06", bookings: 155, revenue: 77 },
];

export default function Reports() {
  const [year, setYear] = useState(2025);
  const [type, setType] = useState("revenue");

  const data = useMemo(() => base, [year]); // TODO: fetch theo year
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Báo cáo & Thống kê</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
          >
            {[2025, 2024, 2023].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
          >
            <option value="revenue">Doanh thu (triệu)</option>
            <option value="bookings">Số đơn</option>
          </select>
          <button
            onClick={() => alert("TODO: Export CSV/PDF")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#111827",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Biểu đồ cột theo tháng
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Xu hướng</div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={type} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, color: "#6b7280" }}>
            Tổng doanh thu 6 tháng: <strong>{totalRevenue} triệu</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
