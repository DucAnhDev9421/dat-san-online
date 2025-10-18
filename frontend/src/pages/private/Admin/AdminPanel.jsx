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
  Calendar,
  CreditCard,
  Receipt,
  UserCog,
  Settings,
  Bell,
  Send,
  Mail,
  FileText,
  Activity,
} from "lucide-react";
import AdminHeader from "../../../component/admin/AdminHeader";

// Mock data
const kpis = {
  totalRevenue: 350000000,
  totalBookings: 1254,
  occupancyRate: 85,
  newUsers: 120,
};

const trendData = [
  { name: "T2", bookings: 45, revenue: 12.5 },
  { name: "T3", bookings: 52, revenue: 14.2 },
  { name: "T4", bookings: 48, revenue: 13.8 },
  { name: "T5", bookings: 61, revenue: 16.5 },
  { name: "T6", bookings: 58, revenue: 15.9 },
  { name: "T7", bookings: 72, revenue: 19.2 },
  { name: "CN", bookings: 68, revenue: 18.1 },
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
    email: "an@example.com",
    facility: "Truong Football",
    court: "Sân 1",
    date: "2025-01-15",
    time: "18:00–20:00",
    price: 400000,
    status: "confirmed",
    pay: "paid",
    bookingDate: "2025-01-14",
    notes: "Đặt sân cho đội bóng công ty"
  },
  {
    id: "BK002",
    customer: "Trần Thị Bình",
    phone: "0909998888",
    email: "binh@example.com",
    facility: "Sân Bóng Đá Minh Khai",
    court: "Sân 2",
    date: "2025-01-16",
    time: "19:00–21:00",
    price: 360000,
    status: "pending",
    pay: "unpaid",
    bookingDate: "2025-01-15",
    notes: ""
  },
  {
    id: "BK003",
    customer: "Lê Hoàng",
    phone: "0912223333",
    email: "hoang@example.com",
    facility: "Trung Tâm Thể Thao Quận 7",
    court: "Sân 3",
    date: "2025-01-16",
    time: "17:00–19:00",
    price: 500000,
    status: "cancelled",
    pay: "refund",
    bookingDate: "2025-01-15",
    notes: "Khách hủy do thay đổi lịch"
  },
  {
    id: "BK004",
    customer: "Phạm Văn Đức",
    phone: "0913334444",
    email: "duc@example.com",
    facility: "Sân Bóng Đá Tân Bình",
    court: "Sân 1",
    date: "2025-01-14",
    time: "20:00–22:00",
    price: 440000,
    status: "completed",
    pay: "paid",
    bookingDate: "2025-01-13",
    notes: "Đã hoàn thành"
  },
  {
    id: "BK005",
    customer: "Võ Thị Hoa",
    phone: "0914445555",
    email: "hoa@example.com",
    facility: "Trung Tâm Thể Thao Bình Thạnh",
    court: "Sân 2",
    date: "2025-01-13",
    time: "18:00–20:00",
    price: 460000,
    status: "no-show",
    pay: "paid",
    bookingDate: "2025-01-12",
    notes: "Khách không đến"
  },
  {
    id: "BK006",
    customer: "Đặng Văn Thành",
    phone: "0915556666",
    email: "thanh@example.com",
    facility: "Sân Bóng Đá Gò Vấp",
    court: "Sân 1",
    date: "2025-01-17",
    time: "19:00–21:00",
    price: 300000,
    status: "pending",
    pay: "unpaid",
    bookingDate: "2025-01-16",
    notes: "Chờ xác nhận"
  },
];

const customerData = [
  {
    id: "U001",
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an@example.com",
    role: "user",
    status: "active",
    totalBookings: 5,
    totalSpend: 2500000,
    joinDate: "2024-01-15",
    lastLogin: "2025-01-16",
    address: "123 Đường ABC, Quận 1, TP.HCM"
  },
  {
    id: "O001",
    name: "Trần Thị Bình",
    phone: "0909998888",
    email: "binh@example.com",
    role: "owner",
    status: "active",
    totalBookings: 3,
    totalSpend: 1500000,
    joinDate: "2024-02-20",
    lastLogin: "2025-01-15",
    address: "456 Đường Minh Khai, Quận 3, TP.HCM"
  },
  {
    id: "A001",
    name: "Lê Hoàng",
    phone: "0912223333",
    email: "hoang@example.com",
    role: "admin",
    status: "active",
    totalBookings: 8,
    totalSpend: 4200000,
    joinDate: "2024-01-01",
    lastLogin: "2025-01-16",
    address: "789 Đường Nguyễn Thị Thập, Quận 7, TP.HCM"
  },
  {
    id: "U002",
    name: "Phạm Văn Đức",
    phone: "0913334444",
    email: "duc@example.com",
    role: "user",
    status: "banned",
    totalBookings: 2,
    totalSpend: 800000,
    joinDate: "2024-03-10",
    lastLogin: "2025-01-10",
    address: "321 Đường Quang Trung, Gò Vấp, TP.HCM"
  },
  {
    id: "O002",
    name: "Võ Thị Hoa",
    phone: "0914445555",
    email: "hoa@example.com",
    role: "owner",
    status: "active",
    totalBookings: 0,
    totalSpend: 0,
    joinDate: "2024-04-05",
    lastLogin: "2025-01-14",
    address: "654 Đường Cộng Hòa, Tân Bình, TP.HCM"
  },
  {
    id: "U003",
    name: "Đặng Văn Thành",
    phone: "0915556666",
    email: "thanh@example.com",
    role: "user",
    status: "active",
    totalBookings: 12,
    totalSpend: 3600000,
    joinDate: "2024-05-12",
    lastLogin: "2025-01-16",
    address: "987 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM"
  },
];

const facilityData = [
  { 
    id: 1, 
    name: "Truong Football", 
    type: "Sân bóng đá 7 người", 
    price: 200000, 
    address: "123 Đường ABC, Quận 1, TP.HCM", 
    status: "Hoạt động", 
    owner: "Nguyễn Văn Trường" 
  },
  { 
    id: 2, 
    name: "Sân Bóng Đá Minh Khai", 
    type: "Sân bóng đá 7 người", 
    price: 180000, 
    address: "456 Đường Minh Khai, Quận 3, TP.HCM", 
    status: "Hoạt động", 
    owner: "Trần Thị Minh" 
  },
  { 
    id: 3, 
    name: "Trung Tâm Thể Thao Quận 7", 
    type: "Sân bóng đá 11 người", 
    price: 250000, 
    address: "789 Đường Nguyễn Thị Thập, Quận 7, TP.HCM", 
    status: "Hoạt động", 
    owner: "Lê Hoàng Nam" 
  },
  { 
    id: 4, 
    name: "Sân Bóng Đá Gò Vấp", 
    type: "Sân bóng đá 7 người", 
    price: 150000, 
    address: "321 Đường Quang Trung, Gò Vấp, TP.HCM", 
    status: "Bảo trì", 
    owner: "Phạm Văn Đức" 
  },
  { 
    id: 5, 
    name: "Sân Bóng Đá Tân Bình", 
    type: "Sân bóng đá 7 người", 
    price: 220000, 
    address: "654 Đường Cộng Hòa, Tân Bình, TP.HCM", 
    status: "Hoạt động", 
    owner: "Võ Thị Hoa" 
  },
  { 
    id: 6, 
    name: "Trung Tâm Thể Thao Bình Thạnh", 
    type: "Sân bóng đá 11 người", 
    price: 230000, 
    address: "987 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM", 
    status: "Hoạt động", 
    owner: "Đặng Văn Thành" 
  },
  { 
    id: 7, 
    name: "Sân Bóng Đá Phú Nhuận", 
    type: "Sân bóng đá 7 người", 
    price: 190000, 
    address: "147 Đường Phan Đình Phùng, Phú Nhuận, TP.HCM", 
    status: "Tạm ngưng", 
    owner: "Bùi Thị Lan" 
  },
  { 
    id: 8, 
    name: "Sân Bóng Đá Thủ Đức", 
    type: "Sân bóng đá 7 người", 
    price: 210000, 
    address: "258 Đường Võ Văn Ngân, Thủ Đức, TP.HCM", 
    status: "Hoạt động", 
    owner: "Ngô Văn Hùng" 
  },
];

const reportData = [
  { month: "01", bookings: 120, revenue: 56 },
  { month: "02", bookings: 98, revenue: 49 },
  { month: "03", bookings: 140, revenue: 68 },
  { month: "04", bookings: 110, revenue: 52 },
  { month: "05", bookings: 160, revenue: 78 },
  { month: "06", bookings: 180, revenue: 89 },
];

const dailyRevenueData = [
  { date: "2025-01-15", revenue: 2500000, bookings: 12 },
  { date: "2025-01-16", revenue: 3200000, bookings: 15 },
  { date: "2025-01-17", revenue: 1800000, bookings: 8 },
  { date: "2025-01-18", revenue: 4100000, bookings: 18 },
  { date: "2025-01-19", revenue: 2900000, bookings: 13 },
  { date: "2025-01-20", revenue: 3600000, bookings: 16 },
  { date: "2025-01-21", revenue: 2200000, bookings: 10 },
];

const occupancyData = [
  { facility: "Truong Football", totalSlots: 168, bookedSlots: 142, occupancyRate: 84.5 },
  { facility: "Sân Bóng Đá Minh Khai", totalSlots: 168, bookedSlots: 128, occupancyRate: 76.2 },
  { facility: "Trung Tâm Thể Thao Quận 7", totalSlots: 168, bookedSlots: 156, occupancyRate: 92.9 },
  { facility: "Sân Bóng Đá Tân Bình", totalSlots: 168, bookedSlots: 98, occupancyRate: 58.3 },
  { facility: "Trung Tâm Thể Thao Bình Thạnh", totalSlots: 168, bookedSlots: 134, occupancyRate: 79.8 },
];

const cancellationData = [
  { facility: "Truong Football", totalBookings: 156, cancelled: 12, noShow: 8, cancellationRate: 7.7, noShowRate: 5.1 },
  { facility: "Sân Bóng Đá Minh Khai", totalBookings: 142, cancelled: 18, noShow: 6, cancellationRate: 12.7, noShowRate: 4.2 },
  { facility: "Trung Tâm Thể Thao Quận 7", totalBookings: 128, cancelled: 8, noShow: 4, cancellationRate: 6.3, noShowRate: 3.1 },
  { facility: "Sân Bóng Đá Tân Bình", totalBookings: 115, cancelled: 15, noShow: 9, cancellationRate: 13.0, noShowRate: 7.8 },
  { facility: "Trung Tâm Thể Thao Bình Thạnh", totalBookings: 98, cancelled: 6, noShow: 3, cancellationRate: 6.1, noShowRate: 3.1 },
];

const topUsersData = [
  { name: "Nguyễn Văn An", totalBookings: 25, totalSpend: 12500000, loyaltyScore: 95, lastBooking: "2025-01-16" },
  { name: "Trần Thị Bình", totalBookings: 18, totalSpend: 9000000, loyaltyScore: 88, lastBooking: "2025-01-15" },
  { name: "Lê Hoàng", totalBookings: 22, totalSpend: 11000000, loyaltyScore: 92, lastBooking: "2025-01-14" },
  { name: "Phạm Văn Đức", totalBookings: 15, totalSpend: 7500000, loyaltyScore: 82, lastBooking: "2025-01-13" },
  { name: "Võ Thị Hoa", totalBookings: 12, totalSpend: 6000000, loyaltyScore: 78, lastBooking: "2025-01-12" },
];

const notificationData = [
  {
    id: "N001",
    type: "booking",
    title: "Đặt sân thành công",
    message: "Bạn đã đặt sân Truong Football thành công cho ngày 15/01/2025 từ 18:00-20:00",
    recipient: "Nguyễn Văn An",
    recipientType: "user",
    status: "sent",
    createdAt: "2025-01-14 18:30:00",
    readAt: "2025-01-14 18:35:00"
  },
  {
    id: "N002",
    type: "booking_owner",
    title: "Có đặt sân mới",
    message: "Sân Truong Football có đặt sân mới từ Nguyễn Văn An cho ngày 15/01/2025",
    recipient: "Nguyễn Văn Trường",
    recipientType: "owner",
    status: "sent",
    createdAt: "2025-01-14 18:30:00",
    readAt: null
  },
  {
    id: "N003",
    type: "cancellation",
    title: "Hủy sân",
    message: "Đặt sân BK003 đã bị hủy. Sân Trung Tâm Thể Thao Quận 7 ngày 16/01/2025",
    recipient: "Lê Hoàng",
    recipientType: "user",
    status: "sent",
    createdAt: "2025-01-15 17:45:00",
    readAt: "2025-01-15 18:00:00"
  },
  {
    id: "N004",
    type: "maintenance",
    title: "Bảo trì sân",
    message: "Sân Bóng Đá Gò Vấp sẽ bảo trì từ 20/01/2025 đến 22/01/2025. Vui lòng đặt sân khác",
    recipient: "Tất cả người dùng",
    recipientType: "all",
    status: "sent",
    createdAt: "2025-01-16 09:00:00",
    readAt: null
  },
  {
    id: "N005",
    type: "promotion",
    title: "Khuyến mãi cuối tuần",
    message: "Giảm 20% cho tất cả sân vào cuối tuần. Đặt ngay để không bỏ lỡ!",
    recipient: "Tất cả người dùng",
    recipientType: "all",
    status: "sent",
    createdAt: "2025-01-16 10:00:00",
    readAt: null
  },
  {
    id: "N006",
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Hệ thống sẽ được cập nhật vào 02:00-04:00 ngày 18/01/2025. Có thể gián đoạn dịch vụ",
    recipient: "Tất cả người dùng",
    recipientType: "all",
    status: "draft",
    createdAt: "2025-01-16 14:00:00",
    readAt: null
  },
];

const activityLogData = [
  {
    id: "AL001",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "create_facility",
    actionName: "Thêm sân mới",
    target: "Sân Bóng Đá Phú Nhuận",
    targetId: "F007",
    details: "Tạo sân bóng đá 7 người với giá 190,000 VNĐ/h",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-16 14:30:25",
    status: "success"
  },
  {
    id: "AL002",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "update_price",
    actionName: "Cập nhật giá sân",
    target: "Truong Football",
    targetId: "F001",
    details: "Thay đổi giá từ 200,000 VNĐ/h thành 220,000 VNĐ/h",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-16 13:15:42",
    status: "success"
  },
  {
    id: "AL003",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "delete_user",
    actionName: "Xóa người dùng",
    target: "Phạm Văn Đức",
    targetId: "U002",
    details: "Xóa tài khoản người dùng do vi phạm quy định",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-16 12:45:18",
    status: "success"
  },
  {
    id: "AL004",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "approve_owner",
    actionName: "Duyệt chủ sân",
    target: "Nguyễn Văn Trường",
    targetId: "O001",
    details: "Duyệt đăng ký làm chủ sân Truong Football",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-16 11:20:33",
    status: "success"
  },
  {
    id: "AL005",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "send_notification",
    actionName: "Gửi thông báo",
    target: "Tất cả người dùng",
    targetId: "ALL",
    details: "Gửi thông báo khuyến mãi cuối tuần 20%",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-16 10:00:15",
    status: "success"
  },
  {
    id: "AL006",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "update_system_config",
    actionName: "Cập nhật cấu hình hệ thống",
    target: "Cấu hình email",
    targetId: "CONFIG_EMAIL",
    details: "Thay đổi SMTP server từ smtp.gmail.com thành smtp.outlook.com",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-16 09:30:45",
    status: "success"
  },
  {
    id: "AL007",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "refund_payment",
    actionName: "Hoàn tiền",
    target: "Giao dịch TXN003",
    targetId: "TXN003",
    details: "Hoàn tiền 500,000 VNĐ cho đặt sân BK003 đã hủy",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-15 17:50:22",
    status: "success"
  },
  {
    id: "AL008",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "export_report",
    actionName: "Xuất báo cáo",
    target: "Báo cáo doanh thu tháng 1",
    targetId: "REPORT_202501",
    details: "Xuất báo cáo doanh thu tháng 1/2025 định dạng PDF",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-15 16:25:10",
    status: "success"
  },
  {
    id: "AL009",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "login",
    actionName: "Đăng nhập hệ thống",
    target: "Admin Panel",
    targetId: "ADMIN_PANEL",
    details: "Đăng nhập thành công vào Admin Panel",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-15 08:00:00",
    status: "success"
  },
  {
    id: "AL010",
    admin: "Lê Hoàng",
    adminId: "A001",
    action: "failed_login",
    actionName: "Đăng nhập thất bại",
    target: "Admin Panel",
    targetId: "ADMIN_PANEL",
    details: "Đăng nhập thất bại - sai mật khẩu",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2025-01-15 07:58:30",
    status: "failed"
  },
];

const topFacilities = [
  { name: "Truong Football", bookings: 156, revenue: 31200000 },
  { name: "Sân Bóng Đá Minh Khai", bookings: 142, revenue: 25560000 },
  { name: "Trung Tâm Thể Thao Quận 7", bookings: 128, revenue: 32000000 },
  { name: "Sân Bóng Đá Tân Bình", bookings: 115, revenue: 25300000 },
  { name: "Trung Tâm Thể Thao Bình Thạnh", bookings: 98, revenue: 22540000 },
];

const transactionData = [
  {
    id: "TXN001",
    bookingId: "BK001",
    amount: 400000,
    method: "vnpay",
    status: "completed",
    createdAt: "2025-01-14 18:30:00",
    customer: "Nguyễn Văn An",
    facility: "Truong Football",
    court: "Sân 1",
    date: "2025-01-15",
    time: "18:00–20:00",
    transactionId: "VNPAY_123456789"
  },
  {
    id: "TXN002",
    bookingId: "BK002",
    amount: 360000,
    method: "momo",
    status: "pending",
    createdAt: "2025-01-15 19:15:00",
    customer: "Trần Thị Bình",
    facility: "Sân Bóng Đá Minh Khai",
    court: "Sân 2",
    date: "2025-01-16",
    time: "19:00–21:00",
    transactionId: "MOMO_987654321"
  },
  {
    id: "TXN003",
    bookingId: "BK003",
    amount: 500000,
    method: "cash",
    status: "refunded",
    createdAt: "2025-01-15 17:45:00",
    customer: "Lê Hoàng",
    facility: "Trung Tâm Thể Thao Quận 7",
    court: "Sân 3",
    date: "2025-01-16",
    time: "17:00–19:00",
    transactionId: "CASH_001"
  },
  {
    id: "TXN004",
    bookingId: "BK004",
    amount: 440000,
    method: "vnpay",
    status: "completed",
    createdAt: "2025-01-13 20:20:00",
    customer: "Phạm Văn Đức",
    facility: "Sân Bóng Đá Tân Bình",
    court: "Sân 1",
    date: "2025-01-14",
    time: "20:00–22:00",
    transactionId: "VNPAY_456789123"
  },
  {
    id: "TXN005",
    bookingId: "BK005",
    amount: 460000,
    method: "momo",
    status: "completed",
    createdAt: "2025-01-12 18:00:00",
    customer: "Võ Thị Hoa",
    facility: "Trung Tâm Thể Thao Bình Thạnh",
    court: "Sân 2",
    date: "2025-01-13",
    time: "18:00–20:00",
    transactionId: "MOMO_456789123"
  },
  {
    id: "TXN006",
    bookingId: "BK006",
    amount: 300000,
    method: "vnpay",
    status: "failed",
    createdAt: "2025-01-16 19:30:00",
    customer: "Đặng Văn Thành",
    facility: "Sân Bóng Đá Gò Vấp",
    court: "Sân 1",
    date: "2025-01-17",
    time: "19:00–21:00",
    transactionId: "VNPAY_789123456"
  },
];

const ownerData = [
  {
    id: "O001",
    name: "Nguyễn Văn Trường",
    email: "truong@example.com",
    phone: "0901234567",
    status: "active",
    joinDate: "2024-01-15",
    totalFacilities: 1,
    totalRevenue: 31200000,
    commissionRate: 15,
    facilities: ["Truong Football"],
    pendingApplications: 0
  },
  {
    id: "O002",
    name: "Trần Thị Minh",
    email: "minh@example.com",
    phone: "0909998888",
    status: "active",
    joinDate: "2024-02-20",
    totalFacilities: 1,
    totalRevenue: 25560000,
    commissionRate: 15,
    facilities: ["Sân Bóng Đá Minh Khai"],
    pendingApplications: 1
  },
  {
    id: "O003",
    name: "Lê Hoàng Nam",
    email: "nam@example.com",
    phone: "0912223333",
    status: "active",
    joinDate: "2024-03-10",
    totalFacilities: 1,
    totalRevenue: 32000000,
    commissionRate: 15,
    facilities: ["Trung Tâm Thể Thao Quận 7"],
    pendingApplications: 0
  },
  {
    id: "O004",
    name: "Phạm Văn Đức",
    email: "duc@example.com",
    phone: "0913334444",
    status: "pending",
    joinDate: "2024-04-05",
    totalFacilities: 0,
    totalRevenue: 0,
    commissionRate: 15,
    facilities: [],
    pendingApplications: 2
  },
  {
    id: "O005",
    name: "Võ Thị Hoa",
    email: "hoa@example.com",
    phone: "0914445555",
    status: "active",
    joinDate: "2024-05-12",
    totalFacilities: 1,
    totalRevenue: 25300000,
    commissionRate: 15,
    facilities: ["Sân Bóng Đá Tân Bình"],
    pendingApplications: 0
  },
  {
    id: "O006",
    name: "Đặng Văn Thành",
    email: "thanh@example.com",
    phone: "0915556666",
    status: "suspended",
    joinDate: "2024-06-01",
    totalFacilities: 1,
    totalRevenue: 22540000,
    commissionRate: 15,
    facilities: ["Trung Tâm Thể Thao Bình Thạnh"],
    pendingApplications: 0
  },
];

// Components
const Status = ({ value }) => {
  const map = {
    pending: {
      bg: "#e6effe",
      color: "#4338ca",
      icon: <Clock5 size={14} />,
      label: "Chờ xử lý",
    },
    confirmed: {
      bg: "#e6f9f0",
      color: "#059669",
      icon: <CheckCircle2 size={14} />,
      label: "Đã xác nhận",
    },
    cancelled: {
      bg: "#fee2e2",
      color: "#ef4444",
      icon: <XCircle size={14} />,
      label: "Đã hủy",
    },
    completed: {
      bg: "#f0f9ff",
      color: "#0284c7",
      icon: <CheckCircle2 size={14} />,
      label: "Hoàn thành",
    },
    "no-show": {
      bg: "#fef3c7",
      color: "#d97706",
      icon: <XCircle size={14} />,
      label: "Không đến",
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
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "facilities", label: "Quản lý sân", icon: Building2 },
    { id: "bookings", label: "Quản lý lịch đặt sân", icon: Calendar },
    { id: "customers", label: "Quản lý người dùng", icon: UserCheck },
    { id: "payments", label: "Quản lý thanh toán & Hóa đơn", icon: CreditCard },
    { id: "owners", label: "Quản lý chủ sân", icon: UserCog },
    { id: "notifications", label: "Quản lý thông báo", icon: Bell },
    { id: "activity_log", label: "Nhật ký hoạt động", icon: Activity },
    { id: "reports", label: "Báo cáo & thống kê", icon: BarChart3 },
    { id: "settings", label: "Cấu hình hệ thống", icon: Settings },
  ];

  const filteredBookings = useMemo(
    () =>
      bookingData.filter((r) =>
        [r.id, r.customer, r.facility, r.court, r.phone, r.email, r.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const filteredCustomers = useMemo(
    () =>
      customerData.filter((r) =>
        [r.name, r.phone, r.email, r.id, r.role, r.status, r.address]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const filteredFacilities = useMemo(
    () => facilityData.filter(r => 
      [r.name, r.type, r.address, r.owner, r.status]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredTransactions = useMemo(
    () => transactionData.filter(r => 
      [r.id, r.bookingId, r.customer, r.facility, r.method, r.status, r.transactionId]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredOwners = useMemo(
    () => ownerData.filter(r => 
      [r.id, r.name, r.email, r.phone, r.status, r.facilities.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredNotifications = useMemo(
    () => notificationData.filter(r => 
      [r.id, r.title, r.message, r.recipient, r.type, r.status]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredActivityLogs = useMemo(
    () => activityLogData.filter(r => 
      [r.id, r.admin, r.actionName, r.target, r.details, r.status, r.ipAddress]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
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
          title="Tổng doanh thu"
          value={`${(kpis.totalRevenue / 1e6).toFixed(0)}M VNĐ / tháng`}
          icon={<BadgeDollarSign size={20} color="#10b981" />}
        />
        <KpiCard
          title="Tổng số lượt đặt sân"
          value={`${kpis.totalBookings.toLocaleString()} lượt`}
          icon={<CalendarDays size={20} color="#3b82f6" />}
        />
        <KpiCard
          title="Tỷ lệ lấp đầy"
          value={`${kpis.occupancyRate}%`}
          icon={<Users2 size={20} color="#6366f1" />}
        />
        <KpiCard
          title="Số người dùng mới"
          value={`+${kpis.newUsers} trong tuần qua`}
          icon={<UserCheck size={20} color="#f59e0b" />}
        />
      </div>

      {/* Charts row */}
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
            Biểu đồ doanh thu theo tuần
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'bookings' ? `${value} lượt` : `${value}M VNĐ`,
                  name === 'bookings' ? 'Số lượt đặt' : 'Doanh thu'
                ]}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Số lượt đặt" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Doanh thu (M VNĐ)" />
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

      {/* Top Facilities */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>
          Sân hoạt động nhiều nhất
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {topFacilities.map((facility, index) => (
            <div
              key={facility.name}
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: 12,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    background: index < 3 ? "#10b981" : "#6b7280",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{facility.name}</div>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                {facility.bookings} lượt đặt
              </div>
              <div style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>
                {(facility.revenue / 1e6).toFixed(1)}M VNĐ
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý lịch đặt sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xem lịch biểu")}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: "#3b82f6", 
              color: "#fff", 
              border: 0, 
              borderRadius: 10, 
              padding: "10px 14px", 
              cursor: "pointer", 
              fontWeight: 700 
            }}
          >
            <Calendar size={16}/> Xem lịch biểu
          </button>
          <button
            onClick={() => alert("TODO: Xuất báo cáo")}
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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
              <strong>Tổng:</strong> {filteredBookings.length} đơn đặt sân
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="no-show">Không đến</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã, khách hàng, sân, email, trạng thái…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã đặt",
                  "Khách hàng",
                  "Liên hệ",
                  "Sân",
                  "Ngày đặt",
                  "Khung giờ",
                  "Giá (VNĐ)",
                  "Thanh toán",
                  "Trạng thái",
                  "Ghi chú",
                  "Hành động",
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
              {filteredBookings.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.customer}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{r.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{r.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Đặt: {r.bookingDate}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.facility}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.court}</div>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.date}</td>
                  <td style={{ padding: 12, color: "#059669", fontWeight: 600 }}>{r.time}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {r.price.toLocaleString()}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.pay === "paid" ? "#e6f9f0" : 
                                 r.pay === "unpaid" ? "#fee2e2" : "#fef3c7",
                      color: r.pay === "paid" ? "#059669" : 
                            r.pay === "unpaid" ? "#ef4444" : "#d97706",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "capitalize"
                    }}>
                      {r.pay === "paid" ? "Đã thanh toán" : 
                       r.pay === "unpaid" ? "Chưa thanh toán" : "Hoàn tiền"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <Status value={r.status} />
                  </td>
                  <td style={{ padding: 12, maxWidth: "150px" }}>
                    {r.notes ? (
                      <div style={{ 
                        fontSize: 12, 
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }} title={r.notes}>
                        {r.notes}
                      </div>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết " + r.id)}
                      title="Xem chi tiết"
                    />
                    {r.status === "pending" && (
                      <>
                    <ActionButton
                          bg="#10b981"
                          Icon={CheckCircle2}
                          onClick={() => alert("Xác nhận " + r.id)}
                          title="Xác nhận"
                    />
                    <ActionButton
                      bg="#ef4444"
                          Icon={XCircle}
                          onClick={() => alert("Hủy " + r.id)}
                          title="Hủy"
                        />
                      </>
                    )}
                    <ActionButton
                      bg="#6b7280"
                      Icon={Pencil}
                      onClick={() => alert("Sửa " + r.id)}
                      title="Sửa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredBookings.length && (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>📅</div>
                    Không có dữ liệu đặt sân
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý người dùng</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Thêm người dùng")}
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
            <Plus size={16}/> Thêm người dùng
          </button>
        </div>
      </div>

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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
              <strong>Tổng:</strong> {filteredCustomers.length} người dùng
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="user">Người chơi</option>
                <option value="owner">Chủ sân</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="banned">Bị khóa</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tên, email, SĐT, địa chỉ, vai trò…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Họ tên",
                  "Liên hệ",
                  "Vai trò",
                  "Trạng thái",
                  "Tham gia",
                  "Đăng nhập cuối",
                  "Lịch sử đặt sân",
                  "Hành động",
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
              {filteredCustomers.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.address}>
                        {r.address}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{r.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.email}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.role === "admin" ? "#fee2e2" : 
                                 r.role === "owner" ? "#e6f9f0" : "#e6effe",
                      color: r.role === "admin" ? "#ef4444" : 
                            r.role === "owner" ? "#059669" : "#4338ca",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "capitalize"
                    }}>
                      {r.role === "admin" ? "Quản trị viên" : 
                       r.role === "owner" ? "Chủ sân" : "Người chơi"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "active" ? "#e6f9f0" : "#fee2e2",
                      color: r.status === "active" ? "#059669" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.status === "active" ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.joinDate}</td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.lastLogin}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.totalBookings} lượt</div>
                    <div style={{ fontSize: 12, color: "#059669" }}>{r.totalSpend.toLocaleString()} VNĐ</div>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem lịch sử đặt sân của " + r.name)}
                      title="Xem lịch sử"
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => alert("Cập nhật thông tin " + r.name)}
                      title="Cập nhật"
                    />
                    {r.status === "active" ? (
                    <ActionButton
                      bg="#ef4444"
                        Icon={XCircle}
                        onClick={() => alert("Khóa tài khoản " + r.name)}
                        title="Khóa tài khoản"
                      />
                    ) : (
                      <ActionButton
                        bg="#10b981"
                        Icon={CheckCircle2}
                        onClick={() => alert("Mở khóa tài khoản " + r.name)}
                        title="Mở khóa"
                      />
                    )}
                  </td>
                </tr>
              ))}
              {!filteredCustomers.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>👥</div>
                    Không có dữ liệu người dùng
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý sân</h1>
        <button
          onClick={() => alert("TODO: mở modal tạo sân")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
        >
          <Plus size={16}/> Thêm sân
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
            <input value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value); setPage(1);}} placeholder="Tên sân, địa chỉ, chủ sân…" style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}/>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["#", "Tên", "Loại sân", "Giá sân/h", "Địa chỉ", "Tình trạng", "Chủ sân", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilitySlice.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12 }}>{(page-1)*pageSize + idx + 1}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.type}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>{r.price.toLocaleString()} VNĐ</td>
                  <td style={{ padding: 12, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.address}>{r.address}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ 
                      background: r.status === "Hoạt động" ? "#e6f9f0" : 
                                 r.status === "Bảo trì" ? "#fef3c7" : "#fee2e2", 
                      color: r.status === "Hoạt động" ? "#059669" : 
                            r.status === "Bảo trì" ? "#d97706" : "#ef4444", 
                      padding: "4px 8px", 
                      borderRadius: 999, 
                      fontSize: 12, 
                      fontWeight: 700 
                    }}>{r.status}</span>
                  </td>
                  <td style={{ padding: 12 }}>{r.owner}</td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton bg="#06b6d4" Icon={Eye} onClick={()=>alert("Xem sân " + r.name)} title="Xem" />
                    <ActionButton bg="#22c55e" Icon={Pencil} onClick={()=>alert("Sửa " + r.name)} title="Sửa" />
                    <ActionButton bg="#ef4444" Icon={Trash2} onClick={()=>alert("Xóa " + r.name)} title="Xóa" />
                  </td>
                </tr>
              ))}
              {!facilitySlice.length && (
                <tr><td colSpan={8} style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>Không có dữ liệu</td></tr>
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

  const renderPayments = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý thanh toán & Hóa đơn</h1>
        <div style={{ display: "flex", gap: 8 }}>
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
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng giao dịch</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredTransactions.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng doanh thu</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0).toLocaleString()} VNĐ
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã hoàn tiền</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {filteredTransactions.filter(t => t.status === 'refunded').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Giao dịch thất bại</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredTransactions.filter(t => t.status === 'failed').length}
          </div>
        </div>
      </div>

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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredTransactions.length} giao dịch
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Chờ xử lý</option>
                <option value="refunded">Đã hoàn tiền</option>
                <option value="failed">Thất bại</option>
              </select>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả phương thức</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
                <option value="cash">Tiền mặt</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã giao dịch, khách hàng, sân, phương thức…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã giao dịch",
                  "Mã đặt sân",
                  "Khách hàng",
                  "Sân",
                  "Ngày & Giờ",
                  "Số tiền",
                  "Phương thức",
                  "Trạng thái",
                  "Thời gian tạo",
                  "Hành động",
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
              {filteredTransactions.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#3b82f6" }}>{r.bookingId}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.customer}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {r.transactionId}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.facility}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.court}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.date}</div>
                    <div style={{ fontSize: 12, color: "#059669" }}>{r.time}</div>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {r.amount.toLocaleString()} VNĐ
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.method === "vnpay" ? "#e6f9f0" : 
                                 r.method === "momo" ? "#fef3c7" : "#e6effe",
                      color: r.method === "vnpay" ? "#059669" : 
                            r.method === "momo" ? "#d97706" : "#4338ca",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase"
                    }}>
                      {r.method === "vnpay" ? "VNPay" : 
                       r.method === "momo" ? "MoMo" : "Tiền mặt"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "completed" ? "#e6f9f0" : 
                                 r.status === "pending" ? "#e6effe" :
                                 r.status === "refunded" ? "#fef3c7" : "#fee2e2",
                      color: r.status === "completed" ? "#059669" : 
                            r.status === "pending" ? "#4338ca" :
                            r.status === "refunded" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.status === "completed" ? "Hoàn thành" : 
                       r.status === "pending" ? "Chờ xử lý" :
                       r.status === "refunded" ? "Đã hoàn tiền" : "Thất bại"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.createdAt}</td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết hóa đơn " + r.id)}
                      title="Xem chi tiết"
                    />
                    {r.status === "completed" && (
                      <ActionButton
                        bg="#f59e0b"
                        Icon={Receipt}
                        onClick={() => alert("Hoàn tiền " + r.id)}
                        title="Hoàn tiền"
                      />
                    )}
                    {r.status === "pending" && (
                      <ActionButton
                        bg="#ef4444"
                        Icon={XCircle}
                        onClick={() => alert("Hủy giao dịch " + r.id)}
                        title="Hủy giao dịch"
                      />
                    )}
                  </td>
                </tr>
              ))}
              {!filteredTransactions.length && (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>💰</div>
                    Không có dữ liệu giao dịch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOwners = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý chủ sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xem đơn đăng ký chủ sân")}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: "#3b82f6", 
              color: "#fff", 
              border: 0, 
              borderRadius: 10, 
              padding: "10px 14px", 
              cursor: "pointer", 
              fontWeight: 700 
            }}
          >
            <UserCog size={16}/> Đơn đăng ký ({ownerData.filter(o => o.pendingApplications > 0).length})
          </button>
          <button
            onClick={() => alert("TODO: Xuất báo cáo doanh thu chủ sân")}
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

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng chủ sân</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredOwners.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đang hoạt động</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredOwners.filter(o => o.status === 'active').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Chờ duyệt</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredOwners.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng doanh thu</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredOwners.reduce((sum, o) => sum + o.totalRevenue, 0).toLocaleString()} VNĐ
          </div>
        </div>
      </div>

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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredOwners.length} chủ sân
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="suspended">Tạm ngưng</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tên, email, SĐT, tên sân…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã chủ sân",
                  "Thông tin",
                  "Liên hệ",
                  "Trạng thái",
                  "Sân quản lý",
                  "Doanh thu",
                  "Hoa hồng",
                  "Đơn chờ duyệt",
                  "Hành động",
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
              {filteredOwners.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>Tham gia: {r.joinDate}</div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{r.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.email}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "active" ? "#e6f9f0" : 
                                 r.status === "pending" ? "#fef3c7" : "#fee2e2",
                      color: r.status === "active" ? "#059669" : 
                            r.status === "pending" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.status === "active" ? "Đang hoạt động" : 
                       r.status === "pending" ? "Chờ duyệt" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.totalFacilities} sân</div>
                    {r.facilities.length > 0 ? (
                      <div style={{ fontSize: 12, color: "#6b7280", maxWidth: "200px" }}>
                        {r.facilities.map((facility, idx) => (
                          <div key={idx} style={{ 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap" 
                          }} title={facility}>
                            {facility}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>Chưa có sân</div>
                    )}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>
                      {r.totalRevenue.toLocaleString()} VNĐ
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {r.totalFacilities > 0 ? `${(r.totalRevenue / r.totalFacilities).toLocaleString()} VNĐ/sân` : "0 VNĐ/sân"}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#3b82f6" }}>
                      {r.commissionRate}%
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {(r.totalRevenue * r.commissionRate / 100).toLocaleString()} VNĐ
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    {r.pendingApplications > 0 ? (
                      <span style={{
                        background: "#fef3c7",
                        color: "#d97706",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.pendingApplications} đơn
                      </span>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết chủ sân " + r.name)}
                      title="Xem chi tiết"
                    />
                    {r.status === "pending" && (
                      <>
                        <ActionButton
                          bg="#10b981"
                          Icon={CheckCircle2}
                          onClick={() => alert("Duyệt chủ sân " + r.name)}
                          title="Duyệt"
                        />
                        <ActionButton
                          bg="#ef4444"
                          Icon={XCircle}
                          onClick={() => alert("Từ chối " + r.name)}
                          title="Từ chối"
                        />
                      </>
                    )}
                    {r.status === "active" && (
                      <ActionButton
                        bg="#f59e0b"
                        Icon={UserCog}
                        onClick={() => alert("Tạm ngưng " + r.name)}
                        title="Tạm ngưng"
                      />
                    )}
                    {r.status === "suspended" && (
                      <ActionButton
                        bg="#10b981"
                        Icon={CheckCircle2}
                        onClick={() => alert("Kích hoạt lại " + r.name)}
                        title="Kích hoạt"
                      />
                    )}
                    <ActionButton
                      bg="#6b7280"
                      Icon={Pencil}
                      onClick={() => alert("Cập nhật thông tin " + r.name)}
                      title="Cập nhật"
                    />
                  </td>
                </tr>
              ))}
              {!filteredOwners.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>🏟️</div>
                    Không có dữ liệu chủ sân
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Báo cáo & thống kê</h1>
        <div style={{ display: "flex", gap: 8 }}>
        <button
            onClick={() => alert("TODO: Xuất báo cáo CSV")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#3b82f6",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <Download size={16} /> Xuất CSV
          </button>
          <button
            onClick={() => alert("TODO: Xuất báo cáo PDF")}
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
            <Download size={16} /> Xuất PDF
        </button>
        </div>
      </div>

      {/* Revenue Reports */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>🗓️ Doanh thu theo ngày/tuần/tháng</h2>
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
              Doanh thu theo ngày (tuần qua)
          </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `${value}M VNĐ` : `${value} lượt`,
                    name === 'revenue' ? 'Doanh thu' : 'Số lượt đặt'
                  ]}
                />
              <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Doanh thu" />
                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" name="Số lượt đặt" />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Occupancy Reports */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>⚽ Tỷ lệ lấp đầy</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 16 }}>
            Tỷ lệ lấp đầy theo sân (tuần này)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Sân", "Tổng khung giờ", "Đã đặt", "Tỷ lệ lấp đầy", "Hiệu suất"].map((h) => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {occupancyData.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.facility}</td>
                    <td style={{ padding: 12 }}>{r.totalSlots}</td>
                    <td style={{ padding: 12, color: "#059669", fontWeight: 600 }}>{r.bookedSlots}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ 
                          width: 60, 
                          height: 8, 
                          background: "#e5e7eb", 
                          borderRadius: 4,
                          overflow: "hidden"
                        }}>
                          <div style={{ 
                            width: `${r.occupancyRate}%`, 
                            height: "100%", 
                            background: r.occupancyRate >= 80 ? "#10b981" : r.occupancyRate >= 60 ? "#f59e0b" : "#ef4444",
                            transition: "width 0.3s ease"
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1f2937" }}>
                          {r.occupancyRate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: r.occupancyRate >= 80 ? "#e6f9f0" : r.occupancyRate >= 60 ? "#fef3c7" : "#fee2e2",
                        color: r.occupancyRate >= 80 ? "#059669" : r.occupancyRate >= 60 ? "#d97706" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.occupancyRate >= 80 ? "Tốt" : r.occupancyRate >= 60 ? "Trung bình" : "Thấp"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancellation Reports */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>⛔ Tỷ lệ hủy / no-show</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 16 }}>
            Phân tích hành vi người dùng theo sân
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Sân", "Tổng đặt", "Hủy", "No-show", "Tỷ lệ hủy", "Tỷ lệ no-show", "Đánh giá"].map((h) => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cancellationData.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.facility}</td>
                    <td style={{ padding: 12 }}>{r.totalBookings}</td>
                    <td style={{ padding: 12, color: "#ef4444", fontWeight: 600 }}>{r.cancelled}</td>
                    <td style={{ padding: 12, color: "#f59e0b", fontWeight: 600 }}>{r.noShow}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: r.cancellationRate <= 8 ? "#e6f9f0" : r.cancellationRate <= 12 ? "#fef3c7" : "#fee2e2",
                        color: r.cancellationRate <= 8 ? "#059669" : r.cancellationRate <= 12 ? "#d97706" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.cancellationRate}%
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: r.noShowRate <= 5 ? "#e6f9f0" : r.noShowRate <= 8 ? "#fef3c7" : "#fee2e2",
                        color: r.noShowRate <= 5 ? "#059669" : r.noShowRate <= 8 ? "#d97706" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.noShowRate}%
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: (r.cancellationRate + r.noShowRate) <= 15 ? "#e6f9f0" : (r.cancellationRate + r.noShowRate) <= 25 ? "#fef3c7" : "#fee2e2",
                        color: (r.cancellationRate + r.noShowRate) <= 15 ? "#059669" : (r.cancellationRate + r.noShowRate) <= 25 ? "#d97706" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {(r.cancellationRate + r.noShowRate) <= 15 ? "Tốt" : (r.cancellationRate + r.noShowRate) <= 25 ? "Trung bình" : "Cần cải thiện"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Users Reports */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>👤 Người dùng hoạt động nhiều nhất</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 16 }}>
            Loyalty Ranking - Top khách hàng trung thành
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Xếp hạng", "Tên khách hàng", "Số lượt đặt", "Tổng chi tiêu", "Điểm trung thành", "Đặt cuối", "Hạng"].map((h) => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topUsersData.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12 }}>
                      <div style={{
                        background: idx < 3 ? "#10b981" : "#6b7280",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {idx + 1}
                      </div>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: 12, color: "#3b82f6", fontWeight: 600 }}>{r.totalBookings}</td>
                    <td style={{ padding: 12, color: "#059669", fontWeight: 600 }}>{r.totalSpend.toLocaleString()} VNĐ</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ 
                          width: 60, 
                          height: 8, 
                          background: "#e5e7eb", 
                          borderRadius: 4,
                          overflow: "hidden"
                        }}>
                          <div style={{ 
                            width: `${r.loyaltyScore}%`, 
                            height: "100%", 
                            background: r.loyaltyScore >= 90 ? "#10b981" : r.loyaltyScore >= 80 ? "#3b82f6" : "#f59e0b",
                            transition: "width 0.3s ease"
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1f2937" }}>
                          {r.loyaltyScore}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.lastBooking}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: r.loyaltyScore >= 90 ? "#e6f9f0" : r.loyaltyScore >= 80 ? "#e6effe" : "#fef3c7",
                        color: r.loyaltyScore >= 90 ? "#059669" : r.loyaltyScore >= 80 ? "#4338ca" : "#d97706",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.loyaltyScore >= 90 ? "VIP" : r.loyaltyScore >= 80 ? "Gold" : "Silver"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
        Cấu hình hệ thống
      </h1>

      {/* Operating Hours Configuration */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>🕒 Cấu hình khung giờ hoạt động</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Giờ mở cửa
              </label>
              <input
                type="time"
                defaultValue="06:00"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Giờ đóng cửa
              </label>
              <input
                type="time"
                defaultValue="22:00"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Khoảng cách khung giờ (phút)
              </label>
              <select
                defaultValue="120"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              >
                <option value="60">60 phút</option>
                <option value="90">90 phút</option>
                <option value="120">120 phút</option>
                <option value="180">180 phút</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              style={{
                background: "#10b981",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
              onClick={() => alert("Đã lưu cấu hình khung giờ")}
            >
              Lưu cấu hình
            </button>
            <button
              style={{
                background: "#6b7280",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
              onClick={() => alert("Đã reset về mặc định")}
            >
              Reset mặc định
            </button>
          </div>
        </div>
      </div>

      {/* Price Configuration */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>💵 Cấu hình giá theo khung giờ</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Khung giờ", "Loại", "Giá cơ bản (VNĐ)", "Hệ số", "Giá thực tế", "Hành động"].map((h) => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "06:00-08:00", type: "Giờ thấp điểm", basePrice: 150000, multiplier: 0.8, actualPrice: 120000 },
                  { time: "08:00-12:00", type: "Giờ bình thường", basePrice: 150000, multiplier: 1.0, actualPrice: 150000 },
                  { time: "12:00-14:00", type: "Giờ thấp điểm", basePrice: 150000, multiplier: 0.8, actualPrice: 120000 },
                  { time: "14:00-18:00", type: "Giờ bình thường", basePrice: 150000, multiplier: 1.0, actualPrice: 150000 },
                  { time: "18:00-22:00", type: "Giờ cao điểm", basePrice: 150000, multiplier: 1.5, actualPrice: 225000 },
                ].map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.time}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: r.type.includes("cao điểm") ? "#fee2e2" : r.type.includes("thấp điểm") ? "#e6f9f0" : "#e6effe",
                        color: r.type.includes("cao điểm") ? "#ef4444" : r.type.includes("thấp điểm") ? "#059669" : "#4338ca",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>{r.basePrice.toLocaleString()}</td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{r.multiplier}x</td>
                    <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>{r.actualPrice.toLocaleString()}</td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <ActionButton
                        bg="#22c55e"
                        Icon={Pencil}
                        onClick={() => alert("Sửa giá " + r.time)}
                        title="Sửa giá"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Promotions Configuration */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>🎁 Khuyến mãi</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Danh sách khuyến mãi</h3>
            <button
              style={{
                background: "#10b981",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
              onClick={() => alert("TODO: Thêm khuyến mãi")}
            >
              + Thêm khuyến mãi
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              { name: "Giảm giá cuối tuần", discount: "20%", condition: "Thứ 7, CN", status: "active" },
              { name: "Giờ vàng", discount: "30%", condition: "06:00-08:00", status: "active" },
              { name: "Khuyến mãi Tết", discount: "50%", condition: "1-7/2/2025", status: "inactive" },
            ].map((promo, idx) => (
              <div key={idx} style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 16,
                background: "#f9fafb"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{promo.name}</h4>
                  <span style={{
                    background: promo.status === "active" ? "#e6f9f0" : "#fee2e2",
                    color: promo.status === "active" ? "#059669" : "#ef4444",
                    padding: "2px 6px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700
                  }}>
                    {promo.status === "active" ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                  Giảm: <span style={{ fontWeight: 600, color: "#059669" }}>{promo.discount}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                  Điều kiện: {promo.condition}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <ActionButton
                    bg="#22c55e"
                    Icon={Pencil}
                    onClick={() => alert("Sửa " + promo.name)}
                    title="Sửa"
                  />
                  <ActionButton
                    bg={promo.status === "active" ? "#f59e0b" : "#10b981"}
                    Icon={promo.status === "active" ? XCircle : CheckCircle2}
                    onClick={() => alert(promo.status === "active" ? "Tạm dừng " + promo.name : "Kích hoạt " + promo.name)}
                    title={promo.status === "active" ? "Tạm dừng" : "Kích hoạt"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>📨 Cấu hình email thông báo</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                SMTP Server
              </label>
              <input
                type="text"
                defaultValue="smtp.gmail.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Port
              </label>
              <input
                type="number"
                defaultValue="587"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Email gửi
              </label>
              <input
                type="email"
                defaultValue="noreply@datsanonline.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 14,
                  background: "#fff"
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#374151" }}>Loại email thông báo:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                { name: "Đặt sân thành công", enabled: true },
                { name: "Hủy sân", enabled: true },
                { name: "Nhắc nhở trước giờ", enabled: true },
                { name: "Khuyến mãi mới", enabled: false },
                { name: "Báo cáo tuần", enabled: false },
                { name: "Thông báo hệ thống", enabled: true },
              ].map((email, idx) => (
                <label key={idx} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    defaultChecked={email.enabled}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: "#374151" }}>{email.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              style={{
                background: "#10b981",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
              onClick={() => alert("Đã lưu cấu hình email")}
            >
              Lưu cấu hình
            </button>
            <button
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
              onClick={() => alert("Đã gửi email test")}
            >
              Gửi email test
            </button>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" }}>🔒 Quản lý quyền truy cập</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              {
                role: "Admin",
                description: "Toàn quyền truy cập hệ thống",
                permissions: ["Quản lý tất cả", "Cấu hình hệ thống", "Xem báo cáo", "Quản lý người dùng"],
                color: "#ef4444"
              },
              {
                role: "Owner",
                description: "Quản lý sân và doanh thu",
                permissions: ["Quản lý sân", "Xem báo cáo sân", "Quản lý đặt sân", "Cấu hình giá"],
                color: "#059669"
              },
              {
                role: "Staff",
                description: "Hỗ trợ khách hàng cơ bản",
                permissions: ["Xem đặt sân", "Xác nhận/hủy", "Hỗ trợ khách hàng"],
                color: "#3b82f6"
              },
            ].map((role, idx) => (
              <div key={idx} style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 16,
                background: "#f9fafb"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: role.color
                  }} />
                  <h4 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#1f2937" }}>{role.role}</h4>
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{role.description}</p>
                <div>
                  <h5 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "#374151" }}>Quyền hạn:</h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {role.permissions.map((permission, pIdx) => (
                      <span key={pIdx} style={{
                        background: "#e6effe",
                        color: "#4338ca",
                        padding: "2px 6px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 600
                      }}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 4 }}>
                  <ActionButton
                    bg="#22c55e"
                    Icon={Pencil}
                    onClick={() => alert("Sửa quyền " + role.role)}
                    title="Sửa quyền"
                  />
                  <ActionButton
                    bg="#06b6d4"
                    Icon={Eye}
                    onClick={() => alert("Xem chi tiết " + role.role)}
                    title="Xem chi tiết"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý thông báo</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Gửi thông báo cho người dùng")}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: "#3b82f6", 
              color: "#fff", 
              border: 0, 
              borderRadius: 10, 
              padding: "10px 14px", 
              cursor: "pointer", 
              fontWeight: 700 
            }}
          >
            <Send size={16}/> Gửi cho người dùng
          </button>
          <button
            onClick={() => alert("TODO: Gửi thông báo cho chủ sân")}
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
            <Mail size={16}/> Gửi cho chủ sân
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng thông báo</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredNotifications.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã gửi</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredNotifications.filter(n => n.status === 'sent').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã đọc</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>
            {filteredNotifications.filter(n => n.readAt).length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Bản nháp</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredNotifications.filter(n => n.status === 'draft').length}
          </div>
        </div>
      </div>

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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredNotifications.length} thông báo
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả loại</option>
                <option value="booking">Đặt sân</option>
                <option value="booking_owner">Đặt sân (chủ sân)</option>
                <option value="cancellation">Hủy sân</option>
                <option value="maintenance">Bảo trì</option>
                <option value="promotion">Khuyến mãi</option>
                <option value="system">Hệ thống</option>
              </select>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="sent">Đã gửi</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tiêu đề, nội dung, người nhận…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Loại",
                  "Tiêu đề",
                  "Nội dung",
                  "Người nhận",
                  "Trạng thái",
                  "Thời gian tạo",
                  "Đã đọc",
                  "Hành động",
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
              {filteredNotifications.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.type === "booking" ? "#e6f9f0" : 
                                 r.type === "booking_owner" ? "#e6effe" :
                                 r.type === "cancellation" ? "#fee2e2" :
                                 r.type === "maintenance" ? "#fef3c7" :
                                 r.type === "promotion" ? "#f0f9ff" : "#f3e8ff",
                      color: r.type === "booking" ? "#059669" : 
                            r.type === "booking_owner" ? "#4338ca" :
                            r.type === "cancellation" ? "#ef4444" :
                            r.type === "maintenance" ? "#d97706" :
                            r.type === "promotion" ? "#0284c7" : "#7c3aed",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.type === "booking" ? "Đặt sân" : 
                       r.type === "booking_owner" ? "Đặt sân (chủ sân)" :
                       r.type === "cancellation" ? "Hủy sân" :
                       r.type === "maintenance" ? "Bảo trì" :
                       r.type === "promotion" ? "Khuyến mãi" : "Hệ thống"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.title}</td>
                  <td style={{ padding: 12, maxWidth: "300px" }}>
                    <div style={{ 
                      fontSize: 14, 
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }} title={r.message}>
                      {r.message}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.recipient}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {r.recipientType === "user" ? "Người dùng" : 
                       r.recipientType === "owner" ? "Chủ sân" : "Tất cả"}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "sent" ? "#e6f9f0" : "#fef3c7",
                      color: r.status === "sent" ? "#059669" : "#d97706",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.status === "sent" ? "Đã gửi" : "Bản nháp"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.createdAt}</td>
                  <td style={{ padding: 12 }}>
                    {r.readAt ? (
                      <div>
                        <div style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Đã đọc</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{r.readAt}</div>
                      </div>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>Chưa đọc</span>
                    )}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết thông báo " + r.id)}
                      title="Xem chi tiết"
                    />
                    {r.status === "draft" && (
                      <ActionButton
                        bg="#10b981"
                        Icon={Send}
                        onClick={() => alert("Gửi thông báo " + r.id)}
                        title="Gửi"
                      />
                    )}
                    <ActionButton
                      bg="#6b7280"
                      Icon={Pencil}
                      onClick={() => alert("Sửa thông báo " + r.id)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => alert("Xóa thông báo " + r.id)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredNotifications.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>🔔</div>
                    Không có dữ liệu thông báo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderActivityLog = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Nhật ký hoạt động</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xuất file log CSV")}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 8, 
              background: "#3b82f6", 
              color: "#fff", 
              border: 0, 
              borderRadius: 10, 
              padding: "10px 14px", 
              cursor: "pointer", 
              fontWeight: 700 
            }}
          >
            <Download size={16}/> Xuất CSV
          </button>
          <button
            onClick={() => alert("TODO: Xuất file log PDF")}
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
            <FileText size={16}/> Xuất PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng hoạt động</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredActivityLogs.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Thành công</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredActivityLogs.filter(a => a.status === 'success').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Thất bại</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {filteredActivityLogs.filter(a => a.status === 'failed').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Hôm nay</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>
            {filteredActivityLogs.filter(a => a.timestamp.startsWith('2025-01-16')).length}
          </div>
        </div>
      </div>

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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredActivityLogs.length} hoạt động
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả hành động</option>
                <option value="create_facility">Thêm sân</option>
                <option value="update_price">Cập nhật giá</option>
                <option value="delete_user">Xóa người dùng</option>
                <option value="approve_owner">Duyệt chủ sân</option>
                <option value="send_notification">Gửi thông báo</option>
                <option value="update_system_config">Cấu hình hệ thống</option>
                <option value="refund_payment">Hoàn tiền</option>
                <option value="export_report">Xuất báo cáo</option>
                <option value="login">Đăng nhập</option>
              </select>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="success">Thành công</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo admin, hành động, mục tiêu, IP…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Admin",
                  "Hành động",
                  "Mục tiêu",
                  "Chi tiết",
                  "IP Address",
                  "Thời gian",
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
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredActivityLogs.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.admin}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {r.adminId}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.action.includes("create") ? "#e6f9f0" : 
                                 r.action.includes("update") ? "#e6effe" :
                                 r.action.includes("delete") ? "#fee2e2" :
                                 r.action.includes("approve") ? "#f0f9ff" :
                                 r.action.includes("send") ? "#fef3c7" :
                                 r.action.includes("login") ? "#f3e8ff" : "#f9fafb",
                      color: r.action.includes("create") ? "#059669" : 
                            r.action.includes("update") ? "#4338ca" :
                            r.action.includes("delete") ? "#ef4444" :
                            r.action.includes("approve") ? "#0284c7" :
                            r.action.includes("send") ? "#d97706" :
                            r.action.includes("login") ? "#7c3aed" : "#6b7280",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.actionName}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.target}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {r.targetId}</div>
                  </td>
                  <td style={{ padding: 12, maxWidth: "300px" }}>
                    <div style={{ 
                      fontSize: 14, 
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }} title={r.details}>
                      {r.details}
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.ipAddress}</td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.timestamp}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "success" ? "#e6f9f0" : "#fee2e2",
                      color: r.status === "success" ? "#059669" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.status === "success" ? "Thành công" : "Thất bại"}
                    </span>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết hoạt động " + r.id)}
                      title="Xem chi tiết"
                    />
                    <ActionButton
                      bg="#6b7280"
                      Icon={FileText}
                      onClick={() => alert("Xem user agent: " + r.userAgent)}
                      title="Xem thông tin trình duyệt"
                    />
                  </td>
                </tr>
              ))}
              {!filteredActivityLogs.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>📋</div>
                    Không có dữ liệu nhật ký hoạt động
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "facilities":
        return renderFacilities();
      case "bookings":
        return renderBookings();
      case "customers":
        return renderCustomers();
      case "payments":
        return renderPayments();
      case "owners":
        return renderOwners();
      case "notifications":
        return renderNotifications();
      case "activity_log":
        return renderActivityLog();
      case "reports":
        return renderReports();
      case "settings":
        return renderSettings();
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
