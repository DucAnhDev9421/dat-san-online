//Trang đặt sân
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Booking() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedStartTime, setSelectedStartTime] = useState('')
  const [selectedEndTime, setSelectedEndTime] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })

  // Mock venue data - in real app this would come from API
  const venueData = {
    id: 1,
    name: 'Sân bóng đá ABC',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0123456789',
    rating: 4.5,
    price: '200,000 VNĐ/giờ',
    images: ['venue1.jpg', 'venue2.jpg'],
    facilities: ['Thay đồ', 'Nước uống', 'Bãi đỗ xe', 'Wifi'],
    description: 'Sân bóng đá chất lượng cao với cỏ nhân tạo, phù hợp cho các trận đấu và luyện tập.'
  }

  // Venue operating hours
  const operatingHours = {
    open: '06:00',
    close: '22:00',
    pricePerHour: 200000 // VNĐ per hour
  }

  // Generate time options for time picker
  const generateTimeOptions = () => {
    const options = []
    const [openHour, openMin] = operatingHours.open.split(':').map(Number)
    const [closeHour, closeMin] = operatingHours.close.split(':').map(Number)
    
    for (let hour = openHour; hour <= closeHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === closeHour && min > closeMin) break
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        options.push(timeString)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  // Mock calendar data
  const generateCalendar = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    
    const calendar = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: '', disabled: true })
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isPast = date < today
      const isToday = date.toDateString() === today.toDateString()
      
      calendar.push({
        day: day,
        disabled: isPast,
        isToday: isToday,
        available: !isPast && Math.random() > 0.3 // Mock availability
      })
    }
    
    return calendar
  }

  const handleDateSelect = (day) => {
    if (day && !day.disabled) {
      const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
      setSelectedDate(newDate)
      setSelectedStartTime('') // Reset time when date changes
      setSelectedEndTime('')
    }
  }

  const handleStartTimeChange = (time) => {
    setSelectedStartTime(time)
    // Auto-set end time to 1 hour later if not set
    if (!selectedEndTime) {
      const [hour, min] = time.split(':').map(Number)
      const endHour = hour + 1
      if (endHour <= 22) {
        setSelectedEndTime(`${endHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
      }
    }
  }

  const handleEndTimeChange = (time) => {
    setSelectedEndTime(time)
  }

  const handleBookNow = () => {
    if (selectedStartTime && selectedEndTime) {
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
    // In real app, this would submit to API
    alert('Đặt sân thành công! Chúng tôi sẽ liên hệ lại với bạn.')
    setShowBookingModal(false)
    setSelectedStartTime('')
    setSelectedEndTime('')
    setBookingForm({ name: '', phone: '', email: '', notes: '' })
  }

  const calculateDuration = () => {
    if (selectedStartTime && selectedEndTime) {
      const [startHour, startMin] = selectedStartTime.split(':').map(Number)
      const [endHour, endMin] = selectedEndTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      return (endMinutes - startMinutes) / 60
    }
    return 0
  }

  const calculateTotal = () => {
    const duration = calculateDuration()
    return (duration * operatingHours.pricePerHour).toLocaleString('vi-VN')
  }

  const calendar = generateCalendar()
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                     'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']

  return (
    <main className="booking-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <span>Đặt sân</span>
        </nav>

        {/* Venue Info */}
        <section className="venue-info">
          <div className="venue-gallery">
            <div className="main-image">
              <div className="image-placeholder">Hình ảnh sân</div>
            </div>
            <div className="thumbnail-images">
              <div className="thumbnail">Hình 1</div>
              <div className="thumbnail">Hình 2</div>
              <div className="thumbnail">Hình 3</div>
            </div>
          </div>
          
          <div className="venue-details">
            <h1>{venueData.name}</h1>
            <div className="venue-rating">
              <span className="stars">★★★★☆</span>
              <span className="rating-text">({venueData.rating}/5)</span>
            </div>
            <p className="venue-address">📍 {venueData.address}</p>
            <p className="venue-phone">📞 {venueData.phone}</p>
            <p className="venue-price">💰 {venueData.price}</p>
            
            <div className="venue-facilities">
              <h3>Tiện ích</h3>
              <div className="facilities-grid">
                {venueData.facilities.map((facility, index) => (
                  <span key={index} className="facility-tag">{facility}</span>
                ))}
              </div>
            </div>
            
            <div className="venue-description">
              <h3>Mô tả</h3>
              <p>{venueData.description}</p>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="booking-section">
          <div className="booking-calendar">
            <h3>Chọn ngày</h3>
            <div className="calendar-header">
              <h4>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h4>
            </div>
            <div className="calendar-grid">
              <div className="calendar-weekdays">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="calendar-days">
                {calendar.map((day, index) => (
                  <button
                    key={index}
                    className={`calendar-day ${day.isToday ? 'today' : ''} ${day.disabled ? 'disabled' : ''} ${day.available ? 'available' : 'unavailable'} ${selectedDate.getDate() === day.day ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(day)}
                    disabled={day.disabled || !day.available}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="booking-time">
            <h3>Chọn thời gian</h3>
            <div className="time-picker">
              <div className="time-input-group">
                <label>Giờ bắt đầu</label>
                <select 
                  className="time-select"
                  value={selectedStartTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                >
                  <option value="">Chọn giờ bắt đầu</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div className="time-input-group">
                <label>Giờ kết thúc</label>
                <select 
                  className="time-select"
                  value={selectedEndTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  disabled={!selectedStartTime}
                >
                  <option value="">Chọn giờ kết thúc</option>
                  {timeOptions
                    .filter(time => {
                      if (!selectedStartTime) return true
                      const [startHour, startMin] = selectedStartTime.split(':').map(Number)
                      const [timeHour, timeMin] = time.split(':').map(Number)
                      const startMinutes = startHour * 60 + startMin
                      const timeMinutes = timeHour * 60 + timeMin
                      return timeMinutes > startMinutes
                    })
                    .map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))
                  }
                </select>
              </div>
              
              {selectedStartTime && selectedEndTime && (
                <div className="time-summary">
                  <div className="duration-info">
                    <span>Thời gian: {selectedStartTime} - {selectedEndTime}</span>
                    <span>Kéo dài: {calculateDuration()} giờ</span>
                  </div>
                  <div className="price-info">
                    <span>Tổng tiền: {calculateTotal()} VNĐ</span>
                  </div>
                  <button 
                    className="btn btn-primary book-now-btn"
                    onClick={handleBookNow}
                  >
                    Đặt sân ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="total-price">{calculateTotal()}.000₫</div>
                <button 
                  className="close-btn"
                  onClick={() => setShowBookingModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="contact-form">
                  <h4>Thông tin liên hệ</h4>
                  <form onSubmit={handleBookingSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        className="input"
                        placeholder="Nhập tên của bạn"
                        value={bookingForm.name}
                        onChange={handleFormChange}
                        required
                      />
                      <label>Tên người đặt *</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="tel"
                        name="phone"
                        className="input"
                        placeholder="Nhập số điện thoại"
                        value={bookingForm.phone}
                        onChange={handleFormChange}
                        required
                      />
                      <label>Số điện thoại *</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        className="input"
                        placeholder="Nhập email (không bắt buộc)"
                        value={bookingForm.email}
                        onChange={handleFormChange}
                      />
                      <label>Email</label>
                    </div>
                    <div className="form-group">
                      <textarea
                        name="notes"
                        className="input"
                        placeholder="Ghi chú (nếu có)"
                        value={bookingForm.notes}
                        onChange={handleFormChange}
                        rows="3"
                      />
                      <label>Ghi chú cho chủ sân</label>
                    </div>
                    
                    <div className="info-message">
                      <span className="check-icon">✓</span>
                      Thông tin đơn hàng sẽ được gửi đến số điện thoại và email bạn cung cấp.
                    </div>
                    
                    <div className="modal-actions">
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => setShowBookingModal(false)}
                      >
                        ← Quay lại
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </form>
                </div>

                <div className="booking-summary">
                  <h4>Tạm tính</h4>
                  <h5>Thông tin đặt sân</h5>
                  
                  <div className="summary-details">
                    <div className="summary-item">
                      <span>Ngày:</span>
                      <span>{selectedDate.toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="summary-item">
                      <span>Tên sân:</span>
                      <span>{venueData.name}</span>
                    </div>
                    <div className="summary-item">
                      <span>Địa chỉ:</span>
                      <span>{venueData.address}</span>
                    </div>
                    <div className="summary-item">
                      <span>Khung giờ:</span>
                      <div className="time-slot-item">
                        <span>Sân 1</span>
                        <div className="time-badge">
                          <span className="clock-icon">🕐</span>
                          {selectedStartTime} - {selectedEndTime}
                        </div>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span>Tổng thời lượng:</span>
                      <span>{calculateDuration()} giờ</span>
                    </div>
                    <div className="summary-item total">
                      <span>Tổng tiền:</span>
                      <span>{calculateTotal()} VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Booking
