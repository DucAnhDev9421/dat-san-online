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
import { Download } from "lucide-react";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("revenue");

  const revenueData = [
    { month: "Tháng 1", revenue: 35000000, bookings: 125 },
    { month: "Tháng 2", revenue: 42000000, bookings: 142 },
    { month: "Tháng 3", revenue: 38000000, bookings: 128 },
    { month: "Tháng 4", revenue: 45000000, bookings: 156 },
    { month: "Tháng 5", revenue: 52000000, bookings: 178 },
    { month: "Tháng 6", revenue: 48000000, bookings: 165 },
  ];

  const facilityPerformance = [
    { name: "Truong Football", revenue: 31200000, bookings: 156 },
    { name: "Sân Bóng Đá Minh Khai", revenue: 25560000, bookings: 142 },
    { name: "Trung Tâm Thể Thao Quận 7", revenue: 32000000, bookings: 128 },
    { name: "Sân Bóng Đá Tân Bình", revenue: 25300000, bookings: 115 },
  ];

  const paymentMethodData = [
    { name: "Chuyển khoản", value: 45, color: "#3b82f6" },
    { name: "MoMo", value: 30, color: "#7c3aed" },
    { name: "VNPay", value: 25, color: "#10b981" },
  ];

  const renderRevenueReport = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Báo cáo doanh thu</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo doanh thu")}
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            background: "#10b981", 
            color: "#fff", 
            border: 0, 
            borderRadius: 10, 
            padding: "10px 14px", 
            cursor: "pointer", 
            fontWeight: 700 
          }}
        >
          <Download size={16}/> Xuất báo cáo
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `${(value / 1e6).toFixed(1)}M VNĐ` : `${value} lượt`,
                  name === 'revenue' ? 'Doanh thu' : 'Số lượt đặt'
                ]}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" name="Doanh thu" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Số lượt đặt" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Phương thức thanh toán</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Hiệu suất sân</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={facilityPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `${(value / 1e6).toFixed(1)}M VNĐ` : `${value} lượt`,
                name === 'revenue' ? 'Doanh thu' : 'Số lượt đặt'
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Doanh thu" />
            <Bar yAxisId="right" dataKey="bookings" fill="#3b82f6" name="Số lượt đặt" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderBookingReport = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Báo cáo đặt sân</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo đặt sân")}
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            background: "#10b981", 
            color: "#fff", 
            border: 0, 
            borderRadius: 10, 
            padding: "10px 14px", 
            cursor: "pointer", 
            fontWeight: 700 
          }}
        >
          <Download size={16}/> Xuất báo cáo
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tổng đặt sân</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981" }}>1,254</div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>+12% so với tháng trước</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tỷ lệ lấp đầy</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>85%</div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>+5% so với tháng trước</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tỷ lệ hủy</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#ef4444" }}>8%</div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>-2% so với tháng trước</div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Báo cáo & thống kê</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setSelectedReport("revenue")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedReport === "revenue" ? "#10b981" : "#fff",
              color: selectedReport === "revenue" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Doanh thu
          </button>
          <button
            onClick={() => setSelectedReport("booking")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedReport === "booking" ? "#10b981" : "#fff",
              color: selectedReport === "booking" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Đặt sân
          </button>
        </div>
      </div>

      {selectedReport === "revenue" && renderRevenueReport()}
      {selectedReport === "booking" && renderBookingReport()}
    </div>
  );
};

export default Reports;
