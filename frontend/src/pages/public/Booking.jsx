//Trang đặt sân - Grid Booking System
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, Maximize2 } from 'lucide-react'
import MapDisplay from '../../component/map/MapDisplay'

function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const venueId = searchParams.get('venue')

  // Scroll to top when component mounts or venue changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [venueId])
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedSlots, setSelectedSlots] = useState([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })

  // Mock venues data
  const venuesData = [
    {
    id: 1,
      name: 'Truong Football',
    address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '0376283388',
    rating: 4.5,
    price: '200,000 VNĐ/giờ',
    images: ['venue1.jpg', 'venue2.jpg'],
      facilities: ['Thay đồ', 'Nước uống', 'Bãi đỗ xe', 'Wifi', 'Cỏ nhân tạo', 'Ánh sáng'],
      description: 'Sân bóng đá chất lượng cao với cỏ nhân tạo, phù hợp cho các trận đấu và luyện tập. Có đầy đủ tiện ích và dịch vụ hỗ trợ.',
      operatingHours: '06:00 - 22:00',
      capacity: '7 người/sân'
    },
    {
      id: 2,
      name: 'Sân Bóng Đá Minh Khai',
      address: '456 Đường Minh Khai, Quận 3, TP.HCM',
      phone: '0376283389',
      rating: 4.2,
      price: '180,000 VNĐ/giờ',
      images: ['venue2.jpg'],
      facilities: ['Cỏ tự nhiên', 'Bãi đỗ xe', 'Wifi', 'Quán ăn', 'Thay đồ', 'Nước uống'],
      description: 'Sân bóng đá với cỏ tự nhiên chất lượng cao, không gian rộng rãi và thoáng mát. Có quán ăn và dịch vụ tiện ích đầy đủ.',
      operatingHours: '05:00 - 23:00',
      capacity: '8 người/sân'
    },
    {
      id: 3,
      name: 'Trung Tâm Thể Thao Quận 7',
      address: '789 Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
      phone: '0376283390',
      rating: 4.7,
      price: '250,000 VNĐ/giờ',
      images: ['venue3.jpg'],
      facilities: ['Cỏ nhân tạo', 'Hệ thống tưới', 'Camera', 'Bảo vệ 24/7', 'Thay đồ', 'Nước uống'],
      description: 'Trung tâm thể thao hiện đại với hệ thống cỏ nhân tạo cao cấp, camera giám sát và bảo vệ 24/7. Địa điểm lý tưởng cho các trận đấu chuyên nghiệp.',
      operatingHours: '06:00 - 22:00',
      capacity: '10 người/sân'
    },
    {
      id: 4,
      name: 'Sân Bóng Đá Gò Vấp',
      address: '321 Đường Quang Trung, Gò Vấp, TP.HCM',
      phone: '0376283391',
      rating: 4.0,
      price: '150,000 VNĐ/giờ',
      images: ['venue4.jpg'],
      facilities: ['Cỏ nhân tạo', 'Ánh sáng', 'Thay đồ', 'Nước uống', 'Bãi đỗ xe'],
      description: 'Sân bóng đá giá cả hợp lý với cỏ nhân tạo chất lượng tốt. Phù hợp cho các nhóm bạn và gia đình.',
      operatingHours: '05:30 - 22:30',
      capacity: '7 người/sân'
    },
    {
      id: 5,
      name: 'Sân Bóng Đá Tân Bình',
      address: '654 Đường Cộng Hòa, Tân Bình, TP.HCM',
      phone: '0376283392',
      rating: 4.3,
      price: '220,000 VNĐ/giờ',
      images: ['venue5.jpg'],
      facilities: ['Cỏ tự nhiên', 'Bãi đỗ xe', 'Wifi', 'Quán ăn', 'Thay đồ', 'Nước uống'],
      description: 'Sân bóng đá với cỏ tự nhiên được chăm sóc kỹ lưỡng. Có quán ăn và wifi miễn phí cho khách hàng.',
      operatingHours: '06:00 - 22:00',
      capacity: '8 người/sân'
    },
    {
      id: 6,
      name: 'Trung Tâm Thể Thao Bình Thạnh',
      address: '987 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
      phone: '0376283393',
      rating: 4.6,
      price: '230,000 VNĐ/giờ',
      images: ['venue6.jpg'],
      facilities: ['Cỏ nhân tạo', 'Hệ thống tưới', 'Camera', 'Bảo vệ 24/7', 'Thay đồ', 'Nước uống'],
      description: 'Trung tâm thể thao cao cấp với hệ thống cỏ nhân tạo và tưới nước tự động. An ninh tốt với camera và bảo vệ 24/7.',
      operatingHours: '05:00 - 23:00',
      capacity: '10 người/sân'
    },
    {
      id: 7,
      name: 'Sân Bóng Đá Phú Nhuận',
      address: '147 Đường Phan Đình Phùng, Phú Nhuận, TP.HCM',
      phone: '0376283394',
      rating: 4.1,
      price: '190,000 VNĐ/giờ',
      images: ['venue7.jpg'],
      facilities: ['Cỏ nhân tạo', 'Ánh sáng', 'Thay đồ', 'Nước uống', 'Bãi đỗ xe', 'Wifi'],
      description: 'Sân bóng đá với cỏ nhân tạo và hệ thống ánh sáng hiện đại. Có wifi miễn phí và bãi đỗ xe rộng rãi.',
      operatingHours: '06:00 - 22:00',
      capacity: '7 người/sân'
    },
    {
      id: 8,
      name: 'Sân Bóng Đá Thủ Đức',
      address: '258 Đường Võ Văn Ngân, Thủ Đức, TP.HCM',
      phone: '0376283395',
      rating: 4.4,
      price: '210,000 VNĐ/giờ',
      images: ['venue8.jpg'],
      facilities: ['Cỏ tự nhiên', 'Bãi đỗ xe', 'Wifi', 'Quán ăn', 'Thay đồ', 'Nước uống'],
      description: 'Sân bóng đá với cỏ tự nhiên được chăm sóc tốt. Có quán ăn và các tiện ích đầy đủ cho khách hàng.',
      operatingHours: '05:30 - 22:30',
      capacity: '8 người/sân'
    }
  ]

  // Get venue data based on ID from URL
  const venueData = venuesData.find(venue => venue.id === parseInt(venueId)) || venuesData[0]

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: 'Nguyễn Văn An',
      rating: 5,
      date: '2025-01-10',
      comment: 'Sân rất đẹp, cỏ nhân tạo chất lượng tốt. Nhân viên phục vụ nhiệt tình, giá cả hợp lý. Sẽ quay lại lần sau!',
      avatar: 'A'
    },
    {
      id: 2,
      user: 'Trần Thị Bình',
      rating: 4,
      date: '2025-01-08',
      comment: 'Sân sạch sẽ, ánh sáng tốt. Chỉ có điều bãi đỗ xe hơi chật vào cuối tuần. Nhìn chung rất hài lòng.',
      avatar: 'B'
    },
    {
      id: 3,
      user: 'Lê Hoàng Minh',
      rating: 5,
      date: '2025-01-05',
      comment: 'Đã chơi ở đây nhiều lần, chất lượng sân ổn định. Có wifi miễn phí, nước uống giá rẻ. Recommend!',
      avatar: 'L'
    },
    {
      id: 4,
      user: 'Phạm Thị Hoa',
      rating: 4,
      date: '2025-01-03',
      comment: 'Sân bóng đẹp, không gian thoáng mát. Chỉ cần cải thiện thêm về dịch vụ thay đồ thì sẽ hoàn hảo.',
      avatar: 'P'
    }
  ]

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  // Court data
  const courts = [
    { id: 1, name: 'Sân 1' },
    { id: 2, name: 'Sân 2' },
    { id: 3, name: 'Sân 3' },
    { id: 4, name: 'Sân 4' },
    { id: 5, name: 'Sân 5' },
    { id: 6, name: 'Sân 6' },
    { id: 7, name: 'Sân 7' },
    { id: 8, name: 'Sân 8' },
    { id: 10, name: 'Sân 10' }, // Note: Sân 10 appears out of order in the image
  ]

  // Time slots (30-minute intervals from 11:00 to 20:00)
  const timeSlots = []
  for (let hour = 11; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
      if (hour === 20 && min > 0) break
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      timeSlots.push(timeString)
    }
  }

  // Mock booking data - in real app this would come from API
  const getBookingStatus = (courtId, timeSlot) => {
    // Mock some booked slots
    const bookedSlots = [
      { court: 1, time: '14:00' },
      { court: 1, time: '14:30' },
      { court: 2, time: '15:00' },
      { court: 3, time: '16:00' },
      { court: 3, time: '16:30' },
      { court: 5, time: '18:00' },
      { court: 5, time: '18:30' },
      { court: 7, time: '19:00' },
    ]
    
    const isBooked = bookedSlots.some(slot => slot.court === courtId && slot.time === timeSlot)
    return isBooked ? 'booked' : 'available'
  }

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    
    // Check if the new date is not in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    newDate.setHours(0, 0, 0, 0)
    
    if (newDate >= today) {
      setSelectedDate(newDate)
      setSelectedSlots([]) // Reset selection when date changes
    }
  }

  const handleSlotClick = (courtId, timeSlot) => {
    const slotKey = `${courtId}-${timeSlot}`
    const status = getBookingStatus(courtId, timeSlot)
    const isPastTime = isTimeSlotInPast(timeSlot)
    
    if (status === 'booked' || isPastTime) return // Can't select booked or past slots
    
    setSelectedSlots(prev => {
      if (prev.includes(slotKey)) {
        return prev.filter(slot => slot !== slotKey)
      } else {
        return [...prev, slotKey]
      }
    })
  }

  const handleBookNow = () => {
    if (selectedSlots.length > 0) {
      setShowBookingModal(true)
    }
  }

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    })
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    setShowBookingModal(false)
    navigate('/payment')
  }

  const formatDate = (date) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    const dayName = days[date.getDay()]
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${dayName}, ${day}/${month}/${year}`
  }

  const generateCalendarDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const today = new Date()
    // Set today to start of day for comparison
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      currentDate.setHours(0, 0, 0, 0)
      
      days.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        isSelected: currentDate.toDateString() === selectedDate.toDateString(),
        isPast: currentDate < today
      })
    }
    
    return days
  }

  const handleCalendarDateSelect = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    
    // Only allow selecting today or future dates
    if (date >= today) {
      setSelectedDate(date)
      setShowCalendar(false)
      setSelectedSlots([]) // Reset selection when date changes
    }
  }

  const handleCalendarMonthChange = (direction) => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }

  const getSlotStatus = (courtId, timeSlot) => {
    const slotKey = `${courtId}-${timeSlot}`
    const isSelected = selectedSlots.includes(slotKey)
    const isBooked = getBookingStatus(courtId, timeSlot) === 'booked'
    
    // Check if the time slot is in the past
    const isPastTime = isTimeSlotInPast(timeSlot)
    
    if (isPastTime) return 'past'
    if (isBooked) return 'booked'
    if (isSelected) return 'selected'
    return 'available'
  }

  const isTimeSlotInPast = (timeSlot) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    
    // If selected date is in the future, no slots are past
    if (selectedDateOnly > today) return false
    
    // If selected date is in the past, all slots are past
    if (selectedDateOnly < today) return true
    
    // If selected date is today, check if time slot is in the past
    const [hours, minutes] = timeSlot.split(':').map(Number)
    const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    
    return slotTime < now
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        padding: '20px 24px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            Đặt sân - {venueData.name}
          </h1>
        </div>
        <button style={{
          background: 'none',
          border: 'none',
          padding: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#6b7280'
        }}>
          <Maximize2 size={20} />
        </button>
      </div>

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
          {/* Venue Gallery */}
          <div>
            <div style={{
              background: '#f3f4f6',
              borderRadius: '12px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              border: '2px dashed #d1d5db'
            }}>
              <span style={{ color: '#6b7280', fontSize: '16px' }}>Hình ảnh sân bóng</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  height: '60px',
                  width: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #d1d5db'
                }}>
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>Hình {i}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Venue Info */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                {venueData.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#f59e0b' }}>★★★★☆</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>({venueData.rating}/5)</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6b7280' }}>📍</span>
                <span style={{ fontSize: '14px', color: '#374151' }}>{venueData.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6b7280' }}>📞</span>
                <span style={{ fontSize: '14px', color: '#374151' }}>{venueData.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6b7280' }}>💰</span>
                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{venueData.price}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6b7280' }}>🕐</span>
                <span style={{ fontSize: '14px', color: '#374151' }}>Giờ hoạt động: {venueData.operatingHours}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6b7280' }}>👥</span>
                <span style={{ fontSize: '14px', color: '#374151' }}>Sức chứa: {venueData.capacity}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                Tiện ích
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {venueData.facilities.map((facility, index) => (
                  <span key={index} style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {facility}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                Mô tả
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                {venueData.description}
              </p>
            </div>
          </div>
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
      <div style={{
        background: '#fff',
        padding: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Đánh giá từ khách hàng
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b', fontSize: '18px' }}>★★★★☆</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>4.5</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>({reviews.length} đánh giá)</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {reviews.map((review) => (
              <div key={review.id} style={{
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {review.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      {review.user}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                        {getRatingStars(review.rating)}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button style={{
              background: 'none',
              border: '1px solid #d1d5db',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Xem tất cả đánh giá
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        background: '#fff',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151' }}>Trống</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#10b981',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151' }}>Đã chọn</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#ef4444',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151' }}>Đã đặt</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#9ca3af',
            borderRadius: '4px',
            opacity: 0.6
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151' }}>Quá thời gian đặt sân</span>
        </div>
      </div>

      {/* Date Navigation */}
      <div style={{
        background: '#fff',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => handleDateChange('prev')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={() => setShowCalendar(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#1f2937',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none'
          }}
        >
          <Calendar size={20} color="#6b7280" />
          <span>{formatDate(selectedDate)}</span>
        </button>
        
        <button
          onClick={() => handleDateChange('next')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Booking Grid */}
      <div style={{
        background: '#fff',
        padding: '24px',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `120px repeat(${timeSlots.length}, 80px)`,
          gap: '1px',
          background: '#e5e7eb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          minWidth: 'fit-content'
        }}>
          {/* Header row with time slots */}
          <div style={{
            background: '#f3f4f6',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            color: '#374151',
            fontSize: '14px'
          }}>
            Sân
          </div>
          {timeSlots.map((time, index) => (
            <div key={time} style={{
              background: '#f3f4f6',
              padding: '12px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: '#374151',
              fontSize: '12px',
              position: 'relative'
            }}>
              {time}
              {index % 2 === 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid #f59e0b'
                }}></div>
              )}
            </div>
          ))}

          {/* Court rows */}
          {courts.map((court) => (
            <React.Fragment key={court.id}>
              {/* Court name */}
              <div style={{
                background: '#ecfdf5',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                color: '#059669',
                fontSize: '14px'
              }}>
                {court.name}
              </div>
              
              {/* Time slots for this court */}
              {timeSlots.map((time) => {
                const status = getSlotStatus(court.id, time)
                return (
                  <button
                    key={`${court.id}-${time}`}
                    onClick={() => handleSlotClick(court.id, time)}
                    style={{
                      background: status === 'booked' ? '#ef4444' : 
                                status === 'selected' ? '#10b981' : 
                                status === 'past' ? '#9ca3af' : '#fff',
                      border: 'none',
                      padding: '12px 8px',
                      cursor: status === 'booked' || status === 'past' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: status === 'past' ? 0.6 : 1
                    }}
                    disabled={status === 'booked' || status === 'past'}
                    onMouseEnter={(e) => {
                      if (status === 'available') {
                        e.target.style.background = '#e0f2fe'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (status === 'available') {
                        e.target.style.background = '#fff'
                      }
                    }}
                  >
                    {status === 'selected' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#fff',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </button>
                )
              })}
            </React.Fragment>
                ))}
              </div>
            </div>

      {/* Footer */}
      <div style={{
        background: '#ecfdf5',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #d1fae5',
        zIndex: 1000,
        gap: '16px'
      }}>
        <span style={{ fontSize: '16px', color: '#059669', fontWeight: '500' }}>
          {selectedSlots.length > 0 
            ? `Đã chọn ${selectedSlots.length} khung giờ - Tổng ${(selectedSlots.length * parseInt(venueData.price.replace(/[^\d]/g, ''))).toLocaleString('vi-VN')} VNĐ` 
            : 'Vui lòng chọn sân và giờ'
          }
        </span>
        
        {selectedSlots.length > 0 && (
          <button
            onClick={handleBookNow}
            style={{
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Đặt sân
          </button>
        )}
          </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setShowCalendar(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '320px',
            width: '100%'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Calendar Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => handleCalendarMonthChange('prev')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {selectedDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </span>
              
                  <button 
                onClick={() => handleCalendarMonthChange('next')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <ChevronRight size={16} />
                  </button>
            </div>

            {/* Calendar Days Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px'
            }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  padding: '8px 4px'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px'
            }}>
              {generateCalendarDays(selectedDate).map((day, index) => (
                <button
                  key={index}
                  onClick={() => !day.isPast && handleCalendarDateSelect(day.date)}
                  disabled={day.isPast}
                  style={{
                    background: day.isSelected ? '#1f2937' : 
                               day.isToday ? '#f3f4f6' : 'transparent',
                    color: day.isSelected ? '#fff' : 
                           day.isPast ? '#d1d5db' :
                           day.isCurrentMonth ? '#1f2937' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 4px',
                    fontSize: '14px',
                    fontWeight: day.isSelected ? '600' : '400',
                    cursor: day.isPast ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: day.isPast ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!day.isSelected && !day.isPast) {
                      e.target.style.background = '#f3f4f6'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!day.isSelected && !day.isPast) {
                      e.target.style.background = day.isToday ? '#f3f4f6' : 'transparent'
                    }
                  }}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

        {/* Booking Modal */}
        {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowBookingModal(false)}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Xác nhận đặt sân
              </h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                >
                  ×
                </button>
              </div>
              
            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Booking Summary */}
              <div style={{
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Thông tin đặt sân
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Ngày:</span>
                    <span style={{ fontWeight: '500' }}>{formatDate(selectedDate)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Sân:</span>
                    <span style={{ fontWeight: '500' }}>{venueData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Số khung giờ:</span>
                    <span style={{ fontWeight: '500' }}>{selectedSlots.length} khung giờ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Tổng tiền:</span>
                    <span style={{ fontWeight: '600', color: '#059669' }}>
                      {(selectedSlots.length * parseInt(venueData.price.replace(/[^\d]/g, ''))).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
                  <form onSubmit={handleBookingSubmit}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Thông tin liên hệ
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Tên người đặt *
                    </label>
                      <input
                        type="text"
                        name="name"
                        value={bookingForm.name}
                        onChange={handleFormChange}
                        required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nhập tên của bạn"
                    />
                    </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Số điện thoại *
                    </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingForm.phone}
                        onChange={handleFormChange}
                        required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nhập số điện thoại"
                    />
                    </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Email
                    </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingForm.email}
                        onChange={handleFormChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nhập email (không bắt buộc)"
                    />
                    </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Ghi chú cho chủ sân
                    </label>
                      <textarea
                        name="notes"
                        value={bookingForm.notes}
                        onChange={handleFormChange}
                        rows="3"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder="Ghi chú (nếu có)"
                    />
                  </div>
                    </div>
                    
                <div style={{
                  background: '#ecfdf5',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#059669' }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#059669' }}>
                      Thông tin đơn hàng sẽ được gửi đến số điện thoại và email bạn cung cấp.
                  </span>
                    </div>
                    
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button 
                        type="button" 
                        onClick={() => setShowBookingModal(false)}
                    style={{
                      padding: '12px 24px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: '#fff',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Quay lại
                      </button>
                      <button 
                        type="submit" 
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#3b82f6',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default Booking
