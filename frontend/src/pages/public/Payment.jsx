import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import PaymentMethods from './Payment/components/PaymentMethods'
import PaymentInstructions from './Payment/components/PaymentInstructions'
import BookingSummary from './Payment/components/BookingSummary'
import { defaultBookingData, paymentMethods } from './Payment/constants'
import { 
  convertSelectedSlotsToSlots, 
  calculateTotals, 
  formatBookingData 
} from './Payment/utils/helpers'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { toast } from 'react-toastify'
import { useCountdown } from '../../hook/use-countdown'
import '../../styles/Payment.css'

function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMethod, setSelectedMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [paymentResult, setPaymentResult] = useState(null) // 'success' | 'failed' | null
  const paymentCallbackProcessed = useRef(false) // Flag to prevent duplicate processing

  // Get booking data from navigation state, fallback to default
  const rawBookingData = location.state?.bookingData || defaultBookingData

  // Countdown timer: 5 phút = 300 giây
  const PAYMENT_TIMEOUT_SECONDS = 5 * 60

  // Get bookingId - try multiple possible paths
  // Handle case where booking object might be nested in API response structure
  // Case 1: Direct bookingId field
  // Case 2: booking object directly has _id (rawBookingData.booking._id)
  // Case 3: booking object is actually API response wrapper {booking: {...}, paymentPending: true}
  //   so we need rawBookingData.booking.booking._id
  let bookingId = rawBookingData?.bookingId
  
  if (!bookingId && rawBookingData?.booking) {
    // Check if booking has _id directly (normal case)
    bookingId = rawBookingData.booking._id || rawBookingData.booking.id
    
    // If not, check if booking is the API response wrapper {booking: {...}, paymentPending: true}
    if (!bookingId && rawBookingData.booking.booking) {
      bookingId = rawBookingData.booking.booking._id || rawBookingData.booking.booking.id
    }
  }
  


  // Use ref to store latest values for countdown callback
  const isCancelledRef = useRef(isCancelled)
  const isProcessingRef = useRef(isProcessing)
  const bookingIdRef = useRef(bookingId)

  // Update refs when values change
  useEffect(() => {
    isCancelledRef.current = isCancelled
    isProcessingRef.current = isProcessing
    bookingIdRef.current = bookingId
  }, [isCancelled, isProcessing, bookingId])

  // Handle countdown completion - auto cancel booking
  const handleCountdownComplete = useCallback(async () => {
    if (isCancelledRef.current || isProcessingRef.current) return

    const currentBookingId = bookingIdRef.current
    
    if (!currentBookingId) {
      return
    }

    setIsCancelled(true)
    
    // Clear localStorage
    const startTimeKey = `payment_start_time_${currentBookingId}`
    localStorage.removeItem(startTimeKey)
    
    // Clear pending booking from localStorage
    const pendingBookingKey = `pending_booking_${currentBookingId}`
    localStorage.removeItem(pendingBookingKey)
    
    try {
      const result = await bookingApi.cancelBooking(currentBookingId)
      if (result.success) {
        toast.error('Đã hết thời gian thanh toán. Booking đã được tự động hủy.')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        toast.error('Không thể hủy booking tự động. Vui lòng thử lại.')
      }
    } catch (error) {
      toast.error('Không thể hủy booking tự động. Vui lòng thử lại.')
    }
  }, [navigate])

  // Calculate remaining time from localStorage
  const getRemainingTime = useCallback(() => {
    if (!bookingId) return PAYMENT_TIMEOUT_SECONDS
    
    const startTimeKey = `payment_start_time_${bookingId}`
    const startTime = localStorage.getItem(startTimeKey)
    
    if (!startTime) return PAYMENT_TIMEOUT_SECONDS
    
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000)
    const remaining = PAYMENT_TIMEOUT_SECONDS - elapsed
    
    return remaining > 0 ? remaining : 0
  }, [bookingId])

  // Initialize countdown with remaining time from localStorage
  const initialCount = bookingId ? getRemainingTime() : 0
  const { count, start, stop } = useCountdown(initialCount, handleCountdownComplete)

  useEffect(() => {
    // Start countdown only when bookingId is available and not cancelled
    if (!isCancelled && bookingId) {
      const startTimeKey = `payment_start_time_${bookingId}`
      
      // Check if payment timer already started
      const existingStartTime = localStorage.getItem(startTimeKey)
      
      if (!existingStartTime) {
        // First time - save start time and start countdown
        localStorage.setItem(startTimeKey, Date.now().toString())
        start(PAYMENT_TIMEOUT_SECONDS)
      } else {
        // Already started - calculate remaining time
        const remaining = getRemainingTime()
        if (remaining > 0) {
          start(remaining)
        } else {
          // Time expired - cancel booking immediately
          handleCountdownComplete()
        }
      }
    }

    // Cleanup on unmount
    return () => {
      stop()
    }
  }, [bookingId, isCancelled, start, stop, PAYMENT_TIMEOUT_SECONDS, getRemainingTime, handleCountdownComplete])

  // Stop countdown when payment is being processed
  useEffect(() => {
    if (isProcessing) {
      stop() // Stop countdown when payment is being processed
    }
  }, [isProcessing, stop])

  // Handle payment callback from MoMo/VNPay
  useEffect(() => {
    // Prevent duplicate processing
    if (paymentCallbackProcessed.current) {
      return
    }

    const searchParams = new URLSearchParams(location.search)
    const result = searchParams.get('success')
    const paymentId = searchParams.get('paymentId')
    const resultCode = searchParams.get('resultCode')
    const orderId = searchParams.get('orderId')
    const message = searchParams.get('message')

    // Check if this is a callback from payment gateway
    if (result !== null || resultCode !== null || orderId) {
      // Mark as processed immediately to prevent duplicate calls
      paymentCallbackProcessed.current = true
      
      // Clear query params from URL
      navigate(location.pathname, { replace: true })

      // Determine payment result
      let paymentSuccess = false
      if (result === 'true' || resultCode === '0') {
        paymentSuccess = true
      } else if (result === 'false' || (resultCode && resultCode !== '0')) {
        paymentSuccess = false
      }

      if (paymentSuccess) {
        // Payment successful
        setPaymentResult('success')
        stop() // Stop countdown
        
        // Clear localStorage
        if (bookingId) {
          const startTimeKey = `payment_start_time_${bookingId}`
          localStorage.removeItem(startTimeKey)
          
          const pendingBookingKey = `pending_booking_${bookingId}`
          localStorage.removeItem(pendingBookingKey)
        }

        toast.success('Thanh toán thành công! Đơn đặt sân của bạn đã được xác nhận.')
        
        // Navigate to bookings page after delay
        setTimeout(() => {
          navigate('/profile/bookings')
        }, 3000)
      } else {
        // Payment failed or cancelled
        setPaymentResult('failed')
        
        // Cancel booking if payment failed
        // Extract bookingId from paymentId format: MOMO_bookingId_timestamp or VNPAY_bookingId_timestamp
        let currentBookingId = bookingId
        if (!currentBookingId && orderId) {
          // paymentId format: MOMO_bookingId_timestamp or VNPAY_bookingId_timestamp
          const parts = orderId.split('_')
          if (parts.length >= 2) {
            currentBookingId = parts[1] // bookingId is the second part
          }
        }
        
        if (currentBookingId) {
          handleCancelBookingAfterPaymentFailed(currentBookingId)
        } else {
          toast.error('Thanh toán thất bại hoặc đã bị hủy.')
          setIsCancelled(true)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]) // Only depend on location.search to avoid re-running unnecessarily

  // Handle cancel booking after payment failed
  const handleCancelBookingAfterPaymentFailed = async (bookingIdToCancel) => {
    try {
      setIsCancelled(true)
      stop() // Stop countdown
      
      // Clear localStorage
      const startTimeKey = `payment_start_time_${bookingIdToCancel}`
      localStorage.removeItem(startTimeKey)
      
      const pendingBookingKey = `pending_booking_${bookingIdToCancel}`
      localStorage.removeItem(pendingBookingKey)

      const result = await bookingApi.cancelBooking(bookingIdToCancel)
      if (result.success) {
        toast.error('Thanh toán thất bại. Đơn đặt sân đã được hủy.')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        toast.error('Thanh toán thất bại. Vui lòng kiểm tra lại đơn đặt sân.')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Thanh toán thất bại. Vui lòng kiểm tra lại đơn đặt sân.')
    }
  }

  // Format countdown time (MM:SS)
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Convert selectedSlots to slots format
  // Use timeSlotsData from API if available for accurate pricing
  const slots = rawBookingData.selectedSlots?.length > 0 
    ? convertSelectedSlotsToSlots(
        rawBookingData.selectedSlots, 
        rawBookingData.timeSlotsData, 
        rawBookingData.pricePerHour
      )
    : (rawBookingData.slots || [])

  // Calculate totals
  const totals = calculateTotals(slots, rawBookingData)
  const bookingData = formatBookingData(rawBookingData, slots, totals)

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán')
      return
    }
    handleConfirmPayment()
  }

  const handleConfirmPayment = async () => {
    if (!bookingId) {
      toast.error('Không tìm thấy thông tin đặt sân')
      return
    }

    setIsProcessing(true)
    
    try {
      if (selectedMethod === 'cash') {
        // Gọi API để cập nhật payment method = cash
        const result = await bookingApi.updatePaymentMethod(bookingId, 'cash')
        
        if (result.success || result.data) {
          // Stop countdown timer to prevent auto-cancel
          stop()
          
          // Clear localStorage
          const startTimeKey = `payment_start_time_${bookingId}`
          localStorage.removeItem(startTimeKey)
          
          // Clear pending booking from localStorage
          const pendingBookingKey = `pending_booking_${bookingId}`
          localStorage.removeItem(pendingBookingKey)
          
          // Don't set isCancelled = true because booking is not cancelled,
          // it's just pending payment at venue
          // The countdown is stopped, so it won't auto-cancel
          
          // Show success message
          toast.success('Đã chọn thanh toán tiền mặt. Vui lòng thanh toán khi đến sân.')
          
          // Navigate to profile bookings after delay
          setTimeout(() => {
            navigate('/profile/bookings')
          }, 2000)
        } else {
          throw new Error('Không thể cập nhật phương thức thanh toán')
        }
      } else {
        // Online payment methods (momo/vnpay)
        const method = paymentMethods.find(m => m.id === selectedMethod)
        
        try {
          // Call API to initialize payment
          const paymentResult = await paymentApi.initPayment(bookingId, selectedMethod)
          
          if (paymentResult.success && paymentResult.data?.paymentUrl) {
            // Stop countdown when redirecting to payment gateway
            stop()
            
            // Update payment method first
            await bookingApi.updatePaymentMethod(bookingId, selectedMethod)
            
            // Redirect to payment gateway
            toast.info(`Đang chuyển hướng đến ${method?.name || selectedMethod}...`)
            window.location.href = paymentResult.data.paymentUrl
          } else {
            throw new Error('Không thể khởi tạo thanh toán. Vui lòng thử lại.')
          }
        } catch (error) {
          console.error('Error initializing payment:', error)
          toast.error(error.message || 'Không thể khởi tạo thanh toán. Vui lòng thử lại.')
          setIsProcessing(false)
        }
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      toast.error(error.message || 'Không thể xác nhận thanh toán. Vui lòng thử lại.')
      setIsProcessing(false)
    }
  }

  return (
    <main className="payment-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <Link to={rawBookingData?.venueId ? `/booking?venue=${rawBookingData.venueId}` : '/booking'}>
            Đặt sân
          </Link>
          <span> / </span>
          <span>Thanh toán</span>
        </nav>

        <div className="payment-wrapper">
          <div className="payment-main">
            <div className="payment-header">
              <h1>Thanh toán</h1>
              <p>Chọn phương thức thanh toán phù hợp với bạn</p>
              
              {/* Payment Timer Warning */}
              {!isCancelled && count > 0 && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: count <= 60 ? '#fef2f2' : '#fffbeb',
                  border: `2px solid ${count <= 60 ? '#ef4444' : '#f59e0b'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: count <= 60 ? '#dc2626' : '#d97706',
                    fontFamily: 'monospace'
                  }}>
                    ⏱️ {formatCountdown(count)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: count <= 60 ? '#dc2626' : '#d97706',
                      marginBottom: '4px'
                    }}>
                      {count <= 60 
                        ? 'Cảnh báo: Thời gian thanh toán sắp hết!' 
                        : 'Thời gian thanh toán còn lại'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {count <= 60
                        ? 'Vui lòng hoàn tất thanh toán ngay. Booking sẽ tự động hủy khi hết thời gian.'
                        : 'Vui lòng hoàn tất thanh toán trong thời gian này để giữ chỗ.'}
                    </div>
                  </div>
                </div>
              )}

              {isCancelled && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ⚠️ Booking đã được tự động hủy do hết thời gian thanh toán.
                </div>
              )}
            </div>

            <PaymentMethods
              selectedMethod={selectedMethod}
              onMethodSelect={handleMethodSelect}
            />

            <PaymentInstructions selectedMethod={selectedMethod} />

            <div className="payment-action">
              <button 
                className={`btn btn-payment ${!selectedMethod || isCancelled || isProcessing ? 'disabled' : ''}`}
                onClick={handlePayment}
                disabled={!selectedMethod || isCancelled || isProcessing}
              >
                {isCancelled 
                  ? 'Booking đã bị hủy' 
                  : isProcessing
                    ? 'Đang xử lý...'
                    : selectedMethod 
                      ? '🔒 Xác nhận thanh toán' 
                      : 'Chọn phương thức thanh toán'}
              </button>
            </div>
          </div>

          <BookingSummary bookingData={bookingData} />
        </div>
      </div>
    </main>
  )
}

export default Payment
