import React from 'react'
import { Mail, Phone, MapPin, Calendar, Trophy, Heart } from 'lucide-react'
import StatCard from './components/StatCard'

export default function ProfileHeader({ userData, favoriteVenues }) {
  return (
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
            background: userData.avatar ? `url(${userData.avatar})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            {!userData.avatar && userData.name.charAt(0)}
          </div>
          {userData.isVIP && (
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
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>{userData.name}</h1>
            <button 
              className="btn btn-outline small"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ✏️ Chỉnh sửa
            </button>
          </div>
          
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }}>
            Thành viên từ tháng {new Date(userData.joinDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
          </p>

          {/* Contact Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <Mail size={16} color="#6b7280" />
              {userData.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <Phone size={16} color="#6b7280" />
              {userData.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <MapPin size={16} color="#6b7280" />
              {userData.location}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <StatCard 
              icon={Calendar}
              label="Tổng số lần đặt"
              value={userData.totalBookings}
              bgColor="#eff6ff"
              iconColor="#2563eb"
            />
            <StatCard 
              icon={Trophy}
              label="Điểm tích lũy"
              value={userData.points.toLocaleString()}
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
  )
}

