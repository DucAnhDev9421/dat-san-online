import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CalendarDays, Users2, BadgeDollarSign, Percent } from "lucide-react";

// Mock KPI & chart data (thay bằng dữ liệu thật từ API)
const kpis0 = {
  weeklyBookings: 45,
  occupancyRate: 78,
  revenue: 22500000,
  cancellationRate: 12,
};
const trendData0 = [
  { name: "Mon", bookings: 5, revenue: 2.3 },
  { name: "Tue", bookings: 6, revenue: 2.8 },
  { name: "Wed", bookings: 7, revenue: 3.1 },
  { name: "Thu", bookings: 8, revenue: 3.9 },
  { name: "Fri", bookings: 9, revenue: 4.4 },
  { name: "Sat", bookings: 6, revenue: 3.0 },
  { name: "Sun", bookings: 4, revenue: 1.8 },
];

const card = (title, value, icon) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div style={{ background: "#eef7f0", borderRadius: 10, padding: 10 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [range, setRange] = useState("7d"); // Today | 7d | 30d
  const kpis = kpis0; // TODO: thay theo range
  const trendData = trendData0; // TODO: thay theo range

  const pieData = useMemo(
    () => [
      { name: "Đã xác nhận", value: 62 },
      { name: "Đã hủy", value: 12 },
      { name: "Chờ xử lý", value: 26 },
    ],
    []
  );
  const pieColors = ["#10b981", "#ef4444", "#6366f1"];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Bảng điều khiển</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {["Today", "7d", "30d"].map((k) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: range === k ? "#10b981" : "#fff",
                color: range === k ? "#fff" : "#111827",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {card(
          "Đặt sân trong tuần",
          kpis.weeklyBookings,
          <CalendarDays size={20} color="#10b981" />
        )}
        {card(
          "Tỉ lệ lấp đầy",
          `${kpis.occupancyRate}%`,
          <Users2 size={20} color="#3b82f6" />
        )}
        {card(
          "Doanh thu (triệu)",
          (kpis.revenue / 1e6).toFixed(1),
          <BadgeDollarSign size={20} color="#6366f1" />
        )}
        {card(
          "Tỉ lệ hủy",
          `${kpis.cancellationRate}%`,
          <Percent size={20} color="#ef4444" />
        )}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Xu hướng đặt sân & doanh thu
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" />
            </LineChart>
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
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Tình trạng đơn</div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
