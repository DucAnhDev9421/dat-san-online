import React, { useState, useRef } from 'react'
import { mockBookingHistory } from '../mockData'
import Dialog from '../../../../components/ui/Dialog'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

export default function BookingsTab() {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const ticketRef = useRef(null)

  const cancelReasons = [
    { value: 'change_of_plan', label: 'Thay đổi kế hoạch' },
    { value: 'wrong_booking', label: 'Đặt nhầm thông tin' },
    { value: 'weather', label: 'Thời tiết không thuận lợi' },
    { value: 'other', label: 'Lý do khác' }
  ]

  const getPaymentIconSrc = (method) => {
    const normalized = (method || '').toLowerCase()
    if (normalized.includes('momo')) return '/MoMo_Logo.png'
    if (normalized.includes('vnpay')) return '/Vnpay.jpg'
    return ''
  }

  const openCancelModal = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
    setCancelReason('')
    setOtherReason('')
  }

  const openDetailModal = (booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleConfirmCancel = () => {
    const finalReason = cancelReason === 'other' ? otherReason.trim() : cancelReason
    if (!finalReason) return
    // TODO: Integrate API to cancel booking, e.g. cancelBooking(selectedBooking.id, finalReason)
    setShowCancelModal(false)
  }

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || !selectedBooking) return

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      })

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `ve-dat-san-${selectedBooking.id}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch (error) {
      console.error('Error generating ticket:', error)
      alert('Có lỗi xảy ra khi tải vé. Vui lòng thử lại.')
    }
  }

  const generateQRCodeValue = (booking) => {
    // Generate QR code with booking information
    return JSON.stringify({
      id: booking.id,
      venue: booking.venue,
      date: booking.date,
      time: booking.time,
      sport: booking.sport
    })
  }
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
          <div key={booking.id} className="booking-card" style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
            {/* Thumbnail */}
            <div style={{ width: '120px', minWidth: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6' }}>
              {booking.imageUrl ? (
                <img src={booking.imageUrl} alt={booking.venue} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px' }}>No image</div>
              )}
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: '12px' }}>
              <div className="booking-info">
                <h4>{booking.venue}</h4>
                <p className="booking-sport">{booking.sport}</p>
                <p className="booking-datetime">
                  {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
                </p>
                {booking.location && (
                  <p className="booking-location" style={{ color: '#6b7280' }}>{booking.location}</p>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span className="booking-price" style={{ fontWeight: 600 }}>{booking.price}</span>
                  {booking.paymentMethod && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', background: '#eef2ff', color: '#4338ca', borderRadius: '999px' }}>
                      {getPaymentIconSrc(booking.paymentMethod) ? (
                        <img src={getPaymentIconSrc(booking.paymentMethod)} alt={booking.paymentMethod}
                          style={{ width: '16px', height: '16px', objectFit: 'contain', borderRadius: '3px' }} />
                      ) : (
                        <span role="img" aria-label="cash">💵</span>
                      )}
                      <span style={{ fontSize: '12px' }}>{booking.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="booking-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: '160px' }}>
                <div>
                  {getStatusBadge(booking.status)}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline small" onClick={() => openDetailModal(booking)}>Chi tiết</button>
                  {booking.status === 'upcoming' && (
                    <button className="btn btn-outline small" onClick={() => openCancelModal(booking)}>Hủy đặt</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Booking Modal */}
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Hủy đặt sân"
        description={selectedBooking ? `${selectedBooking.venue} - ${new Date(selectedBooking.date).toLocaleDateString('vi-VN')} ${selectedBooking.time}` : ''}
        maxWidth="520px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Chọn lý do hủy</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {cancelReasons.map(r => (
                <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r.value}
                    checked={cancelReason === r.value}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {cancelReason === 'other' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Mô tả lý do</div>
              <textarea
                rows={3}
                placeholder="Nhập lý do hủy..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>
          )}

          <p style={{ margin: 0, color: '#6b7280' }}>Hành động này không thể hoàn tác.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button className="btn btn-outline" onClick={() => setShowCancelModal(false)}>Đóng</button>
            <button
              className="btn"
              onClick={handleConfirmCancel}
              disabled={
                !cancelReason || (cancelReason === 'other' && otherReason.trim().length === 0)
              }
              style={{ opacity: !cancelReason || (cancelReason === 'other' && otherReason.trim().length === 0) ? 0.6 : 1 }}
            >
              Xác nhận hủy
            </button>
          </div>
        </div>
      </Dialog>

      {/* Booking Detail Modal */}
      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết đặt sân"
        description="Thông tin chi tiết về lần đặt"
        maxWidth="560px"
      >
        {selectedBooking && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Image preview full width */}
            {selectedBooking.imageUrl && (
              <div style={{ gridColumn: '1 / -1', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={selectedBooking.imageUrl} alt={selectedBooking.venue} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              </div>
            )}

            <div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Sân</div>
              <div style={{ fontWeight: 600 }}>{selectedBooking.venue}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Môn</div>
              <div>{selectedBooking.sport}</div>
            </div>
            {selectedBooking.location && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Vị trí</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{selectedBooking.location}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBooking.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ef4444', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Xem bản đồ
                  </a>
                </div>
              </div>
            )}
            <div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Ngày</div>
              <div>{new Date(selectedBooking.date).toLocaleDateString('vi-VN')}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Giờ</div>
              <div>{selectedBooking.time}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Trạng thái</div>
              <div>{selectedBooking.status === 'upcoming' ? 'Sắp tới' : selectedBooking.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>Giá</div>
              <div>{selectedBooking.price}</div>
            </div>
            {selectedBooking.paymentMethod && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>Phương thức thanh toán</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {getPaymentIconSrc(selectedBooking.paymentMethod) ? (
                    <img src={getPaymentIconSrc(selectedBooking.paymentMethod)} alt={selectedBooking.paymentMethod}
                      style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '4px' }} />
                  ) : (
                    <span role="img" aria-label="cash">💵</span>
                  )}
                  <span>{selectedBooking.paymentMethod}</span>
                </div>
              </div>
            )}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button 
                className="btn btn-outline" 
                onClick={handleDownloadTicket}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={16} />
                Lưu vé
              </button>
              <button className="btn btn-outline" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Ticket Template (Hidden, used for download) */}
      {selectedBooking && (
        <div
          ref={ticketRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '600px',
            background: '#ffffff',
            padding: '32px',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <div style={{ border: '2px solid #1f2937', borderRadius: '12px', padding: '24px', background: '#ffffff' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>VÉ ĐẶT SÂN</h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Booking Sport</p>
            </div>

            {/* Main Content */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              {/* Left - Booking Info */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tên sân</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{selectedBooking.venue}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Môn thể thao</div>
                  <div style={{ fontSize: '16px', color: '#1f2937' }}>{selectedBooking.sport}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Ngày & Giờ</div>
                  <div style={{ fontSize: '16px', color: '#1f2937' }}>
                    {new Date(selectedBooking.date).toLocaleDateString('vi-VN')} - {selectedBooking.time}
                  </div>
                </div>
                {selectedBooking.location && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Địa chỉ</div>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>{selectedBooking.location}</div>
                  </div>
                )}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Giá</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>{selectedBooking.price}</div>
                </div>
                {selectedBooking.paymentMethod && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Phương thức thanh toán</div>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>{selectedBooking.paymentMethod}</div>
                  </div>
                )}
              </div>

              {/* Right - QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ 
                  background: '#ffffff', 
                  padding: '16px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <QRCodeSVG
                    value={generateQRCodeValue(selectedBooking)}
                    size={150}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                  Mã đặt sân: #{selectedBooking.id}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '16px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                Vui lòng mang theo vé này khi đến sân
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                Trạng thái: {selectedBooking.status === 'upcoming' ? 'Sắp tới' : selectedBooking.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

