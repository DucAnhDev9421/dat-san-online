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

const PeakHoursChart = ({ data, formatPrice }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} barCategoryGap="5%">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="hour"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis
          yAxisId="left"
          label={{ value: "Số lượt đặt", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Doanh thu (VNĐ)", angle: 90, position: "insideRight" }}
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
          dataKey="bookings"
          fill="#3b82f6"
          name="Số lượt đặt"
          radius={[8, 8, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          name="Doanh thu"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PeakHoursChart;

