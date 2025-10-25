import React from 'react'
import { mockBookingHistory } from '../mockData'

export default function BookingsTab() {
  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-completed',
      upcoming: 'status-upcoming',
      cancelled: 'status-cancelled'
    }
    const statusText = {
      completed: 'Hoàn thành',
      upcoming: 'Sắp tới',
      cancelled: 'Đã hủy'
    }
    return <span className={`status-badge ${statusClasses[status]}`}>{statusText[status]}</span>
  }

  return (
    <div className="bookings-section">
      <div className="section-header">
        <h3>Lịch sử đặt sân</h3>
        <span className="total-bookings">Tổng cộng: {mockBookingHistory.length} lần đặt</span>
      </div>
      
      <div className="bookings-list">
        {mockBookingHistory.map(booking => (
          <div key={booking.id} className="booking-card">
            <div className="booking-info">
              <h4>{booking.venue}</h4>
              <p className="booking-sport">{booking.sport}</p>
              <p className="booking-datetime">
                {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
              </p>
              <p className="booking-price">{booking.price}</p>
            </div>
            <div className="booking-actions">
              {getStatusBadge(booking.status)}
              {booking.status === 'upcoming' && (
                <button className="btn btn-outline small">Hủy đặt</button>
              )}
              <button className="btn btn-outline small">Chi tiết</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

