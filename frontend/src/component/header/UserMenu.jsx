import React from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'

const UserMenu = ({ 
  user, 
  isOpen, 
  onToggle, 
  onProfileClick, 
  onLogout,
  onSettingsClick
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
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

      {isOpen && (
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
              onClick={onProfileClick}
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
              onClick={onSettingsClick}
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
              onClick={onLogout}
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
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={onToggle}
        />
      )}
    </div>
  )
}

export default UserMenu
