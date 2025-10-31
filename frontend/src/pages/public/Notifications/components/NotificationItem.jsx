import React from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'
import '../../../../styles/Notifications.css'

export default function NotificationItem({
  notification,
  index,
  total,
  onMarkAsRead,
  onDelete,
  onClick
}) {
  const IconComponent = notification.icon

  return (
    <div
      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
      onClick={onClick}
    >
      <div 
        className="notification-icon-wrapper"
        style={{ background: `${notification.iconColor}20` }}
      >
        <IconComponent size={20} color={notification.iconColor} />
      </div>

      <div className="notification-content">
        <div className={`notification-title ${notification.isRead ? '' : 'unread-title'}`}>
          {notification.title}
        </div>
        <div className="notification-message">
          {notification.message}
        </div>
        <div className="notification-time">
          {notification.time}
        </div>
      </div>

      <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
            className="notification-action-btn notification-action-read"
            title="Đánh dấu đã đọc"
          >
            <CheckCircle size={16} color="#3b82f6" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
          className="notification-action-btn notification-action-delete"
          title="Xóa"
        >
          <Trash2 size={16} color="#ef4444" />
        </button>
      </div>

      {!notification.isRead && (
        <div className="notification-unread-indicator" />
      )}
    </div>
  )
}

