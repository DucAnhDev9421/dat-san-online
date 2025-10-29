import React, { useState } from 'react'
import { formatDate } from '../utils/dateHelpers'
import { Calendar, Clock, DollarSign, CheckCircle, Tag, MapPin, Grid3x3 } from 'lucide-react'

export default function BookingSummary({ selectedDate, selectedSlots, selectedCourt, selectedFieldType, onBookNow }) {
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  // Calculate total amount based on selected slots
  const calculateTotal = () => {
    const timeSlots = [
      { time: '06:00', price: 150000 }, { time: '07:00', price: 180000 },
      { time: '08:00', price: 200000 }, { time: '09:00', price: 200000 },
      { time: '10:00', price: 200000 }, { time: '11:00', price: 200000 },
      { time: '12:00', price: 200000 }, { time: '13:00', price: 200000 },
      { time: '14:00', price: 200000 }, { time: '15:00', price: 200000 },
      { time: '16:00', price: 200000 }, { time: '17:00', price: 220000 },
      { time: '18:00', price: 250000 }, { time: '19:00', price: 250000 },
      { time: '20:00', price: 220000 }, { time: '21:00', price: 200000 },
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

  // Handle promo code apply
  const handleApplyPromo = () => {
    const promotions = {
      'CUOITUAN50': 0.5, // 50% off
      'SOM30': 0.3, // 30% off
      'TANG1H': 0.33, // ~33% off (1 free hour)
      'VIP20': 0.2 // 20% off
    }

    const promoDiscount = promotions[promoCode.toUpperCase()]
    if (promoDiscount) {
      setDiscount(promoDiscount)
      setPromoApplied(true)
    } else {
      alert('Mã khuyến mãi không hợp lệ')
    }
  }

  // Calculate final total with discount
  const finalTotal = () => {
    const total = calculateTotal()
    return Math.round(total * (1 - discount))
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
            <MapPin size={16} style={{ color: '#6b7280' }} />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Sân:</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {selectedCourt}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Grid3x3 size={16} style={{ color: '#6b7280' }} />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Loại sân:</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {selectedFieldType}
          </span>
        </div>
        
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
                { time: '06:00', price: 150000 }, { time: '07:00', price: 180000 },
                { time: '08:00', price: 200000 }, { time: '09:00', price: 200000 },
                { time: '10:00', price: 200000 }, { time: '11:00', price: 200000 },
                { time: '12:00', price: 200000 }, { time: '13:00', price: 200000 },
                { time: '14:00', price: 200000 }, { time: '15:00', price: 200000 },
                { time: '16:00', price: 200000 }, { time: '17:00', price: 220000 },
                { time: '18:00', price: 250000 }, { time: '19:00', price: 250000 },
                { time: '20:00', price: 220000 }, { time: '21:00', price: 200000 },
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

        {/* Promo Code Section */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={14} style={{ color: '#6b7280' }} />
            Mã khuyến mãi
          </div>
          <div className="promo-code-container" style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="promo-code-input"
              style={{
                flex: '1 1 auto',
                minWidth: '120px',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: promoApplied ? '#f3f4f6' : '#fff',
                transition: 'all 0.2s'
              }}
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode}
              className="promo-code-button"
              style={{
                flex: '0 0 auto',
                padding: '10px 16px',
                background: promoApplied || !promoCode ? '#d1d5db' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: promoApplied || !promoCode ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {promoApplied ? 'Đã áp dụng' : 'Áp dụng'}
            </button>
          </div>
          {promoApplied && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} />
              Giảm {Math.round(discount * 100)}%
            </div>
          )}
        </div>

        <div style={{ 
          height: '1px', 
          background: '#e5e7eb', 
          margin: '12px 0' 
        }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Tạm tính:</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {calculateTotal().toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
        
        {promoApplied && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#059669' }}>Giảm giá:</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#059669' }}>
              -{(calculateTotal() * discount).toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} style={{ color: '#1f2937' }} />
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Tổng cộng:</span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
            {finalTotal().toLocaleString('vi-VN')} VNĐ
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

      <style>{`
        /* Responsive styles for promo code section */
        @media (max-width: 640px) {
          .promo-code-container {
            gap: 6px;
          }
          
          .promo-code-input {
            min-width: 100px !important;
            flex: 1 1 0 !important;
            padding: 8px 10px !important;
            font-size: 13px !important;
          }
          
          .promo-code-button {
            padding: 8px 12px !important;
            font-size: 13px !important;
            flex-shrink: 0;
          }
        }
        
        @media (max-width: 480px) {
          .promo-code-input {
            min-width: 80px !important;
            padding: 8px !important;
            font-size: 12px !important;
          }
          
          .promo-code-button {
            padding: 8px !important;
            font-size: 12px !important;
          }
        }
        
        @media (max-width: 360px) {
          .promo-code-input {
            min-width: 60px !important;
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
          
          .promo-code-button {
            padding: 6px 8px !important;
            font-size: 11px !important;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}
