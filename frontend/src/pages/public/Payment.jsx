import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  FiSmartphone, 
  FiCreditCard, 
  FiDollarSign, 
  FiShield, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiCheck,
  FiX,
  FiArrowRight,
  FiInfo,
  FiAlertTriangle,
  FiActivity
} from 'react-icons/fi'
import '../../styles/Payment.css'

function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMethod, setSelectedMethod] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get booking data from navigation state, fallback to mock data
  const rawBookingData = location.state?.bookingData || {
    venueName: 'Sân bóng đá ABC',
    sport: 'Bóng đá',
    courtNumber: 'Sân số 1',
    fieldType: 'Bóng đá mini',
    date: '25/01/2024',
    time: '18:00 - 20:00',
    slots: [
      { time: '18:00', nextTime: '19:00', price: 250000 },
      { time: '19:00', nextTime: '20:00', price: 250000 }
    ],
    duration: 2,
    pricePerHour: 250000,
    subtotal: 500000,
    serviceFee: 25000,
    discount: 0,
    total: 525000
  }

  // Convert selectedSlots to slots format
  const convertSelectedSlotsToSlots = (selectedSlots) => {
    if (!selectedSlots || selectedSlots.length === 0) return []
    
    const timeSlotPrices = [
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
    
    return selectedSlots.map(slotKey => {
      // Parse slot key: format is "YYYY-MM-DD-HH:MM"
      const parts = slotKey.split('-')
      const time = parts[3] // Get "HH:MM"
      
      // Get next hour
      const nextHour = time === '22:00' ? '23:00' : 
                      time === '21:00' ? '22:00' :
                      time === '20:00' ? '21:00' :
                      time === '19:00' ? '20:00' :
                      time === '18:00' ? '19:00' :
                      time === '17:00' ? '18:00' :
                      time === '16:00' ? '17:00' :
                      time === '15:00' ? '16:00' :
                      time === '14:00' ? '15:00' :
                      time === '13:00' ? '14:00' :
                      time === '12:00' ? '13:00' :
                      time === '11:00' ? '12:00' :
                      time === '10:00' ? '11:00' :
                      time === '09:00' ? '10:00' :
                      time === '08:00' ? '09:00' :
                      time === '07:00' ? '08:00' :
                      time === '06:00' ? '07:00' : '07:00'
      
      const slotData = timeSlotPrices.find(s => s.time === time)
      
      return {
        time: time,
        nextTime: nextHour,
        price: slotData?.price || 150000
      }
    })
  }

  const slots = rawBookingData.selectedSlots?.length > 0 
    ? convertSelectedSlotsToSlots(rawBookingData.selectedSlots)
    : (rawBookingData.slots || [])

  // Calculate totals if not provided or if slots are available
  const calculateTotals = () => {
    if (slots.length === 0) {
      return {
        subtotal: rawBookingData.subtotal || 0,
        serviceFee: rawBookingData.serviceFee || 0,
        total: rawBookingData.total || 0
      }
    }
    
    const subtotal = slots.reduce((sum, slot) => sum + slot.price, 0)
    const serviceFee = Math.round(subtotal * 0.05) // 5% service fee
    const total = subtotal + serviceFee - (rawBookingData.discount || 0)
    
    return { subtotal, serviceFee, total }
  }

  const totals = calculateTotals()

  const bookingData = {
    ...rawBookingData,
    slots,
    subtotal: rawBookingData.subtotal && rawBookingData.subtotal > 0 ? rawBookingData.subtotal : totals.subtotal,
    serviceFee: rawBookingData.serviceFee && rawBookingData.serviceFee > 0 ? rawBookingData.serviceFee : totals.serviceFee,
    total: rawBookingData.total && rawBookingData.total > 0 ? rawBookingData.total : totals.total
  }

  // Debug: Log booking data
  console.log('Booking Data:', bookingData)
  console.log('Slots:', bookingData.slots)
  console.log('Totals:', { subtotal: bookingData.subtotal, serviceFee: bookingData.serviceFee, total: bookingData.total })

  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán qua ví điện tử MoMo',
      icon: <img src="/MoMo_Logo.png" alt="MoMo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />,
      color: '#A50064',
      gradient: 'linear-gradient(135deg, #A50064, #D91C81)'
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua cổng VNPay',
      icon: <img src="/Vnpay.jpg" alt="VNPay" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
      color: '#0071BA',
      gradient: 'linear-gradient(135deg, #0071BA, #0090E3)'
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      description: 'Thanh toán trực tiếp tại sân',
      icon: <FiDollarSign size={28} color="#22c55e" />,
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e, #10b981)'
    }
  ]

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán')
      return
    }
    
    // Show confirmation modal for all payment methods
    setShowConfirmModal(true)
  }

  const handleConfirmPayment = () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowConfirmModal(false)
      
      // Show success message based on payment method
      const method = paymentMethods.find(m => m.id === selectedMethod)
      if (selectedMethod === 'cash') {
        alert(`✓ Đặt sân thành công!\n\nVui lòng thanh toán ${bookingData.total.toLocaleString('vi-VN')} VNĐ khi đến sân.\nChúng tôi sẽ liên hệ với bạn để xác nhận.`)
      } else {
        alert(`✓ Đang chuyển hướng đến ${method.name}...\n\n(Chức năng này sẽ được tích hợp khi có Backend)`)
      }
      
      // Redirect to profile/bookings page
      // navigate('/profile')
    }, 2000)
  }

  return (
    <main className="payment-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <Link to="/booking">Đặt sân</Link>
          <span> / </span>
          <span>Thanh toán</span>
        </nav>

        <div className="payment-wrapper">
          {/* Left Side - Payment Methods */}
          <div className="payment-main">
            <div className="payment-header">
              <h1>Thanh toán</h1>
              <p>Chọn phương thức thanh toán phù hợp với bạn</p>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h3>Phương thức thanh toán</h3>
              <div className="methods-grid">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <div className="method-radio">
                      <div className="radio-outer">
                        {selectedMethod === method.id && <div className="radio-inner" />}
                      </div>
                    </div>
                    
                     <div 
                       className="method-icon"
                       style={{ 
                         background: method.id === 'cash' ? '#ffffff' : method.gradient,
                         border: method.id === 'cash' ? '2px solid #e5e7eb' : 'none',
                         boxShadow: method.id === 'cash' ? 'none' : undefined
                       }}
                     >
                       {method.icon}
                     </div>
                    
                    <div className="method-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>

                     {selectedMethod === method.id && (
                       <div className="method-badge">
                         <FiCheck size={16} />
                       </div>
                     )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info based on selected method */}
            {selectedMethod && (
              <div className="payment-info-section">
                 {selectedMethod === 'momo' && (
                   <div className="payment-instructions momo-info">
                     <div className="instruction-header">
                       <FiSmartphone className="instruction-icon" size={32} />
                       <h4>Hướng dẫn thanh toán MoMo</h4>
                     </div>
                    <ol>
                      <li>Bấm "Xác nhận thanh toán" để chuyển đến ứng dụng MoMo</li>
                      <li>Đăng nhập vào ứng dụng MoMo</li>
                      <li>Xác nhận thông tin giao dịch</li>
                      <li>Nhập mã PIN để hoàn tất thanh toán</li>
                    </ol>
                     <div className="info-note">
                       <FiInfo size={20} />
                       <p>Giao dịch được mã hóa và bảo mật tuyệt đối</p>
                     </div>
                  </div>
                )}

                 {selectedMethod === 'vnpay' && (
                   <div className="payment-instructions vnpay-info">
                     <div className="instruction-header">
                       <FiCreditCard className="instruction-icon" size={32} />
                       <h4>Hướng dẫn thanh toán VNPay</h4>
                     </div>
                    <ol>
                      <li>Bấm "Xác nhận thanh toán" để chuyển đến cổng VNPay</li>
                      <li>Chọn ngân hàng hoặc ví điện tử</li>
                      <li>Nhập thông tin thẻ/tài khoản</li>
                      <li>Xác thực OTP để hoàn tất thanh toán</li>
                    </ol>
                     <div className="info-note">
                       <FiShield size={20} />
                       <p>Hỗ trợ hơn 40 ngân hàng và ví điện tử tại Việt Nam</p>
                     </div>
                  </div>
                )}

                 {selectedMethod === 'cash' && (
                   <div className="payment-instructions cash-info">
                     <div className="instruction-header">
                       <FiDollarSign className="instruction-icon" size={32} />
                       <h4>Thanh toán tiền mặt tại sân</h4>
                     </div>
                    <ol>
                      <li>Bấm "Xác nhận thanh toán" để hoàn tất đặt sân</li>
                      <li>Bạn sẽ nhận được mã đặt sân qua SMS/Email</li>
                      <li>Đến sân đúng giờ đã đặt</li>
                      <li>Xuất trình mã đặt sân và thanh toán trực tiếp</li>
                    </ol>
                     <div className="info-note warning">
                       <FiAlertTriangle size={20} />
                       <p>Vui lòng đến sớm 10 phút và mang theo đủ tiền mặt</p>
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Action Button */}
            <div className="payment-action">
              <button 
                className={`btn btn-payment ${!selectedMethod ? 'disabled' : ''}`}
                onClick={handlePayment}
                disabled={!selectedMethod}
              >
                {selectedMethod ? '🔒 Xác nhận thanh toán' : 'Chọn phương thức thanh toán'}
              </button>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="payment-sidebar">
            <div className="booking-summary-card">
              <h3>Thông tin đặt sân</h3>
              
               <div className="summary-section">
                 <div className="venue-header">
                   <div className="venue-icon">
                     <FiMapPin size={32} />
                   </div>
                   <div>
                     <h4>{bookingData.venueName}</h4>
                     <p className="sport-type">{bookingData.sport}</p>
                   </div>
                 </div>
               </div>

              <div className="summary-divider"></div>

               <div className="summary-section">
                 <h4 className="price-title">Thông tin đặt chỗ</h4>
                 
                 {bookingData.courtNumber && (
                   <div className="summary-row">
                     <span className="label">
                       <FiMapPin size={16} style={{ marginRight: '8px' }} />
                       Sân:
                     </span>
                     <span className="value">{bookingData.courtNumber}</span>
                   </div>
                 )}

                 {bookingData.fieldType && (
                   <div className="summary-row">
                     <span className="label">
                       <FiActivity size={16} style={{ marginRight: '8px' }} />
                       Loại sân:
                     </span>
                     <span className="value">{bookingData.fieldType}</span>
                   </div>
                 )}
                 
                 <div className="summary-row">
                   <span className="label">
                     <FiCalendar size={16} style={{ marginRight: '8px' }} />
                     Ngày đặt:
                   </span>
                   <span className="value">{bookingData.date}</span>
                 </div>
                 
                 {bookingData.slots && bookingData.slots.length > 0 && (
                   <>
                     {bookingData.slots.map((slot, index) => (
                       <div 
                         key={index}
                         className="summary-row"
                         style={{ 
                           backgroundColor: '#f0f9ff',
                           padding: '8px 12px',
                           borderRadius: '8px',
                           marginBottom: '4px'
                         }}
                       >
                         <span className="label">
                           <FiClock size={16} style={{ marginRight: '8px', color: '#0ea5e9' }} />
                           {slot.time} - {slot.nextTime}:
                         </span>
                         <span className="value" style={{ fontWeight: '600', color: '#0ea5e9' }}>
                           {slot.price.toLocaleString('vi-VN')} đ
                         </span>
                       </div>
                     ))}
                   </>
                 )}
                 
                 <div className="summary-row">
                   <span className="label">⏱️ Thời lượng:</span>
                   <span className="value">{bookingData.duration} giờ</span>
                 </div>
               </div>

              <div className="summary-divider"></div>

              <div className="summary-section">
                <h4 className="price-title">Chi tiết giá</h4>
                <div className="summary-row">
                  <span className="label">Giá thuê sân</span>
                  <span className="value">{bookingData.pricePerHour.toLocaleString('vi-VN')} đ × {bookingData.duration}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Tạm tính</span>
                  <span className="value">{bookingData.subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="summary-row">
                  <span className="label">Phí dịch vụ</span>
                  <span className="value">{bookingData.serviceFee.toLocaleString('vi-VN')} đ</span>
                </div>
                {bookingData.discount > 0 && (
                  <div className="summary-row discount">
                    <span className="label">Giảm giá</span>
                    <span className="value">-{bookingData.discount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span className="label">Tổng cộng</span>
                <span className="value">{bookingData.total.toLocaleString('vi-VN')} đ</span>
              </div>

               <div className="security-badge">
                 <FiShield className="badge-icon" size={24} />
                 <div>
                   <strong>Thanh toán an toàn</strong>
                   <p>Thông tin được mã hóa SSL</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay" onClick={() => !isProcessing && setShowConfirmModal(false)}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
               <div className="modal-header">
                 <h3>Xác nhận thanh toán</h3>
                 <button 
                   className="close-btn"
                   onClick={() => setShowConfirmModal(false)}
                   disabled={isProcessing}
                 >
                   <FiX size={24} />
                 </button>
               </div>

              <div className="modal-body">
                <div className="confirm-icon">
                  {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                </div>
                <h4>
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </h4>
                
                <div className="confirm-details">
                  <div className="confirm-row">
                    <span>Sân:</span>
                    <strong>{bookingData.venueName}</strong>
                  </div>
                  <div className="confirm-row">
                    <span>Ngày giờ:</span>
                    <strong>{bookingData.date} - {bookingData.time}</strong>
                  </div>
                  <div className="confirm-row total-row">
                    <span>Tổng tiền:</span>
                    <strong className="total-price">{bookingData.total.toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>

                 {selectedMethod === 'cash' && (
                   <div className="cash-reminder">
                     <FiInfo size={20} />
                     <p>Bạn sẽ thanh toán <strong>{bookingData.total.toLocaleString('vi-VN')} đ</strong> trực tiếp tại sân</p>
                   </div>
                 )}
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isProcessing}
                >
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Payment

