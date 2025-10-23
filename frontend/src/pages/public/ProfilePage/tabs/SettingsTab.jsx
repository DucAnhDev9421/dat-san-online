import React from 'react'
import ToggleSwitch from '../components/ToggleSwitch'

export default function SettingsTab({ notifications, setNotifications }) {
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
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <ToggleSwitch 
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                label="Nhận thông báo qua email"
                description="Gửi thông báo đến email của bạn"
              />
            </div>
          </div>
        </div>

        {/* Bảo mật */}
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bảo mật</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-outline" style={{ 
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
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
    </div>
  )
}

