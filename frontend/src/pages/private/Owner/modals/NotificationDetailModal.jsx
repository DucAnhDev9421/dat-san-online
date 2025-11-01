import React, { useState } from 'react';
import { X, Calendar, Clock, User, Hash, DollarSign, Tag, Info } from 'lucide-react'; 

// Định nghĩa bảng màu cơ bản (Giữ nguyên)
const PRIMARY_COLOR = '#3b82f6'; 
const UNREAD_COLOR = '#f59e0b'; 
const TEXT_COLOR = '#1f2937';
const MUTED_TEXT_COLOR = '#6b7280';
const BG_HEADER = '#eef2ff'; 
const SUCCESS_COLOR = '#059669'; 
const DANGER_COLOR = '#ef4444'; 

const badgeStyle = (bg, color) => ({
  background: bg,
  color,
  padding: '5px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  textTransform: 'capitalize',
});

// Component cho từng chi tiết (Detail Block)
const DetailBlock = ({ icon: Icon, label, value, valueColor = TEXT_COLOR, iconColor = PRIMARY_COLOR }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, /* Giảm gap */ padding: '6px 0', /* Giảm padding */ borderBottom: '1px dashed #f3f4f6' }}>
        <div style={{ fontSize: 11, color: MUTED_TEXT_COLOR, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}> {/* Giảm font size */}
            {Icon && <Icon size={12} color={iconColor} />} {/* Giảm size icon */}
            {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: valueColor, minHeight: 20 }}> {/* Giảm font size */}
            {value || 'N/A'}
        </div>
    </div>
);


// Hàm giả định để trích xuất thông tin
const extractBookingDetails = (notification) => {
    // Regex cơ bản để trích xuất thông tin đặt sân
    const match = notification.message.match(/Khách\s+(.+?)\s+vừa đặt sân\s+(.+?)\s+lúc\s+(.+?)\s+ngày\s+(.+)/);

    // Regex để trích xuất đánh giá sao
    const ratingMatch = notification.message.match(/đánh giá\s+(\d+)\s*sao/);
    
    // Khởi tạo chi tiết cơ bản
    let details = {
        customerName: match ? match[1].trim() : 'N/A',
        courtName: match ? match[2].trim() : 'N/A',
        timeRange: match ? match[3].trim() : notification.time,
        date: match ? match[4].trim() : notification.date,
        price: null,
        bookingStatus: 'N/A', // Mặc định là N/A
        bookingId: notification.bookingId || 'N/A',
        rating: ratingMatch ? `${ratingMatch[1]} sao` : 'N/A',
        // Thêm trường mô tả chi tiết cho các loại thông báo khác
        statusDetail: notification.message, 
    };

    // LOGIC GÁN TRẠNG THÁI BOOKING/CHI TIẾT TÙY THEO LOẠI THÔNG BÁO
    switch (notification.type) {
        case 'booking':
            details.bookingStatus = 'Đã đặt sân';
            details.statusDetail = `Đặt sân: ${details.courtName}, ${details.timeRange} ngày ${details.date}`;
            break;
        case 'payment':
            details.bookingStatus = 'Đã thanh toán';
            details.statusDetail = `Giao dịch thanh toán thành công cho Mã ${details.bookingId}`;
            break;
        case 'cancellation':
            details.customerName = notification.message.match(/Khách\s+(.+?)\s+đã hủy đặt sân/)?.[1] || 'Khách hàng';
            details.bookingStatus = 'Đã hủy'; // Trạng thái là "Đã hủy"
            details.statusDetail = notification.message;
            break;
        case 'review':
            details.bookingStatus = 'Đã đánh giá'; // Trạng thái là "Đã đánh giá"
            details.statusDetail = `Đánh giá ${details.rating} cho sân ${details.courtName || 'Chưa rõ'}`;
            details.courtName = notification.message.match(/sân\s+(.+)/)?.[1] || 'N/A';
            break;
        case 'maintenance':
            details.bookingStatus = 'Lịch bảo trì'; // Trạng thái là "Bảo trì"
            details.statusDetail = notification.message;
            break;
        default:
            details.bookingStatus = 'Khác';
            break;
    }

    return details;
};


const NotificationDetailModal = ({ isOpen, onClose, notification = {} }) => {
  const [hoverClose, setHoverClose] = useState(false);

  if (!isOpen) return null;

  const isUnread = notification.status === 'unread';
  const displayTitle = notification.title === 'Đặt sân mới' 
                        ? 'Xác nhận Đặt sân' 
                        : notification.title;
  
  const bookingInfo = extractBookingDetails(notification);

  const statusBadge = isUnread
    ? badgeStyle('#fef3c7', UNREAD_COLOR) 
    : badgeStyle('#e6f9f0', SUCCESS_COLOR); 

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ 
            width: '100%', 
            maxWidth: 550, 
            background: '#fff', 
            borderRadius: 12, 
            overflow: 'hidden', 
            boxShadow: '0 10px 40px rgba(2,6,23,0.2)' 
        }}
      >
        {/* Header nổi bật */}
        <div 
            style={{ 
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: BG_HEADER, 
            }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Calendar size={20} style={{marginRight: 8, color: PRIMARY_COLOR}}/>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: TEXT_COLOR }}>
                {displayTitle}
            </h2>
          </div>
          <div style={statusBadge}>
            <Info size={11}/> {notification.status === 'unread' ? 'Đã đọc' : 'Đã đọc'}
          </div>
        </div>

        {/* Body - Chia thành các khối Card */}
        <div style={{ padding: 15, display: 'flex', flexDirection: 'column', gap: 10, background: '#fcfcfc' }}>
            
            {/* 1. Khối Khách hàng và Giao dịch */}
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #eef2ff' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: PRIMARY_COLOR, marginBottom: 6, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 }}>
                    <User size={14} style={{marginRight: 6}}/> Thông tin Khách hàng & Giao dịch
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px 10px' }}>
                    <DetailBlock 
                        icon={User} 
                        label="Khách hàng" 
                        value={bookingInfo.customerName} 
                        iconColor={TEXT_COLOR}
                    />
                    <DetailBlock 
                        icon={Hash} 
                        label="Mã đặt sân (ID)" 
                        value={notification.bookingId || notification.id} 
                        iconColor={TEXT_COLOR}
                    />
                    <DetailBlock 
                        icon={Tag} 
                        label="Loại thông báo" 
                        value={notification.type || 'N/A'} 
                        valueColor={PRIMARY_COLOR}
                        iconColor={TEXT_COLOR}
                    />
                </div>
            </div>

            {/* 2. Khối Chi tiết Đặt sân */}
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #eef2ff' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: PRIMARY_COLOR, marginBottom: 6, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 }}>
                    <Calendar size={14} style={{marginRight: 6}}/> Chi tiết Đặt sân
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 10px' }}>
                    <DetailBlock 
                        icon={Tag} 
                        label="Sân đặt" 
                        value={bookingInfo.courtName} 
                        iconColor={TEXT_COLOR}
                    />
                    <DetailBlock 
                        icon={Calendar} 
                        label="Ngày chơi" 
                        value={bookingInfo.date} 
                        iconColor={TEXT_COLOR}
                    />
                    <DetailBlock 
                        icon={Clock} 
                        label="Khung giờ chơi" 
                        value={bookingInfo.timeRange} 
                        iconColor={TEXT_COLOR}
                    />
                    <DetailBlock 
                        icon={DollarSign} 
                        label="Giá trị (Giả định)" 
                        value={bookingInfo.price ? `${bookingInfo.price.toLocaleString('vi-VN')} đ` : 'Chưa rõ'} 
                        valueColor={bookingInfo.price ? SUCCESS_COLOR : MUTED_TEXT_COLOR}
                        iconColor={TEXT_COLOR}
                    />
                    <DetailBlock 
                        icon={Info} 
                        label="Trạng thái Booking" 
                        value={bookingInfo.bookingStatus} 
                        valueColor={bookingInfo.bookingStatus === 'Đã hủy' ? DANGER_COLOR : SUCCESS_COLOR}
                        iconColor={TEXT_COLOR}
                    />
                     {/* Item trống để giữ bố cục 2 cột */}
                    <div></div>
                </div>
            </div>
            
            {/* 3. Nội dung Message gốc và Thời điểm đặt (Full Width) */}
            <div style={{ marginTop: 0 }}>
                <div style={{ fontSize: 11, color: MUTED_TEXT_COLOR, fontWeight: 600, marginBottom: 4 }}>Nội dung thông báo (Message gốc)</div>
                <div style={{ fontSize: 13, color: TEXT_COLOR, padding: 8, background: '#fff', borderRadius: 4, border: '1px solid #e5e7eb', lineHeight: 1.5 }}> 
                    {notification.message}
                </div>
            </div>
             
             {/* Thời điểm đặt (Giờ/Ngày hệ thống ghi nhận) */}
             <div style={{ fontSize: 11, color: MUTED_TEXT_COLOR, display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 5 }}>
                <div style={badgeStyle('#f3f4f6', MUTED_TEXT_COLOR)}>
                    <Clock size={10}/> Giờ hệ thống: {notification.time || 'N/A'}
                </div>
                <div style={badgeStyle('#f3f4f6', MUTED_TEXT_COLOR)}>
                    <Calendar size={10}/> Ngày hệ thống: {notification.date || 'N/A'}
                </div>
             </div>


        </div>

        {/* Footer / Actions */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{
              padding: '7px 14px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              background: hoverClose ? '#f8fafc' : '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'background 150ms ease, transform 120ms ease',
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;