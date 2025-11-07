import React, { useState } from "react";
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
import {
  CalendarDays,
  Users2,
  BadgeDollarSign,
  UserCheck,
} from "lucide-react";
import { kpis, trendData, pieData, pieColors } from "../data/mockData";

const topFacilities = [
  { name: "Truong Football", bookings: 156, revenue: 31200000 },
  { name: "Sân Bóng Đá Minh Khai", bookings: 142, revenue: 25560000 },
  { name: "Trung Tâm Thể Thao Quận 7", bookings: 128, revenue: 32000000 },
  { name: "Sân Bóng Đá Tân Bình", bookings: 115, revenue: 25300000 },
  { name: "Trung Tâm Thể Thao Bình Thạnh", bookings: 98, revenue: 22540000 },
];

const KpiCard = ({ title, value, icon }) => (
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

const Dashboard = () => {
  const [range, setRange] = useState("Today");

  return (
    <div>
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
        <KpiCard
          title="Tổng doanh thu"
          value={`${(kpis.totalRevenue / 1e6).toFixed(0)}M VNĐ / tháng`}
          icon={<BadgeDollarSign size={20} color="#10b981" />}
        />
        <KpiCard
          title="Tổng số lượt đặt sân"
          value={`${kpis.totalBookings.toLocaleString()} lượt`}
          icon={<CalendarDays size={20} color="#3b82f6" />}
        />
        <KpiCard
          title="Tỷ lệ lấp đầy"
          value={`${kpis.occupancyRate}%`}
          icon={<Users2 size={20} color="#6366f1" />}
        />
        <KpiCard
          title="Số người dùng mới"
          value={`+${kpis.newUsers} trong tuần qua`}
          icon={<UserCheck size={20} color="#f59e0b" />}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Biểu đồ doanh thu theo tuần
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'bookings' ? `${value} lượt` : `${value}M VNĐ`,
                  name === 'bookings' ? 'Số lượt đặt' : 'Doanh thu'
                ]}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Số lượt đặt" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Doanh thu (M VNĐ)" />
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

      {/* Top Facilities */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>
          Sân hoạt động nhiều nhất
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {topFacilities.map((facility, index) => (
            <div
              key={facility.name}
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: 12,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    background: index < 3 ? "#10b981" : "#6b7280",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{facility.name}</div>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                {facility.bookings} lượt đặt
              </div>
              <div style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                {(facility.revenue / 1e6).toFixed(1)}M VNĐ
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

