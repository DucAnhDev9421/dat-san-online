import React, { useState } from 'react'
import ToggleSwitch from '../components/ToggleSwitch'
import ChangePasswordModal from '../modals/ChangePasswordModal'
import '../modals/ChangePasswordModal.css'

export default function SettingsTab({ notifications, setNotifications }) {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  return (
    <div className="settings-section">
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>Cài đặt tài khoản</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Thông báo */}
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Thông báo</h4>
          <div style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            border: '1px solid #e5e7eb',
            padding: '16px 20px'
          }}>
            <ToggleSwitch 
              checked={notifications.booking}
              onChange={(e) => setNotifications({...notifications, booking: e.target.checked})}
              label="Nhận thông báo về lịch đặt sân"
              description="Nhận thông báo khi có lịch đặt mới hoặc thay đổi"
            />
            
            <ToggleSwitch 
              checked={notifications.promotion}
              onChange={(e) => setNotifications({...notifications, promotion: e.target.checked})}
              label="Nhận thông báo khuyến mãi"
              description="Nhận thông tin về các chương trình ưu đãi"
            />
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              alignItems: 'center',
              padding: '12px 0',
              gap: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                  Nhận thông báo qua email
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Gửi thông báo đến email của bạn
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  style={{ opacity: 0, width: 0, height: 0 }} 
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: notifications.email ? '#3b82f6' : '#d1d5db',
                  borderRadius: '24px',
                  transition: '0.4s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: notifications.email ? '23px' : '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: '0.4s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Bảo mật */}
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bảo mật</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              className="btn btn-outline" 
              style={{ 
                justifyContent: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onClick={() => setShowChangePasswordModal(true)}
            >
              🔒 Đổi mật khẩu
            </button>
            <button className="btn btn-outline" style={{ 
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🔐 Xác thực 2 bước
            </button>
          </div>
        </div>

        {/* Vùng nguy hiểm */}
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#dc2626' }}>
            Vùng nguy hiểm
          </h4>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#dc2626', marginBottom: '4px' }}>
                Xóa tài khoản
              </div>
              <div style={{ fontSize: '13px', color: '#991b1b' }}>
                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </div>
            </div>
            <button className="btn btn-dark" style={{ 
              background: '#dc2626',
              borderColor: '#dc2626'
            }}>
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  )
}

