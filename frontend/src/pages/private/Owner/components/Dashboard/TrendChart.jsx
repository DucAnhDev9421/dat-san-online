import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TrendChart = ({ data, title = "Xu hướng đặt sân & doanh thu" }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Lượt đặt" />
          <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Doanh thu (VNĐ)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;

