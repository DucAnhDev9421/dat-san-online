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
      // Parse slot key: format is "YYYY-MM-DD-HH:MM"
      const parts = slotKey.split('-')
      const actualTime = parts[3] // Get "HH:MM"
      const slot = timeSlots.find(s => s.time === actualTime)
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
        
        {/* Time Slots Detail */}
        {selectedSlots.length > 0 && (
          <div style={{ margin: '8px 0' }}>
            <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>
              Khung giờ
            </div>
            {selectedSlots.map((slot, index) => {
              // Parse slot key: format is "YYYY-MM-DD-HH:MM"
              const parts = slot.split('-')
              const time = `${parts[2]}-${parts[3]}` // Get "DD-HH:MM"
              const actualTime = parts[3] // Get "HH:MM"
              
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
              const slotData = timeSlots.find(s => s.time === actualTime)
              const nextHour = actualTime === '22:00' ? '23:00' : 
                              actualTime === '21:00' ? '22:00' :
                              actualTime === '20:00' ? '21:00' :
                              actualTime === '19:00' ? '20:00' :
                              actualTime === '18:00' ? '19:00' :
                              actualTime === '17:00' ? '18:00' :
                              actualTime === '16:00' ? '17:00' :
                              actualTime === '15:00' ? '16:00' :
                              actualTime === '14:00' ? '15:00' :
                              actualTime === '13:00' ? '14:00' :
                              actualTime === '12:00' ? '13:00' :
                              actualTime === '11:00' ? '12:00' :
                              actualTime === '10:00' ? '11:00' :
                              actualTime === '09:00' ? '10:00' :
                              actualTime === '08:00' ? '09:00' :
                              actualTime === '07:00' ? '08:00' :
                              actualTime === '06:00' ? '07:00' : '07:00'
              
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '4px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span>{actualTime} - {nextHour}</span>
                  <span style={{ fontWeight: '500' }}>
                    {slotData?.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )
            })}
            <div style={{ 
              height: '1px', 
              background: '#e5e7eb', 
              margin: '8px 0' 
            }}></div>
          </div>
        )}
        
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
