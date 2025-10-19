// Mock data cho Admin Panel
export const kpis = {
  totalRevenue: 350000000,
  totalBookings: 1254,
  occupancyRate: 85,
  newUsers: 120,
};

export const trendData = [
  { name: "T2", bookings: 45, revenue: 12.5 },
  { name: "T3", bookings: 52, revenue: 14.2 },
  { name: "T4", bookings: 48, revenue: 13.8 },
  { name: "T5", bookings: 61, revenue: 16.5 },
  { name: "T6", bookings: 58, revenue: 15.9 },
  { name: "T7", bookings: 72, revenue: 19.2 },
  { name: "CN", bookings: 68, revenue: 18.1 },
];

export const pieData = [
  { name: "Đã xác nhận", value: 62 },
  { name: "Đã hủy", value: 12 },
  { name: "Chờ xử lý", value: 26 },
];

export const pieColors = ["#10b981", "#ef4444", "#6366f1"];

export const bookingData = [
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
    pay: "pending",
    bookingDate: "2025-01-15",
    notes: "Đặt sân cho đội bóng phường"
  },
  {
    id: "BK003",
    customer: "Lê Văn Cường",
    phone: "0905556666",
    email: "cuong@example.com",
    facility: "Sân Bóng Đá Cầu Giấy",
    court: "Sân 3",
    date: "2025-01-17",
    time: "20:00–22:00",
    price: 380000,
    status: "cancelled",
    pay: "refunded",
    bookingDate: "2025-01-16",
    notes: "Hủy do thời tiết xấu"
  },
  {
    id: "BK004",
    customer: "Phạm Thị Dung",
    phone: "0907778888",
    email: "dung@example.com",
    facility: "Truong Football",
    court: "Sân 2",
    date: "2025-01-18",
    time: "17:00–19:00",
    price: 350000,
    status: "confirmed",
    pay: "paid",
    bookingDate: "2025-01-17",
    notes: "Đặt sân cho đội bóng nữ"
  },
  {
    id: "BK005",
    customer: "Hoàng Văn Em",
    phone: "0903334444",
    email: "em@example.com",
    facility: "Sân Bóng Đá Minh Khai",
    court: "Sân 1",
    date: "2025-01-19",
    time: "18:30–20:30",
    price: 420000,
    status: "pending",
    pay: "pending",
    bookingDate: "2025-01-18",
    notes: "Đặt sân cho đội bóng trường"
  }
];

export const customerData = [
  {
    id: "C001",
    name: "Nguyễn Văn An",
    email: "an@example.com",
    phone: "0901234567",
    joinDate: "2024-01-15",
    totalBookings: 25,
    totalSpent: 8500000,
    status: "active",
    lastLogin: "2025-01-14"
  },
  {
    id: "C002",
    name: "Trần Thị Bình",
    email: "binh@example.com",
    phone: "0909998888",
    joinDate: "2024-02-20",
    totalBookings: 18,
    totalSpent: 6200000,
    status: "active",
    lastLogin: "2025-01-13"
  },
  {
    id: "C003",
    name: "Lê Văn Cường",
    email: "cuong@example.com",
    phone: "0905556666",
    joinDate: "2024-03-10",
    totalBookings: 12,
    totalSpent: 4200000,
    status: "inactive",
    lastLogin: "2024-12-20"
  },
  {
    id: "C004",
    name: "Phạm Thị Dung",
    email: "dung@example.com",
    phone: "0907778888",
    joinDate: "2024-04-05",
    totalBookings: 30,
    totalSpent: 10500000,
    status: "active",
    lastLogin: "2025-01-14"
  },
  {
    id: "C005",
    name: "Hoàng Văn Em",
    email: "em@example.com",
    phone: "0903334444",
    joinDate: "2024-05-12",
    totalBookings: 8,
    totalSpent: 2800000,
    status: "active",
    lastLogin: "2025-01-12"
  }
];

export const facilityData = [
  {
    id: "F001",
    name: "Truong Football",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    owner: "Nguyễn Văn A",
    phone: "0901111111",
    email: "owner1@example.com",
    courts: 3,
    status: "active",
    joinDate: "2024-01-01",
    totalBookings: 156,
    revenue: 52000000
  },
  {
    id: "F002",
    name: "Sân Bóng Đá Minh Khai",
    address: "456 Đường DEF, Quận 2, TP.HCM",
    owner: "Trần Thị B",
    phone: "0902222222",
    email: "owner2@example.com",
    courts: 2,
    status: "active",
    joinDate: "2024-02-15",
    totalBookings: 98,
    revenue: 32000000
  },
  {
    id: "F003",
    name: "Sân Bóng Đá Cầu Giấy",
    address: "789 Đường GHI, Quận 3, TP.HCM",
    owner: "Lê Văn C",
    phone: "0903333333",
    email: "owner3@example.com",
    courts: 4,
    status: "inactive",
    joinDate: "2024-03-01",
    totalBookings: 45,
    revenue: 15000000
  }
];

export const paymentData = [
  {
    id: "P001",
    bookingId: "BK001",
    customer: "Nguyễn Văn An",
    facility: "Truong Football",
    amount: 400000,
    method: "bank_transfer",
    status: "completed",
    transactionId: "TXN001",
    date: "2025-01-14",
    time: "14:30"
  },
  {
    id: "P002",
    bookingId: "BK002",
    customer: "Trần Thị Bình",
    facility: "Sân Bóng Đá Minh Khai",
    amount: 360000,
    method: "momo",
    status: "pending",
    transactionId: "TXN002",
    date: "2025-01-15",
    time: "09:15"
  },
  {
    id: "P003",
    bookingId: "BK003",
    customer: "Lê Văn Cường",
    facility: "Sân Bóng Đá Cầu Giấy",
    amount: 380000,
    method: "bank_transfer",
    status: "refunded",
    transactionId: "TXN003",
    date: "2025-01-16",
    time: "16:45"
  },
  {
    id: "P004",
    bookingId: "BK004",
    customer: "Phạm Thị Dung",
    facility: "Truong Football",
    amount: 350000,
    method: "vnpay",
    status: "completed",
    transactionId: "TXN004",
    date: "2025-01-17",
    time: "11:20"
  },
  {
    id: "P005",
    bookingId: "BK005",
    customer: "Hoàng Văn Em",
    facility: "Sân Bóng Đá Minh Khai",
    amount: 420000,
    method: "momo",
    status: "failed",
    transactionId: "TXN005",
    date: "2025-01-18",
    time: "13:10"
  }
];

export const ownerData = [
  {
    id: "O001",
    name: "Nguyễn Văn A",
    email: "owner1@example.com",
    phone: "0901111111",
    facility: "Truong Football",
    joinDate: "2024-01-01",
    status: "active",
    totalRevenue: 52000000,
    commission: 5200000,
    lastLogin: "2025-01-14"
  },
  {
    id: "O002",
    name: "Trần Thị B",
    email: "owner2@example.com",
    phone: "0902222222",
    facility: "Sân Bóng Đá Minh Khai",
    joinDate: "2024-02-15",
    status: "active",
    totalRevenue: 32000000,
    commission: 3200000,
    lastLogin: "2025-01-13"
  },
  {
    id: "O003",
    name: "Lê Văn C",
    email: "owner3@example.com",
    phone: "0903333333",
    facility: "Sân Bóng Đá Cầu Giấy",
    joinDate: "2024-03-01",
    status: "inactive",
    totalRevenue: 15000000,
    commission: 1500000,
    lastLogin: "2024-12-20"
  }
];

export const notificationData = [
  {
    id: "N001",
    title: "Đặt sân mới",
    message: "Có đặt sân mới từ khách hàng Nguyễn Văn An",
    type: "booking",
    status: "unread",
    date: "2025-01-14",
    time: "14:30"
  },
  {
    id: "N002",
    title: "Thanh toán thành công",
    message: "Thanh toán cho đặt sân BK001 đã hoàn tất",
    type: "payment",
    status: "read",
    date: "2025-01-14",
    time: "14:35"
  },
  {
    id: "N003",
    title: "Hủy đặt sân",
    message: "Khách hàng Lê Văn Cường đã hủy đặt sân BK003",
    type: "cancellation",
    status: "unread",
    date: "2025-01-16",
    time: "16:45"
  },
  {
    id: "N004",
    title: "Đăng ký chủ sân mới",
    message: "Có chủ sân mới đăng ký: Phạm Văn D",
    type: "registration",
    status: "read",
    date: "2025-01-17",
    time: "10:20"
  },
  {
    id: "N005",
    title: "Báo cáo tháng",
    message: "Báo cáo doanh thu tháng 1/2025 đã sẵn sàng",
    type: "report",
    status: "unread",
    date: "2025-01-18",
    time: "09:00"
  }
];

export const activityLogData = [
  {
    id: "A001",
    user: "Admin",
    action: "Xác nhận đặt sân",
    target: "BK001",
    details: "Xác nhận đặt sân cho khách hàng Nguyễn Văn An",
    date: "2025-01-14",
    time: "14:30",
    ip: "192.168.1.100"
  },
  {
    id: "A002",
    user: "System",
    action: "Tự động gửi email",
    target: "an@example.com",
    details: "Gửi email xác nhận đặt sân",
    date: "2025-01-14",
    time: "14:31",
    ip: "System"
  },
  {
    id: "A003",
    user: "Admin",
    action: "Cập nhật thông tin sân",
    target: "F001",
    details: "Cập nhật giá thuê sân từ 350,000 VNĐ lên 400,000 VNĐ",
    date: "2025-01-15",
    time: "09:15",
    ip: "192.168.1.100"
  },
  {
    id: "A004",
    user: "Owner",
    action: "Hủy đặt sân",
    target: "BK003",
    details: "Hủy đặt sân do thời tiết xấu",
    date: "2025-01-16",
    time: "16:45",
    ip: "192.168.1.105"
  },
  {
    id: "A005",
    user: "Admin",
    action: "Thêm chủ sân mới",
    target: "O004",
    details: "Thêm chủ sân mới: Phạm Văn D",
    date: "2025-01-17",
    time: "10:20",
    ip: "192.168.1.100"
  }
];
