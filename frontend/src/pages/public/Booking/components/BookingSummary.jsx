import React, { useState } from 'react'
import useDeviceType from '../../../../hook/use-device-type'
import useMobile from '../../../../hook/use-mobile'
import { formatDate } from '../utils/dateHelpers'
import { Calendar, Clock, DollarSign, CheckCircle, Tag, MapPin, Grid3x3 } from 'lucide-react'

export default function BookingSummary({ selectedDate, selectedSlots, selectedCourt, selectedFieldType, courts, timeSlotsData, onBookNow }) {
  const { isMobile, isTablet } = useDeviceType()
  const isSmallMobile = useMobile(480)
  const isVerySmallMobile = useMobile(360)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  // Get selected court data
  const selectedCourtData = courts?.find(c => (c.id || c._id) === selectedCourt)
  const courtPrice = selectedCourtData?.price || 0

  // Calculate total amount based on selected slots
  // Use actual price from court or timeSlotsData
  const calculateTotal = () => {
    if (!selectedSlots.length) return 0

    // If we have timeSlotsData with prices, use that
    if (timeSlotsData && timeSlotsData.length > 0) {
      return selectedSlots.reduce((total, slotKey) => {
        // Parse slot key: format is "YYYY-MM-DD-HH:MM"
        const parts = slotKey.split('-')
        const actualTime = parts[3] // Get "HH:MM"
        const slot = timeSlotsData.find(s => s.time === actualTime)
        return total + (slot?.price || courtPrice || 0)
      }, 0)
    }

    // Fallback: use court price * number of slots (each slot is 1 hour)
    return courtPrice * selectedSlots.length
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
      padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: isMobile ? '16px' : isTablet ? '17px' : '18px', 
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
            {courts && selectedCourt 
              ? (courts.find(c => (c.id || c._id) === selectedCourt)?.name || 'Chưa chọn sân')
              : 'Chưa chọn sân'}
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
              const actualTime = parts[3] // Get "HH:MM"
              
              // Get slot data from timeSlotsData or use court price
              let slotPrice = courtPrice
              let endTime = ''
              
              if (timeSlotsData && timeSlotsData.length > 0) {
                const slotData = timeSlotsData.find(s => s.time === actualTime)
                if (slotData) {
                  slotPrice = slotData.price || courtPrice
                  endTime = slotData.endTime || ''
                } else {
                  // Calculate end time if not available
                  const [hours, minutes] = actualTime.split(':').map(Number)
                  const nextHour = (hours + 1) % 24
                  endTime = `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
                }
              } else {
                // Fallback: calculate end time
                const [hours, minutes] = actualTime.split(':').map(Number)
                const nextHour = (hours + 1) % 24
                endTime = `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
              }
              
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '4px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span>{actualTime} - {endTime}</span>
                  <span style={{ fontWeight: '500' }}>
                    {slotPrice.toLocaleString('vi-VN')} đ
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
          <div className="promo-code-container" style={{ 
            display: 'flex', 
            gap: isMobile ? '6px' : '8px' 
          }}>
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="promo-code-input"
              style={{
                flex: '1 1 auto',
                minWidth: isVerySmallMobile ? '60px' : isSmallMobile ? '80px' : isMobile ? '100px' : '120px',
                padding: isVerySmallMobile ? '6px 8px' : isSmallMobile ? '8px' : isMobile ? '8px 10px' : '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: isVerySmallMobile ? '11px' : isSmallMobile ? '12px' : isMobile ? '13px' : '14px',
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
                padding: isVerySmallMobile ? '6px 8px' : isSmallMobile ? '8px' : isMobile ? '8px 12px' : '10px 16px',
                background: promoApplied || !promoCode ? '#d1d5db' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: isVerySmallMobile ? '11px' : isSmallMobile ? '12px' : isMobile ? '13px' : '14px',
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
      {/* Check if all required fields are selected: field type, court, and time slots */}
      {(() => {
        const isComplete = selectedFieldType && selectedCourt && selectedSlots.length > 0
        return (
          <button
            onClick={onBookNow}
            disabled={!isComplete}
            style={{
              width: '100%',
              background: isComplete ? '#374151' : '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isComplete ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (isComplete) {
                e.target.style.background = '#1f2937'
              }
            }}
            onMouseLeave={(e) => {
              if (isComplete) {
                e.target.style.background = '#374151'
              }
            }}
            title={!isComplete ? 'Vui lòng chọn đầy đủ: loại sân, sân và khung giờ' : ''}
          >
            <CheckCircle size={16} />
            Xác nhận đặt sân
          </button>
        )
      })()}

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

      {/* CSS media queries đã được thay thế bằng useMobile hook */}
    </div>
  )
}
