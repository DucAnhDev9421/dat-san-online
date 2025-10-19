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
import { reportData, transactionData, dailyRevenueData, courtRevenueData } from "../data/mockData";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("revenue");

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
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `${value}M VNĐ` : `${value} lượt`,
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
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Doanh thu theo sân</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courtRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="court" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `${(value / 1e6).toFixed(1)}M VNĐ` : `${value} lượt`,
                  name === 'revenue' ? 'Doanh thu' : 'Số lượt đặt'
                ]}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
            </BarChart>
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
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Doanh thu hàng ngày</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
    </div>
  );

  const renderTransactionReport = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Báo cáo giao dịch</h2>
        <button
          onClick={() => alert("TODO: Xuất báo cáo giao dịch")}
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
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tổng giao dịch</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981" }}>{transactionData.length}</div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Giao dịch trong tháng</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tổng doanh thu</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>
            {(transactionData.reduce((sum, t) => sum + t.amount, 0) / 1e6).toFixed(1)}M VNĐ
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Trong tháng này</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tỷ lệ thành công</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#f59e0b" }}>
            {((transactionData.filter(t => t.status === 'completed').length / transactionData.length) * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Giao dịch thành công</div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Doanh thu & Thanh toán</h1>
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
            onClick={() => setSelectedReport("transaction")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: selectedReport === "transaction" ? "#10b981" : "#fff",
              color: selectedReport === "transaction" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Giao dịch
          </button>
        </div>
      </div>

      {selectedReport === "revenue" && renderRevenueReport()}
      {selectedReport === "transaction" && renderTransactionReport()}
    </div>
  );
};

export default Reports;
