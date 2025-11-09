import React, { useState } from 'react'
import SettingsTab from '../tabs/SettingsTab'

export default function Settings() {
  const [notifications, setNotifications] = useState({
    booking: true,
    promotion: true,
    email: false
  })

  return (
    <SettingsTab 
      notifications={notifications} 
      setNotifications={setNotifications} 
    />
  )
}

