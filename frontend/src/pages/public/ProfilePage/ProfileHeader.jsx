import React, { useState } from 'react'
import { Mail, Phone, MapPin, Calendar, Trophy, Heart, Edit3 } from 'lucide-react'
import StatCard from './components/StatCard'
import EditProfileModal from './modals/EditProfileModal'
import './modals/EditProfileModal.css'

export default function ProfileHeader({ userData, favoriteVenues }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUserData, setCurrentUserData] = useState(userData)

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleSaveProfile = (updatedData) => {
    // Handle avatar separately if it's a File object
    let avatarUrl = updatedData.avatar
    
    if (updatedData.avatar instanceof File) {
      // Create object URL for preview (in real app, you'd upload to server)
      avatarUrl = URL.createObjectURL(updatedData.avatar)
      console.log('Avatar file selected:', updatedData.avatar.name)
    }
    
    // Update local state
    setCurrentUserData(prev => ({
      ...prev,
      ...updatedData,
      avatar: avatarUrl
    }))
    
    // Here you would typically call an API to save the data
    console.log('Saving profile data:', updatedData)
    
    // Show success message
    alert('Cập nhật thông tin thành công!')
  }

  return (
    <>
      <section style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: currentUserData.avatar ? `url(${currentUserData.avatar})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '48px',
              fontWeight: '600',
              border: '4px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {!currentUserData.avatar && currentUserData.name.charAt(0)}
            </div>
            {currentUserData.isVIP && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
                whiteSpace: 'nowrap'
              }}>
                ⭐ Thành viên VIP
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>{currentUserData.name}</h1>
              <button 
                onClick={handleEditClick}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e2e8f0'
                  e.target.style.borderColor = '#cbd5e1'
                  e.target.style.color = '#334155'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8fafc'
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.color = '#475569'
                }}
              >
                <Edit3 size={16} />
                Chỉnh sửa
              </button>
            </div>
            
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }}>
              Thành viên từ tháng {new Date(currentUserData.joinDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
            </p>

            {/* Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                <Mail size={16} color="#6b7280" />
                {currentUserData.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                <Phone size={16} color="#6b7280" />
                {currentUserData.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                <MapPin size={16} color="#6b7280" />
                {currentUserData.location}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <StatCard 
                icon={Calendar}
                label="Tổng số lần đặt"
                value={currentUserData.totalBookings}
                bgColor="#eff6ff"
                iconColor="#2563eb"
              />
              <StatCard 
                icon={Trophy}
                label="Điểm tích lũy"
                value={currentUserData.points.toLocaleString()}
                bgColor="#fef3c7"
                iconColor="#d97706"
              />
              <StatCard 
                icon={Heart}
                label="Sân yêu thích"
                value={favoriteVenues.length}
                bgColor="#f0fdf4"
                iconColor="#16a34a"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userData={currentUserData}
        onSave={handleSaveProfile}
      />
    </>
  )
}

