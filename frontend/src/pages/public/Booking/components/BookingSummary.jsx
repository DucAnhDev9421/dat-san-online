import React from 'react'
import { formatDate } from '../utils/dateHelpers'
import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react'

export default function BookingSummary({ selectedDate, selectedSlots, onBookNow }) {
  // Calculate total amount based on selected slots
  const calculateTotal = () => {
    const timeSlots = [
      { time: '06:00', price: 200000 }, { time: '07:00', price: 200000 },
      { time: '08:00', price: 200000 }, { time: '09:00', price: 250000 },
      { time: '10:00', price: 250000 }, { time: '11:00', price: 250000 },
      { time: '12:00', price: 250000 }, { time: '13:00', price: 250000 },
      { time: '14:00', price: 300000 }, { time: '15:00', price: 300000 },
      { time: '16:00', price: 300000 }, { time: '17:00', price: 350000 },
      { time: '18:00', price: 350000 }, { time: '19:00', price: 350000 },
      { time: '20:00', price: 350000 }, { time: '21:00', price: 300000 },
      { time: '22:00', price: 180000 }
    ]
    
    return selectedSlots.reduce((total, slotKey) => {
      const time = slotKey.split('-')[2] // Get time from key
      const slot = timeSlots.find(s => s.time === time)
      return total + (slot?.price || 0)
    }, 0)
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#1f2937' 
      }}>
        Tóm tắt đặt sân
      </h3>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: '#6b7280' }} />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Ngày đặt:</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {formatDate(selectedDate)}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: '#6b7280' }} />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Khung giờ:</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {selectedSlots.length > 0 ? `${selectedSlots.length} tiếng` : 'Chưa chọn khung giờ'}
          </span>
        </div>
        
        <div style={{ 
          height: '1px', 
          background: '#e5e7eb', 
          margin: '8px 0' 
        }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} style={{ color: '#1f2937' }} />
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Tổng cộng:</span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
            {calculateTotal().toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      </div>

      {/* Book Now Button */}
      <button
        onClick={onBookNow}
        disabled={selectedSlots.length === 0}
        style={{
          width: '100%',
          background: selectedSlots.length > 0 ? '#374151' : '#9ca3af',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: selectedSlots.length > 0 ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (selectedSlots.length > 0) {
            e.target.style.background = '#1f2937'
          }
        }}
        onMouseLeave={(e) => {
          if (selectedSlots.length > 0) {
            e.target.style.background = '#374151'
          }
        }}
      >
        <CheckCircle size={16} />
        Xác nhận đặt sân
      </button>

      {/* Terms */}
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center',
        margin: '12px 0 0 0',
        lineHeight: '1.4'
      }}>
        Bằng việc đặt sân, bạn đồng ý với điều khoản sử dụng của chúng tôi
      </p>
    </div>
  )
}
