import React, { useState, useEffect, useRef } from 'react'
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, generateCalendarDays } from '../utils/dateHelpers'
import { getBookedSlots } from '../mockData'

export default function TimeSlotSelector({ 
  selectedDate, 
  onDateChange, 
  selectedSlots, 
  onSlotSelect,
  venuePrice
}) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  
  const datePickerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    }

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])
  
  // Time slots 1 tiếng với giá tiền (hiển thị dạng range)
  const timeSlots = [
    { time: '06:00', endTime: '07:00', price: 200000 },
    { time: '07:00', endTime: '08:00', price: 200000 },
    { time: '08:00', endTime: '09:00', price: 200000 },
    { time: '09:00', endTime: '10:00', price: 250000 },
    { time: '10:00', endTime: '11:00', price: 250000 },
    { time: '11:00', endTime: '12:00', price: 250000 },
    { time: '12:00', endTime: '13:00', price: 250000 },
    { time: '13:00', endTime: '14:00', price: 250000 },
    { time: '14:00', endTime: '15:00', price: 300000 },
    { time: '15:00', endTime: '16:00', price: 300000 },
    { time: '16:00', endTime: '17:00', price: 300000 },
    { time: '17:00', endTime: '18:00', price: 350000 },
    { time: '18:00', endTime: '19:00', price: 350000 },
    { time: '19:00', endTime: '20:00', price: 350000 },
    { time: '20:00', endTime: '21:00', price: 350000 },
    { time: '21:00', endTime: '22:00', price: 300000 }
  ]
  
  // Mock booked slots - In real app, this would come from API
  const bookedTimes = ['08:00', '11:00', '16:00', '20:00']

  const handleSlotClick = (timeSlot) => {
    const slotKey = `${selectedDate.toISOString().split('T')[0]}-${timeSlot.time}`
    
    if (selectedSlots.includes(slotKey)) {
      onSlotSelect(selectedSlots.filter(slot => slot !== slotKey))
    } else {
      onSlotSelect([...selectedSlots, slotKey])
    }
  }

  const isSlotSelected = (timeSlot) => {
    const slotKey = `${selectedDate.toISOString().split('T')[0]}-${timeSlot.time}`
    return selectedSlots.includes(slotKey)
  }

  const calculateTotal = () => {
    return selectedSlots.reduce((total, slotKey) => {
      const time = slotKey.split('-')[2] // Get time from key
      const slot = timeSlots.find(s => s.time === time)
      return total + (slot?.price || 0)
    }, 0)
  }

  const isSlotBooked = (timeSlot) => {
    return bookedTimes.includes(timeSlot.time)
  }

  const isPastTime = (timeSlot) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    
    // If selected date is in the future, no slots are past
    if (selectedDateOnly > today) return false
    
    // If selected date is in the past, all slots are past
    if (selectedDateOnly < today) return true
    
    // If selected date is today, check if time slot is in the past
    const [hours] = timeSlot.time.split(':').map(Number)
    const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, 0)
    
    return slotTime < now
  }
  
  const getSlotStatus = (timeSlot) => {
    if (isPastTime(timeSlot) || isSlotBooked(timeSlot)) return 'booked'
    if (isSlotSelected(timeSlot)) return 'selected'
    return 'available'
  }

  return (
    <div style={{ 
      background: '#fff', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '16px' 
          }}>
            <Clock size={20} color="#374151" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              Chọn khung giờ
            </h3>
          </div>

          {/* Date Picker */}
          <div ref={datePickerRef} style={{ position: 'relative', marginBottom: '16px' }}>
            <button
              onClick={() => {
                setShowDatePicker(!showDatePicker)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9ca3af'
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.background = '#fff'
              }}
            >
              <Calendar size={16} />
              {formatDate(selectedDate)}
            </button>

            {/* Calendar Picker - Dropdown */}
            {showDatePicker && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  zIndex: 1000,
                  border: '1px solid #e5e7eb',
                  maxWidth: '320px',
                  width: '100%'
                }}
              >
              {/* Calendar Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate)
                    newDate.setMonth(newDate.getMonth() - 1)
                    onDateChange(newDate)
                  }}
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
                  onClick={() => {
                    const newDate = new Date(selectedDate)
                    newDate.setMonth(newDate.getMonth() + 1)
                    onDateChange(newDate)
                  }}
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
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
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
                {generateCalendarDays(selectedDate).map((day, index) => {
                  const isSelected = day.date.toDateString() === selectedDate.toDateString()
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!day.isPast) {
                          onDateChange(day.date)
                          setShowDatePicker(false)
                        }
                      }}
                      disabled={day.isPast}
                      style={{
                        background: isSelected ? '#1f2937' : 
                                   day.isToday ? '#f3f4f6' : 'transparent',
                        color: isSelected ? '#fff' : 
                               day.isPast ? '#d1d5db' :
                               day.isCurrentMonth ? '#1f2937' : '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 4px',
                        fontSize: '14px',
                        fontWeight: isSelected ? '600' : '400',
                        cursor: day.isPast ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: day.isPast ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected && !day.isPast) {
                          e.target.style.background = '#f3f4f6'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !day.isPast) {
                          e.target.style.background = day.isToday ? '#f3f4f6' : 'transparent'
                        }
                      }}
                    >
                      {day.date.getDate()}
                    </button>
                  )
                })}
              </div>
              </div>
            )}
          </div>
        </div>

        {/* Time Slots Grid */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            {timeSlots.map((slot) => {
              const status = getSlotStatus(slot)
              const isSelected = status === 'selected'
              const isBooked = status === 'booked'
              
              return (
                <button
                  key={slot.time}
                  onClick={() => !isBooked && handleSlotClick(slot)}
                  disabled={isBooked}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 12px',
                    border: isSelected ? '2px solid #000' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: isSelected ? '#000' : isBooked ? '#f5f5f5' : '#fff',
                    cursor: isBooked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '90px'
                  }}
                  onMouseEnter={(e) => {
                    if (status === 'available') {
                      e.currentTarget.style.borderColor = '#9ca3af'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status === 'available') {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  <div style={{ 
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isSelected ? '#fff' : isBooked ? '#9ca3af' : '#1f2937'
                  }}>
                    {slot.time} - {slot.endTime}
                  </div>
                  
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isSelected ? '#fff' : isBooked ? '#9ca3af' : '#374151'
                  }}>
                    {isBooked ? 'Đã đặt' : `${slot.price.toLocaleString('vi-VN')} đ`}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          alignItems: 'center',
          gap: window.innerWidth <= 768 ? '12px' : '24px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: '#000',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '14px', color: '#374151' }}>Đã chọn</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '14px', color: '#374151' }}>Còn trống</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: '#f5f5f5',
              border: '1px solid #e5e7eb',
              borderRadius: '4px'
            }}></div>
            <span style={{ fontSize: '14px', color: '#374151' }}>Đã đặt</span>
          </div>
        </div>

      </div>
    </div>
  )
}

