import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useDeviceType from '../../../hook/use-device-type'
import VenueGallery from './components/VenueGallery'
import VenueInfo from './components/VenueInfo'
import MapDisplay from '../../../components/map/MapDisplay'
import ReviewsSection from './components/ReviewsSection'
import CourtAndFieldTypeSelector from './components/CourtAndFieldTypeSelector'
import TimeSlotSelector from './components/TimeSlotSelector'
import BookingSummary from './components/BookingSummary'
import CalendarModal from './modals/CalendarModal'
import BookingModal from './modals/BookingModal'
import { venuesData, reviews } from './mockData'

function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const venueId = searchParams.get('venue')
  const { isMobile, isTablet, isDesktop } = useDeviceType()
  
  // Get venue data based on ID from URL
  const venueData = venuesData.find(venue => venue.id === parseInt(venueId)) || venuesData[0]

  // State management
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedSlots, setSelectedSlots] = useState([])
  const [selectedCourt, setSelectedCourt] = useState('Sân số 1')
  const [selectedFieldType, setSelectedFieldType] = useState('Bóng đá mini')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Scroll to top when component mounts or venue changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [venueId])

  // Reset slots when date changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    setSelectedSlots([])
  }

  const handleBookNow = () => {
    if (selectedSlots.length > 0) {
      setShowBookingModal(true)
    }
  }

  const handleBookingSubmit = (bookingData) => {
    setIsProcessing(true)
    setShowBookingModal(false)
    
    // Prepare booking data to pass to payment page
    const bookingInfo = {
      venueId: venueData.id,
      venueName: venueData.name,
      sport: venueData.sport,
      courtNumber: selectedCourt,
      fieldType: selectedFieldType,
      date: selectedDate.toLocaleDateString('vi-VN'),
      time: selectedSlots.map(slot => slot.split('-')[2]).join(', '),
      duration: selectedSlots.length,
      pricePerHour: venueData.price,
      subtotal: calculateTotalAmount(),
      serviceFee: Math.round(calculateTotalAmount() * 0.05), // 5% service fee
      discount: 0,
      total: calculateTotalAmount() + Math.round(calculateTotalAmount() * 0.05),
      selectedSlots: selectedSlots,
      venueData: venueData
    }
    
    // Small delay to show processing state
    setTimeout(() => {
      // Navigate to payment with booking data
      navigate('/payment', { 
        state: { bookingData: bookingInfo } 
      })
    }, 500)
  }

  // Calculate total amount based on selected slots
  const calculateTotalAmount = () => {
    const timeSlots = [
      { time: '06:00', price: 150000 },
      { time: '07:00', price: 180000 },
      { time: '08:00', price: 200000 },
      { time: '09:00', price: 200000 },
      { time: '10:00', price: 200000 },
      { time: '11:00', price: 200000 },
      { time: '12:00', price: 200000 },
      { time: '13:00', price: 200000 },
      { time: '14:00', price: 200000 },
      { time: '15:00', price: 200000 },
      { time: '16:00', price: 200000 },
      { time: '17:00', price: 220000 },
      { time: '18:00', price: 250000 },
      { time: '19:00', price: 250000 },
      { time: '20:00', price: 220000 },
      { time: '21:00', price: 200000 },
      { time: '22:00', price: 180000 }
    ]
    
    return selectedSlots.reduce((total, slotKey) => {
      const time = slotKey.split('-')[2] // Get time from key
      const slot = timeSlots.find(s => s.time === time)
      return total + (slot?.price || 0)
    }, 0)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Gallery Section */}
      <div style={{ 
        maxWidth: '1200px',
        margin: isMobile ? '12px auto' : isTablet ? '16px auto' : '20px auto',
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 20px'
      }}>
        <div style={{
          background: '#fff',
          padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <VenueGallery images={venueData.images} />
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
        gap: isMobile ? '16px' : isTablet ? '20px' : '24px', 
        alignItems: 'flex-start',
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 20px'
      }}>
        {/* Left Column - Venue Info */}
        <div style={{ 
          flex: 1, 
          minWidth: isMobile ? 'auto' : '600px',
          width: isMobile ? '100%' : 'auto'
        }}>
          {/* Venue Details Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
            marginBottom: isMobile ? '16px' : isTablet ? '18px' : '20px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <VenueInfo venueData={venueData} />
          </div>

          {/* Court and Field Type Selector */}
          <CourtAndFieldTypeSelector 
            selectedCourt={selectedCourt}
            onCourtChange={setSelectedCourt}
            selectedFieldType={selectedFieldType}
            onFieldTypeChange={setSelectedFieldType}
          />

          {/* Time Slot Selector */}
          <TimeSlotSelector 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedSlots={selectedSlots}
            onSlotSelect={setSelectedSlots}
            venuePrice={venueData.price}
          />
        </div>

        {/* Right Column - Booking Summary */}
        <div style={{ 
          width: isMobile ? '100%' : isTablet ? '100%' : '320px',
          position: isMobile || isTablet ? 'static' : 'sticky',
          top: isMobile || isTablet ? 'auto' : '100px',
          order: isMobile || isTablet ? -1 : 'auto'
        }}>
          <BookingSummary 
            selectedDate={selectedDate}
            selectedSlots={selectedSlots}
            selectedCourt={selectedCourt}
            selectedFieldType={selectedFieldType}
            onBookNow={handleBookNow}
          />
        </div>
      </div>

      {/* Map Section */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 20px'
      }}>
        <div style={{
          background: '#fff',
          padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '18px' : isTablet ? '19px' : '20px', 
            fontWeight: '700', 
            color: '#1f2937', 
            margin: '0 0 20px 0' 
          }}>
            Vị trí sân
          </h3>
          <MapDisplay venueData={venueData} />
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 20px'
      }}>
        <div style={{
          background: '#fff',
          padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <ReviewsSection reviews={reviews} venueRating={venueData.rating} />
        </div>
      </div>

      {/* Modals */}
      {showCalendar && (
        <CalendarModal 
          selectedDate={selectedDate}
          onDateSelect={handleDateChange}
          onClose={() => setShowCalendar(false)}
        />
      )}
      {showBookingModal && (
        <BookingModal 
          selectedDate={selectedDate}
          selectedSlots={selectedSlots}
          selectedCourt={selectedCourt}
          selectedFieldType={selectedFieldType}
          venueData={venueData}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Đang chuyển đến trang thanh toán...
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking

