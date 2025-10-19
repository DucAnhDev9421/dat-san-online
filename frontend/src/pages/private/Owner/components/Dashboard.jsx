import React from "react";
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
  Star,
  Download,
  TrendingUp,
} from "lucide-react";
import { ownerKpis, trendData, pieData, pieColors } from "../data/mockData";

const todaySchedule = [
  { time: "08:00", status: "booked", customer: "Nguyễn Văn An", court: "Sân 1" },
  { time: "10:00", status: "available", customer: null, court: "Tất cả sân" },
  { time: "12:00", status: "booked", customer: "Trần Thị Bình", court: "Sân 2" },
  { time: "14:00", status: "booked", customer: "Lê Hoàng", court: "Sân 1" },
  { time: "16:00", status: "booked", customer: "Phạm Văn Đức", court: "Sân 2" },
  { time: "18:00", status: "booked", customer: "Võ Thị Hoa", court: "Sân 1" },
  { time: "20:00", status: "available", customer: null, court: "Tất cả sân" },
];

const KpiCard = ({ title, value, icon, trend }) => (
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
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
      {trend && (
        <div style={{ fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
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
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Bảng điều khiển chủ sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#3b82f6",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <Download size={16} /> Xuất báo cáo
          </button>
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
          title="Doanh thu hôm nay"
          value={`${(ownerKpis.todayRevenue / 1e6).toFixed(1)}M VNĐ`}
          icon={<BadgeDollarSign size={20} color="#10b981" />}
          trend="+15% so với hôm qua"
        />
        <KpiCard
          title="Tổng số lượt đặt sân"
          value={`${ownerKpis.weeklyBookings} lượt / tuần`}
          icon={<CalendarDays size={20} color="#3b82f6" />}
          trend="+8% so với tuần trước"
        />
        <KpiCard
          title="Tỷ lệ lấp đầy"
          value={`${ownerKpis.occupancyRate}%`}
          icon={<Users2 size={20} color="#f59e0b" />}
          trend="+5% so với tuần trước"
        />
        <KpiCard
          title="Đánh giá trung bình"
          value={`⭐ ${ownerKpis.averageRating} / 5.0`}
          icon={<Star size={20} color="#f59e0b" />}
          trend="+0.1 so với tháng trước"
        />
      </div>

      {/* Charts and Schedule row */}
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
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" />
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

      {/* Today's Schedule */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>
          📅 Lịch sân hôm nay
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {todaySchedule.map((schedule, index) => (
            <div
              key={index}
              style={{
                background: schedule.status === "booked" ? "#f0f9ff" : "#f0fdf4",
                border: `1px solid ${schedule.status === "booked" ? "#3b82f6" : "#10b981"}`,
                borderRadius: 8,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ 
                fontWeight: 600, 
                color: schedule.status === "booked" ? "#1e40af" : "#166534",
                fontSize: 14 
              }}>
                {schedule.time}
              </div>
              <div style={{ 
                fontSize: 12, 
                color: schedule.status === "booked" ? "#1e40af" : "#166534",
                fontWeight: 600 
              }}>
                {schedule.status === "booked" ? "Đã đặt" : "Trống"}
              </div>
              {schedule.customer && (
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  {schedule.customer}
                </div>
              )}
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {schedule.court}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
