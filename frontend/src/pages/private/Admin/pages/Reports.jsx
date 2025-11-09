import React, { useState, useMemo } from "react";
import { Download, Trophy } from "lucide-react";
import { bookingData } from "../data/mockData";
import { facilityData } from "../data/mockData";
import { paymentData } from "../data/mockData";
import { userData } from "../data/mockData";
import ReportStats from "../components/Reports/ReportStats";
import ReportPeriodSelector from "../components/Reports/ReportPeriodSelector";
import RevenueChart from "../components/Reports/RevenueChart";
import FacilityStats from "../components/Reports/FacilityStats";
import PeakHoursChart from "../components/Reports/PeakHoursChart";
import TopFacilitiesTable from "../components/Reports/TopFacilitiesTable";
import TopOwnersTable from "../components/Reports/TopOwnersTable";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
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

  // Tỷ lệ tăng trưởng (mock)
  const revenueGrowth = 12.5;

  const totalBookings = bookingData.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  ).length;

  const fillRate = Math.round((activeFacilities / totalFacilities) * 100);

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

      <ReportStats
        totalRevenue={totalRevenue}
        revenueGrowth={revenueGrowth}
        activeFacilities={activeFacilities}
        totalFacilities={totalFacilities}
        totalBookings={totalBookings}
        fillRate={fillRate}
        formatPrice={formatPrice}
      />

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
          <ReportPeriodSelector
            selectedPeriod={selectedPeriod}
            selectedYear={selectedYear}
            onPeriodChange={setSelectedPeriod}
            onYearChange={setSelectedYear}
          />
        </div>
        <RevenueChart data={revenueData} formatPrice={formatPrice} />
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
        <FacilityStats
          activeFacilities={activeFacilities}
          pausedFacilities={pausedFacilities}
          hiddenFacilities={hiddenFacilities}
          totalFacilities={totalFacilities}
        />
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
        <PeakHoursChart data={peakHoursData} formatPrice={formatPrice} />
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
        <TopFacilitiesTable facilities={topFacilities} formatPrice={formatPrice} />
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
        <TopOwnersTable owners={topOwners} formatPrice={formatPrice} />
      </div>
    </div>
  );
};

export default Reports;

