import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  
  // Mock user data - in real app this would come from context/API
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    avatar: null,
    joinDate: '2024-01-15',
    totalBookings: 12,
    favoriteSports: ['Bóng đá', 'Cầu lông', 'Tennis']
  })

  // Mock booking history
  const bookingHistory = [
    {
      id: 1,
      venue: 'Sân bóng đá ABC',
      sport: 'Bóng đá',
      date: '2024-01-20',
      time: '18:00 - 20:00',
      status: 'completed',
      price: '200,000 VNĐ'
    },
    {
      id: 2,
      venue: 'Trung tâm cầu lông XYZ',
      sport: 'Cầu lông',
      date: '2024-01-18',
      time: '19:00 - 21:00',
      status: 'completed',
      price: '150,000 VNĐ'
    },
    {
      id: 3,
      venue: 'Sân tennis DEF',
      sport: 'Tennis',
      date: '2024-01-25',
      time: '16:00 - 18:00',
      status: 'upcoming',
      price: '300,000 VNĐ'
    }
  ]

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = () => {
    // In real app, this would save to API
    setIsEditing(false)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-completed',
      upcoming: 'status-upcoming',
      cancelled: 'status-cancelled'
    }
    const statusText = {
      completed: 'Hoàn thành',
      upcoming: 'Sắp tới',
      cancelled: 'Đã hủy'
    }
    return <span className={`status-badge ${statusClasses[status]}`}>{statusText[status]}</span>
  }

  return (
    <main className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" />
              ) : (
                <span>{userData.name.charAt(0)}</span>
              )}
            </div>
            <button className="btn btn-outline small">Thay đổi ảnh</button>
          </div>
          <div className="profile-info">
            <h1>{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
            <p className="profile-join">Tham gia từ {new Date(userData.joinDate).toLocaleDateString('vi-VN')}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{userData.totalBookings}</span>
                <span className="stat-label">Lần đặt sân</span>
              </div>
              <div className="stat">
                <span className="stat-number">{userData.favoriteSports.length}</span>
                <span className="stat-label">Môn thể thao yêu thích</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="profile-tabs">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Thông tin cá nhân
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Lịch sử đặt sân
            </button>
            <button 
              className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Sở thích
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Cài đặt
            </button>
          </div>
        </section>

        {/* Tab Content */}
        <section className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-form">
              <div className="form-header">
                <h3>Thông tin cá nhân</h3>
                <button 
                  className="btn btn-outline small"
                  onClick={handleEditProfile}
                >
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={userData.name}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="input" 
                    value={userData.email}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="tel" 
                    className="input" 
                    value={userData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày tham gia</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={new Date(userData.joinDate).toLocaleDateString('vi-VN')}
                    disabled
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSaveProfile}>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <div className="section-header">
                <h3>Lịch sử đặt sân</h3>
                <span className="total-bookings">Tổng cộng: {bookingHistory.length} lần đặt</span>
              </div>
              
              <div className="bookings-list">
                {bookingHistory.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-info">
                      <h4>{booking.venue}</h4>
                      <p className="booking-sport">{booking.sport}</p>
                      <p className="booking-datetime">
                        {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
                      </p>
                      <p className="booking-price">{booking.price}</p>
                    </div>
                    <div className="booking-actions">
                      {getStatusBadge(booking.status)}
                      {booking.status === 'upcoming' && (
                        <button className="btn btn-outline small">Hủy đặt</button>
                      )}
                      <button className="btn btn-outline small">Chi tiết</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-section">
              <h3>Môn thể thao yêu thích</h3>
              <div className="sports-grid">
                {['Bóng đá', 'Cầu lông', 'Tennis', 'Bóng rổ', 'Bóng chuyền', 'Cầu mây'].map(sport => (
                  <label key={sport} className="sport-checkbox">
                    <input 
                      type="checkbox" 
                      checked={userData.favoriteSports.includes(sport)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUserData({
                            ...userData, 
                            favoriteSports: [...userData.favoriteSports, sport]
                          })
                        } else {
                          setUserData({
                            ...userData, 
                            favoriteSports: userData.favoriteSports.filter(s => s !== sport)
                          })
                        }
                      }}
                    />
                    <span>{sport}</span>
                  </label>
                ))}
              </div>
              
              <div className="preferences-actions">
                <button className="btn btn-primary">Lưu sở thích</button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>Cài đặt tài khoản</h3>
              
              <div className="settings-group">
                <h4>Thông báo</h4>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Nhận thông báo về lịch đặt sân</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Nhận thông báo khuyến mãi</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" />
                    <span>Nhận thông báo qua email</span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h4>Bảo mật</h4>
                <div className="setting-item">
                  <button className="btn btn-outline">Đổi mật khẩu</button>
                </div>
                <div className="setting-item">
                  <button className="btn btn-outline">Xác thực 2 bước</button>
                </div>
              </div>

              <div className="settings-group danger-zone">
                <h4>Vùng nguy hiểm</h4>
                <div className="setting-item">
                  <button className="btn btn-dark">Xóa tài khoản</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default ProfilePage
