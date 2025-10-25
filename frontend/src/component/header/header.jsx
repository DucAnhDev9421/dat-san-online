import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { User, LogOut, Settings, ChevronDown, Bell } from 'lucide-react'
import LocationDisplay from '../location/LocationDisplay'

function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3) // Mock data
  const navigate = useNavigate()

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
        
        {/* Location Display */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <LocationDisplay />
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
              {/* Notification Button */}
              <button
                onClick={() => navigate('/notifications')}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                aria-label="Thông báo"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 5px',
                    borderRadius: '10px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    animation: 'pulse 2s infinite'
                  }}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleUserMenuClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {user?.name || 'User'}
                </span>
                <ChevronDown size={16} color="#6b7280" />
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,.15)',
                  minWidth: '200px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {user?.email}
                    </div>
                    {user?.role && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#3b82f6',
                        marginTop: '4px',
                        textTransform: 'capitalize'
                      }}>
                        {user.role === 'admin' ? 'Quản trị viên' : 
                         user.role === 'owner' ? 'Chủ sân' : 'Người dùng'}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={handleProfileClick}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <User size={16} />
                      Thông tin cá nhân
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/settings')
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <Settings size={16} />
                      Cài đặt
                    </button>
                    
                    <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
                )}

                {/* Click outside to close menu */}
                {showUserMenu && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                    onClick={() => setShowUserMenu(false)}
                  />
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">Đăng ký / Đăng nhập</Link>
          )}
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </header>
  )
}

export default Header

