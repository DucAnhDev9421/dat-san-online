import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationButton from './NotificationButton'
import NotificationDropdown from './NotificationDropdown'
import UserMenu from './UserMenu'
import { mockNotifications } from './constants'

function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3) // Mock data
  const navigate = useNavigate()

  const notifications = mockNotifications

  // Reset user menu when authentication state changes
  useEffect(() => {
    setShowUserMenu(false)
  }, [isAuthenticated, user])

  // Debug logs
  console.log('🔍 Header - Auth state:', { isAuthenticated, user, loading });

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleProfileClick = () => {
    setShowUserMenu(false)
    navigate('/profile')
  }

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown)
    setShowUserMenu(false) // Close user menu if open
  }

  const handleNotificationItemClick = (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      setUnreadNotifications(prev => Math.max(0, prev - 1))
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
        navigate('/notifications')
    }
    setShowNotificationDropdown(false)
  }

  const handleSettingsClick = () => {
    setShowUserMenu(false)
    navigate('/profile?tab=settings')
  }

  const markAllAsRead = () => {
    setUnreadNotifications(0)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div className="brand">
            <img 
              src="/Logo.png" 
              alt="Booking Sport Logo" 
              className="logo-image"
              style={{ 
                height: "40px", 
                width: "auto",
                objectFit: "contain"
              }}
            />
            <span className="brand-name">Booking sport</span>
          </div>
          <nav className="nav">
            <Link to="/">Trang chủ</Link>
            <a href="/partner">Đối tác</a>
          </nav>
        </div>
        
        <div className="auth-actions">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#6b7280'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Đang tải...
            </div>
          ) : isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Notification Button with Dropdown */}
              <div style={{ position: 'relative' }}>
                <NotificationButton 
                  unreadCount={unreadNotifications}
                  isOpen={showNotificationDropdown}
                  onClick={handleNotificationClick}
                />
                <NotificationDropdown
                  isOpen={showNotificationDropdown}
                  onClose={() => setShowNotificationDropdown(false)}
                  notifications={notifications}
                  unreadCount={unreadNotifications}
                  onNotificationClick={handleNotificationItemClick}
                  onMarkAllAsRead={markAllAsRead}
                  onViewAll={() => {
                    setShowNotificationDropdown(false)
                    navigate('/notifications')
                  }}
                />
              </div>

              {/* User Menu */}
              <UserMenu
                user={user}
                isOpen={showUserMenu}
                onToggle={handleUserMenuClick}
                onProfileClick={handleProfileClick}
                onLogout={handleLogout}
                onSettingsClick={handleSettingsClick}
              />
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">Đăng ký / Đăng nhập</Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}

export default Header

