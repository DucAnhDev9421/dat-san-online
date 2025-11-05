import React, { useState, useEffect, useRef } from 'react'
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
import { facilityApi } from '../../../api/facilityApi'
import { courtApi } from '../../../api/courtApi'
import { categoryApi } from '../../../api/categoryApi'
import { bookingApi } from '../../../api/bookingApi'
import { useAuth } from '../../../contexts/AuthContext'
import { useSocket } from '../../../contexts/SocketContext'
import { toast } from 'react-toastify'
import { reviews } from './mockData'
import { formatDateToYYYYMMDD } from './utils/dateHelpers'

function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const venueId = searchParams.get('venue')
  const { isMobile, isTablet, isDesktop } = useDeviceType()
  const { user, isAuthenticated } = useAuth()
  const { defaultSocket, isConnected, joinFacility, leaveFacility, joinCourt, leaveCourt } = useSocket()
  
  // State management
  const [venueData, setVenueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courts, setCourts] = useState([])
  const [courtTypes, setCourtTypes] = useState([])
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedSlots, setSelectedSlots] = useState([])
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedFieldType, setSelectedFieldType] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contactInfo, setContactInfo] = useState(null)
  const [timeSlotsData, setTimeSlotsData] = useState([])
  const [lockedSlots, setLockedSlots] = useState({}) // Track locked slots: { "courtId_date_timeSlot": { lockedBy, expiresAt, isLockedByMe, isLockedByOther } }
  const hasUnlockedRef = useRef(false) // Track if we've already unlocked on unmount

  // Transform facility data to venue format for components
  const transformFacilityToVenue = (facility) => {
    // Format operating hours
    const formatOperatingHours = (hours) => {
      if (!hours) return '06:00 - 22:00'
      
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const today = days[new Date().getDay()]
      const todayHours = hours[today]
      
      if (todayHours && todayHours.isOpen) {
        return `${todayHours.open} - ${todayHours.close}`
      }
      
      // Fallback: return first available day
      for (const day of days) {
        if (hours[day] && hours[day].isOpen) {
          return `${hours[day].open} - ${hours[day].close}`
        }
      }
      
      return '06:00 - 22:00'
    }

    // Format price
    const formatPrice = (pricePerHour) => {
      if (!pricePerHour) return '0 VNĐ/giờ'
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      }).format(pricePerHour) + '/giờ'
    }

    // Get images array
    const images = facility.images && facility.images.length > 0
      ? facility.images.map(img => img.url)
      : ['/sports-meeting.webp']

    return {
      id: facility._id || facility.id,
      name: facility.name,
      address: facility.address,
      rating: facility.averageRating || facility.rating || 0,
      reviewCount: facility.reviewCount || 0,
      phone: facility.phoneNumber || '',
      price: formatPrice(facility.pricePerHour),
      pricePerHour: facility.pricePerHour || 0,
      operatingHours: formatOperatingHours(facility.operatingHours),
      capacity: facility.capacity || 'N/A',
      facilities: facility.types || [],
      services: facility.services || [],
      description: facility.description || 'Không có mô tả',
      images: images,
      location: facility.location || null,
      sport: facility.types?.[0] || 'Bóng đá'
    }
  }

  // Fetch facility data, courts, and court types from API
  useEffect(() => {
    const fetchData = async () => {
      if (!venueId) {
        setError('Không tìm thấy ID cơ sở')
        setLoading(false)
        toast.error('Không tìm thấy ID cơ sở')
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch facility data
        const facilityResult = await facilityApi.getFacilityById(venueId)
        
        if (!facilityResult.success || !facilityResult.data) {
          setError('Không tìm thấy cơ sở')
          toast.error('Không tìm thấy cơ sở')
          return
        }

        const transformedData = transformFacilityToVenue(facilityResult.data)
        setVenueData(transformedData)

        // Courts will be fetched in separate useEffect when field type changes
        // This avoids duplicate fetches

        // Fetch court types
        try {
          const courtTypesResult = await categoryApi.getCourtTypes({
            status: 'active'
          })
          
          if (courtTypesResult.success && courtTypesResult.data) {
            const typesList = Array.isArray(courtTypesResult.data)
              ? courtTypesResult.data
              : courtTypesResult.data.courtTypes || []
            
            const types = typesList.map(type => ({
              id: type._id || type.id,
              name: type.name,
              description: type.description
            }))
            setCourtTypes(types)
            
            // Don't auto-select field type - let user choose
            // This prevents filtering issues when courts haven't loaded yet
          }
        } catch (typesError) {
          // Don't show error toast for court types
        }

      } catch (error) {
        setError('Không thể tải thông tin cơ sở')
        toast.error('Không thể tải thông tin cơ sở. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [venueId])

  // Scroll to top when component mounts or venue changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [venueId, venueData])

  // Fetch courts when field type changes (using API filter)
  useEffect(() => {
    if (!venueId) return

    const fetchCourtsByType = async () => {
      try {
        // Build query params
        const params = {
          facility: venueId,
          status: 'active',
          limit: 100
        }

        // Add typeId filter if field type is selected
        if (selectedFieldType) {
          // Find courtType object from courtTypes array by name
          const selectedCourtType = courtTypes.find(ct => ct.name === selectedFieldType)
          if (selectedCourtType && selectedCourtType.id) {
            // Use typeId (preferred method - by reference)
            params.typeId = selectedCourtType.id
          } else {
            // Fallback: use type name (backward compatible)
            params.type = selectedFieldType
          }
        }

        const courtsResult = await courtApi.getCourts(params)
        
        if (courtsResult.success && courtsResult.data && courtsResult.data.courts) {
          const courtsList = courtsResult.data.courts.map(court => ({
            id: court._id || court.id,
            name: court.name,
            type: court.type,
            price: court.price,
            capacity: court.capacity,
            status: court.status
          }))
          
          setCourts(courtsList)
          
          // Auto-select first court if available
          if (courtsList.length > 0) {
            setSelectedCourt(prev => {
              // Check if current selected court is still valid
              const isValid = prev && courtsList.some(c => (c.id || c._id) === prev)
              if (!isValid) {
                // Reset to first available court if current selection is invalid
                return courtsList[0].id || courtsList[0]._id
              }
              // Keep current selection if valid, or select first if none
              return prev || courtsList[0].id || courtsList[0]._id
            })
          } else {
            // Clear selection if no courts available
            setSelectedCourt(null)
            
            // Fallback: fetch all courts to see what types are available
            if (selectedFieldType) {
              try {
                const allCourtsResult = await courtApi.getCourts({
                  facility: venueId,
                  status: 'active',
                  limit: 100
                })
                if (allCourtsResult.success && allCourtsResult.data && allCourtsResult.data.courts) {
                  const allCourtsList = allCourtsResult.data.courts.map(court => ({
                    id: court._id || court.id,
                    name: court.name,
                    type: court.type,
                    price: court.price,
                    capacity: court.capacity,
                    status: court.status
                  }))
                  
                  // Show all courts as fallback so user can still see available courts
                  setCourts(allCourtsList)
                  if (allCourtsList.length > 0) {
                    setSelectedCourt(allCourtsList[0].id || allCourtsList[0]._id)
                  }
                }
              } catch (fallbackError) {
                // Silently fail fallback fetch
              }
            }
          }
        }
      } catch (error) {
        // Don't show toast for court fetch errors
      }
    }

    // Always fetch when field type changes
    // If selectedFieldType is null, fetch all courts (no filter)
    fetchCourtsByType()
  }, [selectedFieldType, venueId, courtTypes])

  // Socket.IO: Join facility and court rooms, listen for slot lock events
  useEffect(() => {
    if (!venueId || !selectedCourt || !isConnected || !defaultSocket || !isAuthenticated) return

    // Join facility room to receive updates
    joinFacility(venueId, 'default')
    
    // Join court room for specific court updates
    joinCourt(selectedCourt, venueId, 'default')

    // Listen for slot lock events from other users
    const handleSlotLocked = (data) => {
      const { courtId, date, timeSlot, lockedBy, expiresAt } = data
      
      // Only update if it's not locked by current user
      if (lockedBy !== user?._id) {
        const lockKey = `${courtId}_${date}_${timeSlot}`
        setLockedSlots(prev => ({
          ...prev,
          [lockKey]: { lockedBy, expiresAt, isLockedByOther: true }
        }))
      }
    }

    const handleSlotUnlocked = (data) => {
      const { courtId, date, timeSlot } = data
      const lockKey = `${courtId}_${date}_${timeSlot}`
      setLockedSlots(prev => {
        const newState = { ...prev }
        delete newState[lockKey]
        return newState
      })
    }

    const handleSlotConfirmed = (data) => {
      const { courtId, date, timeSlots } = data
      // Remove confirmed slots from locked slots
      // date can be Date object or string (YYYY-MM-DD), handle both cases
      let dateStr
      if (date instanceof Date) {
        dateStr = formatDateToYYYYMMDD(date)
      } else if (typeof date === 'string') {
        // If it's already in YYYY-MM-DD format, use it directly
        dateStr = date.includes('T') ? formatDateToYYYYMMDD(new Date(date)) : date
      } else {
        dateStr = formatDateToYYYYMMDD(new Date(date))
      }
      
      timeSlots.forEach(timeSlot => {
        const lockKey = `${courtId}_${dateStr}_${timeSlot}`
        setLockedSlots(prev => {
          const newState = { ...prev }
          delete newState[lockKey]
          return newState
        })
      })
    }

    defaultSocket.on('booking:slot:locked', handleSlotLocked)
    defaultSocket.on('booking:slot:unlocked', handleSlotUnlocked)
    defaultSocket.on('booking:slot:confirmed', handleSlotConfirmed)

    return () => {
      defaultSocket.off('booking:slot:locked', handleSlotLocked)
      defaultSocket.off('booking:slot:unlocked', handleSlotUnlocked)
      defaultSocket.off('booking:slot:confirmed', handleSlotConfirmed)
      leaveFacility(venueId, 'default')
      leaveCourt(selectedCourt, 'default')
    }
  }, [venueId, selectedCourt, isConnected, defaultSocket, isAuthenticated, user?._id, joinFacility, leaveFacility, joinCourt, leaveCourt])

  // Reset slots when date changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    setSelectedSlots([])
  }

  // Handle slot lock (when user selects a slot)
  const handleSlotLock = (timeSlot) => {
    if (!selectedCourt || !selectedDate || !defaultSocket || !isAuthenticated) return
    
    // Use local timezone format, not UTC
    const dateStr = formatDateToYYYYMMDD(selectedDate)
    const timeSlotStr = timeSlot // Format: "18:00-19:00"
    
    defaultSocket.emit('booking:lock', {
      courtId: selectedCourt,
      date: dateStr,
      timeSlot: timeSlotStr
    })

    // Listen for lock success
    const handleLockSuccess = (data) => {
      if (data.courtId === selectedCourt && data.timeSlot === timeSlotStr) {
        const lockKey = `${selectedCourt}_${dateStr}_${timeSlotStr}`
        setLockedSlots(prev => ({
          ...prev,
          [lockKey]: { 
            lockedBy: user?._id, 
            expiresAt: data.expiresAt,
            isLockedByMe: true 
          }
        }))
        defaultSocket.off('booking:lock:success', handleLockSuccess)
        defaultSocket.off('booking:lock:error', handleLockError)
      }
    }

    const handleLockError = (error) => {
      toast.error(error.message || 'Không thể giữ chỗ. Slot có thể đang được người khác chọn.')
      // Remove slot from selection if lock fails
      const slotKey = `${dateStr}-${timeSlotStr.split('-')[0]}`
      setSelectedSlots(prev => prev.filter(slot => slot !== slotKey))
      defaultSocket.off('booking:lock:success', handleLockSuccess)
      defaultSocket.off('booking:lock:error', handleLockError)
    }

    defaultSocket.once('booking:lock:success', handleLockSuccess)
    defaultSocket.once('booking:lock:error', handleLockError)
  }

  // Handle slot unlock (when user deselects a slot)
  const handleSlotUnlock = (timeSlot) => {
    if (!selectedCourt || !selectedDate || !defaultSocket || !isAuthenticated) return
    
    // Use local timezone format, not UTC
    const dateStr = formatDateToYYYYMMDD(selectedDate)
    const timeSlotStr = timeSlot
    
    defaultSocket.emit('booking:unlock', {
      courtId: selectedCourt,
      date: dateStr,
      timeSlot: timeSlotStr
    })

    // Remove from lockedSlots on success
    const handleUnlockSuccess = () => {
      const lockKey = `${selectedCourt}_${dateStr}_${timeSlotStr}`
      setLockedSlots(prev => {
        const newState = { ...prev }
        delete newState[lockKey]
        return newState
      })
      defaultSocket.off('booking:unlock:success', handleUnlockSuccess)
      defaultSocket.off('booking:unlock:error', handleUnlockError)
    }

    const handleUnlockError = (error) => {
      // Silently fail unlock error, slot will expire anyway
      defaultSocket.off('booking:unlock:success', handleUnlockSuccess)
      defaultSocket.off('booking:unlock:error', handleUnlockError)
    }

    defaultSocket.once('booking:unlock:success', handleUnlockSuccess)
    defaultSocket.once('booking:unlock:error', handleUnlockError)
  }

  // Unlock all slots when component unmounts
  useEffect(() => {
    return () => {
      if (!hasUnlockedRef.current && defaultSocket && isAuthenticated) {
        hasUnlockedRef.current = true
        // Unlock all slots locked by current user
        defaultSocket.emit('booking:unlock:all')
      }
    }
  }, [defaultSocket, isAuthenticated])

  // Track previous court to detect changes
  const previousCourtRef = useRef(selectedCourt)
  const previousDateRef = useRef(selectedDate)

  // Cleanup locked slots and validate selected slots when court or date changes
  useEffect(() => {
    const dateStr = formatDateToYYYYMMDD(selectedDate)
    const courtChanged = previousCourtRef.current !== selectedCourt
    const dateChanged = previousDateRef.current?.getTime() !== selectedDate?.getTime()

    if (!selectedCourt) {
      // If no court selected, clear all selected slots and locked slots
      setSelectedSlots([])
      setLockedSlots({})
      previousCourtRef.current = selectedCourt
      previousDateRef.current = selectedDate
      return
    }

    // When court changes, unlock all slots from previous court and clear selected slots
    if (courtChanged && previousCourtRef.current && defaultSocket && isAuthenticated) {
      // Unlock all slots from previous court
      const previousLocks = Object.keys(lockedSlots)
        .filter(key => {
          const parts = key.split('_')
          if (parts.length >= 3) {
            const lockCourtId = parts[0]
            return lockCourtId === previousCourtRef.current
          }
          return false
        })
        .map(key => {
          const parts = key.split('_')
          if (parts.length >= 3) {
            const lockInfo = lockedSlots[key]
            if (lockInfo?.isLockedByMe) {
              return {
                courtId: parts[0],
                date: parts[1],
                timeSlot: parts.slice(2).join('_')
              }
            }
          }
          return null
        })
        .filter(item => item !== null)

      // Unlock slots from previous court
      previousLocks.forEach(({ courtId, date, timeSlot }) => {
        defaultSocket.emit('booking:unlock', { courtId, date, timeSlot })
      })

      // Clear selected slots when court changes
      setSelectedSlots(prev => {
        if (prev.length > 0) {
          toast.info('Đã xóa các khung giờ đã chọn vì bạn đã đổi sân. Vui lòng chọn lại.')
          return []
        }
        return prev
      })
    }

    // Clear locked slots that don't match current court/date
    setLockedSlots(prev => {
      const newState = {}
      Object.keys(prev).forEach(key => {
        if (key.startsWith(`${selectedCourt}_${dateStr}_`)) {
          newState[key] = prev[key]
        }
      })
      return newState
    })

    previousCourtRef.current = selectedCourt
    previousDateRef.current = selectedDate
  }, [selectedCourt, selectedDate, defaultSocket, isAuthenticated])

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

  const handleBookingSubmit = async (bookingData) => {
    // Validate all required fields
    if (!venueData) {
      toast.error('Không tìm thấy thông tin cơ sở')
      return
    }
    
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

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt sân')
      navigate('/login')
      return
    }

    setIsProcessing(true)
    setShowBookingModal(false)

    try {
      // Get court data
      const selectedCourtData = courts.find(c => (c.id || c._id) === selectedCourt)
      if (!selectedCourtData) {
        toast.error('Không tìm thấy thông tin sân')
        setIsProcessing(false)
        return
      }

      // Parse timeSlots from format "YYYY-MM-DD-HH:MM" to "HH:MM-HH:MM"
      const formatTimeSlots = (slots) => {
        return slots.map(slot => {
          // Parse slot: "2024-01-15-18:00" -> "18:00-19:00"
          const parts = slot.split('-')
          if (parts.length >= 4) {
            const hourStr = parts[3] // "18:00"
            const [hours, minutes] = hourStr.split(':').map(Number)
            const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
            // Calculate end time (add 1 hour)
            const endHours = (hours + 1) % 24
            const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
            return `${startTime}-${endTime}`
          }
          return slot
        })
      }

      const formattedTimeSlots = formatTimeSlots(selectedSlots)

      // Prepare booking data for API
      const bookingPayload = {
        courtId: selectedCourt,
        facilityId: venueId,
        date: formatDateToYYYYMMDD(selectedDate), // Format: YYYY-MM-DD in local timezone
        timeSlots: formattedTimeSlots,
        contactInfo: contactInfo || {
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          notes: ''
        },
        totalAmount: calculateTotalAmount()
      }

      // Create booking via API
      const result = await bookingApi.createBooking(bookingPayload)

      if (result.success) {
        // API returns { booking: {...}, paymentPending: true }
        const booking = result.data?.booking || result.data
        const courtName = selectedCourtData.name

        // Get bookingId
        const bookingId = booking?._id || booking?.id
        
        if (!bookingId) {
          toast.error('Không thể lấy ID booking. Vui lòng thử lại.')
          setIsProcessing(false)
          return
        }

        // Prepare booking data to pass to payment page
        const bookingInfo = {
          bookingId: bookingId,
          venueId: venueData.id,
          venueName: venueData.name,
          sport: venueData.sport,
          courtId: selectedCourt,
          courtNumber: courtName,
          fieldType: selectedFieldType,
          date: selectedDate.toLocaleDateString('vi-VN'),
          time: formattedTimeSlots.join(', '),
          duration: selectedSlots.length,
          pricePerHour: selectedCourtData.price || venueData.pricePerHour,
          subtotal: calculateTotalAmount(),
          serviceFee: 0,
          discount: 0,
          total: calculateTotalAmount(),
          selectedSlots: selectedSlots,
          timeSlotsData: timeSlotsData,
          venueData: venueData,
          booking: booking
        }

        // Save pending booking to localStorage for recovery if user leaves payment page
        const pendingBookingKey = `pending_booking_${bookingId}`
        const pendingBookingData = {
          bookingId: bookingId,
          bookingInfo: bookingInfo,
          createdAt: Date.now(),
          expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
        }
        localStorage.setItem(pendingBookingKey, JSON.stringify(pendingBookingData))

        toast.success('Đặt sân thành công! Đang chuyển đến trang thanh toán...')

        // Navigate to payment with booking data
        navigate('/payment', {
          state: { bookingData: bookingInfo }
        })
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi đặt sân')
      }
    } catch (error) {
      const errorMessage = error.message || 'Có lỗi xảy ra khi đặt sân. Vui lòng thử lại.'
      toast.error(errorMessage)
      setIsProcessing(false)
      setShowBookingModal(true) // Reopen modal on error
    }
  }

  // Calculate total amount based on selected slots
  const calculateTotalAmount = () => {
    if (!selectedCourt || selectedSlots.length === 0) return 0
    
    // Get court data to get price
    const selectedCourtData = courts.find(c => (c.id || c._id) === selectedCourt)
    const pricePerHour = selectedCourtData?.price || venueData?.pricePerHour || 0
    
    if (!pricePerHour) return 0
    
    // Each slot is 1 hour, so multiply by pricePerHour
    return selectedSlots.length * pricePerHour
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
          courts={courts}
          onClose={() => {
            setShowBookingModal(false)
            setContactInfo(null)
          }}
          onSubmit={(contactInfoData) => {
            setContactInfo(contactInfoData)
            handleBookingSubmit()
          }}
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

