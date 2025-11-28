import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../../../contexts/AuthContext";
import { facilityApi } from "../../../../api/facilityApi";
import { analyticsApi } from "../../../../api/analyticsApi";
import { toast } from "react-toastify";

const Reports = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [facilityId, setFacilityId] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [courtData, setCourtData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0], // First day of current month
    endDate: new Date().toISOString().split("T")[0], // Today
  });

  // Fetch owner facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      if (!user?._id) return;
      try {
        const ownerId = user._id || user.id;
        const result = await facilityApi.getFacilities({ ownerId, status: "opening" });
        if (result.success) {
          const facilitiesList = result.data?.facilities || result.data || [];
          setFacilities(facilitiesList);
          if (facilitiesList.length > 0) {
            const firstFacilityId = facilitiesList[0]._id || facilitiesList[0].id;
            setFacilityId(firstFacilityId);
          }
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
        toast.error("Không thể tải danh sách cơ sở");
      }
    };
    fetchFacilities();
  }, [user]);

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenue = async () => {
      if (!facilityId || selectedReport !== "revenue") return;
      try {
        setLoading(true);
        const result = await analyticsApi.getOwnerRevenue(
          facilityId,
          dateRange.startDate,
          dateRange.endDate
        );
        if (result.success) {
          setRevenueData(result.data);
        }
      } catch (error) {
        console.error("Error fetching revenue:", error);
        toast.error(error.message || "Không thể tải dữ liệu doanh thu");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [facilityId, dateRange, selectedReport]);

  // Fetch court data
  useEffect(() => {
    const fetchCourts = async () => {
      if (!facilityId || selectedReport !== "revenue") return;
      try {
        const result = await analyticsApi.getOwnerCourts(facilityId);
        if (result.success) {
          setCourtData(result.data);
        }
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };
    fetchCourts();
  }, [facilityId, selectedReport]);

  // Transform revenue data for charts
  const dailyRevenueChartData = revenueData?.dailyData
    ? revenueData.dailyData.map((item) => ({
        date: new Date(item._id).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        revenue: item.total / 1e6, // Convert to millions
        bookings: item.count,
      }))
    : [];

  const courtRevenueChartData = courtData
    ? courtData.map((court) => ({
        court: court.name || `Sân ${court.courtNumber || ""}`,
        revenue: court.totalRevenue || 0,
        bookings: court.totalBookings || 0,
      }))
    : [];

  const renderRevenueReport = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Báo cáo doanh thu</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
          <span>đến</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
            }}
          />
          <button
            onClick={() => toast.info("Tính năng xuất báo cáo đang được phát triển")}
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
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            <p style={{ color: "#6b7280" }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 6px 20px rgba(0,0,0,.06)",
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Tổng doanh thu: {revenueData ? (revenueData.totalRevenue / 1e6).toFixed(1) : "0"}M VNĐ
              </h3>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Tổng lượt đặt: {revenueData?.totalBookings || 0} lượt
              </h3>
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
              {courtRevenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={courtRevenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="court" angle={-45} textAnchor="end" height={80} />
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
              ) : (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Chưa có dữ liệu</p>
              )}
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
            {dailyRevenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRevenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `${value.toFixed(1)}M VNĐ` : `${value} lượt`,
                      name === 'revenue' ? 'Doanh thu' : 'Số lượt đặt'
                    ]}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" name="Doanh thu (M VNĐ)" />
                  <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Số lượt đặt" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Chưa có dữ liệu trong khoảng thời gian này</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderTransactionReport = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Báo cáo giao dịch</h2>
        <button
          onClick={() => toast.info("Tính năng xuất báo cáo đang được phát triển")}
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
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tổng lượt đặt</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981" }}>
            {revenueData?.totalBookings || 0}
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Trong khoảng thời gian đã chọn</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tổng doanh thu</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>
            {revenueData ? (revenueData.totalRevenue / 1e6).toFixed(1) : "0"}M VNĐ
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Trong khoảng thời gian đã chọn</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Số sân</h3>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#f59e0b" }}>
            {courtData?.length || 0}
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Tổng số sân trong cơ sở</div>
        </div>
      </div>
    </div>
  );

  if (!facilityId) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Bạn chưa có cơ sở nào. Vui lòng tạo cơ sở trước.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Doanh thu & Thanh toán</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {facilities.length > 1 && (
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              {facilities.map((facility) => (
                <option key={facility._id || facility.id} value={facility._id || facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          )}
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Reports;

