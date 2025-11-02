import React, { useState, useMemo } from "react";
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
import { Download, TrendingUp, TrendingDown, Building2, Clock, Trophy } from "lucide-react";
import { bookingData } from "../data/mockData";
import { facilityData } from "../data/mockData";
import { paymentData } from "../data/mockData";
import { userData } from "../data/mockData";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month"); // month hoặc quarter
  const [selectedYear, setSelectedYear] = useState(2025);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Tính doanh thu theo tháng/quý
  const revenueData = useMemo(() => {
    const data = [];
    if (selectedPeriod === "month") {
      for (let month = 1; month <= 12; month++) {
        const monthBookings = bookingData.filter((b) => {
          const bookingDate = new Date(b.date);
          return (
            bookingDate.getFullYear() === selectedYear &&
            bookingDate.getMonth() + 1 === month &&
            (b.status === "confirmed" || b.status === "completed")
          );
        });
        const revenue = monthBookings.reduce((sum, b) => sum + b.price, 0);
        data.push({
          period: `Tháng ${month}`,
          revenue,
          bookings: monthBookings.length,
        });
      }
    } else {
      // Quý
      for (let quarter = 1; quarter <= 4; quarter++) {
        const startMonth = (quarter - 1) * 3 + 1;
        const endMonth = quarter * 3;
        const quarterBookings = bookingData.filter((b) => {
          const bookingDate = new Date(b.date);
          const month = bookingDate.getMonth() + 1;
          return (
            bookingDate.getFullYear() === selectedYear &&
            month >= startMonth &&
            month <= endMonth &&
            (b.status === "confirmed" || b.status === "completed")
          );
        });
        const revenue = quarterBookings.reduce((sum, b) => sum + b.price, 0);
        data.push({
          period: `Q${quarter}`,
          revenue,
          bookings: quarterBookings.length,
        });
      }
    }
    return data;
  }, [selectedPeriod, selectedYear]);

  // Số lượng sân hoạt động
  const activeFacilities = useMemo(() => {
    return facilityData.filter((f) => f.status === "active").length;
  }, []);

  const totalFacilities = facilityData.length;
  const pausedFacilities = facilityData.filter((f) => f.status === "paused").length;
  const hiddenFacilities = facilityData.filter((f) => f.status === "hidden").length;

  // Tỷ lệ đặt sân theo giờ cao điểm
  const peakHoursData = useMemo(() => {
    const hourCounts = {};
    const hourRevenue = {};
    
    bookingData.forEach((booking) => {
      if (booking.status === "confirmed" || booking.status === "completed") {
        const startHour = parseInt(booking.startTime.split(":")[0]);
        const hourKey = `${startHour.toString().padStart(2, "0")}:00`;
        
        if (!hourCounts[hourKey]) {
          hourCounts[hourKey] = 0;
          hourRevenue[hourKey] = 0;
        }
        hourCounts[hourKey]++;
        hourRevenue[hourKey] += booking.price;
      }
    });

    const hours = [];
    for (let hour = 6; hour <= 22; hour++) {
      const hourKey = `${hour.toString().padStart(2, "0")}:00`;
      const nextHour = hour === 22 ? "23:00" : `${(hour + 1).toString().padStart(2, "0")}:00`;
      hours.push({
        hour: `${hourKey}-${nextHour}`,
        bookings: hourCounts[hourKey] || 0,
        revenue: hourRevenue[hourKey] || 0,
        type:
          (hourCounts[hourKey] || 0) >= 10
            ? "Cao điểm"
            : (hourCounts[hourKey] || 0) >= 5
            ? "Trung bình"
            : "Thấp điểm",
      });
    }

    return hours;
  }, []);

  // Top sân được đặt nhiều nhất
  const topFacilities = useMemo(() => {
    const facilityStats = {};
    
    bookingData.forEach((booking) => {
      if (booking.status === "confirmed" || booking.status === "completed") {
        if (!facilityStats[booking.facility]) {
          facilityStats[booking.facility] = {
            name: booking.facility,
            bookings: 0,
            revenue: 0,
          };
        }
        facilityStats[booking.facility].bookings++;
        facilityStats[booking.facility].revenue += booking.price;
      }
    });

    return Object.values(facilityStats)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);
  }, []);

  // Top chủ sân doanh thu cao nhất
  const topOwners = useMemo(() => {
    const ownerStats = {};
    
    // Tính từ paymentData (giao dịch thành công)
    paymentData
      .filter((p) => p.status === "success" && p.performerRole === "owner")
      .forEach((payment) => {
        const facility = facilityData.find((f) => f.name === payment.facility);
        if (facility) {
          const ownerId = facility.ownerId;
          const owner = userData.find((u) => u.id === ownerId);
          if (owner && !ownerStats[ownerId]) {
            ownerStats[ownerId] = {
              id: ownerId,
              name: owner.name,
              email: owner.email,
              facilities: [],
              revenue: 0,
              bookings: 0,
            };
          }
          if (ownerStats[ownerId]) {
            if (!ownerStats[ownerId].facilities.includes(payment.facility)) {
              ownerStats[ownerId].facilities.push(payment.facility);
            }
            ownerStats[ownerId].revenue += payment.amount;
          }
        }
      });

    // Thêm doanh thu từ bookingData
    bookingData
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .forEach((booking) => {
        const facility = facilityData.find((f) => f.name === booking.facility);
        if (facility) {
          const ownerId = facility.ownerId;
          if (ownerStats[ownerId]) {
            ownerStats[ownerId].bookings++;
            ownerStats[ownerId].revenue += booking.price;
          }
        }
      });

    return Object.values(ownerStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, []);

  // Tính tổng doanh thu
  const totalRevenue = useMemo(() => {
    return bookingData
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.price, 0);
  }, []);

  // Tỷ lệ tăng trưởng (mock - có thể tính từ dữ liệu thực)
  const revenueGrowth = 12.5; // %

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Thống kê & Báo cáo</h1>
        <button
          onClick={() => alert("TODO: Xuất báo cáo tổng hợp")}
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
            fontWeight: 700,
          }}
        >
          <Download size={16} /> Xuất báo cáo
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
              Tổng doanh thu
            </h3>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>
            {formatPrice(totalRevenue)} VNĐ
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            <span style={{ color: "#10b981" }}>+{revenueGrowth}%</span> so với kỳ trước
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
              Sân hoạt động
            </h3>
            <Building2 size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6" }}>
            {activeFacilities}
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            / {totalFacilities} tổng số sân
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
              Tổng đặt sân
            </h3>
            <Clock size={20} color="#6366f1" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>
            {bookingData.filter((b) => b.status === "confirmed" || b.status === "completed").length}
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            Đã xác nhận & hoàn thành
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
          <div
          style={{ 
              display: "flex",
              justifyContent: "space-between",
            alignItems: "center", 
              marginBottom: 8,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
              Tỷ lệ lấp đầy
            </h3>
            <TrendingUp size={20} color="#f59e0b" />
      </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>
            {Math.round((activeFacilities / totalFacilities) * 100)}%
        </div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
            Sân đang hoạt động
        </div>
      </div>
    </div>

      {/* Doanh thu theo tháng/quý */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            Doanh thu theo {selectedPeriod === "month" ? "tháng" : "quý"}
          </h2>
        <div style={{ display: "flex", gap: 8 }}>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
                padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          <button
              onClick={() =>
                setSelectedPeriod(selectedPeriod === "month" ? "quarter" : "month")
              }
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
                background: selectedPeriod === "month" ? "#10b981" : "#fff",
                color: selectedPeriod === "month" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
                fontSize: 14,
            }}
          >
              {selectedPeriod === "month" ? "Theo tháng" : "Theo quý"}
          </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueData}>
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
      </div>

      {/* Chi tiết sân hoạt động */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
          Số lượng sân hoạt động
        </h2>
        <div
          style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981" }}>
              {activeFacilities}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              Đang hoạt động
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#f59e0b" }}>
              {pausedFacilities}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              Tạm dừng
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#6b7280" }}>
              {hiddenFacilities}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              Đã ẩn
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#374151" }}>
              {totalFacilities}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              Tổng số sân
            </div>
          </div>
        </div>
      </div>

      {/* Tỷ lệ đặt sân theo giờ cao điểm */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
          Tỷ lệ đặt sân theo giờ cao điểm
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={peakHoursData} barCategoryGap="5%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis yAxisId="left" label={{ value: "Số lượt đặt", angle: -90, position: "insideLeft" }} />
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
        </div>

      {/* Top sân được đặt nhiều nhất */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Trophy size={24} color="#f59e0b" />
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            Top sân được đặt nhiều nhất
          </h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Hạng", "Tên sân", "Số lượt đặt", "Doanh thu", "Trung bình/đơn"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: 12,
                        fontSize: 13,
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb",
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {topFacilities.map((facility, index) => (
                <tr
                  key={facility.name}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background:
                          index === 0
                            ? "#fbbf24"
                            : index === 1
                            ? "#e5e7eb"
                            : index === 2
                            ? "#f97316"
                            : "#f3f4f6",
                        color:
                          index < 3 ? "#fff" : "#6b7280",
                        textAlign: "center",
                        lineHeight: "28px",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>
                    {facility.name}
                  </td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {facility.bookings} lượt
                  </td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#10b981" }}>
                    {formatPrice(facility.revenue)} VNĐ
                  </td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {formatPrice(
                      Math.round(facility.revenue / facility.bookings)
                    )}{" "}
                    VNĐ
                  </td>
                </tr>
              ))}
              {topFacilities.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top chủ sân doanh thu cao nhất */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Trophy size={24} color="#f59e0b" />
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            Top chủ sân doanh thu cao nhất
          </h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Hạng",
                  "Tên chủ sân",
                  "Email",
                  "Số cơ sở",
                  "Tổng doanh thu",
                  "Số lượt đặt",
                ].map((h) => (
                  <th
                    key={h}
            style={{
                      padding: 12,
                      fontSize: 13,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
              fontWeight: 600,
            }}
          >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topOwners.map((owner, index) => (
                <tr
                  key={owner.id}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background:
                          index === 0
                            ? "#fbbf24"
                            : index === 1
                            ? "#e5e7eb"
                            : index === 2
                            ? "#f97316"
                            : "#f3f4f6",
                        color: index < 3 ? "#fff" : "#6b7280",
                        textAlign: "center",
                        lineHeight: "28px",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>
                    {owner.name}
                  </td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {owner.email}
                  </td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {owner.facilities.length} cơ sở
                  </td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#10b981" }}>
                    {formatPrice(owner.revenue)} VNĐ
                  </td>
                  <td style={{ padding: 12, color: "#6b7280" }}>
                    {owner.bookings} lượt
                  </td>
                </tr>
              ))}
              {topOwners.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
            style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
