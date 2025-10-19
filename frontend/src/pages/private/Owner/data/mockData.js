// Mock data cho Owner Panel
export const ownerKpis = {
  todayRevenue: 12500000,
  monthlyRevenue: 12500000,
  weeklyBookings: 58,
  occupancyRate: 80,
  averageRating: 4.6,
};

export const trendData = [
  { name: "Mon", bookings: 3, revenue: 1.5 },
  { name: "Tue", bookings: 4, revenue: 2.0 },
  { name: "Wed", bookings: 5, revenue: 2.5 },
  { name: "Thu", bookings: 6, revenue: 3.0 },
  { name: "Fri", bookings: 7, revenue: 3.5 },
  { name: "Sat", bookings: 8, revenue: 4.0 },
  { name: "Sun", bookings: 9, revenue: 4.5 },
];

export const pieData = [
  { name: "Đã xác nhận", value: 70 },
  { name: "Chờ xác nhận", value: 20 },
  { name: "Đã hủy", value: 10 },
];

export const pieColors = ["#10b981", "#f59e0b", "#ef4444"];

export const bookingData = [
  {
    id: "BK001",
    customer: "Nguyễn Văn An",
    phone: "0901234567",
    email: "nguyenvanan@gmail.com",
    court: "Sân Bóng Đá 7 Người A",
    courtType: "7 người",
    date: "2025-01-16",
    time: "17:00-19:00",
    price: 500000,
    status: "confirmed",
    pay: "paid",
    bookingDate: "2025-01-15",
    notes: "Đặt sân cho đội bóng công ty"
  },
  {
    id: "BK002",
    customer: "Trần Thị Bình",
    phone: "0909998888",
    email: "tranthibinh@gmail.com",
    court: "Sân Bóng Đá 7 Người B",
    courtType: "7 người",
    date: "2025-01-17",
    time: "19:00-21:00",
    price: 500000,
    status: "pending",
    pay: "pending",
    bookingDate: "2025-01-16",
    notes: "Đặt sân cho đội bóng phường"
  },
  {
    id: "BK003",
    customer: "Lê Văn Cường",
    phone: "0905556666",
    email: "levancuong@gmail.com",
    court: "Sân Tennis VIP",
    courtType: "Tennis",
    date: "2025-01-18",
    time: "20:00-22:00",
    price: 800000,
    status: "cancelled",
    pay: "refunded",
    bookingDate: "2025-01-17",
    notes: "Hủy do thời tiết xấu"
  },
  {
    id: "BK004",
    customer: "Phạm Thị Dung",
    phone: "0907778888",
    email: "phamthidung@gmail.com",
    court: "Sân Bóng Đá 5 Người",
    courtType: "5 người",
    date: "2025-01-19",
    time: "17:00-19:00",
    price: 350000,
    status: "confirmed",
    pay: "paid",
    bookingDate: "2025-01-18",
    notes: "Đặt sân cho đội bóng nữ"
  },
  {
    id: "BK005",
    customer: "Hoàng Văn Em",
    phone: "0903334444",
    email: "hoangvanem@gmail.com",
    court: "Sân Bóng Đá 7 Người A",
    courtType: "7 người",
    date: "2025-01-20",
    time: "18:30-20:30",
    price: 500000,
    status: "pending",
    pay: "pending",
    bookingDate: "2025-01-19",
    notes: "Đặt sân cho đội bóng trường"
  }
];

export const courtData = [
  { 
    id: 1, 
    name: "Sân Bóng Đá 7 Người A", 
    type: "7 người", 
    capacity: 7, 
    price: 500000, 
    status: "active", 
    description: "Sân bóng đá 7 người chất lượng cao với cỏ nhân tạo",
    amenities: ["Cỏ nhân tạo", "Ánh sáng LED", "Ghế ngồi", "Nhà vệ sinh"],
    images: ["/images/court1-1.jpg", "/images/court1-2.jpg"],
    maintenance: "Không có lịch bảo trì"
  },
  { 
    id: 2, 
    name: "Sân Bóng Đá 7 Người B", 
    type: "7 người", 
    capacity: 7, 
    price: 500000, 
    status: "active", 
    description: "Sân bóng đá 7 người với hệ thống thoát nước tốt",
    amenities: ["Cỏ nhân tạo", "Ánh sáng LED", "Ghế ngồi", "Nhà vệ sinh"],
    images: ["/images/court2-1.jpg", "/images/court2-2.jpg"],
    maintenance: "Không có lịch bảo trì"
  },
  { 
    id: 3, 
    name: "Sân Tennis VIP", 
    type: "Tennis", 
    capacity: 2, 
    price: 800000, 
    status: "active", 
    description: "Sân tennis cao cấp với mặt sân chuyên nghiệp",
    amenities: ["Mặt sân chuyên nghiệp", "Ánh sáng LED", "Ghế ngồi VIP", "Nhà vệ sinh"],
    images: ["/images/tennis1-1.jpg", "/images/tennis1-2.jpg"],
    maintenance: "Không có lịch bảo trì"
  },
  { 
    id: 4, 
    name: "Sân Bóng Đá 5 Người", 
    type: "5 người", 
    capacity: 5, 
    price: 350000, 
    status: "maintenance", 
    description: "Sân bóng đá 5 người phù hợp cho các trận đấu nhỏ",
    amenities: ["Cỏ nhân tạo", "Ánh sáng LED", "Ghế ngồi"],
    images: ["/images/court5-1.jpg", "/images/court5-2.jpg"],
    maintenance: "Bảo trì từ 20/01/2025 đến 25/01/2025"
  }
];

export const reportData = [
  { month: "01", bookings: 45, revenue: 22.5 },
  { month: "02", bookings: 38, revenue: 19.0 },
  { month: "03", bookings: 52, revenue: 26.0 },
  { month: "04", bookings: 41, revenue: 20.5 },
  { month: "05", bookings: 58, revenue: 29.0 },
  { month: "06", bookings: 62, revenue: 31.0 },
];

export const transactionData = [
  {
    id: "TXN001",
    bookingId: "BK001",
    customer: "Nguyễn Văn An",
    court: "Sân Bóng Đá 7 Người A",
    amount: 500000,
    method: "bank_transfer",
    status: "completed",
    transactionId: "TXN001",
    date: "2025-01-15",
    time: "14:30"
  },
  {
    id: "TXN002",
    bookingId: "BK002",
    customer: "Trần Thị Bình",
    court: "Sân Bóng Đá 7 Người B",
    amount: 500000,
    method: "momo",
    status: "pending",
    transactionId: "TXN002",
    date: "2025-01-16",
    time: "09:15"
  },
  {
    id: "TXN003",
    bookingId: "BK003",
    customer: "Lê Văn Cường",
    court: "Sân Tennis VIP",
    amount: 800000,
    method: "bank_transfer",
    status: "refunded",
    transactionId: "TXN003",
    date: "2025-01-17",
    time: "16:45"
  },
  {
    id: "TXN004",
    bookingId: "BK004",
    customer: "Phạm Thị Dung",
    court: "Sân Bóng Đá 5 Người",
    amount: 350000,
    method: "vnpay",
    status: "completed",
    transactionId: "TXN004",
    date: "2025-01-18",
    time: "11:20"
  },
  {
    id: "TXN005",
    bookingId: "BK005",
    customer: "Hoàng Văn Em",
    court: "Sân Bóng Đá 7 Người A",
    amount: 500000,
    method: "momo",
    status: "failed",
    transactionId: "TXN005",
    date: "2025-01-19",
    time: "13:10"
  }
];

export const dailyRevenueData = [
  { date: "2025-01-10", revenue: 2500000, bookings: 5 },
  { date: "2025-01-11", revenue: 3200000, bookings: 6 },
  { date: "2025-01-12", revenue: 1800000, bookings: 3 },
  { date: "2025-01-13", revenue: 4100000, bookings: 7 },
  { date: "2025-01-14", revenue: 2900000, bookings: 5 },
  { date: "2025-01-15", revenue: 3800000, bookings: 6 },
  { date: "2025-01-16", revenue: 4500000, bookings: 8 },
];

export const courtRevenueData = [
  { court: "Sân Bóng Đá 7 Người A", revenue: 15000000, bookings: 30, percentage: 35 },
  { court: "Sân Bóng Đá 7 Người B", revenue: 12000000, bookings: 24, percentage: 28 },
  { court: "Sân Tennis VIP", revenue: 10000000, bookings: 12, percentage: 23 },
  { court: "Sân Bóng Đá 5 Người", revenue: 6000000, bookings: 15, percentage: 14 },
];

export const reviewData = [
  {
    id: "REV001",
    customer: "Nguyễn Văn An",
    court: "Sân Bóng Đá 7 Người A",
    bookingId: "BK001",
    rating: 5,
    comment: "Sân rất đẹp, cỏ nhân tạo chất lượng cao. Nhân viên phục vụ nhiệt tình. Sẽ quay lại!",
    date: "2025-01-16",
    status: "approved",
    isOwnerReplied: true,
    ownerReply: "Cảm ơn bạn đã đánh giá! Chúng tôi sẽ tiếp tục cải thiện dịch vụ.",
    replyDate: "2025-01-16"
  },
  {
    id: "REV002",
    customer: "Trần Thị Bình",
    court: "Sân Bóng Đá 7 Người B",
    bookingId: "BK002",
    rating: 4,
    comment: "Sân tốt, giá cả hợp lý. Chỉ có điều ánh sáng hơi yếu vào buổi tối.",
    date: "2025-01-15",
    status: "approved",
    isOwnerReplied: false,
    ownerReply: "",
    replyDate: ""
  },
  {
    id: "REV003",
    customer: "Lê Văn Cường",
    court: "Sân Tennis VIP",
    bookingId: "BK003",
    rating: 5,
    comment: "Sân tennis tuyệt vời! Mặt sân chuyên nghiệp, ánh sáng tốt. Rất hài lòng!",
    date: "2025-01-14",
    status: "approved",
    isOwnerReplied: true,
    ownerReply: "Cảm ơn bạn! Chúng tôi rất vui khi được phục vụ bạn.",
    replyDate: "2025-01-14"
  },
  {
    id: "REV004",
    customer: "Phạm Thị Dung",
    court: "Sân Bóng Đá 5 Người",
    bookingId: "BK004",
    rating: 3,
    comment: "Sân ổn nhưng cần cải thiện hệ thống thoát nước. Khi mưa sân bị ướt.",
    date: "2025-01-13",
    status: "reported",
    isOwnerReplied: false,
    ownerReply: "",
    replyDate: ""
  },
  {
    id: "REV005",
    customer: "Hoàng Văn Em",
    court: "Sân Bóng Đá 7 Người A",
    bookingId: "BK005",
    rating: 4,
    comment: "Sân đẹp, giá cả hợp lý. Nhân viên thân thiện. Sẽ giới thiệu cho bạn bè.",
    date: "2025-01-12",
    status: "approved",
    isOwnerReplied: false,
    ownerReply: "",
    replyDate: ""
  }
];

export const occupancyData = [
  { court: "Sân Bóng Đá 7 Người A", totalSlots: 16, bookedSlots: 14, occupancyRate: 87.5, performance: "Tốt" },
  { court: "Sân Bóng Đá 7 Người B", totalSlots: 16, bookedSlots: 12, occupancyRate: 75.0, performance: "Tốt" },
  { court: "Sân Tennis VIP", totalSlots: 16, bookedSlots: 8, occupancyRate: 50.0, performance: "Trung bình" },
  { court: "Sân Bóng Đá 5 Người", totalSlots: 16, bookedSlots: 6, occupancyRate: 37.5, performance: "Thấp" },
];

export const peakHoursData = [
  { hour: "06:00-08:00", bookings: 2, revenue: 1000000, type: "Thấp điểm" },
  { hour: "08:00-10:00", bookings: 4, revenue: 2000000, type: "Thấp điểm" },
  { hour: "10:00-12:00", bookings: 6, revenue: 3000000, type: "Trung bình" },
  { hour: "12:00-14:00", bookings: 8, revenue: 4000000, type: "Cao điểm" },
  { hour: "14:00-16:00", bookings: 10, revenue: 5000000, type: "Cao điểm" },
  { hour: "16:00-18:00", bookings: 12, revenue: 6000000, type: "Cao điểm" },
  { hour: "18:00-20:00", bookings: 14, revenue: 7000000, type: "Cao điểm" },
  { hour: "20:00-22:00", bookings: 8, revenue: 4000000, type: "Trung bình" },
];

export const loyalCustomersData = [
  { customer: "Nguyễn Văn An", totalBookings: 15, totalSpent: 7500000, lastBooking: "2025-01-16", loyaltyScore: 95, tier: "VIP" },
  { customer: "Đặng Minh Tuấn", totalBookings: 12, totalSpent: 6000000, lastBooking: "2025-01-14", loyaltyScore: 88, tier: "Gold" },
  { customer: "Lê Hoàng", totalBookings: 8, totalSpent: 6400000, lastBooking: "2025-01-15", loyaltyScore: 82, tier: "Gold" },
  { customer: "Trần Thị Bình", totalBookings: 6, totalSpent: 3600000, lastBooking: "2025-01-13", loyaltyScore: 75, tier: "Silver" },
  { customer: "Võ Thị Hoa", totalBookings: 4, totalSpent: 2000000, lastBooking: "2025-01-12", loyaltyScore: 65, tier: "Silver" },
];

export const cancellationData = [
  { court: "Sân Bóng Đá 7 Người A", totalBookings: 30, cancelled: 2, noShow: 1, cancellationRate: 6.7, noShowRate: 3.3, status: "Tốt" },
  { court: "Sân Bóng Đá 7 Người B", totalBookings: 24, cancelled: 3, noShow: 2, cancellationRate: 12.5, noShowRate: 8.3, status: "Trung bình" },
  { court: "Sân Tennis VIP", totalBookings: 12, cancelled: 1, noShow: 0, cancellationRate: 8.3, noShowRate: 0.0, status: "Tốt" },
  { court: "Sân Bóng Đá 5 Người", totalBookings: 15, cancelled: 4, noShow: 3, cancellationRate: 26.7, noShowRate: 20.0, status: "Cần cải thiện" },
];

export const notificationData = [
  {
    id: "NOTIF001",
    type: "booking",
    title: "Đặt sân mới",
    message: "Khách Nguyễn Văn An vừa đặt sân Bóng Đá 7 Người A lúc 17:00-19:00 ngày 16/01/2025",
    date: "2025-01-16",
    time: "15:30",
    status: "unread",
    priority: "normal"
  },
  {
    id: "NOTIF002",
    type: "payment",
    title: "Thanh toán thành công",
    message: "Khách Trần Thị Bình đã thanh toán thành công cho đặt sân BK002",
    date: "2025-01-16",
    time: "14:20",
    status: "read",
    priority: "normal"
  },
  {
    id: "NOTIF003",
    type: "cancellation",
    title: "Hủy đặt sân",
    message: "Khách Lê Văn Cường đã hủy đặt sân BK003 do thời tiết xấu",
    date: "2025-01-16",
    time: "13:15",
    status: "unread",
    priority: "high"
  },
  {
    id: "NOTIF004",
    type: "review",
    title: "Đánh giá mới",
    message: "Khách Phạm Thị Dung đã để lại đánh giá 3 sao cho sân Bóng Đá 5 Người",
    date: "2025-01-16",
    time: "12:45",
    status: "read",
    priority: "normal"
  },
  {
    id: "NOTIF005",
    type: "maintenance",
    title: "Lịch bảo trì",
    message: "Sân Bóng Đá 5 Người sẽ được bảo trì từ 20/01/2025 đến 25/01/2025",
    date: "2025-01-16",
    time: "10:30",
    status: "read",
    priority: "high"
  }
];

export const staffData = [
  {
    id: "STAFF001",
    name: "Nguyễn Thị Lan",
    email: "nguyenthilan@gmail.com",
    phone: "0901111111",
    position: "Quản lý sân",
    salary: 8000000,
    joinDate: "2024-01-15",
    status: "active",
    permissions: ["manage_courts", "manage_bookings", "view_reports"],
    lastLogin: "2025-01-16 14:30",
    totalHours: 160,
    performance: "Tốt"
  },
  {
    id: "STAFF002",
    name: "Trần Văn Minh",
    email: "tranvanminh@gmail.com",
    phone: "0902222222",
    position: "Nhân viên bảo trì",
    salary: 6000000,
    joinDate: "2024-03-20",
    status: "active",
    permissions: ["manage_courts", "view_reports"],
    lastLogin: "2025-01-16 09:15",
    totalHours: 140,
    performance: "Tốt"
  },
  {
    id: "STAFF003",
    name: "Lê Thị Hoa",
    email: "lethihoa@gmail.com",
    phone: "0903333333",
    position: "Nhân viên thu ngân",
    salary: 7000000,
    joinDate: "2024-02-10",
    status: "inactive",
    permissions: ["manage_bookings", "view_reports"],
    lastLogin: "2025-01-10 17:45",
    totalHours: 120,
    performance: "Trung bình"
  },
  {
    id: "STAFF004",
    name: "Phạm Văn Đức",
    email: "phamvanduc@gmail.com",
    phone: "0904444444",
    position: "Nhân viên vệ sinh",
    salary: 5000000,
    joinDate: "2024-04-05",
    status: "active",
    permissions: ["manage_courts"],
    lastLogin: "2025-01-16 16:20",
    totalHours: 150,
    performance: "Tốt"
  }
];

export const activityLogData = [
  {
    id: "LOG001",
    timestamp: "2025-01-16 15:30:25",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    action: "Xác nhận đặt sân",
    target: "BK001",
    details: "Xác nhận đặt sân cho khách hàng Nguyễn Văn An",
    ip: "192.168.1.100",
    status: "success"
  },
  {
    id: "LOG002",
    timestamp: "2025-01-16 14:20:15",
    user: "Nguyễn Thị Lan",
    userId: "STAFF001",
    action: "Cập nhật thông tin sân",
    target: "Sân Bóng Đá 7 Người A",
    details: "Cập nhật giá thuê sân từ 450,000 VNĐ lên 500,000 VNĐ",
    ip: "192.168.1.101",
    status: "success"
  },
  {
    id: "LOG003",
    timestamp: "2025-01-16 13:15:30",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    action: "Hủy đặt sân",
    target: "BK003",
    details: "Hủy đặt sân do khách hàng yêu cầu",
    ip: "192.168.1.100",
    status: "success"
  },
  {
    id: "LOG004",
    timestamp: "2025-01-16 12:45:20",
    user: "Trần Văn Minh",
    userId: "STAFF002",
    action: "Bảo trì sân",
    target: "Sân Bóng Đá 5 Người",
    details: "Thực hiện bảo trì hệ thống thoát nước",
    ip: "192.168.1.102",
    status: "success"
  },
  {
    id: "LOG005",
    timestamp: "2025-01-16 11:30:45",
    user: "Nguyễn Văn Chủ",
    userId: "OWNER001",
    action: "Thêm nhân viên mới",
    target: "STAFF005",
    details: "Thêm nhân viên mới: Võ Thị Mai",
    ip: "192.168.1.100",
    status: "success"
  }
];
