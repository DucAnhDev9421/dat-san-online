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
import { occupancyData, peakHoursData, loyalCustomersData, cancellationData } from "../data/mockData";

const Analytics = () => {
  const [selectedAnalytics, setSelectedAnalytics] = useState("occupancy");

  const renderOccupancyAnalytics = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Phân tích tỷ lệ lấp đầy</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo tỷ lệ lấp đầy")}
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

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Tỷ lệ lấp đầy theo sân</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="court" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'occupancyRate' ? `${value}%` : `${value} slot`,
                name === 'occupancyRate' ? 'Tỷ lệ lấp đầy' : 'Số slot'
              ]}
            />
            <Legend />
            <Bar dataKey="occupancyRate" fill="#10b981" name="Tỷ lệ lấp đầy" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPeakHoursAnalytics = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Phân tích giờ cao điểm</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo giờ cao điểm")}
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

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Doanh thu theo giờ</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
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

  const renderLoyalCustomersAnalytics = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Phân tích khách hàng trung thành</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo khách hàng trung thành")}
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

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Top khách hàng trung thành</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {loyalCustomersData.map((customer, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: index < 3 ? "#f0f9ff" : "#fff",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                  {customer.customer}
                </div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  {customer.totalBookings} lượt đặt • {(customer.totalSpent / 1e6).toFixed(1)}M VNĐ
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: customer.tier === "VIP" ? "#f59e0b" : 
                        customer.tier === "Gold" ? "#10b981" : "#6b7280"
                }}>
                  {customer.tier}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {customer.loyaltyScore} điểm
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCancellationAnalytics = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Phân tích tỷ lệ hủy</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo tỷ lệ hủy")}
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

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Tỷ lệ hủy theo sân</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cancellationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="court" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'cancellationRate' ? `${value}%` : `${value} lượt`,
                name === 'cancellationRate' ? 'Tỷ lệ hủy' : 'Số lượt'
              ]}
            />
            <Legend />
            <Bar dataKey="cancellationRate" fill="#ef4444" name="Tỷ lệ hủy" />
            <Bar dataKey="noShowRate" fill="#f59e0b" name="Tỷ lệ không đến" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Báo cáo & Thống kê</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setSelectedAnalytics("occupancy")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedAnalytics === "occupancy" ? "#10b981" : "#fff",
              color: selectedAnalytics === "occupancy" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tỷ lệ lấp đầy
          </button>
          <button
            onClick={() => setSelectedAnalytics("peak")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedAnalytics === "peak" ? "#10b981" : "#fff",
              color: selectedAnalytics === "peak" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Giờ cao điểm
          </button>
          <button
            onClick={() => setSelectedAnalytics("loyal")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedAnalytics === "loyal" ? "#10b981" : "#fff",
              color: selectedAnalytics === "loyal" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Khách hàng trung thành
          </button>
          <button
            onClick={() => setSelectedAnalytics("cancellation")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedAnalytics === "cancellation" ? "#10b981" : "#fff",
              color: selectedAnalytics === "cancellation" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tỷ lệ hủy
          </button>
        </div>
      </div>

      {selectedAnalytics === "occupancy" && renderOccupancyAnalytics()}
      {selectedAnalytics === "peak" && renderPeakHoursAnalytics()}
      {selectedAnalytics === "loyal" && renderLoyalCustomersAnalytics()}
      {selectedAnalytics === "cancellation" && renderCancellationAnalytics()}
    </div>
  );
};

export default Analytics;
