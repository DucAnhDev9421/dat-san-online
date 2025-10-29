import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle, Clock, AlertCircle, Info, ArrowLeft, CheckCheck, Trash2, ShoppingBag, Ticket, Settings } from 'lucide-react'
import { mockNotifications } from '../../components/header/constants'

const NotificationsPage = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all', 'booking', 'promotion', 'system'

  // Count notifications by category
  const categoryCounts = useMemo(() => {
    return {
      all: notifications.length,
      booking: notifications.filter(n => ['booking', 'payment'].includes(n.type)).length,
      promotion: notifications.filter(n => n.type === 'promotion').length,
      system: notifications.filter(n => ['reminder', 'cancellation'].includes(n.type)).length
    }
  }, [notifications])

  // Count unread by category
  const categoryUnreadCounts = useMemo(() => {
    return {
      all: notifications.filter(n => !n.isRead).length,
      booking: notifications.filter(n => ['booking', 'payment'].includes(n.type) && !n.isRead).length,
      promotion: notifications.filter(n => n.type === 'promotion' && !n.isRead).length,
      system: notifications.filter(n => ['reminder', 'cancellation'].includes(n.type) && !n.isRead).length
    }
  }, [notifications])

  // Filter notifications based on selected filters
  const filteredNotifications = useMemo(() => {
    let result = notifications

    // Filter by category
    if (categoryFilter !== 'all') {
      switch (categoryFilter) {
        case 'booking':
          result = result.filter(n => ['booking', 'payment'].includes(n.type))
          break
        case 'promotion':
          result = result.filter(n => n.type === 'promotion')
          break
        case 'system':
          result = result.filter(n => ['reminder', 'cancellation'].includes(n.type))
          break
        default:
          break
      }
    }

    // Filter by read status
    switch (filter) {
      case 'unread':
        result = result.filter(n => !n.isRead)
        break
      case 'read':
        result = result.filter(n => n.isRead)
        break
      default:
        break
    }

    return result
  }, [notifications, filter, categoryFilter])

  // Count unread notifications
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length
  }, [notifications])

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    // Only mark filtered notifications as read
    const filteredIds = filteredNotifications.map(n => n.id)
    setNotifications(prev =>
      prev.map(n => filteredIds.includes(n.id) ? { ...n, isRead: true } : n)
    )
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleDeleteAll = () => {
    const categoryName = categoryFilter === 'all' ? 'thông báo' :
      categoryFilter === 'booking' ? 'đơn đặt sân' :
      categoryFilter === 'promotion' ? 'khuyến mãi' : 'hệ thống'
    if (window.confirm(`Bạn có chắc muốn xóa tất cả thông báo ${categoryName}?`)) {
      // Only delete filtered notifications
      const filteredIds = filteredNotifications.map(n => n.id)
      setNotifications(prev => prev.filter(n => !filteredIds.includes(n.id)))
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    // Navigate to relevant page based on notification type
    switch (notification.type) {
      case 'booking':
        navigate('/profile?tab=bookings')
        break
      case 'payment':
        navigate('/profile?tab=payments')
        break
      default:
        // Stay on notifications page
        break
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '24px 16px',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Sidebar Menu */}
        <div className="notifications-sidebar" style={{
          width: '240px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Danh mục
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <button
            onClick={() => setCategoryFilter('all')}
            className="sidebar-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: categoryFilter === 'all' ? '#3b82f6' : 'white',
              color: categoryFilter === 'all' ? 'white' : '#374151',
              fontWeight: categoryFilter === 'all' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.2s',
              textAlign: 'left',
              width: '100%',
              border: categoryFilter === 'all' ? 'none' : '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              if (categoryFilter !== 'all') {
                e.currentTarget.style.background = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (categoryFilter !== 'all') {
                e.currentTarget.style.background = 'white'
              }
            }}
          >
            <Bell size={18} />
            <span style={{ flex: 1 }}>Tất cả</span>
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: categoryFilter === 'all' ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
              color: categoryFilter === 'all' ? 'white' : '#6b7280',
              fontWeight: '600'
            }}>
              {categoryCounts.all}
            </span>
            {categoryUnreadCounts.all > 0 && (
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: categoryFilter === 'all' ? 'white' : '#3b82f6',
                flexShrink: 0
              }} />
            )}
          </button>

          <button
            onClick={() => setCategoryFilter('booking')}
            className="sidebar-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: categoryFilter === 'booking' ? '#10b981' : 'white',
              color: categoryFilter === 'booking' ? 'white' : '#374151',
              fontWeight: categoryFilter === 'booking' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.2s',
              textAlign: 'left',
              width: '100%',
              border: categoryFilter === 'booking' ? 'none' : '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              if (categoryFilter !== 'booking') {
                e.currentTarget.style.background = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (categoryFilter !== 'booking') {
                e.currentTarget.style.background = 'white'
              }
            }}
          >
            <ShoppingBag size={18} />
            <span style={{ flex: 1 }}>Đơn đặt sân</span>
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: categoryFilter === 'booking' ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
              color: categoryFilter === 'booking' ? 'white' : '#6b7280',
              fontWeight: '600'
            }}>
              {categoryCounts.booking}
            </span>
            {categoryUnreadCounts.booking > 0 && (
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: categoryFilter === 'booking' ? 'white' : '#10b981',
                flexShrink: 0
              }} />
            )}
          </button>

          <button
            onClick={() => setCategoryFilter('promotion')}
            className="sidebar-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: categoryFilter === 'promotion' ? '#f59e0b' : 'white',
              color: categoryFilter === 'promotion' ? 'white' : '#374151',
              fontWeight: categoryFilter === 'promotion' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.2s',
              textAlign: 'left',
              width: '100%',
              border: categoryFilter === 'promotion' ? 'none' : '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              if (categoryFilter !== 'promotion') {
                e.currentTarget.style.background = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (categoryFilter !== 'promotion') {
                e.currentTarget.style.background = 'white'
              }
            }}
          >
            <Ticket size={18} />
            <span style={{ flex: 1 }}>Khuyến mãi</span>
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: categoryFilter === 'promotion' ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
              color: categoryFilter === 'promotion' ? 'white' : '#6b7280',
              fontWeight: '600'
            }}>
              {categoryCounts.promotion}
            </span>
            {categoryUnreadCounts.promotion > 0 && (
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: categoryFilter === 'promotion' ? 'white' : '#f59e0b',
                flexShrink: 0
              }} />
            )}
          </button>

          <button
            onClick={() => setCategoryFilter('system')}
            className="sidebar-menu-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: categoryFilter === 'system' ? '#6b7280' : 'white',
              color: categoryFilter === 'system' ? 'white' : '#374151',
              fontWeight: categoryFilter === 'system' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.2s',
              textAlign: 'left',
              width: '100%',
              border: categoryFilter === 'system' ? 'none' : '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              if (categoryFilter !== 'system') {
                e.currentTarget.style.background = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (categoryFilter !== 'system') {
                e.currentTarget.style.background = 'white'
              }
            }}
          >
            <Settings size={18} />
            <span style={{ flex: 1 }}>Hệ thống</span>
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: categoryFilter === 'system' ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
              color: categoryFilter === 'system' ? 'white' : '#6b7280',
              fontWeight: '600'
            }}>
              {categoryCounts.system}
            </span>
            {categoryUnreadCounts.system > 0 && (
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: categoryFilter === 'system' ? 'white' : '#6b7280',
                flexShrink: 0
              }} />
            )}
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <ArrowLeft size={20} color="#374151" />
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                marginBottom: '4px'
              }}>
                {categoryFilter === 'all' ? 'Thông báo' :
                 categoryFilter === 'booking' ? 'Đơn đặt sân' :
                 categoryFilter === 'promotion' ? 'Khuyến mãi' :
                 'Hệ thống'}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                {(() => {
                  const unread = filteredNotifications.filter(n => !n.isRead).length
                  const total = filteredNotifications.length
                  if (unread > 0) {
                    return `${unread} thông báo chưa đọc trong ${total} thông báo`
                  }
                  return `Tất cả ${total} thông báo đã được đọc`
                })()}
              </p>
            </div>
          </div>

        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            background: 'white',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: filter === 'all' ? '#3b82f6' : 'transparent',
                color: filter === 'all' ? 'white' : '#6b7280',
                fontWeight: filter === 'all' ? '600' : '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Tất cả ({filteredNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: filter === 'unread' ? '#3b82f6' : 'transparent',
                color: filter === 'unread' ? 'white' : '#6b7280',
                fontWeight: filter === 'unread' ? '600' : '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Chưa đọc ({filteredNotifications.filter(n => !n.isRead).length})
            </button>
            <button
              onClick={() => setFilter('read')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: filter === 'read' ? '#3b82f6' : 'transparent',
                color: filter === 'read' ? 'white' : '#6b7280',
                fontWeight: filter === 'read' ? '600' : '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Đã đọc ({filteredNotifications.filter(n => n.isRead).length})
            </button>
          </div>

          {/* Action Buttons */}
          {filteredNotifications.filter(n => !n.isRead).length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#3b82f6',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff'
                e.currentTarget.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <CheckCheck size={16} />
              Đánh dấu tất cả đã đọc
            </button>
          )}

          {filteredNotifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#ef4444',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef2f2'
                e.currentTarget.style.borderColor = '#ef4444'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <Trash2 size={16} />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => {
              const IconComponent = notification.icon
              return (
                <div
                  key={notification.id}
                  className="notification-item"
                  style={{
                    padding: '20px',
                    borderBottom: index < filteredNotifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: notification.isRead ? '#fff' : '#f0f9ff',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = notification.isRead ? '#f8fafc' : '#e0f2fe'
                    e.currentTarget.querySelector('.notification-actions').style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.isRead ? '#fff' : '#f0f9ff'
                    e.currentTarget.querySelector('.notification-actions').style.opacity = '0'
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `${notification.iconColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComponent size={20} color={notification.iconColor} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: notification.isRead ? '500' : '600',
                      color: '#1f2937',
                      marginBottom: '6px',
                      lineHeight: '1.5'
                    }}>
                      {notification.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      marginBottom: '8px'
                    }}>
                      {notification.message}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      {notification.time}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="notification-actions"
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexShrink: 0,
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0f9ff'
                          e.currentTarget.style.borderColor = '#3b82f6'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white'
                          e.currentTarget.style.borderColor = '#e5e7eb'
                        }}
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle size={16} color="#3b82f6" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(notification.id)
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2'
                        e.currentTarget.style.borderColor = '#ef4444'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.borderColor = '#e5e7eb'
                      }}
                      title="Xóa"
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div style={{
                      position: 'absolute',
                      left: '20px',
                      top: '20px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#3b82f6'
                    }} />
                  )}
                </div>
              )
            })
          ) : (
            <div style={{
              padding: '80px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{
                fontSize: '16px',
                fontWeight: '500',
                margin: 0,
                marginBottom: '8px',
                color: '#1f2937'
              }}>
                {(() => {
                  const categoryName = categoryFilter === 'all' ? 'thông báo' :
                    categoryFilter === 'booking' ? 'đơn đặt sân' :
                    categoryFilter === 'promotion' ? 'khuyến mãi' : 'hệ thống'
                  if (filter === 'unread') return `Không có thông báo ${categoryName} chưa đọc`
                  if (filter === 'read') return `Không có thông báo ${categoryName} đã đọc`
                  return `Chưa có thông báo ${categoryName} nào`
                })()}
              </p>
              <p style={{ fontSize: '14px', margin: 0, color: '#9ca3af' }}>
                {(() => {
                  const categoryName = categoryFilter === 'all' ? 'thông báo' :
                    categoryFilter === 'booking' ? 'đơn đặt sân' :
                    categoryFilter === 'promotion' ? 'khuyến mãi' : 'hệ thống'
                  if (filter === 'unread') return `Tất cả thông báo ${categoryName} của bạn đã được đọc`
                  if (filter === 'read') return `Bạn chưa có thông báo ${categoryName} nào đã đọc`
                  return `Các thông báo ${categoryName} mới sẽ xuất hiện ở đây`
                })()}
              </p>
            </div>
          )}
        </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .notifications-container {
            padding: 16px 12px !important;
          }

          .notifications-sidebar {
            display: none !important;
          }
        }

        .notification-item:hover .notification-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}

export default NotificationsPage

