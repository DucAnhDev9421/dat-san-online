import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
import { useAuth } from '../../../contexts/AuthContext'
import { useSocket } from '../../../contexts/SocketContext'
import { toast } from 'react-toastify'

// Custom hooks
import { useFacilityData } from './hooks/useFacilityData'
import { useCourtData } from './hooks/useCourtData'
import { useSlotLocking } from './hooks/useSlotLocking'
import { useAutoDeselect } from './hooks/useAutoDeselect'
import { useSlotCleanup } from './hooks/useSlotCleanup'
import { useBookingSubmission } from './hooks/useBookingSubmission'
import { useUnlockOnUnmount } from './hooks/useUnlockOnUnmount'

function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const venueId = searchParams.get('venue')
  const { isMobile, isTablet, isDesktop } = useDeviceType()
  const { user, isAuthenticated } = useAuth()
  const { defaultSocket, isConnected, joinFacility, leaveFacility, joinCourt, leaveCourt } = useSocket()

  // Local UI state
  const [selectedSportCategory, setSelectedSportCategory] = useState(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedSlots, setSelectedSlots] = useState([])
  const [selectedFieldType, setSelectedFieldType] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [contactInfo, setContactInfo] = useState(null)
  const [timeSlotsData, setTimeSlotsData] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsPage, setReviewsPage] = useState(1)
  const [promotionData, setPromotionData] = useState(null) // { code, promotion, discountAmount }

  // Custom hooks - tất cả logic phức tạp ở đây
  const {
    venueData,
    loading,
    error,
    reviews,
    reviewsStats,
    reviewsTotal,
    sportCategories,
    timeSlotDuration,
    setVenueData,
    setReviews,
    setReviewsStats,
    setReviewsTotal
  } = useFacilityData(venueId)

  const {
    courts,
    courtTypes,
    selectedCourt,
    setSelectedCourt
  } = useCourtData(venueId, selectedSportCategory, selectedFieldType)

  const {
    lockedSlots,
    bookedSlots,
    setLockedSlots,
    setBookedSlots,
    handleSlotLock: handleSlotLockBase,
    handleSlotUnlock,
    lockedSlotsByMeRef
  } = useSlotLocking(
    venueId,
    selectedCourt,
    selectedDate,
    user,
    defaultSocket,
    isAuthenticated,
    { isConnected, joinFacility, leaveFacility, joinCourt, leaveCourt }
  )

  // Wrapper for handleSlotLock to pass setSelectedSlots
  const handleSlotLock = (timeSlot) => {
    handleSlotLockBase(timeSlot, setSelectedSlots)
  }

  const { slotTimeoutRef } = useAutoDeselect(
    selectedSlots,
    selectedCourt,
    selectedDate,
    timeSlotDuration,
    defaultSocket,
    isAuthenticated,
    setSelectedSlots
  )

  useSlotCleanup(
    selectedCourt,
    selectedDate,
    lockedSlots,
    bookedSlots,
    defaultSocket,
    isAuthenticated,
    setLockedSlots,
    setBookedSlots,
    lockedSlotsByMeRef,
    setSelectedSlots,
    slotTimeoutRef
  )

  useUnlockOnUnmount(defaultSocket, isAuthenticated, lockedSlotsByMeRef, slotTimeoutRef)

  const { handleBookingSubmit, isProcessing } = useBookingSubmission(
    venueData,
    selectedCourt,
    selectedFieldType,
    selectedSlots,
    selectedDate,
    courts,
    timeSlotDuration,
    promotionData,
    contactInfo,
    user,
    venueId,
    setShowBookingModal,
    slotTimeoutRef,
    isAuthenticated,
    timeSlotsData
  )

  // Reset field type when sport category changes
  useEffect(() => {
    if (selectedSportCategory) {
      setSelectedFieldType(null)
    }
  }, [selectedSportCategory])

  // Scroll to top when component mounts or venue changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [venueId, venueData])

  // Reset slots when date changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    setSelectedSlots([])
  }

  const handleBookNow = () => {
    // Validate all required fields before showing booking modal
    if (!selectedFieldType) {
      toast.error('Vui lòng chọn loại sân')
      return
    }
    
    if (!selectedCourt) {
      toast.error('Vui lòng chọn sân')
      return
    }
    
    if (selectedSlots.length === 0) {
      toast.error('Vui lòng chọn khung giờ')
      return
    }
    
    // All validations passed, show booking modal
    setShowBookingModal(true)
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #16a34a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{
          color: '#374151',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Đang tải thông tin cơ sở...
        </div>
      </div>
    )
  }

  // Error state
  if (error || !venueData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px'
      }}>
        <div style={{
          color: '#dc2626',
          fontSize: '20px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {error || 'Không tìm thấy cơ sở'}
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Về trang chủ
        </button>
      </div>
    )
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
            courts={courts}
            courtTypes={courtTypes}
            sportCategories={sportCategories}
            selectedSportCategory={selectedSportCategory}
            onSportCategoryChange={setSelectedSportCategory}
            selectedCourt={selectedCourt}
            onCourtChange={setSelectedCourt}
            selectedFieldType={selectedFieldType}
            onFieldTypeChange={setSelectedFieldType}
            loading={loading}
          />

          {/* Time Slot Selector */}
          <TimeSlotSelector 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedSlots={selectedSlots}
            onSlotSelect={setSelectedSlots}
            selectedCourt={selectedCourt}
            venuePrice={venueData.pricePerHour}
            onTimeSlotsDataChange={setTimeSlotsData}
            lockedSlots={lockedSlots}
            onSlotLock={handleSlotLock}
            onSlotUnlock={handleSlotUnlock}
            bookedSlots={bookedSlots}
            currentUserId={user?._id}
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
            courts={courts}
            timeSlotsData={timeSlotsData}
            onBookNow={handleBookNow}
            venueId={venueId}
            timeSlotDuration={timeSlotDuration}
            onPromotionChange={setPromotionData}
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
          <ReviewsSection 
            reviews={reviews} 
            venueRating={reviewsStats.averageRating || venueData.rating || 0}
            totalReviews={reviewsStats.totalReviews || 0}
            loading={reviewsLoading}
            facilityId={venueId}
            onPageChange={setReviewsPage}
            onRatingFilterChange={(rating) => {
              // Will be handled by ReviewsSection component
            }}
          />
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
          courts={courts}
          promotionData={promotionData}
          onClose={() => {
            setShowBookingModal(false)
            setContactInfo(null)
          }}
          onSubmit={(contactInfoData) => {
            setContactInfo(contactInfoData)
            handleBookingSubmit()
          }}
          timeSlotsData={timeSlotsData}
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

