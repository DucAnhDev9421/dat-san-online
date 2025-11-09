import React from "react";
import { Download } from "lucide-react";
import {
  CalendarDays,
  Users2,
  BadgeDollarSign,
  Star,
} from "lucide-react";
import { ownerKpis, trendData, pieData, pieColors } from "../data/mockData";
import KpiCard from "../components/Dashboard/KpiCard";
import TrendChart from "../components/Dashboard/TrendChart";
import PieChartCard from "../components/Dashboard/PieChartCard";
import TodaySchedule from "../components/Dashboard/TodaySchedule";

const todaySchedule = [
  { time: "08:00", status: "booked", customer: "Nguyễn Văn An", court: "Sân 1" },
  { time: "10:00", status: "available", customer: null, court: "Tất cả sân" },
  { time: "12:00", status: "booked", customer: "Trần Thị Bình", court: "Sân 2" },
  { time: "14:00", status: "booked", customer: "Lê Hoàng", court: "Sân 1" },
  { time: "16:00", status: "booked", customer: "Phạm Văn Đức", court: "Sân 2" },
  { time: "18:00", status: "booked", customer: "Võ Thị Hoa", court: "Sân 1" },
  { time: "20:00", status: "available", customer: null, court: "Tất cả sân" },
];

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
        <TrendChart data={trendData} />
        <PieChartCard data={pieData} colors={pieColors} />
      </div>

      {/* Today's Schedule */}
      <TodaySchedule schedule={todaySchedule} />
    </div>
  );
};

export default Dashboard;
