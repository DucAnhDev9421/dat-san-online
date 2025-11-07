import React from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RevenueChart = ({ data, formatPrice }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis
          yAxisId="left"
          label={{ value: "Doanh thu (VNĐ)", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Số lượt đặt", angle: 90, position: "insideRight" }}
        />
        <Tooltip
          formatter={(value, name) => [
            name === "revenue"
              ? `${formatPrice(value)} VNĐ`
              : `${value} lượt`,
            name === "revenue" ? "Doanh thu" : "Số lượt đặt",
          ]}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="revenue"
          fill="#10b981"
          name="Doanh thu"
          radius={[8, 8, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="bookings"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Số lượt đặt"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;

