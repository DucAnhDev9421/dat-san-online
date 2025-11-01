import { timeSlotPrices } from '../constants'

export const convertSelectedSlotsToSlots = (selectedSlots) => {
  if (!selectedSlots || selectedSlots.length === 0) return []
  
  const timeMap = {
    '22:00': '23:00', '21:00': '22:00', '20:00': '21:00',
    '19:00': '20:00', '18:00': '19:00', '17:00': '18:00',
    '16:00': '17:00', '15:00': '16:00', '14:00': '15:00',
    '13:00': '14:00', '12:00': '13:00', '11:00': '12:00',
    '10:00': '11:00', '09:00': '10:00', '08:00': '09:00',
    '07:00': '08:00', '06:00': '07:00'
  }
  
  return selectedSlots.map(slotKey => {
    const parts = slotKey.split('-')
    const time = parts[3]
    const nextHour = timeMap[time] || '07:00'
    const slotData = timeSlotPrices.find(s => s.time === time)
    
    return {
      time: time,
      nextTime: nextHour,
      price: slotData?.price || 150000
    }
  })
}

export const calculateTotals = (slots, rawBookingData) => {
  if (slots.length === 0) {
    return {
      subtotal: rawBookingData.subtotal || 0,
      serviceFee: rawBookingData.serviceFee || 0,
      total: rawBookingData.total || 0
    }
  }
  
  const subtotal = slots.reduce((sum, slot) => sum + slot.price, 0)
  const serviceFee = Math.round(subtotal * 0.05) // 5% service fee
  const total = subtotal + serviceFee - (rawBookingData.discount || 0)
  
  return { subtotal, serviceFee, total }
}

export const formatBookingData = (rawBookingData, slots, totals) => {
  return {
    ...rawBookingData,
    slots,
    subtotal: rawBookingData.subtotal && rawBookingData.subtotal > 0 
      ? rawBookingData.subtotal 
      : totals.subtotal,
    serviceFee: rawBookingData.serviceFee && rawBookingData.serviceFee > 0 
      ? rawBookingData.serviceFee 
      : totals.serviceFee,
    total: rawBookingData.total && rawBookingData.total > 0 
      ? rawBookingData.total 
      : totals.total
  }
}

