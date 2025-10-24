import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import VenueGallery from './components/VenueGallery'
import VenueInfo from './components/VenueInfo'
import MapDisplay from '../../../component/map/MapDisplay'
import ReviewsSection from './components/ReviewsSection'
import TimeSlotSelector from './components/TimeSlotSelector'
import BookingSummary from './components/BookingSummary'
import CalendarModal from './modals/CalendarModal'
import BookingModal from './modals/BookingModal'
import { venuesData, reviews } from './mockData'

function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const venueId = searchParams.get('venue')
  
  // Get venue data based on ID from URL
  const venueData = venuesData.find(venue => venue.id === parseInt(venueId)) || venuesData[0]

  // State management
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedSlots, setSelectedSlots] = useState([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

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

  const handleBookingSubmit = () => {
    setShowBookingModal(false)
    navigate('/payment')
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
      {/* Gallery Section */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <VenueGallery images={venueData.images} />
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '24px', 
        alignItems: 'flex-start',
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: '0 20px'
      }}>
        {/* Left Column - Venue Info */}
        <div style={{ 
          flex: 1, 
          minWidth: window.innerWidth <= 768 ? 'auto' : '600px',
          width: window.innerWidth <= 768 ? '100%' : 'auto'
        }}>
          {/* Venue Details Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <VenueInfo venueData={venueData} />
          </div>

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
          width: window.innerWidth <= 768 ? '100%' : '320px',
          position: window.innerWidth <= 768 ? 'static' : 'sticky',
          top: window.innerWidth <= 768 ? 'auto' : '100px',
          order: window.innerWidth <= 768 ? -1 : 'auto'
        }}>
          <BookingSummary 
            selectedDate={selectedDate}
            selectedSlots={selectedSlots}
            onBookNow={handleBookNow}
          />
        </div>
      </div>

      {/* Map Section */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
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
        padding: '0 20px'
      }}>
        <div style={{
          background: '#fff',
          padding: '24px',
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
          venueData={venueData}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  )
}

export default Booking

