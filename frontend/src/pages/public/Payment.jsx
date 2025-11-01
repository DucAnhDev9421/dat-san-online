import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import PaymentMethods from './Payment/components/PaymentMethods'
import PaymentInstructions from './Payment/components/PaymentInstructions'
import BookingSummary from './Payment/components/BookingSummary'
import ConfirmModal from './Payment/components/ConfirmModal'
import { defaultBookingData, paymentMethods } from './Payment/constants'
import { 
  convertSelectedSlotsToSlots, 
  calculateTotals, 
  formatBookingData 
} from './Payment/utils/helpers'
import '../../styles/Payment.css'

function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMethod, setSelectedMethod] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get booking data from navigation state, fallback to default
  const rawBookingData = location.state?.bookingData || defaultBookingData

  // Convert selectedSlots to slots format
  const slots = rawBookingData.selectedSlots?.length > 0 
    ? convertSelectedSlotsToSlots(rawBookingData.selectedSlots)
    : (rawBookingData.slots || [])

  // Calculate totals
  const totals = calculateTotals(slots, rawBookingData)
  const bookingData = formatBookingData(rawBookingData, slots, totals)

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán')
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmPayment = () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      setIsProcessing(false)
      setShowConfirmModal(false)
      
      const method = paymentMethods.find(m => m.id === selectedMethod)
      if (selectedMethod === 'cash') {
        alert(`✓ Đặt sân thành công!\n\nVui lòng thanh toán ${bookingData.total.toLocaleString('vi-VN')} VNĐ khi đến sân.\nChúng tôi sẽ liên hệ với bạn để xác nhận.`)
      } else {
        alert(`✓ Đang chuyển hướng đến ${method.name}...\n\n(Chức năng này sẽ được tích hợp khi có Backend)`)
      }
    }, 2000)
  }

  return (
    <main className="payment-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <Link to="/booking">Đặt sân</Link>
          <span> / </span>
          <span>Thanh toán</span>
        </nav>

        <div className="payment-wrapper">
          <div className="payment-main">
            <div className="payment-header">
              <h1>Thanh toán</h1>
              <p>Chọn phương thức thanh toán phù hợp với bạn</p>
            </div>

            <PaymentMethods
              selectedMethod={selectedMethod}
              onMethodSelect={handleMethodSelect}
            />

            <PaymentInstructions selectedMethod={selectedMethod} />

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

          <BookingSummary bookingData={bookingData} />
        </div>

        <ConfirmModal
          show={showConfirmModal}
          selectedMethod={selectedMethod}
          bookingData={bookingData}
          isProcessing={isProcessing}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmPayment}
        />
      </div>
    </main>
  )
}

export default Payment
