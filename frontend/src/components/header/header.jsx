import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import useDeviceType from '../../hook/use-device-type'
import useToggle from '../../hook/use-toggle'
import NotificationButton from './NotificationButton'
import NotificationDropdown from './NotificationDropdown'
import UserMenu from './UserMenu'
import NavigationBar from './NavigationBar'
import { mockNotifications } from './constants'
import { Menu, X } from 'lucide-react'

function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const { isMobile, isTablet } = useDeviceType()
  const [showUserMenu, { toggle: toggleUserMenu, setFalse: closeUserMenu }] = useToggle(false)
  const [showNotificationDropdown, { toggle: toggleNotificationDropdown, setFalse: closeNotificationDropdown }] = useToggle(false)
  const [showMobileMenu, { toggle: toggleMobileMenu, setFalse: closeMobileMenu }] = useToggle(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3) // Mock data
  const navigate = useNavigate()

  const notifications = mockNotifications

  // Đóng mobile menu khi chuyển từ mobile sang desktop/tablet
  useEffect(() => {
    if (!isMobile && showMobileMenu) {
      closeMobileMenu()
    }
  }, [isMobile, showMobileMenu]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset user menu when authentication state changes
  useEffect(() => {
    if (showUserMenu) {
      closeUserMenu()
    }
  }, [isAuthenticated, user]) // eslint-disable-line react-hooks/exhaustive-deps

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
    toggleUserMenu()
  }

  const handleProfileClick = () => {
    closeUserMenu()
    navigate('/profile')
  }

  const handleNotificationClick = () => {
    toggleNotificationDropdown()
    closeUserMenu() // Close user menu if open
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
    closeNotificationDropdown()
  }

  const handleSettingsClick = () => {
    closeUserMenu()
    navigate('/profile?tab=settings')
  }

  const handleBookingHistoryClick = () => {
    closeUserMenu()
    navigate('/profile?tab=bookings')
  }

  const markAllAsRead = () => {
    setUnreadNotifications(0)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-left">
          {isMobile && (
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand">
              <img 
                src="/Logo.png" 
                alt="Booking Sport Logo" 
                className="logo-image"
                style={{ 
                  height: isMobile ? "40px" : isTablet ? "48px" : "56px", 
                  width: "auto",
                  objectFit: "contain"
                }}
              />
              <span className="brand-name">Booking sport</span>
            </div>
          </Link>
        </div>
        
        {!isMobile && (
          <div className="desktop-nav-wrapper">
            <NavigationBar user={user} />
          </div>
        )}
        
        <div className="auth-actions" style={{ gap: isMobile ? '8px' : isTablet ? '10px' : '12px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : isTablet ? '10px' : '12px' }}>
              {/* Notification Button with Dropdown */}
              <div style={{ position: 'relative' }}>
                <NotificationButton 
                  unreadCount={unreadNotifications}
                  isOpen={showNotificationDropdown}
                  onClick={handleNotificationClick}
                />
                <NotificationDropdown
                  isOpen={showNotificationDropdown}
                  onClose={closeNotificationDropdown}
                  notifications={notifications}
                  unreadCount={unreadNotifications}
                  onNotificationClick={handleNotificationItemClick}
                  onMarkAllAsRead={markAllAsRead}
                  onViewAll={() => {
                    closeNotificationDropdown()
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
            <Link 
              to="/login" 
              className="btn btn-outline"
              style={{ 
                padding: isMobile ? '8px 12px' : isTablet ? '9px 14px' : undefined,
                fontSize: isMobile ? '14px' : isTablet ? '15px' : undefined
              }}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && showMobileMenu && (
        <div className="mobile-nav-overlay" onClick={closeMobileMenu}>
          <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
            <NavigationBar user={user} mobile onLinkClick={closeMobileMenu} />
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

        /* Mobile menu toggle - chỉ hiển thị khi isMobile = true (được điều khiển bởi JS) */
        .mobile-menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #111827;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
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

        /* Responsive styles - chỉ cho styling bổ sung, logic chính đã dùng useMobile hook */
        @media (max-width: 768px) {
          .header-inner {
            gap: 8px !important;
          }
        }

        @media (max-width: 480px) {
          .brand-name {
            font-size: 14px;
          }

          .header-inner {
            height: 56px !important;
          }
        }

        @media (max-width: 400px) {
          .brand-name {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Header

