import React from 'react'

export default function BookingFooter({ selectedSlots, venuePrice, onBookNow }) {
  const calculateTotal = () => {
    return selectedSlots.length * parseInt(venuePrice.replace(/[^\d]/g, ''))
  }

  return (
    <div style={{
      background: '#ecfdf5',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      borderTop: '1px solid #d1fae5',
      zIndex: 1000,
      gap: '16px'
    }}>
      <span style={{ fontSize: '16px', color: '#059669', fontWeight: '500' }}>
        {selectedSlots.length > 0 
          ? `Đã chọn ${selectedSlots.length} khung giờ - Tổng ${calculateTotal().toLocaleString('vi-VN')} VNĐ` 
          : 'Vui lòng chọn sân và giờ'
        }
      </span>
      
      {selectedSlots.length > 0 && (
        <button
          onClick={onBookNow}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Đặt sân
        </button>
      )}
    </div>
  )
}

