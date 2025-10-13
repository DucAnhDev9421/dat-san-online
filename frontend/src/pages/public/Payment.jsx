import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Payment.css'

function Payment() {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  // Mock booking data - in real app this would come from props/context/API
  const bookingData = {
    venue: 'Sân bóng đá ABC',
    sport: 'Bóng đá',
    date: '25/01/2024',
    time: '18:00 - 20:00',
    duration: 2,
    pricePerHour: 200000,
    subtotal: 400000,
    serviceFee: 20000,
    discount: 0,
    total: 420000
  }

  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán qua ví điện tử MoMo',
      icon: '📱',
      color: '#A50064',
      gradient: 'linear-gradient(135deg, #A50064, #D91C81)'
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua cổng VNPay',
      icon: '💳',
      color: '#0071BA',
      gradient: 'linear-gradient(135deg, #0071BA, #0090E3)'
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      description: 'Thanh toán trực tiếp tại sân',
      icon: '💵',
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
    
    // If MoMo is selected, show QR code option
    if (selectedMethod === 'momo') {
      setShowQRCode(true)
    } else {
      setShowConfirmModal(true)
    }
  }

  const handleQRPayment = () => {
    setShowQRCode(false)
    setShowConfirmModal(true)
  }

  const handleDirectPayment = () => {
    setShowQRCode(false)
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
                      style={{ background: method.gradient }}
                    >
                      <span>{method.icon}</span>
                    </div>
                    
                    <div className="method-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>

                    {selectedMethod === method.id && (
                      <div className="method-badge">
                        <span>✓</span>
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
                      <span className="instruction-icon">📱</span>
                      <h4>Hướng dẫn thanh toán MoMo</h4>
                    </div>
                    <ol>
                      <li>Bấm "Xác nhận thanh toán" để chuyển đến ứng dụng MoMo</li>
                      <li>Đăng nhập vào ứng dụng MoMo</li>
                      <li>Xác nhận thông tin giao dịch</li>
                      <li>Nhập mã PIN để hoàn tất thanh toán</li>
                    </ol>
                    <div className="info-note">
                      <span>💡</span>
                      <p>Giao dịch được mã hóa và bảo mật tuyệt đối</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'vnpay' && (
                  <div className="payment-instructions vnpay-info">
                    <div className="instruction-header">
                      <span className="instruction-icon">💳</span>
                      <h4>Hướng dẫn thanh toán VNPay</h4>
                    </div>
                    <ol>
                      <li>Bấm "Xác nhận thanh toán" để chuyển đến cổng VNPay</li>
                      <li>Chọn ngân hàng hoặc ví điện tử</li>
                      <li>Nhập thông tin thẻ/tài khoản</li>
                      <li>Xác thực OTP để hoàn tất thanh toán</li>
                    </ol>
                    <div className="info-note">
                      <span>🔒</span>
                      <p>Hỗ trợ hơn 40 ngân hàng và ví điện tử tại Việt Nam</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'cash' && (
                  <div className="payment-instructions cash-info">
                    <div className="instruction-header">
                      <span className="instruction-icon">💵</span>
                      <h4>Thanh toán tiền mặt tại sân</h4>
                    </div>
                    <ol>
                      <li>Bấm "Xác nhận thanh toán" để hoàn tất đặt sân</li>
                      <li>Bạn sẽ nhận được mã đặt sân qua SMS/Email</li>
                      <li>Đến sân đúng giờ đã đặt</li>
                      <li>Xuất trình mã đặt sân và thanh toán trực tiếp</li>
                    </ol>
                    <div className="info-note warning">
                      <span>⚠️</span>
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
                  <div className="venue-icon">🏟️</div>
                  <div>
                    <h4>{bookingData.venue}</h4>
                    <p className="sport-type">{bookingData.sport}</p>
                  </div>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-section">
                <div className="summary-row">
                  <span className="label">📅 Ngày:</span>
                  <span className="value">{bookingData.date}</span>
                </div>
                <div className="summary-row">
                  <span className="label">🕐 Giờ:</span>
                  <span className="value">{bookingData.time}</span>
                </div>
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
                <span className="badge-icon">🛡️</span>
                <div>
                  <strong>Thanh toán an toàn</strong>
                  <p>Thông tin được mã hóa SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal for MoMo */}
        {showQRCode && (
          <div className="modal-overlay" onClick={() => setShowQRCode(false)}>
            <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Thanh toán MoMo</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowQRCode(false)}
                >
                  ×
                </button>
              </div>

              <div className="qr-modal-body">
                <div className="qr-tabs">
                  <div className="qr-tab active">
                    <span className="tab-icon">📱</span>
                    <div>
                      <h4>Quét mã QR</h4>
                      <p>Sử dụng app MoMo để quét</p>
                    </div>
                  </div>
                </div>

                <div className="qr-content">
                  <div className="qr-code-wrapper">
                    <div className="qr-code-container">
                      {/* Mock QR Code - In real app, this would be generated from backend */}
                      <div className="qr-code-placeholder">
                        <svg viewBox="0 0 200 200" className="qr-code-svg">
                          {/* QR Code pattern simulation */}
                          <rect x="0" y="0" width="200" height="200" fill="#ffffff"/>
                          
                          {/* Corner markers */}
                          <rect x="10" y="10" width="50" height="50" fill="#000000"/>
                          <rect x="20" y="20" width="30" height="30" fill="#ffffff"/>
                          <rect x="25" y="25" width="20" height="20" fill="#000000"/>
                          
                          <rect x="140" y="10" width="50" height="50" fill="#000000"/>
                          <rect x="150" y="20" width="30" height="30" fill="#ffffff"/>
                          <rect x="155" y="25" width="20" height="20" fill="#000000"/>
                          
                          <rect x="10" y="140" width="50" height="50" fill="#000000"/>
                          <rect x="20" y="150" width="30" height="30" fill="#ffffff"/>
                          <rect x="25" y="155" width="20" height="20" fill="#000000"/>
                          
                          {/* Random QR pattern */}
                          <rect x="70" y="15" width="8" height="8" fill="#000000"/>
                          <rect x="85" y="15" width="8" height="8" fill="#000000"/>
                          <rect x="100" y="15" width="8" height="8" fill="#000000"/>
                          <rect x="70" y="30" width="8" height="8" fill="#000000"/>
                          <rect x="100" y="30" width="8" height="8" fill="#000000"/>
                          <rect x="115" y="30" width="8" height="8" fill="#000000"/>
                          <rect x="70" y="45" width="8" height="8" fill="#000000"/>
                          <rect x="85" y="45" width="8" height="8" fill="#000000"/>
                          <rect x="115" y="45" width="8" height="8" fill="#000000"/>
                          <rect x="15" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="30" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="45" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="70" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="100" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="145" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="175" y="70" width="8" height="8" fill="#000000"/>
                          <rect x="15" y="85" width="8" height="8" fill="#000000"/>
                          <rect x="45" y="85" width="8" height="8" fill="#000000"/>
                          <rect x="85" y="85" width="8" height="8" fill="#000000"/>
                          <rect x="115" y="85" width="8" height="8" fill="#000000"/>
                          <rect x="160" y="85" width="8" height="8" fill="#000000"/>
                          <rect x="30" y="100" width="8" height="8" fill="#000000"/>
                          <rect x="70" y="100" width="8" height="8" fill="#000000"/>
                          <rect x="100" y="100" width="8" height="8" fill="#000000"/>
                          <rect x="130" y="100" width="8" height="8" fill="#000000"/>
                          <rect x="175" y="100" width="8" height="8" fill="#000000"/>
                          <rect x="15" y="115" width="8" height="8" fill="#000000"/>
                          <rect x="45" y="115" width="8" height="8" fill="#000000"/>
                          <rect x="85" y="115" width="8" height="8" fill="#000000"/>
                          <rect x="145" y="115" width="8" height="8" fill="#000000"/>
                          <rect x="175" y="115" width="8" height="8" fill="#000000"/>
                          <rect x="70" y="145" width="8" height="8" fill="#000000"/>
                          <rect x="85" y="145" width="8" height="8" fill="#000000"/>
                          <rect x="115" y="145" width="8" height="8" fill="#000000"/>
                          <rect x="145" y="145" width="8" height="8" fill="#000000"/>
                          <rect x="175" y="145" width="8" height="8" fill="#000000"/>
                          <rect x="70" y="160" width="8" height="8" fill="#000000"/>
                          <rect x="100" y="160" width="8" height="8" fill="#000000"/>
                          <rect x="130" y="160" width="8" height="8" fill="#000000"/>
                          <rect x="160" y="160" width="8" height="8" fill="#000000"/>
                          <rect x="85" y="175" width="8" height="8" fill="#000000"/>
                          <rect x="115" y="175" width="8" height="8" fill="#000000"/>
                          <rect x="145" y="175" width="8" height="8" fill="#000000"/>
                          <rect x="175" y="175" width="8" height="8" fill="#000000"/>
                        </svg>
                      </div>
                      <div className="momo-logo-overlay">
                        <div className="momo-logo">M</div>
                      </div>
                    </div>
                    
                    <div className="qr-amount">
                      <span className="amount-label">Số tiền thanh toán</span>
                      <span className="amount-value">{bookingData.total.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  <div className="qr-instructions">
                    <h4>📱 Hướng dẫn thanh toán</h4>
                    <ol>
                      <li>Mở ứng dụng <strong>MoMo</strong> trên điện thoại</li>
                      <li>Chọn <strong>"Quét mã QR"</strong></li>
                      <li>Quét mã QR bên trái</li>
                      <li>Kiểm tra thông tin và xác nhận thanh toán</li>
                    </ol>

                    <div className="qr-divider">
                      <span>Hoặc</span>
                    </div>

                    <button 
                      className="btn btn-momo"
                      onClick={handleDirectPayment}
                    >
                      <span>📱</span>
                      Mở ứng dụng MoMo
                    </button>

                    <div className="qr-note">
                      <span>⏱️</span>
                      <p>Mã QR có hiệu lực trong <strong>15 phút</strong></p>
                    </div>
                  </div>
                </div>

                <div className="qr-footer">
                  <p>💡 Nếu đã thanh toán thành công, vui lòng chờ hệ thống xác nhận (khoảng 30 giây)</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  ×
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
                    <strong>{bookingData.venue}</strong>
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
                    <span>💡</span>
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

