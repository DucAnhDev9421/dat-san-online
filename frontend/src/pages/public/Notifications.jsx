import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarMenu from './Notifications/components/SidebarMenu'
import NotificationHeader from './Notifications/components/NotificationHeader'
import ActionBar from './Notifications/components/ActionBar'
import NotificationList from './Notifications/components/NotificationList'
import { mockNotifications } from '../../components/header/constants'
import { 
  filterNotifications, 
  getCategoryCounts, 
  getCategoryUnreadCounts,
  getCategoryName 
} from './Notifications/utils/filters'
import '../../styles/Notifications.css'

const NotificationsPage = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all', 'booking', 'promotion', 'system'

  // Calculate counts
  const categoryCounts = useMemo(() => getCategoryCounts(notifications), [notifications])
  const categoryUnreadCounts = useMemo(() => getCategoryUnreadCounts(notifications), [notifications])

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return filterNotifications(notifications, {
      categoryFilter,
      readFilter: filter
    })
  }, [notifications, filter, categoryFilter])

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    const filteredIds = filteredNotifications.map(n => n.id)
    setNotifications(prev =>
      prev.map(n => filteredIds.includes(n.id) ? { ...n, isRead: true } : n)
    )
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleDeleteAll = () => {
    const categoryName = getCategoryName(categoryFilter)
    if (window.confirm(`Bạn có chắc muốn xóa tất cả thông báo ${categoryName}?`)) {
      const filteredIds = filteredNotifications.map(n => n.id)
      setNotifications(prev => prev.filter(n => !filteredIds.includes(n.id)))
    }
  }

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    switch (notification.type) {
      case 'booking':
        navigate('/profile?tab=bookings')
        break
      case 'payment':
        navigate('/profile?tab=payments')
        break
      default:
        break
    }
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <SidebarMenu
          categoryFilter={categoryFilter}
          categoryCounts={categoryCounts}
          categoryUnreadCounts={categoryUnreadCounts}
          onCategoryChange={setCategoryFilter}
        />

        <div className="notifications-main">
          <NotificationHeader
            categoryFilter={categoryFilter}
            filteredNotifications={filteredNotifications}
          />

          <ActionBar
            filter={filter}
            filteredNotifications={filteredNotifications}
            onFilterChange={setFilter}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteAll={handleDeleteAll}
          />

          <NotificationList
            notifications={filteredNotifications}
            categoryFilter={categoryFilter}
            readFilter={filter}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
