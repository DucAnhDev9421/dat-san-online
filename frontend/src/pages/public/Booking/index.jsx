import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BookingHeader from './components/BookingHeader'
import VenueGallery from './components/VenueGallery'
import VenueInfo from './components/VenueInfo'
import MapDisplay from '../../../component/map/MapDisplay'
import ReviewsSection from './components/ReviewsSection'
import BookingLegend from './components/BookingLegend'
import DateNavigation from './components/DateNavigation'
import BookingGrid from './components/BookingGrid'
import BookingFooter from './components/BookingFooter'
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

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      <BookingHeader venueName={venueData.name} />
      
      {/* Venue Details Section */}
      <div style={{
        background: '#fff',
        padding: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <VenueGallery images={venueData.images} />
          <VenueInfo venueData={venueData} />
        </div>
      </div>

      {/* Map Section */}
      <div style={{
        background: '#fff',
        padding: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <MapDisplay venueData={venueData} />
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection reviews={reviews} venueRating={venueData.rating} />

      {/* Booking Section */}
      <BookingLegend />
      <DateNavigation 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onShowCalendar={() => setShowCalendar(true)}
      />
      <BookingGrid 
        selectedDate={selectedDate}
        selectedSlots={selectedSlots}
        onSlotSelect={setSelectedSlots}
      />

      {/* Footer */}
      <BookingFooter 
        selectedSlots={selectedSlots}
        venuePrice={venueData.price}
        onBookNow={handleBookNow}
      />

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

