import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NotificationButton from './NotificationButton'
import NotificationDropdown from './NotificationDropdown'
import UserMenu from './UserMenu'
import NavigationBar from './NavigationBar'
import { mockNotifications } from './constants'
import { Menu, X } from 'lucide-react'

function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  const handleBookingHistoryClick = () => {
    setShowUserMenu(false)
    navigate('/booking-history')
  }

  const markAllAsRead = () => {
    setUnreadNotifications(0)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-left">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand">
              <img 
                src="/Logo.png" 
                alt="Booking Sport Logo" 
                className="logo-image"
                style={{ 
                  height: "56px", 
                  width: "auto",
                  objectFit: "contain"
                }}
              />
              <span className="brand-name">Booking sport</span>
            </div>
          </Link>
        </div>
        
        <div className="desktop-nav-wrapper">
          <NavigationBar user={user} />
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
                onBookingHistoryClick={handleBookingHistoryClick}
              />
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
            <NavigationBar user={user} mobile onLinkClick={() => setShowMobileMenu(false)} />
          </div>
        </div>
      )}

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

        /* Mobile menu toggle */
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #111827;
          padding: 8px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        /* Mobile Navigation Overlay */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          animation: fadeIn 0.2s ease;
        }

        .mobile-nav-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          padding: 16px;
          max-height: calc(100vh - 64px);
          overflow-y: auto;
          animation: slideDown 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .desktop-nav-wrapper {
            display: none !important;
          }

          .brand-name {
            display: none;
          }

          .logo-image {
            height: 40px !important;
          }

          .header-inner {
            gap: 8px !important;
          }

          .auth-actions {
            gap: 8px !important;
          }

          .btn {
            padding: 8px 12px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .brand-name {
            display: block;
            font-size: 14px;
          }

          .header-inner {
            height: 56px !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Header

