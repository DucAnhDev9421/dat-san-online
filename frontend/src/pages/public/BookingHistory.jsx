import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, DollarSign, ChevronRight, Search, Filter } from 'lucide-react'

const BookingHistory = () => {
  // Mock data cho bookings
  const [bookings] = useState([
    {
      id: 1,
      venueName: 'Sân bóng đá Thành Công',
      date: '2024-01-15',
      timeSlots: ['18:00-19:00', '19:00-20:00'],
      totalAmount: 700000,
      status: 'confirmed',
      paymentStatus: 'paid'
    },
    {
      id: 2,
      venueName: 'Sân tennis Quận 7',
      date: '2024-01-20',
      timeSlots: ['10:00-11:00'],
      totalAmount: 250000,
      status: 'pending',
      paymentStatus: 'pending'
    },
    {
      id: 3,
      venueName: 'Sân cầu lông Cần Thơ',
      date: '2024-01-10',
      timeSlots: ['14:00-15:00', '15:00-16:00'],
      totalAmount: 600000,
      status: 'completed',
      paymentStatus: 'paid'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: '#10b981', label: 'Đã xác nhận' },
      pending: { color: '#f59e0b', label: 'Chờ xác nhận' },
      completed: { color: '#3b82f6', label: 'Hoàn thành' },
      cancelled: { color: '#ef4444', label: 'Đã hủy' }
    }
    return statusConfig[status] || statusConfig.confirmed
  }

  const getPaymentBadge = (paymentStatus) => {
    const paymentConfig = {
      paid: { color: '#10b981', label: 'Đã thanh toán' },
      pending: { color: '#f59e0b', label: 'Chưa thanh toán' },
      refunded: { color: '#3b82f6', label: 'Đã hoàn tiền' }
    }
    return paymentConfig[paymentStatus] || paymentConfig.pending
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.venueName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="booking-history-page" style={{ padding: '24px 0 48px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#1f2937' }}>
            Lịch đặt sân
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Quản lý và theo dõi các đặt sân của bạn
          </p>
        </div>

        {/* Search and Filter */}
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader style={{ paddingBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <Search size={16} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'confirmed', 'pending', 'completed'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    style={{
                      background: statusFilter === filter 
                        ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                        : 'white',
                      color: statusFilter === filter ? 'white' : '#6b7280',
                      border: statusFilter === filter ? 'none' : '1px solid #e5e7eb',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: statusFilter === filter 
                        ? '0 2px 8px rgba(59, 130, 246, 0.3)' 
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (statusFilter !== filter) {
                        e.target.style.borderColor = '#3b82f6'
                        e.target.style.color = '#3b82f6'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (statusFilter !== filter) {
                        e.target.style.borderColor = '#e5e7eb'
                        e.target.style.color = '#6b7280'
                      }
                    }}
                  >
                    {filter === 'all' ? 'Tất cả' : 
                     filter === 'confirmed' ? 'Đã xác nhận' :
                     filter === 'pending' ? 'Chờ xác nhận' :
                     filter === 'completed' ? 'Hoàn thành' : filter}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map(booking => {
              const statusConfig = getStatusBadge(booking.status)
              const paymentConfig = getPaymentBadge(booking.paymentStatus)
              
              return (
                <Card key={booking.id} style={{ 
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  background: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = '#3b82f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}>
                  <CardContent style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                            {booking.venueName}
                          </h3>
                          <div style={{
                            background: statusConfig.color,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}>
                            {statusConfig.label}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <Calendar size={16} />
                            <span>Ngày: {booking.date}</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <Clock size={16} />
                            <span>Khung giờ: {booking.timeSlots.join(', ')}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <DollarSign size={16} />
                            <span>Tổng tiền: {booking.totalAmount.toLocaleString('vi-VN')} đ</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <MapPin size={16} />
                            <span>Địa điểm: {booking.venueName.includes('Quận 7') ? 'Quận 7, TP.HCM' : 'Cần Thơ'}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                        <div style={{
                          background: paymentConfig.color,
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap'
                        }}>
                          {paymentConfig.label}
                        </div>
                        <button
                          onClick={() => alert('Chi tiết đặt sân')}
                          style={{
                            padding: '8px 16px',
                            background: 'white',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#3b82f6'
                            e.target.style.color = '#3b82f6'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e5e7eb'
                            e.target.style.color = '#374151'
                          }}
                        >
                          Chi tiết <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                Chưa có lịch đặt sân
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                Bạn chưa có lịch đặt sân nào. Đặt sân ngay để bắt đầu!
              </p>
              <button
                onClick={() => window.location.href = '/facilities'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Đặt sân ngay
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default BookingHistory

