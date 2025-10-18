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
  Building2,
  BookOpen,
  BarChart3,
  MapPin,
  Star,
  TrendingUp,
  Image,
  Settings,
  Power,
  PowerOff,
  Wrench,
  Calendar,
  UserCheck,
  RefreshCw,
  Filter,
  Search,
  CreditCard,
  FileText,
  RotateCcw,
  TrendingDown,
  MessageSquare,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Reply,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Award,
  Bell,
  Send,
  Mail,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  User,
  Banknote,
  Clock,
  Shield,
  Save,
  Edit,
  Phone,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  UserPlus,
  Key,
  Lock,
  Unlock,
  UserX,
  Briefcase,
  Sun,
  Moon,
  History,
  Monitor,
  Database,
  FileSpreadsheet,
} from "lucide-react";
import OwnerHeader from "../../../component/owner/OwnerHeader";

// Mock data
const ownerKpis = {
  todayRevenue: 12500000,
  monthlyRevenue: 12500000,
  weeklyBookings: 58,
  occupancyRate: 80,
  averageRating: 4.6,
};

const trendData = [
  { name: "Mon", bookings: 3, revenue: 1.5 },
  { name: "Tue", bookings: 4, revenue: 2.0 },
  { name: "Wed", bookings: 5, revenue: 2.5 },
  { name: "Thu", bookings: 6, revenue: 3.0 },
  { name: "Fri", bookings: 7, revenue: 3.5 },
  { name: "Sat", bookings: 8, revenue: 4.0 },
  { name: "Sun", bookings: 4, revenue: 2.0 },
];

const pieData = [
  { name: "Đã xác nhận", value: 70 },
  { name: "Chờ xác nhận", value: 20 },
  { name: "Đã hủy", value: 10 },
];

const pieColors = ["#10b981", "#f59e0b", "#ef4444"];

const bookingData = [
  {
    id: "BK001",
    customer: "Nguyễn Văn An",
    phone: "0901234567",
    email: "nguyenvanan@gmail.com",
    court: "Sân Bóng Đá 7 Người A",
    courtType: "7 người",
    date: "2025-01-16",
    time: "18:00–20:00",
    price: 500000,
    status: "confirmed",
    pay: "paid",
    bookingDate: "2025-01-15 14:30",
    notes: "Khách hàng VIP, ưu tiên sân tốt",
    isVip: true,
    totalBookings: 15,
    lastBooking: "2025-01-10"
  },
  {
    id: "BK002",
    customer: "Trần Thị Bình",
    phone: "0909998888",
    email: "tranthibinh@gmail.com",
    court: "Sân Bóng Đá 7 Người B",
    courtType: "7 người",
    date: "2025-01-16",
    time: "19:00–21:00",
    price: 600000,
    status: "pending",
    pay: "unpaid",
    bookingDate: "2025-01-16 09:15",
    notes: "Đặt sân lần đầu",
    isVip: false,
    totalBookings: 1,
    lastBooking: null
  },
  {
    id: "BK003",
    customer: "Lê Hoàng",
    phone: "0912223333",
    email: "lehoang@gmail.com",
    court: "Sân Tennis VIP",
    courtType: "tennis",
    date: "2025-01-16",
    time: "17:00–19:00",
    price: 800000,
    status: "completed",
    pay: "paid",
    bookingDate: "2025-01-15 16:45",
    notes: "Trận đấu quan trọng",
    isVip: true,
    totalBookings: 8,
    lastBooking: "2025-01-12"
  },
  {
    id: "BK004",
    customer: "Phạm Văn Đức",
    phone: "0934445555",
    email: "phamvanduc@gmail.com",
    court: "Sân Bóng Đá 5 Người",
    courtType: "5 người",
    date: "2025-01-16",
    time: "20:00–22:00",
    price: 400000,
    status: "cancelled",
    pay: "refund",
    bookingDate: "2025-01-15 20:20",
    notes: "Hủy do thời tiết",
    isVip: false,
    totalBookings: 3,
    lastBooking: "2025-01-08"
  },
  {
    id: "BK005",
    customer: "Võ Thị Hoa",
    phone: "0945556666",
    email: "vothihoa@gmail.com",
    court: "Sân Bóng Đá 7 Người A",
    courtType: "7 người",
    date: "2025-01-17",
    time: "16:00–18:00",
    price: 500000,
    status: "pending",
    pay: "unpaid",
    bookingDate: "2025-01-16 11:30",
    notes: "Nhóm bạn 7 người",
    isVip: false,
    totalBookings: 2,
    lastBooking: "2025-01-05"
  },
  {
    id: "BK006",
    customer: "Đặng Minh Tuấn",
    phone: "0956667777",
    email: "dangminhtuan@gmail.com",
    court: "Sân Bóng Đá 7 Người B",
    courtType: "7 người",
    date: "2025-01-17",
    time: "14:00–16:00",
    price: 500000,
    status: "confirmed",
    pay: "paid",
    bookingDate: "2025-01-16 08:45",
    notes: "Khách hàng thân thiết",
    isVip: true,
    totalBookings: 12,
    lastBooking: "2025-01-14"
  },
];

const courtData = [
  { 
    id: 1, 
    name: "Sân Bóng Đá 7 Người A", 
    type: "7 người", 
    capacity: 7, 
    address: "123 Đường ABC, Quận 1, TP.HCM",
    openAt: "06:00", 
    closeAt: "22:00", 
    price: 500000, 
    peakPrice: 600000, 
    status: "active", 
    rating: 4.8,
    description: "Sân bóng đá 7 người chất lượng cao với cỏ nhân tạo",
    image: "https://via.placeholder.com/300x200?text=Sân+A",
    createdAt: "2024-01-15"
  },
  { 
    id: 2, 
    name: "Sân Bóng Đá 7 Người B", 
    type: "7 người", 
    capacity: 7, 
    address: "456 Đường DEF, Quận 1, TP.HCM",
    openAt: "06:00", 
    closeAt: "22:00", 
    price: 500000, 
    peakPrice: 600000, 
    status: "active", 
    rating: 4.6,
    description: "Sân bóng đá 7 người với hệ thống chiếu sáng hiện đại",
    image: "https://via.placeholder.com/300x200?text=Sân+B",
    createdAt: "2024-01-20"
  },
  { 
    id: 3, 
    name: "Sân Tennis VIP", 
    type: "tennis", 
    capacity: 4, 
    address: "789 Đường GHI, Quận 1, TP.HCM",
    openAt: "06:00", 
    closeAt: "22:00", 
    price: 800000, 
    peakPrice: 1000000, 
    status: "maintenance", 
    rating: 4.7,
    description: "Sân tennis cao cấp với mặt sân cứng chuyên nghiệp",
    image: "https://via.placeholder.com/300x200?text=Tennis",
    createdAt: "2024-02-01"
  },
  { 
    id: 4, 
    name: "Sân Bóng Đá 5 Người", 
    type: "5 người", 
    capacity: 5, 
    address: "321 Đường JKL, Quận 1, TP.HCM",
    openAt: "06:00", 
    closeAt: "22:00", 
    price: 400000, 
    peakPrice: 500000, 
    status: "inactive", 
    rating: 4.5,
    description: "Sân bóng đá 5 người phù hợp cho các trận đấu nhỏ",
    image: "https://via.placeholder.com/300x200?text=Sân+5",
    createdAt: "2024-02-10"
  },
];

const reportData = [
  { month: "01", bookings: 45, revenue: 22.5 },
  { month: "02", bookings: 38, revenue: 19.0 },
  { month: "03", bookings: 52, revenue: 26.0 },
  { month: "04", bookings: 41, revenue: 20.5 },
  { month: "05", bookings: 58, revenue: 29.0 },
  { month: "06", bookings: 62, revenue: 31.0 },
];

const transactionData = [
  {
    id: "TXN001",
    bookingId: "BK001",
    customer: "Nguyễn Văn An",
    court: "Sân Bóng Đá 7 Người A",
    date: "2025-01-16",
    time: "18:00–20:00",
    amount: 500000,
    method: "VNPay",
    status: "completed",
    createdAt: "2025-01-15 14:30:25",
    transactionId: "VNPAY_123456789",
    refundAmount: 0,
    refundDate: null
  },
  {
    id: "TXN002",
    bookingId: "BK002",
    customer: "Trần Thị Bình",
    court: "Sân Bóng Đá 7 Người B",
    date: "2025-01-16",
    time: "19:00–21:00",
    amount: 600000,
    method: "MoMo",
    status: "pending",
    createdAt: "2025-01-16 09:15:10",
    transactionId: "MOMO_987654321",
    refundAmount: 0,
    refundDate: null
  },
  {
    id: "TXN003",
    bookingId: "BK003",
    customer: "Lê Hoàng",
    court: "Sân Tennis VIP",
    date: "2025-01-16",
    time: "17:00–19:00",
    amount: 800000,
    method: "Cash",
    status: "completed",
    createdAt: "2025-01-15 16:45:30",
    transactionId: "CASH_001",
    refundAmount: 0,
    refundDate: null
  },
  {
    id: "TXN004",
    bookingId: "BK004",
    customer: "Phạm Văn Đức",
    court: "Sân Bóng Đá 5 Người",
    date: "2025-01-16",
    time: "20:00–22:00",
    amount: 400000,
    method: "VNPay",
    status: "refunded",
    createdAt: "2025-01-15 20:20:15",
    transactionId: "VNPAY_456789123",
    refundAmount: 400000,
    refundDate: "2025-01-16 08:30:00"
  },
  {
    id: "TXN005",
    bookingId: "BK005",
    customer: "Võ Thị Hoa",
    court: "Sân Bóng Đá 7 Người A",
    date: "2025-01-17",
    time: "16:00–18:00",
    amount: 500000,
    method: "MoMo",
    status: "failed",
    createdAt: "2025-01-16 11:30:45",
    transactionId: "MOMO_555666777",
    refundAmount: 0,
    refundDate: null
  },
  {
    id: "TXN006",
    bookingId: "BK006",
    customer: "Đặng Minh Tuấn",
    court: "Sân Bóng Đá 7 Người B",
    date: "2025-01-17",
    time: "14:00–16:00",
    amount: 500000,
    method: "VNPay",
    status: "completed",
    createdAt: "2025-01-16 08:45:20",
    transactionId: "VNPAY_789123456",
    refundAmount: 0,
    refundDate: null
  },
];

const dailyRevenueData = [
  { date: "2025-01-10", revenue: 2500000, bookings: 5 },
  { date: "2025-01-11", revenue: 3200000, bookings: 6 },
  { date: "2025-01-12", revenue: 1800000, bookings: 3 },
  { date: "2025-01-13", revenue: 4100000, bookings: 7 },
  { date: "2025-01-14", revenue: 2900000, bookings: 5 },
  { date: "2025-01-15", revenue: 3600000, bookings: 6 },
  { date: "2025-01-16", revenue: 2800000, bookings: 4 },
];

const courtRevenueData = [
  { court: "Sân Bóng Đá 7 Người A", revenue: 15000000, bookings: 30, percentage: 35 },
  { court: "Sân Bóng Đá 7 Người B", revenue: 12000000, bookings: 24, percentage: 28 },
  { court: "Sân Tennis VIP", revenue: 10000000, bookings: 12, percentage: 23 },
  { court: "Sân Bóng Đá 5 Người", revenue: 6000000, bookings: 15, percentage: 14 },
];

const reviewData = [
  {
    id: "REV001",
    customer: "Nguyễn Văn An",
    court: "Sân Bóng Đá 7 Người A",
    bookingId: "BK001",
    rating: 5,
    comment: "Sân rất đẹp, cỏ nhân tạo chất lượng cao. Nhân viên phục vụ nhiệt tình. Sẽ quay lại lần sau!",
    createdAt: "2025-01-16 20:30:15",
    isOwnerReplied: false,
    ownerReply: null,
    replyDate: null,
    status: "active",
    helpful: 3,
    reportCount: 0
  },
  {
    id: "REV002",
    customer: "Trần Thị Bình",
    court: "Sân Bóng Đá 7 Người B",
    bookingId: "BK002",
    rating: 4,
    comment: "Sân tốt, giá hợp lý. Chỉ có điều khu vực để xe hơi chật chội một chút.",
    createdAt: "2025-01-15 18:45:22",
    isOwnerReplied: true,
    ownerReply: "Cảm ơn bạn đã đánh giá! Chúng tôi đang cải thiện khu vực để xe để phục vụ tốt hơn.",
    replyDate: "2025-01-15 19:20:10",
    status: "active",
    helpful: 1,
    reportCount: 0
  },
  {
    id: "REV003",
    customer: "Lê Hoàng",
    court: "Sân Tennis VIP",
    bookingId: "BK003",
    rating: 5,
    comment: "Sân tennis tuyệt vời! Mặt sân cứng chuyên nghiệp, ánh sáng đầy đủ. Rất hài lòng!",
    createdAt: "2025-01-15 19:15:30",
    isOwnerReplied: true,
    ownerReply: "Cảm ơn anh Lê Hoàng! Chúng tôi rất vui khi được phục vụ anh. Hẹn gặp lại!",
    replyDate: "2025-01-15 20:00:45",
    status: "active",
    helpful: 5,
    reportCount: 0
  },
  {
    id: "REV004",
    customer: "Phạm Văn Đức",
    court: "Sân Bóng Đá 5 Người",
    bookingId: "BK004",
    rating: 2,
    comment: "Sân cũ, cỏ bị sờn nhiều chỗ. Giá thì đắt so với chất lượng. Không hài lòng lắm.",
    createdAt: "2025-01-14 16:20:18",
    isOwnerReplied: false,
    ownerReply: null,
    replyDate: null,
    status: "active",
    helpful: 0,
    reportCount: 0
  },
  {
    id: "REV005",
    customer: "Võ Thị Hoa",
    court: "Sân Bóng Đá 7 Người A",
    bookingId: "BK005",
    rating: 4,
    comment: "Sân đẹp, sạch sẽ. Nhân viên thân thiện. Chỉ có điều giá hơi cao so với các sân khác.",
    createdAt: "2025-01-13 21:10:25",
    isOwnerReplied: false,
    ownerReply: null,
    replyDate: null,
    status: "active",
    helpful: 2,
    reportCount: 0
  },
  {
    id: "REV006",
    customer: "Đặng Minh Tuấn",
    court: "Sân Bóng Đá 7 Người B",
    bookingId: "BK006",
    rating: 1,
    comment: "Sân rất tệ! Cỏ bị hỏng, có nhiều chỗ lồi lõm. Nhân viên thái độ không tốt. Không bao giờ quay lại!",
    createdAt: "2025-01-12 14:30:40",
    isOwnerReplied: false,
    ownerReply: null,
    replyDate: null,
    status: "reported",
    helpful: 0,
    reportCount: 1
  },
];

// Reports Data
const occupancyData = [
  { court: "Sân Bóng Đá 7 Người A", totalSlots: 16, bookedSlots: 14, occupancyRate: 87.5, performance: "Tốt" },
  { court: "Sân Bóng Đá 7 Người B", totalSlots: 16, bookedSlots: 12, occupancyRate: 75.0, performance: "Tốt" },
  { court: "Sân Tennis VIP", totalSlots: 16, bookedSlots: 8, occupancyRate: 50.0, performance: "Trung bình" },
  { court: "Sân Bóng Đá 5 Người", totalSlots: 16, bookedSlots: 6, occupancyRate: 37.5, performance: "Thấp" },
];

const peakHoursData = [
  { hour: "06:00-08:00", bookings: 2, revenue: 1000000, type: "Thấp điểm" },
  { hour: "08:00-10:00", bookings: 4, revenue: 2000000, type: "Thấp điểm" },
  { hour: "10:00-12:00", bookings: 6, revenue: 3000000, type: "Trung bình" },
  { hour: "12:00-14:00", bookings: 8, revenue: 4000000, type: "Cao điểm" },
  { hour: "14:00-16:00", bookings: 10, revenue: 5000000, type: "Cao điểm" },
  { hour: "16:00-18:00", bookings: 12, revenue: 6000000, type: "Cao điểm" },
  { hour: "18:00-20:00", bookings: 14, revenue: 7000000, type: "Cao điểm" },
  { hour: "20:00-22:00", bookings: 6, revenue: 3000000, type: "Trung bình" },
];

const loyalCustomersData = [
  { customer: "Nguyễn Văn An", totalBookings: 15, totalSpent: 7500000, lastBooking: "2025-01-16", loyaltyScore: 95, tier: "VIP" },
  { customer: "Đặng Minh Tuấn", totalBookings: 12, totalSpent: 6000000, lastBooking: "2025-01-14", loyaltyScore: 88, tier: "Gold" },
  { customer: "Lê Hoàng", totalBookings: 8, totalSpent: 6400000, lastBooking: "2025-01-15", loyaltyScore: 82, tier: "Gold" },
  { customer: "Trần Thị Bình", totalBookings: 6, totalSpent: 3600000, lastBooking: "2025-01-13", loyaltyScore: 75, tier: "Silver" },
  { customer: "Võ Thị Hoa", totalBookings: 4, totalSpent: 2000000, lastBooking: "2025-01-12", loyaltyScore: 65, tier: "Silver" },
];

const cancellationData = [
  { court: "Sân Bóng Đá 7 Người A", totalBookings: 30, cancelled: 2, noShow: 1, cancellationRate: 6.7, noShowRate: 3.3, status: "Tốt" },
  { court: "Sân Bóng Đá 7 Người B", totalBookings: 24, cancelled: 3, noShow: 2, cancellationRate: 12.5, noShowRate: 8.3, status: "Trung bình" },
  { court: "Sân Tennis VIP", totalBookings: 12, cancelled: 1, noShow: 0, cancellationRate: 8.3, noShowRate: 0.0, status: "Tốt" },
  { court: "Sân Bóng Đá 5 Người", totalBookings: 15, cancelled: 4, noShow: 3, cancellationRate: 26.7, noShowRate: 20.0, status: "Cần cải thiện" },
];

// Notifications Data
const notificationData = [
  {
    id: "NOTIF001",
    type: "booking",
    title: "Đặt sân mới",
    message: "Khách Nguyễn Văn An vừa đặt sân Bóng Đá 7 Người A lúc 17:00-19:00 ngày 16/01/2025",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "unread",
    createdAt: "2025-01-16 14:30:15",
    readAt: null,
    priority: "normal",
    actionRequired: false,
    bookingId: "BK001"
  },
  {
    id: "NOTIF002",
    type: "cancellation",
    title: "Hủy đặt sân",
    message: "Khách Phạm Văn Đức đã hủy đặt sân Bóng Đá 5 Người lúc 20:00-22:00 ngày 16/01/2025",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "read",
    createdAt: "2025-01-16 08:30:10",
    readAt: "2025-01-16 08:35:20",
    priority: "high",
    actionRequired: true,
    bookingId: "BK004"
  },
  {
    id: "NOTIF003",
    type: "system",
    title: "Thay đổi chính sách giá",
    message: "Admin đã cập nhật chính sách giá sân Tennis VIP từ 800,000 VNĐ lên 1,000,000 VNĐ/giờ",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "unread",
    createdAt: "2025-01-15 16:45:30",
    readAt: null,
    priority: "high",
    actionRequired: true,
    bookingId: null
  },
  {
    id: "NOTIF004",
    type: "maintenance",
    title: "Thông báo bảo trì sân",
    message: "Sân Tennis VIP sẽ được bảo trì từ 10:00-12:00 ngày 18/01/2025. Vui lòng thông báo cho khách hàng.",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "read",
    createdAt: "2025-01-15 10:20:45",
    readAt: "2025-01-15 10:25:15",
    priority: "normal",
    actionRequired: true,
    bookingId: null
  },
  {
    id: "NOTIF005",
    type: "payment",
    title: "Thanh toán thành công",
    message: "Khách Lê Hoàng đã thanh toán thành công 800,000 VNĐ cho đặt sân Tennis VIP lúc 17:00-19:00",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "unread",
    createdAt: "2025-01-15 16:50:20",
    readAt: null,
    priority: "normal",
    actionRequired: false,
    bookingId: "BK003"
  },
  {
    id: "NOTIF006",
    type: "review",
    title: "Đánh giá mới",
    message: "Khách Nguyễn Văn An đã đánh giá 5 sao cho sân Bóng Đá 7 Người A: 'Sân rất đẹp, cỏ nhân tạo chất lượng cao'",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "read",
    createdAt: "2025-01-16 20:35:10",
    readAt: "2025-01-16 20:40:25",
    priority: "normal",
    actionRequired: false,
    bookingId: "BK001"
  },
  {
    id: "NOTIF007",
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Hệ thống sẽ được cập nhật từ 02:00-04:00 ngày 20/01/2025. Một số tính năng có thể tạm thời không khả dụng.",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "unread",
    createdAt: "2025-01-16 09:15:30",
    readAt: null,
    priority: "normal",
    actionRequired: false,
    bookingId: null
  },
  {
    id: "NOTIF008",
    type: "booking",
    title: "Đặt sân mới",
    message: "Khách Võ Thị Hoa vừa đặt sân Bóng Đá 7 Người A lúc 16:00-18:00 ngày 17/01/2025",
    recipient: "Chủ sân",
    recipientType: "owner",
    status: "unread",
    createdAt: "2025-01-16 11:30:45",
    readAt: null,
    priority: "normal",
    actionRequired: false,
    bookingId: "BK005"
  }
];

// Settings Data
const ownerProfile = {
  id: "OWNER001",
  name: "Nguyễn Văn Chủ",
  email: "nguyenvanchuh@gmail.com",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  bankAccount: "1234567890",
  bankName: "Vietcombank",
  taxCode: "0123456789",
  businessLicense: "BL123456789",
  joinDate: "2024-01-15",
  status: "active"
};

const paymentConfig = {
  vnpay: {
    enabled: true,
    merchantId: "VNPAY123456",
    secretKey: "••••••••••••••••",
    accountNumber: "1234567890",
    accountName: "NGUYEN VAN CHU"
  },
  momo: {
    enabled: true,
    partnerCode: "MOMO123456",
    accessKey: "••••••••••••••••",
    secretKey: "••••••••••••••••",
    phoneNumber: "0901234567"
  },
  bank: {
    enabled: true,
    accountNumber: "1234567890",
    accountName: "NGUYEN VAN CHU",
    bankName: "Vietcombank",
    branch: "Chi nhánh TP.HCM"
  }
};

const scheduleConfig = {
  openTime: "06:00",
  closeTime: "22:00",
  slotDuration: 120, // minutes
  maxAdvanceBooking: 30, // days
  minAdvanceBooking: 1, // hours
  autoConfirm: false,
  allowSameDayBooking: true,
  weekendPricing: {
    enabled: true,
    multiplier: 1.2
  }
};

const cancellationPolicy = {
  freeCancellationHours: 24,
  partialRefundHours: 12,
  noRefundHours: 2,
  weatherPolicy: {
    enabled: true,
    fullRefund: true
  },
  emergencyPolicy: {
    enabled: true,
    fullRefund: true,
    requireDocument: true
  }
};

// Staff Management Data
const staffData = [
  {
    id: "STAFF001",
    name: "Nguyễn Thị Lan",
    email: "nguyenthilan@gmail.com",
    phone: "0901111111",
    role: "receptionist",
    roleName: "Lễ tân",
    assignedCourts: ["Sân Bóng Đá 7 Người A", "Sân Bóng Đá 7 Người B"],
    shift: "morning",
    shiftName: "Ca sáng",
    workHours: "06:00-14:00",
    status: "active",
    joinDate: "2024-01-15",
    salary: 8000000,
    permissions: ["view_bookings", "confirm_bookings", "customer_service"],
    lastLogin: "2025-01-16 08:30:15"
  },
  {
    id: "STAFF002",
    name: "Trần Văn Minh",
    email: "tranvanminh@gmail.com",
    phone: "0902222222",
    role: "technician",
    roleName: "Kỹ thuật viên",
    assignedCourts: ["Sân Tennis VIP"],
    shift: "afternoon",
    shiftName: "Ca chiều",
    workHours: "14:00-22:00",
    status: "active",
    joinDate: "2024-02-01",
    salary: 10000000,
    permissions: ["maintenance", "equipment_check", "court_management"],
    lastLogin: "2025-01-16 14:15:30"
  },
  {
    id: "STAFF003",
    name: "Lê Thị Hoa",
    email: "lethihoa@gmail.com",
    phone: "0903333333",
    role: "maintenance",
    roleName: "Bảo trì",
    assignedCourts: ["Sân Bóng Đá 5 Người"],
    shift: "evening",
    shiftName: "Ca tối",
    workHours: "18:00-02:00",
    status: "active",
    joinDate: "2024-01-20",
    salary: 9000000,
    permissions: ["cleaning", "maintenance", "equipment_repair"],
    lastLogin: "2025-01-15 18:45:20"
  },
  {
    id: "STAFF004",
    name: "Phạm Văn Đức",
    email: "phamvanduc@gmail.com",
    phone: "0904444444",
    role: "receptionist",
    roleName: "Lễ tân",
    assignedCourts: ["Sân Tennis VIP", "Sân Bóng Đá 5 Người"],
    shift: "morning",
    shiftName: "Ca sáng",
    workHours: "06:00-14:00",
    status: "inactive",
    joinDate: "2024-03-01",
    salary: 8000000,
    permissions: ["view_bookings", "confirm_bookings", "customer_service"],
    lastLogin: "2025-01-10 09:20:10"
  },
  {
    id: "STAFF005",
    name: "Võ Thị Mai",
    email: "vothimai@gmail.com",
    phone: "0905555555",
    role: "technician",
    roleName: "Kỹ thuật viên",
    assignedCourts: ["Sân Bóng Đá 7 Người A", "Sân Bóng Đá 7 Người B"],
    shift: "afternoon",
    shiftName: "Ca chiều",
    workHours: "14:00-22:00",
    status: "active",
    joinDate: "2024-02-15",
    salary: 10000000,
    permissions: ["maintenance", "equipment_check", "court_management"],
    lastLogin: "2025-01-16 15:30:45"
  }
];

// Activity Log Data
const activityLogData = [
  {
    id: "LOG001",
    timestamp: "2025-01-16 15:30:25",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    userRole: "Owner",
    action: "court_created",
    actionName: "Thêm sân mới",
    target: "Sân Bóng Đá 7 Người C",
    targetId: "COURT005",
    details: "Tạo sân bóng đá 7 người mới với giá 500,000 VNĐ/giờ",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "LOG002",
    timestamp: "2025-01-16 14:15:10",
    user: "Nguyễn Thị Lan",
    userId: "STAFF001",
    userRole: "Lễ tân",
    action: "booking_confirmed",
    actionName: "Xác nhận đặt sân",
    target: "Đặt sân BK001",
    targetId: "BK001",
    details: "Xác nhận đặt sân cho khách Nguyễn Văn An lúc 18:00-20:00",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
    status: "success"
  },
  {
    id: "LOG003",
    timestamp: "2025-01-16 13:45:30",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    userRole: "Owner",
    action: "price_updated",
    actionName: "Cập nhật giá sân",
    target: "Sân Tennis VIP",
    targetId: "COURT003",
    details: "Thay đổi giá từ 800,000 VNĐ lên 1,000,000 VNĐ/giờ",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "LOG004",
    timestamp: "2025-01-16 12:20:15",
    user: "Trần Văn Minh",
    userId: "STAFF002",
    userRole: "Kỹ thuật viên",
    action: "court_maintenance",
    actionName: "Bảo trì sân",
    target: "Sân Tennis VIP",
    targetId: "COURT003",
    details: "Thực hiện bảo trì hệ thống chiếu sáng sân Tennis VIP",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0",
    status: "success"
  },
  {
    id: "LOG005",
    timestamp: "2025-01-16 11:10:45",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    userRole: "Owner",
    action: "staff_added",
    actionName: "Thêm nhân viên",
    target: "Võ Thị Mai",
    targetId: "STAFF005",
    details: "Thêm nhân viên kỹ thuật viên mới với lương 10,000,000 VNĐ/tháng",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "LOG006",
    timestamp: "2025-01-16 10:35:20",
    user: "Lê Thị Hoa",
    userId: "STAFF003",
    userRole: "Bảo trì",
    action: "booking_cancelled",
    actionName: "Hủy đặt sân",
    target: "Đặt sân BK004",
    targetId: "BK004",
    details: "Hủy đặt sân do thời tiết xấu, hoàn tiền 100% cho khách",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
    status: "success"
  },
  {
    id: "LOG007",
    timestamp: "2025-01-16 09:25:10",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    userRole: "Owner",
    action: "court_deleted",
    actionName: "Xóa sân",
    target: "Sân Bóng Đá 5 Người Cũ",
    targetId: "COURT006",
    details: "Xóa sân cũ do không còn sử dụng, chuyển dữ liệu sang sân mới",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "LOG008",
    timestamp: "2025-01-16 08:45:30",
    user: "Phạm Văn Đức",
    userId: "STAFF004",
    userRole: "Lễ tân",
    action: "payment_processed",
    actionName: "Xử lý thanh toán",
    target: "Giao dịch TXN003",
    targetId: "TXN003",
    details: "Xử lý thanh toán tiền mặt 800,000 VNĐ cho đặt sân Tennis VIP",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0",
    status: "success"
  },
  {
    id: "LOG009",
    timestamp: "2025-01-15 22:15:45",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    userRole: "Owner",
    action: "settings_updated",
    actionName: "Cập nhật cấu hình",
    target: "Chính sách hủy sân",
    targetId: "SETTINGS001",
    details: "Thay đổi thời gian hủy miễn phí từ 24h xuống 12h",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "LOG010",
    timestamp: "2025-01-15 20:30:15",
    user: "Võ Thị Mai",
    userId: "STAFF005",
    userRole: "Kỹ thuật viên",
    action: "equipment_check",
    actionName: "Kiểm tra thiết bị",
    target: "Sân Bóng Đá 7 Người A",
    targetId: "COURT001",
    details: "Kiểm tra và bảo dưỡng hệ thống tưới nước tự động",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X)",
    status: "success"
  },
  {
    id: "LOG011",
    timestamp: "2025-01-15 18:20:30",
    user: "Nguyễn Thị Lan",
    userId: "STAFF001",
    userRole: "Lễ tân",
    action: "customer_service",
    actionName: "Hỗ trợ khách hàng",
    target: "Khách hàng Trần Thị Bình",
    targetId: "CUSTOMER002",
    details: "Giải đáp thắc mắc về chính sách đặt sân và hướng dẫn sử dụng app",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
    status: "success"
  },
  {
    id: "LOG012",
    timestamp: "2025-01-15 16:45:20",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    userRole: "Owner",
    action: "staff_permission_updated",
    actionName: "Cập nhật quyền nhân viên",
    target: "Trần Văn Minh",
    targetId: "STAFF002",
    details: "Thêm quyền quản lý sân Bóng Đá 7 Người B cho kỹ thuật viên",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  }
];

const todaySchedule = [
  { time: "08:00", status: "booked", customer: "Nguyễn Văn An", court: "Sân 1" },
  { time: "10:00", status: "available", customer: null, court: "Tất cả sân" },
  { time: "12:00", status: "booked", customer: "Trần Thị Bình", court: "Sân 2" },
  { time: "14:00", status: "booked", customer: "Lê Hoàng", court: "Sân 1" },
  { time: "16:00", status: "booked", customer: "Phạm Văn Đức", court: "Sân 2" },
  { time: "18:00", status: "booked", customer: "Võ Thị Hoa", court: "Sân 1" },
  { time: "20:00", status: "available", customer: null, court: "Tất cả sân" },
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
      label: "Hoàn tất",
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

const KpiCard = ({ title, value, icon, trend }) => (
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
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
      {trend && (
        <div style={{ fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
  </div>
);

// Main Owner Panel Component
export default function OwnerPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "courts", label: "Quản lý sân", icon: Building2 },
    { id: "bookings", label: "Đơn đặt sân", icon: BookOpen },
    { id: "reports", label: "Doanh thu & Thanh toán", icon: CreditCard },
    { id: "reviews", label: "Đánh giá & Phản hồi", icon: MessageSquare },
    { id: "analytics", label: "Báo cáo & Thống kê", icon: BarChart3 },
    { id: "notifications", label: "Quản lý thông báo", icon: Bell },
    { id: "staff", label: "Quản lý nhân sự", icon: Users2 },
    { id: "activity", label: "Nhật ký hoạt động", icon: History },
    { id: "settings", label: "Cấu hình & Hệ thống", icon: Settings },
  ];

  const filteredBookings = useMemo(
    () =>
      bookingData.filter((r) =>
        [r.id, r.customer, r.court, r.phone, r.email, r.courtType, r.notes]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const filteredCourts = useMemo(
    () => courtData.filter(r => 
      [r.name, r.type, r.address, r.status, r.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredTransactions = useMemo(
    () => transactionData.filter(t => 
      [t.id, t.bookingId, t.customer, t.court, t.method, t.status, t.transactionId]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredReviews = useMemo(
    () => reviewData.filter(r => 
      [r.id, r.customer, r.court, r.bookingId, r.comment, r.ownerReply]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredNotifications = useMemo(
    () => notificationData.filter(n => 
      [n.id, n.title, n.message, n.type, n.status]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredStaff = useMemo(
    () => staffData.filter(s => 
      [s.id, s.name, s.email, s.phone, s.roleName, s.shiftName, s.status]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const filteredActivityLogs = useMemo(
    () => activityLogData.filter(log => 
      [log.id, log.user, log.actionName, log.target, log.details, log.userRole, log.status]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / pageSize));
  const courtSlice = filteredCourts.slice((page - 1) * pageSize, page * pageSize);

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
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Bảng điều khiển chủ sân</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
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
            <Download size={16} /> Xuất báo cáo
          </button>
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
          title="Doanh thu hôm nay"
          value={`${(ownerKpis.todayRevenue / 1e6).toFixed(1)}M VNĐ`}
          icon={<BadgeDollarSign size={20} color="#10b981" />}
          trend="+15% so với hôm qua"
        />
        <KpiCard
          title="Tổng số lượt đặt sân"
          value={`${ownerKpis.weeklyBookings} lượt / tuần`}
          icon={<CalendarDays size={20} color="#3b82f6" />}
          trend="+8% so với tuần trước"
        />
        <KpiCard
          title="Tỷ lệ lấp đầy"
          value={`${ownerKpis.occupancyRate}%`}
          icon={<Users2 size={20} color="#f59e0b" />}
          trend="+5% so với tuần trước"
        />
        <KpiCard
          title="Đánh giá trung bình"
          value={`⭐ ${ownerKpis.averageRating} / 5.0`}
          icon={<Star size={20} color="#f59e0b" />}
          trend="+0.1 so với tháng trước"
        />
      </div>

      {/* Charts and Schedule row */}
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
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" />
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

      {/* Today's Schedule */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18 }}>
          📅 Lịch sân hôm nay
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {todaySchedule.map((schedule, index) => (
            <div
              key={index}
              style={{
                background: schedule.status === "booked" ? "#f0f9ff" : "#f0fdf4",
                border: `1px solid ${schedule.status === "booked" ? "#3b82f6" : "#10b981"}`,
                borderRadius: 8,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ 
                fontWeight: 600, 
                color: schedule.status === "booked" ? "#1e40af" : "#166534",
                fontSize: 14 
              }}>
                {schedule.time}
              </div>
              <div style={{ 
                fontSize: 12, 
                color: schedule.status === "booked" ? "#1e40af" : "#166534",
                fontWeight: 600 
              }}>
                {schedule.status === "booked" ? "Đã đặt" : "Trống"}
              </div>
              {schedule.customer && (
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  {schedule.customer}
                </div>
              )}
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {schedule.court}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourts = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý sân</h1>
        <button
          onClick={() => alert("TODO: Mở modal thêm sân mới")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
        >
          <Plus size={16}/> Thêm sân mới
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng sân</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredCourts.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đang hoạt động</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredCourts.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Bảo trì</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredCourts.filter(c => c.status === 'maintenance').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tạm ngưng</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {filteredCourts.filter(c => c.status === 'inactive').length}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
              <strong>Tổng:</strong> {filteredCourts.length} sân
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
                <option value="all">Tất cả loại sân</option>
                <option value="5 người">5 người</option>
                <option value="7 người">7 người</option>
                <option value="tennis">Tennis</option>
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
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
          </div>
          </div>
          <input
            placeholder="Tìm theo tên, loại, địa chỉ, mô tả…"
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
                {["Ảnh", "Tên sân", "Loại", "Địa chỉ", "Giá/giờ", "Khung giờ", "Đánh giá", "Trạng thái", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courtSlice.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ 
                      width: 60, 
                      height: 40, 
                      borderRadius: 8, 
                      overflow: "hidden",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <img 
                        src={r.image} 
                        alt={r.name}
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover" 
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div style={{ 
                        display: "none", 
                        alignItems: "center", 
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        background: "#e5e7eb",
                        color: "#6b7280",
                        fontSize: 12
                      }}>
                        <Image size={16} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.description}>
                      {r.description}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.type === "tennis" ? "#f0f9ff" : r.type === "7 người" ? "#e6f9f0" : "#fef3c7",
                      color: r.type === "tennis" ? "#0284c7" : r.type === "7 người" ? "#059669" : "#d97706",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: 12, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.address}>
                    {r.address}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, color: "#059669" }}>{r.price.toLocaleString()} VNĐ</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Cao điểm: {r.peakPrice.toLocaleString()} VNĐ</div>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {r.openAt} - {r.closeAt}
                  </td>
                  <td style={{ padding: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={14} color="#f59e0b" />
                    <span style={{ fontWeight: 600 }}>{r.rating}</span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{ 
                      background: r.status === "active" ? "#e6f9f0" : 
                                 r.status === "maintenance" ? "#fef3c7" : "#fee2e2", 
                      color: r.status === "active" ? "#059669" : 
                            r.status === "maintenance" ? "#d97706" : "#ef4444", 
                      padding: "4px 8px", 
                      borderRadius: 999, 
                      fontSize: 12, 
                      fontWeight: 700 
                    }}>
                      {r.status === "active" ? "Hoạt động" : 
                       r.status === "maintenance" ? "Bảo trì" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton 
                      bg="#06b6d4" 
                      Icon={Eye} 
                      onClick={() => alert("Xem chi tiết sân " + r.name)} 
                      title="Xem chi tiết" 
                    />
                    <ActionButton 
                      bg="#22c55e" 
                      Icon={Pencil} 
                      onClick={() => alert("Chỉnh sửa sân " + r.name)} 
                      title="Chỉnh sửa" 
                    />
                    <ActionButton 
                      bg="#3b82f6" 
                      Icon={Image} 
                      onClick={() => alert("Quản lý ảnh sân " + r.name)} 
                      title="Quản lý ảnh" 
                    />
                    <ActionButton 
                      bg="#6b7280" 
                      Icon={Settings} 
                      onClick={() => alert("Cấu hình khung giờ " + r.name)} 
                      title="Cấu hình giờ" 
                    />
                    {r.status === "active" ? (
                      <ActionButton 
                        bg="#f59e0b" 
                        Icon={PowerOff} 
                        onClick={() => alert("Tạm ngưng sân " + r.name)} 
                        title="Tạm ngưng" 
                      />
                    ) : r.status === "maintenance" ? (
                      <ActionButton 
                        bg="#10b981" 
                        Icon={Power} 
                        onClick={() => alert("Kích hoạt sân " + r.name)} 
                        title="Kích hoạt" 
                      />
                    ) : (
                      <ActionButton 
                        bg="#10b981" 
                        Icon={Power} 
                        onClick={() => alert("Kích hoạt sân " + r.name)} 
                        title="Kích hoạt" 
                      />
                    )}
                    <ActionButton 
                      bg="#ef4444" 
                      Icon={Trash2} 
                      onClick={() => alert("Xóa/ẩn sân " + r.name)} 
                      title="Xóa/ẩn sân" 
                    />
                  </td>
                </tr>
              ))}
              {!courtSlice.length && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>🏟️</div>
                    Không có dữ liệu sân
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
          <div>Showing {(page-1)*pageSize + 1} to {Math.min(page*pageSize, filteredCourts.length)} of {filteredCourts.length} entries</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
            <div style={{ padding: "6px 10px", borderRadius: 8, background: "#3b82f6", color: "#fff" }}>{page}</div>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
          </div>
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
            onClick={() => alert("TODO: Mở lịch biểu")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <Calendar size={16}/> Xem lịch biểu
          </button>
          <button
            onClick={() => alert("TODO: Xuất báo cáo")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <Download size={16}/> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng đơn đặt</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredBookings.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Chờ xử lý</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#4338ca" }}>
            {filteredBookings.filter(b => b.status === 'pending').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã xác nhận</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredBookings.filter(b => b.status === 'confirmed').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Khách VIP</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredBookings.filter(b => b.isVip).length}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredBookings.length} đơn đặt
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
                <option value="completed">Hoàn tất</option>
                <option value="cancelled">Đã hủy</option>
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
                <option value="all">Tất cả sân</option>
                <option value="Sân Bóng Đá 7 Người A">Sân Bóng Đá 7 Người A</option>
                <option value="Sân Bóng Đá 7 Người B">Sân Bóng Đá 7 Người B</option>
                <option value="Sân Tennis VIP">Sân Tennis VIP</option>
                <option value="Sân Bóng Đá 5 Người">Sân Bóng Đá 5 Người</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã, khách hàng, sân, email, ghi chú…"
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
                {["Mã đặt", "Khách hàng", "Liên hệ", "Sân", "Ngày đặt", "Khung giờ", "Giá (VNĐ)", "Thanh toán", "Trạng thái", "Ghi chú", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.customer}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {r.isVip ? (
                        <span style={{ 
                          background: "#fef3c7", 
                          color: "#d97706", 
                          padding: "2px 6px", 
                          borderRadius: 999, 
                          fontSize: 10, 
                          fontWeight: 700 
                        }}>
                          VIP ({r.totalBookings} lần)
                        </span>
                      ) : (
                        <span style={{ color: "#6b7280" }}>
                          {r.totalBookings} lần đặt
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.email}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.court}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      <span style={{
                        background: r.courtType === "tennis" ? "#f0f9ff" : r.courtType === "7 người" ? "#e6f9f0" : "#fef3c7",
                        color: r.courtType === "tennis" ? "#0284c7" : r.courtType === "7 người" ? "#059669" : "#d97706",
                        padding: "2px 6px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700
                      }}>
                        {r.courtType}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.date}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Đặt: {r.bookingDate}</div>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#1f2937" }}>{r.time}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {r.price.toLocaleString()} VNĐ
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.pay === "paid" ? "#e6f9f0" : r.pay === "unpaid" ? "#fef3c7" : "#fee2e2",
                      color: r.pay === "paid" ? "#059669" : r.pay === "unpaid" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {r.pay === "paid" ? "Đã thanh toán" : r.pay === "unpaid" ? "Chưa thanh toán" : "Đã hoàn tiền"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <Status value={r.status} />
                  </td>
                  <td style={{ padding: 12, maxWidth: "200px" }}>
                    <div style={{
                      fontSize: 12,
                      color: "#6b7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }} title={r.notes}>
                      {r.notes}
                    </div>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton 
                      bg="#06b6d4" 
                      Icon={Eye} 
                      onClick={() => alert("Xem chi tiết đơn đặt " + r.id)} 
                      title="Xem chi tiết" 
                    />
                    {r.status === "pending" && (
                      <>
                        <ActionButton
                          bg="#10b981"
                          Icon={CheckCircle2}
                          onClick={() => alert("Duyệt đơn " + r.id)} 
                          title="Duyệt" 
                        />
                        <ActionButton
                          bg="#ef4444"
                          Icon={XCircle}
                          onClick={() => alert("Từ chối đơn " + r.id)} 
                          title="Từ chối"
                        />
                      </>
                    )}
                    {r.status === "confirmed" && (
                      <>
                    <ActionButton
                          bg="#3b82f6" 
                          Icon={RefreshCw} 
                          onClick={() => alert("Cập nhật trạng thái " + r.id)} 
                          title="Cập nhật trạng thái" 
                        />
                        <ActionButton 
                          bg="#f59e0b" 
                          Icon={XCircle} 
                          onClick={() => alert("Hủy đơn " + r.id)} 
                          title="Hủy đơn" 
                        />
                      </>
                    )}
                    <ActionButton 
                      bg="#6b7280" 
                      Icon={UserCheck} 
                      onClick={() => alert("Xem lịch sử khách hàng " + r.customer)} 
                      title="Lịch sử khách hàng" 
                    />
                  </td>
                </tr>
              ))}
              {!filteredBookings.length && (
                <tr>
                  <td colSpan={11} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>📅</div>
                    Không có dữ liệu đặt sân
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
          <div>Showing 1 to {filteredBookings.length} of {filteredBookings.length} entries</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
            <div style={{ padding: "6px 10px", borderRadius: 8, background: "#3b82f6", color: "#fff" }}>{page}</div>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý doanh thu & thanh toán</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xuất báo cáo CSV")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <FileText size={16}/> Xuất CSV
          </button>
        <button
            onClick={() => alert("TODO: Xuất báo cáo PDF")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ef4444", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <Download size={16}/> Xuất PDF
        </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng doanh thu</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {(transactionData.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0) / 1e6).toFixed(1)}M VNĐ
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Giao dịch thành công</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>
            {transactionData.filter(t => t.status === 'completed').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã hoàn tiền</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {transactionData.filter(t => t.status === 'refunded').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Giao dịch thất bại</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {transactionData.filter(t => t.status === 'failed').length}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Doanh thu theo ngày (tuần qua)</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `${(value / 1e6).toFixed(1)}M VNĐ` : value,
                  name === 'revenue' ? 'Doanh thu' : 'Số đặt'
                ]}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Doanh thu theo sân</div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={courtRevenueData}
                dataKey="revenue"
                nameKey="court"
                outerRadius={100}
                label={({ percentage }) => `${percentage}%`}
              >
                {courtRevenueData.map((_, i) => (
                  <Cell key={i} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 4]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${(value / 1e6).toFixed(1)}M VNĐ`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
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
                <option value="completed">Thành công</option>
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
                <option value="VNPay">VNPay</option>
                <option value="MoMo">MoMo</option>
                <option value="Cash">Tiền mặt</option>
              </select>
          </div>
        </div>
          <input
            placeholder="Tìm theo mã giao dịch, booking, khách hàng, sân…"
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
                {["Mã giao dịch", "Mã booking", "Khách hàng", "Sân", "Ngày & Giờ", "Số tiền", "Phương thức", "Trạng thái", "Thời gian tạo", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{t.id}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#3b82f6" }}>{t.bookingId}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{t.customer}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {t.transactionId}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{t.court}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{t.date} - {t.time}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{t.date}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{t.time}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, color: "#059669" }}>{t.amount.toLocaleString()} VNĐ</div>
                    {t.refundAmount > 0 && (
                      <div style={{ fontSize: 12, color: "#ef4444" }}>
                        Hoàn: {t.refundAmount.toLocaleString()} VNĐ
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: t.method === "VNPay" ? "#e6f0ff" : t.method === "MoMo" ? "#f0f9ff" : "#f9fafb",
                      color: t.method === "VNPay" ? "#1e40af" : t.method === "MoMo" ? "#0284c7" : "#6b7280",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {t.method}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: t.status === "completed" ? "#e6f9f0" : 
                                 t.status === "pending" ? "#fef3c7" : 
                                 t.status === "refunded" ? "#f0f9ff" : "#fee2e2",
                      color: t.status === "completed" ? "#059669" : 
                            t.status === "pending" ? "#d97706" : 
                            t.status === "refunded" ? "#0284c7" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {t.status === "completed" ? "Thành công" : 
                       t.status === "pending" ? "Chờ xử lý" : 
                       t.status === "refunded" ? "Đã hoàn tiền" : "Thất bại"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{t.createdAt}</td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton 
                      bg="#06b6d4" 
                      Icon={Eye} 
                      onClick={() => alert("Xem chi tiết giao dịch " + t.id)} 
                      title="Xem chi tiết" 
                    />
                    {t.status === "completed" && (
                      <ActionButton 
                        bg="#f59e0b" 
                        Icon={RotateCcw} 
                        onClick={() => alert("Hoàn tiền giao dịch " + t.id)} 
                        title="Hoàn tiền" 
                      />
                    )}
                    {t.status === "pending" && (
                      <ActionButton 
                        bg="#ef4444" 
                        Icon={XCircle} 
                        onClick={() => alert("Hủy giao dịch " + t.id)} 
                        title="Hủy giao dịch" 
                      />
                    )}
                  </td>
                </tr>
              ))}
              {!filteredTransactions.length && (
                <tr>
                  <td colSpan={10} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>💰</div>
                    Không có dữ liệu giao dịch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
          <div>Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} entries</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
            <div style={{ padding: "6px 10px", borderRadius: 8, background: "#3b82f6", color: "#fff" }}>{page}</div>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => {
    const averageRating = reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length;
    const totalReviews = reviewData.length;
    const repliedReviews = reviewData.filter(r => r.isOwnerReplied).length;
    const reportedReviews = reviewData.filter(r => r.status === 'reported').length;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý đánh giá và phản hồi</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => alert("TODO: Xuất báo cáo đánh giá")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <Download size={16}/> Xuất báo cáo
        </button>
          </div>
      </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng điểm trung bình</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b", display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={20} fill="#f59e0b" />
              {averageRating.toFixed(1)} / 5.0
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng đánh giá</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{totalReviews}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã trả lời</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{repliedReviews}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Báo cáo sai sự thật</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{reportedReviews}</div>
          </div>
        </div>

        {/* Reviews Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div>
                <strong>Tổng:</strong> {filteredReviews.length} đánh giá
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
                  <option value="all">Tất cả điểm</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
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
                  <option value="all">Tất cả sân</option>
                  <option value="Sân Bóng Đá 7 Người A">Sân Bóng Đá 7 Người A</option>
                  <option value="Sân Bóng Đá 7 Người B">Sân Bóng Đá 7 Người B</option>
                  <option value="Sân Tennis VIP">Sân Tennis VIP</option>
                  <option value="Sân Bóng Đá 5 Người">Sân Bóng Đá 5 Người</option>
                </select>
              </div>
            </div>
            <input
              placeholder="Tìm theo khách hàng, sân, nội dung đánh giá…"
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
                  {["Khách hàng", "Sân", "Điểm", "Nội dung", "Thời gian", "Trạng thái", "Hữu ích", "Hành động"].map(h => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.customer}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>Booking: {r.bookingId}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600 }}>{r.court}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < r.rating ? "#f59e0b" : "#e5e7eb"} 
                            color={i < r.rating ? "#f59e0b" : "#e5e7eb"} 
                          />
                        ))}
                        <span style={{ fontWeight: 600, marginLeft: 4 }}>{r.rating}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12, maxWidth: "300px" }}>
                      <div style={{ 
                        fontSize: 14, 
                        marginBottom: 8,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }} title={r.comment}>
                        {r.comment}
                      </div>
                      {r.isOwnerReplied && r.ownerReply && (
                        <div style={{ 
                          background: "#f0f9ff", 
                          padding: 8, 
                          borderRadius: 6, 
                          borderLeft: "3px solid #3b82f6",
                          fontSize: 12,
                          color: "#1e40af"
                        }}>
                          <div style={{ fontWeight: 600, marginBottom: 2 }}>Phản hồi của chủ sân:</div>
                          <div>{r.ownerReply}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                            {r.replyDate}
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{r.createdAt}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: r.status === "active" ? "#e6f9f0" : "#fee2e2",
                        color: r.status === "active" ? "#059669" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {r.status === "active" ? "Hoạt động" : "Đã báo cáo"}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <ThumbsUp size={14} color="#10b981" />
                        <span style={{ fontWeight: 600 }}>{r.helpful}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      {!r.isOwnerReplied && (
                        <ActionButton 
                          bg="#3b82f6" 
                          Icon={Reply} 
                          onClick={() => alert("Trả lời đánh giá " + r.id)} 
                          title="Trả lời đánh giá" 
                        />
                      )}
                      <ActionButton 
                        bg="#06b6d4" 
                        Icon={Eye} 
                        onClick={() => alert("Xem chi tiết đánh giá " + r.id)} 
                        title="Xem chi tiết" 
                      />
                      {r.status === "active" && (
                        <ActionButton 
                          bg="#ef4444" 
                          Icon={Flag} 
                          onClick={() => alert("Báo cáo đánh giá sai sự thật " + r.id)} 
                          title="Báo cáo sai sự thật" 
                        />
                      )}
                    </td>
                  </tr>
                ))}
                {!filteredReviews.length && (
                  <tr>
                    <td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                      <div style={{ fontSize: 16, marginBottom: 8 }}>⭐</div>
                      Không có dữ liệu đánh giá
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
            <div>Showing 1 to {filteredReviews.length} of {filteredReviews.length} entries</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
              <div style={{ padding: "6px 10px", borderRadius: 8, background: "#3b82f6", color: "#fff" }}>{page}</div>
              <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
            </div>
        </div>
      </div>
    </div>
  );
  };

  const renderAnalytics = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Báo cáo & thống kê chi tiết</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xuất báo cáo CSV")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <FileText size={16}/> Xuất CSV
          </button>
          <button
            onClick={() => alert("TODO: Xuất báo cáo PDF")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ef4444", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <Download size={16}/> Xuất PDF
          </button>
          </div>
      </div>

      {/* Doanh thu theo sân */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <PieChartIcon size={20} color="#3b82f6" />
          Doanh thu theo sân
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={courtRevenueData}
              dataKey="revenue"
              nameKey="court"
              outerRadius={100}
              label={({ percentage }) => `${percentage}%`}
            >
              {courtRevenueData.map((_, i) => (
                <Cell key={i} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 4]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${(value / 1e6).toFixed(1)}M VNĐ`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tỷ lệ đặt sân */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Percent size={20} color="#10b981" />
          Tỷ lệ đặt sân (% giờ được đặt trong ngày/tháng)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Sân", "Tổng khung giờ", "Đã đặt", "Tỷ lệ lấp đầy", "Hiệu suất"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {occupancyData.map((o) => (
                <tr key={o.court} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{o.court}</td>
                  <td style={{ padding: 12 }}>{o.totalSlots}</td>
                  <td style={{ padding: 12 }}>{o.bookedSlots}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ 
                        width: 100, 
                        height: 8, 
                        background: "#e5e7eb", 
                        borderRadius: 4, 
                        overflow: "hidden" 
                      }}>
                        <div style={{ 
                          width: `${o.occupancyRate}%`, 
                          height: "100%", 
                          background: o.occupancyRate >= 80 ? "#10b981" : o.occupancyRate >= 60 ? "#f59e0b" : "#ef4444",
                          transition: "width 0.3s ease"
                        }} />
                      </div>
                      <span style={{ fontWeight: 600, color: o.occupancyRate >= 80 ? "#10b981" : o.occupancyRate >= 60 ? "#f59e0b" : "#ef4444" }}>
                        {o.occupancyRate}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: o.performance === "Tốt" ? "#e6f9f0" : o.performance === "Trung bình" ? "#fef3c7" : "#fee2e2",
                      color: o.performance === "Tốt" ? "#059669" : o.performance === "Trung bình" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {o.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Giờ cao điểm / thấp điểm */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={20} color="#f59e0b" />
          Giờ cao điểm / thấp điểm (Dựa theo lịch sử đặt)
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `${(value / 1e6).toFixed(1)}M VNĐ` : value,
                name === 'revenue' ? 'Doanh thu' : 'Số đặt'
              ]}
            />
              <Legend />
            <Bar yAxisId="left" dataKey="bookings" fill="#3b82f6" name="Số đặt" />
            <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      {/* Khách hàng thân thiết */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Award size={20} color="#f59e0b" />
          Khách hàng thân thiết (Người đặt sân nhiều nhất)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Xếp hạng", "Tên khách hàng", "Số lượt đặt", "Tổng chi tiêu", "Điểm trung thành", "Đặt cuối", "Hạng"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loyalCustomersData.map((c, index) => (
                <tr key={c.customer} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: "50%", 
                      background: index === 0 ? "#f59e0b" : index === 1 ? "#6b7280" : index === 2 ? "#cd7f32" : "#e5e7eb",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      {index + 1}
                    </div>
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{c.customer}</td>
                  <td style={{ padding: 12 }}>{c.totalBookings}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {(c.totalSpent / 1e6).toFixed(1)}M VNĐ
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ 
                        width: 100, 
                        height: 8, 
                        background: "#e5e7eb", 
                        borderRadius: 4, 
                        overflow: "hidden" 
                      }}>
                        <div style={{ 
                          width: `${c.loyaltyScore}%`, 
                          height: "100%", 
                          background: c.loyaltyScore >= 90 ? "#f59e0b" : c.loyaltyScore >= 80 ? "#6b7280" : "#cd7f32",
                          transition: "width 0.3s ease"
                        }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{c.loyaltyScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{c.lastBooking}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: c.tier === "VIP" ? "#fef3c7" : c.tier === "Gold" ? "#f0f9ff" : "#f3f4f6",
                      color: c.tier === "VIP" ? "#d97706" : c.tier === "Gold" ? "#0284c7" : "#6b7280",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {c.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tỷ lệ hủy / no-show */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Target size={20} color="#ef4444" />
          Tỷ lệ hủy / no-show (Hỗ trợ cải thiện chính sách đặt sân)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Sân", "Tổng đặt", "Hủy", "No-show", "Tỷ lệ hủy", "Tỷ lệ no-show", "Đánh giá"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cancellationData.map((c) => (
                <tr key={c.court} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{c.court}</td>
                  <td style={{ padding: 12 }}>{c.totalBookings}</td>
                  <td style={{ padding: 12, color: "#f59e0b" }}>{c.cancelled}</td>
                  <td style={{ padding: 12, color: "#ef4444" }}>{c.noShow}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: c.cancellationRate <= 10 ? "#e6f9f0" : c.cancellationRate <= 20 ? "#fef3c7" : "#fee2e2",
                      color: c.cancellationRate <= 10 ? "#059669" : c.cancellationRate <= 20 ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {c.cancellationRate}%
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: c.noShowRate <= 5 ? "#e6f9f0" : c.noShowRate <= 15 ? "#fef3c7" : "#fee2e2",
                      color: c.noShowRate <= 5 ? "#059669" : c.noShowRate <= 15 ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {c.noShowRate}%
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: c.status === "Tốt" ? "#e6f9f0" : c.status === "Trung bình" ? "#fef3c7" : "#fee2e2",
                      color: c.status === "Tốt" ? "#059669" : c.status === "Trung bình" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => {
    const totalNotifications = filteredNotifications.length;
    const unreadNotifications = filteredNotifications.filter(n => n.status === 'unread').length;
    const highPriorityNotifications = filteredNotifications.filter(n => n.priority === 'high').length;
    const actionRequiredNotifications = filteredNotifications.filter(n => n.actionRequired).length;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý thông báo</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => alert("TODO: Gửi thông báo cho khách hàng")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <Send size={16}/> Gửi thông báo
            </button>
            <button
              onClick={() => alert("TODO: Đánh dấu tất cả đã đọc")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <CheckCircle size={16}/> Đánh dấu đã đọc
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng thông báo</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{totalNotifications}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Chưa đọc</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{unreadNotifications}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Ưu tiên cao</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{highPriorityNotifications}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Cần xử lý</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{actionRequiredNotifications}</div>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
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
                  <option value="cancellation">Hủy sân</option>
                  <option value="system">Hệ thống</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="payment">Thanh toán</option>
                  <option value="review">Đánh giá</option>
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
                  <option value="unread">Chưa đọc</option>
                  <option value="read">Đã đọc</option>
                </select>
              </div>
            </div>
            <input
              placeholder="Tìm theo tiêu đề, nội dung, loại thông báo…"
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

          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {filteredNotifications.map((n) => (
              <div 
                key={n.id} 
          style={{
            padding: 16,
                  borderBottom: "1px solid #f3f4f6",
                  background: n.status === "unread" ? "#f8fafc" : "#fff",
                  borderLeft: n.priority === "high" ? "4px solid #ef4444" : "4px solid transparent"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* Notification Icon */}
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: "50%", 
                    background: n.type === "booking" ? "#e6f0ff" : 
                               n.type === "cancellation" ? "#fee2e2" : 
                               n.type === "system" ? "#f0f9ff" : 
                               n.type === "maintenance" ? "#fef3c7" : 
                               n.type === "payment" ? "#e6f9f0" : "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {n.type === "booking" && <Calendar size={20} color="#3b82f6" />}
                    {n.type === "cancellation" && <XCircle size={20} color="#ef4444" />}
                    {n.type === "system" && <Settings size={20} color="#0284c7" />}
                    {n.type === "maintenance" && <Wrench size={20} color="#f59e0b" />}
                    {n.type === "payment" && <CreditCard size={20} color="#10b981" />}
                    {n.type === "review" && <Star size={20} color="#f59e0b" />}
          </div>

                  {/* Notification Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 style={{ 
                        fontSize: 16, 
                        fontWeight: 600, 
                        color: "#1f2937",
                        margin: 0
                      }}>
                        {n.title}
                      </h3>
                      {n.status === "unread" && (
                        <div style={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: "50%", 
                          background: "#ef4444" 
                        }} />
                      )}
                      {n.priority === "high" && (
                        <span style={{
                          background: "#fee2e2",
                          color: "#ef4444",
                          padding: "2px 6px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          Ưu tiên cao
                        </span>
                      )}
                      {n.actionRequired && (
                        <span style={{
                          background: "#fef3c7",
                          color: "#d97706",
                          padding: "2px 6px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          Cần xử lý
                        </span>
                      )}
                    </div>
                    
                    <p style={{ 
                      fontSize: 14, 
                      color: "#6b7280", 
                      margin: "0 0 8px 0",
                      lineHeight: 1.5
                    }}>
                      {n.message}
                    </p>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#9ca3af" }}>
                      <span>{n.createdAt}</span>
                      {n.readAt && (
                        <span>Đã đọc: {n.readAt}</span>
                      )}
                      {n.bookingId && (
                        <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                          Booking: {n.bookingId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {n.status === "unread" && (
                      <ActionButton 
                        bg="#10b981" 
                        Icon={CheckCircle} 
                        onClick={() => alert("Đánh dấu đã đọc " + n.id)} 
                        title="Đánh dấu đã đọc" 
                      />
                    )}
                    {n.bookingId && (
                      <ActionButton 
                        bg="#3b82f6" 
                        Icon={Eye} 
                        onClick={() => alert("Xem chi tiết booking " + n.bookingId)} 
                        title="Xem booking" 
                      />
                    )}
                    {n.actionRequired && (
                      <ActionButton 
                        bg="#f59e0b" 
                        Icon={AlertTriangle} 
                        onClick={() => alert("Xử lý thông báo " + n.id)} 
                        title="Xử lý" 
                      />
                    )}
                    <ActionButton 
                      bg="#ef4444" 
                      Icon={X} 
                      onClick={() => alert("Xóa thông báo " + n.id)} 
                      title="Xóa" 
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {!filteredNotifications.length && (
              <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                <div style={{ fontSize: 16, marginBottom: 8 }}>🔔</div>
                Không có thông báo nào
              </div>
            )}
        </div>
      </div>
    </div>
  );
  };

  const renderSettings = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Cấu hình cá nhân & hệ thống</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Lưu tất cả cấu hình")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
          >
            <Save size={16}/> Lưu tất cả
          </button>
        </div>
      </div>

      {/* Owner Profile Section */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <User size={20} color="#3b82f6" />
          👤 Hồ sơ chủ sân
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Họ và tên</label>
            <input
              type="text"
              defaultValue={ownerProfile.name}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              defaultValue={ownerProfile.email}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Số điện thoại</label>
            <input
              type="tel"
              defaultValue={ownerProfile.phone}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Địa chỉ</label>
            <input
              type="text"
              defaultValue={ownerProfile.address}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Số tài khoản ngân hàng</label>
            <input
              type="text"
              defaultValue={ownerProfile.bankAccount}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Tên ngân hàng</label>
            <input
              type="text"
              defaultValue={ownerProfile.bankName}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mã số thuế</label>
            <input
              type="text"
              defaultValue={ownerProfile.taxCode}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Giấy phép kinh doanh</label>
            <input
              type="text"
              defaultValue={ownerProfile.businessLicense}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Lưu thông tin hồ sơ")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600 }}
          >
            <Save size={16}/> Lưu hồ sơ
          </button>
          <button
            onClick={() => alert("TODO: Chỉnh sửa hồ sơ")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#6b7280", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600 }}
          >
            <Edit size={16}/> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Payment Configuration Section */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Banknote size={20} color="#10b981" />
          💳 Cấu hình thanh toán
        </div>
        
        {/* VNPay Configuration */}
        <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>VNPay</h3>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={paymentConfig.vnpay.enabled} />
              <span style={{ fontSize: 14, color: "#6b7280" }}>Kích hoạt</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Merchant ID</label>
              <input
                type="text"
                defaultValue={paymentConfig.vnpay.merchantId}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Secret Key</label>
              <input
                type="password"
                defaultValue={paymentConfig.vnpay.secretKey}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Số tài khoản</label>
              <input
                type="text"
                defaultValue={paymentConfig.vnpay.accountNumber}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Tên tài khoản</label>
              <input
                type="text"
                defaultValue={paymentConfig.vnpay.accountName}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
          </div>
        </div>

        {/* MoMo Configuration */}
        <div style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>MoMo</h3>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={paymentConfig.momo.enabled} />
              <span style={{ fontSize: 14, color: "#6b7280" }}>Kích hoạt</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Partner Code</label>
              <input
                type="text"
                defaultValue={paymentConfig.momo.partnerCode}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Access Key</label>
              <input
                type="password"
                defaultValue={paymentConfig.momo.accessKey}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Secret Key</label>
              <input
                type="password"
                defaultValue={paymentConfig.momo.secretKey}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Số điện thoại</label>
              <input
                type="tel"
                defaultValue={paymentConfig.momo.phoneNumber}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
          </div>
        </div>

        {/* Bank Transfer Configuration */}
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>Chuyển khoản ngân hàng</h3>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={paymentConfig.bank.enabled} />
              <span style={{ fontSize: 14, color: "#6b7280" }}>Kích hoạt</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Số tài khoản</label>
              <input
                type="text"
                defaultValue={paymentConfig.bank.accountNumber}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Tên tài khoản</label>
              <input
                type="text"
                defaultValue={paymentConfig.bank.accountName}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Tên ngân hàng</label>
              <input
                type="text"
                defaultValue={paymentConfig.bank.bankName}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Chi nhánh</label>
              <input
                type="text"
                defaultValue={paymentConfig.bank.branch}
                style={{ 
                  width: "100%", 
                  padding: "8px 10px", 
                  borderRadius: 6, 
                  border: "1px solid #d1d5db", 
                  fontSize: 13,
                  background: "#fff"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Configuration Section */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={20} color="#f59e0b" />
          📅 Cấu hình lịch sân
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Giờ mở cửa</label>
            <input
              type="time"
              defaultValue={scheduleConfig.openTime}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Giờ đóng cửa</label>
            <input
              type="time"
              defaultValue={scheduleConfig.closeTime}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Thời lượng khung giờ (phút)</label>
            <input
              type="number"
              defaultValue={scheduleConfig.slotDuration}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Đặt trước tối đa (ngày)</label>
            <input
              type="number"
              defaultValue={scheduleConfig.maxAdvanceBooking}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Đặt trước tối thiểu (giờ)</label>
            <input
              type="number"
              defaultValue={scheduleConfig.minAdvanceBooking}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Hệ số giá cuối tuần</label>
            <input
              type="number"
              step="0.1"
              defaultValue={scheduleConfig.weekendPricing.multiplier}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={scheduleConfig.autoConfirm} />
            <span style={{ fontSize: 14, color: "#374151" }}>Tự động xác nhận đặt sân</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={scheduleConfig.allowSameDayBooking} />
            <span style={{ fontSize: 14, color: "#374151" }}>Cho phép đặt sân trong ngày</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={scheduleConfig.weekendPricing.enabled} />
            <span style={{ fontSize: 14, color: "#374151" }}>Áp dụng giá cuối tuần</span>
          </label>
        </div>
      </div>

      {/* Cancellation Policy Section */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={20} color="#ef4444" />
          🧾 Chính sách hoàn hủy riêng
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Hủy miễn phí (giờ)</label>
            <input
              type="number"
              defaultValue={cancellationPolicy.freeCancellationHours}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Hoàn một phần (giờ)</label>
            <input
              type="number"
              defaultValue={cancellationPolicy.partialRefundHours}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Không hoàn (giờ)</label>
            <input
              type="number"
              defaultValue={cancellationPolicy.noRefundHours}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                borderRadius: 8, 
                border: "1px solid #d1d5db", 
                fontSize: 14,
                background: "#fff"
              }}
            />
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={cancellationPolicy.weatherPolicy.enabled} />
            <span style={{ fontSize: 14, color: "#374151" }}>Chính sách thời tiết</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={cancellationPolicy.weatherPolicy.fullRefund} />
            <span style={{ fontSize: 14, color: "#374151" }}>Hoàn tiền đầy đủ do thời tiết</span>
          </label>
        </div>
        
        <div style={{ display: "flex", gap: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={cancellationPolicy.emergencyPolicy.enabled} />
            <span style={{ fontSize: 14, color: "#374151" }}>Chính sách khẩn cấp</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={cancellationPolicy.emergencyPolicy.fullRefund} />
            <span style={{ fontSize: 14, color: "#374151" }}>Hoàn tiền đầy đủ khẩn cấp</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked={cancellationPolicy.emergencyPolicy.requireDocument} />
            <span style={{ fontSize: 14, color: "#374151" }}>Yêu cầu giấy tờ</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStaff = () => {
    const totalStaff = filteredStaff.length;
    const activeStaff = filteredStaff.filter(s => s.status === 'active').length;
    const inactiveStaff = filteredStaff.filter(s => s.status === 'inactive').length;
    const totalSalary = filteredStaff.reduce((sum, s) => sum + s.salary, 0);

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý nhân sự</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => alert("TODO: Thêm nhân viên mới")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <UserPlus size={16}/> Thêm nhân viên
            </button>
            <button
              onClick={() => alert("TODO: Xuất báo cáo nhân sự")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <Download size={16}/> Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng nhân viên</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{totalStaff}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đang hoạt động</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{activeStaff}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tạm ngưng</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{inactiveStaff}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng lương tháng</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
              {(totalSalary / 1e6).toFixed(1)}M VNĐ
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div>
                <strong>Tổng:</strong> {filteredStaff.length} nhân viên
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
                  <option value="receptionist">Lễ tân</option>
                  <option value="technician">Kỹ thuật viên</option>
                  <option value="maintenance">Bảo trì</option>
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
                  <option value="all">Tất cả ca làm</option>
                  <option value="morning">Ca sáng</option>
                  <option value="afternoon">Ca chiều</option>
                  <option value="evening">Ca tối</option>
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
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
            </div>
            <input
              placeholder="Tìm theo tên, email, số điện thoại, vai trò…"
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
                  {["Mã NV", "Thông tin", "Liên hệ", "Vai trò", "Sân quản lý", "Ca làm việc", "Lương", "Trạng thái", "Đăng nhập cuối", "Hành động"].map(h => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{s.id}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        Tham gia: {s.joinDate}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600 }}>{s.phone}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{s.email}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: s.role === "receptionist" ? "#e6f0ff" : 
                                   s.role === "technician" ? "#f0f9ff" : "#fef3c7",
                        color: s.role === "receptionist" ? "#1e40af" : 
                               s.role === "technician" ? "#0284c7" : "#d97706",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {s.roleName}
                      </span>
                    </td>
                    <td style={{ padding: 12, maxWidth: "200px" }}>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {s.assignedCourts.map((court, index) => (
                          <div key={index} style={{ marginBottom: 2 }}>
                            • {court}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {s.shift === "morning" && <Sun size={14} color="#f59e0b" />}
                        {s.shift === "afternoon" && <Clock size={14} color="#3b82f6" />}
                        {s.shift === "evening" && <Moon size={14} color="#6b7280" />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{s.shiftName}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{s.workHours}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                      {(s.salary / 1e6).toFixed(1)}M VNĐ
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: s.status === "active" ? "#e6f9f0" : "#fee2e2",
                        color: s.status === "active" ? "#059669" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {s.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{s.lastLogin}</td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <ActionButton 
                        bg="#06b6d4" 
                        Icon={Eye} 
                        onClick={() => alert("Xem chi tiết nhân viên " + s.name)} 
                        title="Xem chi tiết" 
                      />
                      <ActionButton 
                        bg="#3b82f6" 
                        Icon={Key} 
                        onClick={() => alert("Gán quyền cho " + s.name)} 
                        title="Gán quyền" 
                      />
                      <ActionButton 
                        bg="#6b7280" 
                        Icon={Pencil} 
                        onClick={() => alert("Chỉnh sửa thông tin " + s.name)} 
                        title="Chỉnh sửa" 
                      />
                      {s.status === "active" ? (
                        <ActionButton 
                          bg="#ef4444" 
                          Icon={Lock} 
                          onClick={() => alert("Khóa quyền " + s.name)} 
                          title="Khóa quyền" 
                        />
                      ) : (
                        <ActionButton 
                          bg="#10b981" 
                          Icon={Unlock} 
                          onClick={() => alert("Mở khóa quyền " + s.name)} 
                          title="Mở khóa quyền" 
                        />
                      )}
                      <ActionButton 
                        bg="#f59e0b" 
                        Icon={UserX} 
                        onClick={() => alert("Xóa nhân viên " + s.name)} 
                        title="Xóa nhân viên" 
                      />
                    </td>
                  </tr>
                ))}
                {!filteredStaff.length && (
                  <tr>
                    <td colSpan={10} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                      <div style={{ fontSize: 16, marginBottom: 8 }}>👥</div>
                      Không có dữ liệu nhân viên
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
            <div>Showing 1 to {filteredStaff.length} of {filteredStaff.length} entries</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
              <div style={{ padding: "6px 10px", borderRadius: 8, background: "#3b82f6", color: "#fff" }}>{page}</div>
              <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActivityLog = () => {
    const totalLogs = filteredActivityLogs.length;
    const todayLogs = filteredActivityLogs.filter(log => 
      log.timestamp.startsWith("2025-01-16")
    ).length;
    const ownerLogs = filteredActivityLogs.filter(log => 
      log.userRole === "Owner"
    ).length;
    const staffLogs = filteredActivityLogs.filter(log => 
      log.userRole !== "Owner"
    ).length;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Nhật ký hoạt động</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => alert("TODO: Xuất file log CSV")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <FileSpreadsheet size={16}/> Xuất CSV
            </button>
            <button
              onClick={() => alert("TODO: Xuất file log PDF")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ef4444", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
            >
              <FileText size={16}/> Xuất PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng hoạt động</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{totalLogs}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Hôm nay</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{todayLogs}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Chủ sân</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{ownerLogs}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Nhân viên</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{staffLogs}</div>
          </div>
        </div>

        {/* Activity Log Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
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
                  <option value="court_created">Thêm sân mới</option>
                  <option value="court_updated">Sửa sân</option>
                  <option value="court_deleted">Xóa sân</option>
                  <option value="booking_confirmed">Xác nhận đặt sân</option>
                  <option value="booking_cancelled">Hủy đặt sân</option>
                  <option value="price_updated">Cập nhật giá</option>
                  <option value="staff_added">Thêm nhân viên</option>
                  <option value="payment_processed">Xử lý thanh toán</option>
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
                  <option value="all">Tất cả người dùng</option>
                  <option value="Owner">Chủ sân</option>
                  <option value="Lễ tân">Lễ tân</option>
                  <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                  <option value="Bảo trì">Bảo trì</option>
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
              placeholder="Tìm theo người dùng, hành động, mục tiêu, chi tiết…"
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
                  {["Mã log", "Thời gian", "Người thực hiện", "Hành động", "Mục tiêu", "Chi tiết", "IP Address", "Trạng thái", "Hành động"].map(h => (
                    <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredActivityLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{log.id}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{log.timestamp}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{log.user}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        <span style={{
                          background: log.userRole === "Owner" ? "#e6f0ff" : 
                                     log.userRole === "Lễ tân" ? "#f0f9ff" : 
                                     log.userRole === "Kỹ thuật viên" ? "#fef3c7" : "#f3f4f6",
                          color: log.userRole === "Owner" ? "#1e40af" : 
                                 log.userRole === "Lễ tân" ? "#0284c7" : 
                                 log.userRole === "Kỹ thuật viên" ? "#d97706" : "#6b7280",
                          padding: "2px 6px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          {log.userRole}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: log.action.includes("court") ? "#e6f9f0" : 
                                   log.action.includes("booking") ? "#f0f9ff" : 
                                   log.action.includes("staff") ? "#fef3c7" : 
                                   log.action.includes("payment") ? "#f0fdf4" : "#f3f4f6",
                        color: log.action.includes("court") ? "#059669" : 
                               log.action.includes("booking") ? "#0284c7" : 
                               log.action.includes("staff") ? "#d97706" : 
                               log.action.includes("payment") ? "#166534" : "#6b7280",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {log.actionName}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{log.target}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {log.targetId}</div>
                    </td>
                    <td style={{ padding: 12, maxWidth: "300px" }}>
                      <div style={{ 
                        fontSize: 12, 
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }} title={log.details}>
                        {log.details}
                      </div>
                    </td>
                    <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>{log.ipAddress}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: log.status === "success" ? "#e6f9f0" : "#fee2e2",
                        color: log.status === "success" ? "#059669" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {log.status === "success" ? "Thành công" : "Thất bại"}
                      </span>
                    </td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <ActionButton 
                        bg="#06b6d4" 
                        Icon={Eye} 
                        onClick={() => alert("Xem chi tiết hoạt động " + log.id)} 
                        title="Xem chi tiết" 
                      />
                      <ActionButton 
                        bg="#6b7280" 
                        Icon={Monitor} 
                        onClick={() => alert("Xem thông tin trình duyệt " + log.id)} 
                        title="Xem thông tin trình duyệt" 
                      />
                    </td>
                  </tr>
                ))}
                {!filteredActivityLogs.length && (
                  <tr>
                    <td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                      <div style={{ fontSize: 16, marginBottom: 8 }}>📋</div>
                      Không có dữ liệu hoạt động
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
            <div>Showing 1 to {filteredActivityLogs.length} of {filteredActivityLogs.length} entries</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
              <div style={{ padding: "6px 10px", borderRadius: 8, background: "#3b82f6", color: "#fff" }}>{page}</div>
              <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "courts":
        return renderCourts();
      case "bookings":
        return renderBookings();
      case "reports":
        return renderReports();
      case "reviews":
        return renderReviews();
      case "analytics":
        return renderAnalytics();
      case "notifications":
        return renderNotifications();
      case "staff":
        return renderStaff();
      case "activity":
        return renderActivityLog();
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
      <OwnerHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
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
                  Owner Panel
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
                        background: activeTab === item.id ? "#e6f0ff" : "transparent",
                        color: activeTab === item.id ? "#3b82f6" : "#6b7280",
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
