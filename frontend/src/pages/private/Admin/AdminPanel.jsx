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
import {
  CalendarDays,
  Users2,
  BadgeDollarSign,
  Percent,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock5,
  XCircle,
  Plus,
  Download,
  LayoutDashboard,
  BookOpen,
  UserCheck,
  Building2,
  BarChart3,
} from "lucide-react";
import AdminHeader from "../../../component/admin/AdminHeader";

// Mock data
const kpis = {
  weeklyBookings: 45,
  occupancyRate: 78,
  revenue: 22500000,
  cancellationRate: 12,
};

const trendData = [
  { name: "Mon", bookings: 5, revenue: 2.3 },
  { name: "Tue", bookings: 6, revenue: 2.8 },
  { name: "Wed", bookings: 7, revenue: 3.1 },
  { name: "Thu", bookings: 8, revenue: 3.9 },
  { name: "Fri", bookings: 9, revenue: 4.4 },
  { name: "Sat", bookings: 6, revenue: 3.0 },
  { name: "Sun", bookings: 4, revenue: 1.8 },
];

const pieData = [
  { name: "Đã xác nhận", value: 62 },
  { name: "Đã hủy", value: 12 },
  { name: "Chờ xử lý", value: 26 },
];

const pieColors = ["#10b981", "#ef4444", "#6366f1"];

const bookingData = [
  {
    id: "BK001",
    customer: "Nguyễn Văn An",
    phone: "0901234567",
    court: "Sân 1",
    date: "2025-01-15",
    time: "18:00–20:00",
    price: 500000,
    status: "confirmed",
    pay: "paid",
  },
  {
    id: "BK002",
    customer: "Trần Thị Bình",
    phone: "0909998888",
    court: "Sân 2",
    date: "2025-01-16",
    time: "19:00–21:00",
    price: 600000,
    status: "pending",
    pay: "unpaid",
  },
  {
    id: "BK003",
    customer: "Lê Hoàng",
    phone: "0912223333",
    court: "Sân 3",
    date: "2025-01-16",
    time: "17:00–19:00",
    price: 500000,
    status: "cancelled",
    pay: "refund",
  },
];

const customerData = [
  {
    id: "C001",
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an@example.com",
    totalBookings: 5,
    totalSpend: 2500000,
  },
  {
    id: "C002",
    name: "Trần Thị Bình",
    phone: "0909998888",
    email: "binh@example.com",
    totalBookings: 3,
    totalSpend: 1500000,
  },
  {
    id: "C003",
    name: "Lê Hoàng",
    phone: "0912223333",
    email: "hoang@example.com",
    totalBookings: 8,
    totalSpend: 4200000,
  },
];

const facilityData = [
  { id: 1, name: "Sân 1", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 2, name: "Sân 2", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 3, name: "Sân 3", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 4, name: "Sân 4", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 5, name: "Sân 5", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 6, name: "Sân 3 + 2", capacity: 11, openAt: "07:00", closeAt: "22:00", price: 1000000, peakPrice: 1200000, status: "Hoạt động" },
  { id: 7, name: "Sân 3 + 4", capacity: 11, openAt: "07:00", closeAt: "22:00", price: 1000000, peakPrice: 1200000, status: "Hoạt động" },
];

const reportData = [
  { month: "01", bookings: 120, revenue: 56 },
  { month: "02", bookings: 98, revenue: 49 },
  { month: "03", bookings: 140, revenue: 68 },
  { month: "04", bookings: 110, revenue: 52 },
  { month: "05", bookings: 160, revenue: 78 },
  { month: "06", bookings: 180, revenue: 89 },
];

// Components
const Status = ({ value }) => {
  const map = {
    confirmed: {
      bg: "#e6f9f0",
      color: "#059669",
      icon: <CheckCircle2 size={14} />,
      label: "Xác nhận",
    },
    pending: {
      bg: "#e6effe",
      color: "#4338ca",
      icon: <Clock5 size={14} />,
      label: "Chờ",
    },
    cancelled: {
      bg: "#fee2e2",
      color: "#ef4444",
      icon: <XCircle size={14} />,
      label: "Hủy",
    },
  };
  const s = map[value] || map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontWeight: 700,
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
};

const ActionButton = ({ bg, Icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: bg,
      color: "#fff",
      border: 0,
      borderRadius: 8,
      padding: 8,
      marginRight: 6,
      cursor: "pointer",
    }}
  >
    <Icon size={16} />
  </button>
);

const KpiCard = ({ title, value, icon }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div style={{ background: "#eef7f0", borderRadius: 10, padding: 10 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

// Main Admin Panel Component
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [range, setRange] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "bookings", label: "Quản lý đặt sân", icon: BookOpen },
    { id: "customers", label: "Quản lý khách hàng", icon: UserCheck },
    { id: "facilities", label: "Quản lý sân bóng", icon: Building2 },
    { id: "reports", label: "Báo cáo", icon: BarChart3 },
  ];

  const filteredBookings = useMemo(
    () =>
      bookingData.filter((r) =>
        [r.id, r.customer, r.court, r.phone]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const filteredCustomers = useMemo(
    () =>
      customerData.filter((r) =>
        [r.name, r.phone, r.email, r.id]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const filteredFacilities = useMemo(
    () => facilityData.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredFacilities.length / pageSize));
  const facilitySlice = filteredFacilities.slice((page - 1) * pageSize, page * pageSize);

  const renderDashboard = () => (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Bảng điều khiển</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {["Today", "7d", "30d"].map((k) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: range === k ? "#10b981" : "#fff",
                color: range === k ? "#fff" : "#111827",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {k}
            </button>
          ))}
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
          title="Đặt sân trong tuần"
          value={kpis.weeklyBookings}
          icon={<CalendarDays size={20} color="#10b981" />}
        />
        <KpiCard
          title="Tỉ lệ lấp đầy"
          value={`${kpis.occupancyRate}%`}
          icon={<Users2 size={20} color="#3b82f6" />}
        />
        <KpiCard
          title="Doanh thu (triệu)"
          value={(kpis.revenue / 1e6).toFixed(1)}
          icon={<BadgeDollarSign size={20} color="#6366f1" />}
        />
        <KpiCard
          title="Tỉ lệ hủy"
          value={`${kpis.cancellationRate}%`}
          icon={<Percent size={20} color="#ef4444" />}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Xu hướng đặt sân & doanh thu
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Tình trạng đơn</div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
        Quản lý đặt sân
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <strong>Tổng:</strong> {filteredBookings.length} bookings
          </div>
          <input
            placeholder="Tìm mã / khách / sân…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Khách hàng",
                  "SĐT",
                  "Sân",
                  "Ngày",
                  "Khung giờ",
                  "Giá (đ)",
                  "Thanh toán",
                  "Trạng thái",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 12,
                      fontSize: 13,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.customer}</td>
                  <td style={{ padding: 12 }}>{r.phone}</td>
                  <td style={{ padding: 12 }}>{r.court}</td>
                  <td style={{ padding: 12 }}>{r.date}</td>
                  <td style={{ padding: 12 }}>{r.time}</td>
                  <td style={{ padding: 12 }}>{r.price.toLocaleString()}</td>
                  <td style={{ padding: 12, textTransform: "capitalize" }}>
                    {r.pay}
                  </td>
                  <td style={{ padding: 12 }}>
                    <Status value={r.status} />
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem " + r.id)}
                      title="Xem"
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => alert("Sửa " + r.id)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => alert("Xóa " + r.id)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredBookings.length && (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
        Quản lý khách hàng
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <strong>Tổng:</strong> {filteredCustomers.length} khách
          </div>
          <input
            placeholder="Tìm tên / SĐT / email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Họ tên",
                  "SĐT",
                  "Email",
                  "Số lần đặt",
                  "Tổng chi (đ)",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 12,
                      fontSize: 13,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.phone}</td>
                  <td style={{ padding: 12 }}>{r.email}</td>
                  <td style={{ padding: 12 }}>{r.totalBookings}</td>
                  <td style={{ padding: 12 }}>
                    {r.totalSpend.toLocaleString()}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem " + r.name)}
                      title="Xem"
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => alert("Sửa " + r.name)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => alert("Xóa " + r.name)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredCustomers.length && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFacilities = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý sân bóng</h1>
        <button
          onClick={() => alert("TODO: mở modal tạo sân")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
        >
          <Plus size={16}/> Thêm sân bóng
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <label style={{ marginRight: 8 }}>Show</label>
            <select value={pageSize} onChange={(e)=>{setPageSize(Number(e.target.value)); setPage(1);}} style={{ padding: 6, borderRadius: 8, border: "1px solid #e5e7eb" }}>
              {[5,10,20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ marginLeft: 8 }}>entries</span>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Search:</label>
            <input value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value); setPage(1);}} placeholder="Tên sân…" style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}/>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["#", "Tên", "Số người", "Bắt đầu lúc", "Kết thúc lúc", "Giá/giờ", "Giá/giờ cao điểm", "Tình trạng", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilitySlice.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12 }}>{(page-1)*pageSize + idx + 1}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.capacity}</td>
                  <td style={{ padding: 12 }}>{r.openAt}</td>
                  <td style={{ padding: 12 }}>{r.closeAt}</td>
                  <td style={{ padding: 12 }}>{r.price.toLocaleString()}</td>
                  <td style={{ padding: 12 }}>{r.peakPrice.toLocaleString()}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ background: "#e6f9f0", color: "#059669", padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{r.status}</span>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton bg="#06b6d4" Icon={Eye} onClick={()=>alert("Xem sân " + r.name)} title="Xem" />
                    <ActionButton bg="#22c55e" Icon={Pencil} onClick={()=>alert("Sửa " + r.name)} title="Sửa" />
                    <ActionButton bg="#ef4444" Icon={Trash2} onClick={()=>alert("Xóa " + r.name)} title="Xóa" />
                  </td>
                </tr>
              ))}
              {!facilitySlice.length && (
                <tr><td colSpan={9} style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: 12 }}>
          <div>Showing {(page-1)*pageSize + 1} to {Math.min(page*pageSize, filteredFacilities.length)} of {filteredFacilities.length} entries</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
            <div style={{ padding: "6px 10px", borderRadius: 8, background: "#10b981", color: "#fff" }}>{page}</div>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Báo cáo</h1>
        <button
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

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Doanh thu theo tháng
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Số lượng đặt sân
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "bookings":
        return renderBookings();
      case "customers":
        return renderCustomers();
      case "facilities":
        return renderFacilities();
      case "reports":
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <AdminHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: isSidebarOpen ? 250 : 0,
            background: "#fff",
            boxShadow: "0 0 20px rgba(0,0,0,.1)",
            padding: isSidebarOpen ? "24px 0" : 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
            zIndex: 100,
          }}
        >
          {isSidebarOpen && (
            <>
              <div style={{ padding: "0 24px", marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
                  Admin Panel
                </h2>
              </div>
              
              <nav>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 24px",
                        border: "none",
                        background: activeTab === item.id ? "#e6f9f0" : "transparent",
                        color: activeTab === item.id ? "#10b981" : "#6b7280",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: activeTab === item.id ? 600 : 400,
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== item.id) {
                          e.target.style.background = "#f9fafb";
                          e.target.style.color = "#374151";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== item.id) {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#6b7280";
                        }
                      }}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 24, overflow: "auto" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
