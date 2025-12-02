import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Eye, Share2 } from 'lucide-react'
import { TournamentProvider, useTournament } from './TournamentContext'
import TournamentRoutes from './TournamentRoutes'
import '../../../styles/TournamentDetail.css'

const TournamentDetailContent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { tournament, loading } = useTournament()

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { className: 'badge badge-yellow', text: 'Sắp diễn ra' },
      ongoing: { className: 'badge badge-green', text: 'Đang diễn ra' },
      completed: { className: 'badge badge-gray', text: 'Đã kết thúc' },
      cancelled: { className: 'badge badge-red', text: 'Đã hủy' }
    }
    return badges[status] || badges.upcoming
  }

  // Tính toán status dựa trên endDate nếu cần
  const getComputedStatus = () => {
    if (!tournament?.endDate) return tournament?.status || 'upcoming'
    
    const now = new Date();
    const endDate = new Date(tournament.endDate);
    const startDate = tournament.startDate ? new Date(tournament.startDate) : null;
    
    // Nếu đã bị hủy, giữ nguyên
    if (tournament.status === 'cancelled') {
      return 'cancelled';
    }
    
    // Nếu endDate đã qua, tự động là completed
    if (endDate < now) {
      return 'completed';
    }
    
    // Nếu startDate đã qua nhưng endDate chưa qua, là ongoing
    if (startDate && startDate <= now && endDate >= now) {
      return 'ongoing';
    }
    
    // Còn lại là upcoming (hoặc giữ nguyên status từ DB nếu hợp lệ)
    return tournament.status || 'upcoming';
  };

  const computedStatus = getComputedStatus();
  const isRegistrationOpen = computedStatus === 'upcoming' && 
    tournament?.registrationDeadline &&
    new Date(tournament.registrationDeadline) > new Date()
  const isFull = tournament?.participants >= tournament?.maxParticipants

  const handleRegister = () => {
    // TODO: Implement registration
    console.log('Register for tournament:', id)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tournament?.name,
          text: tournament?.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Đã sao chép link vào clipboard')
    }
  }

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname
    if (path.includes('/custom')) return 'custom'
    if (path.includes('/teams')) return 'teams'
    if (path.includes('/schedule')) return 'schedule'
    return 'overview'
  }

  const currentTab = getCurrentTab()

  const handleTabClick = (tab) => {
    navigate(`/tournament/${id}/${tab === 'overview' ? '' : tab}`)
  }

  if (loading) {
    return (
      <div className="tournament-detail-page">
        <div className="tournament-detail-container">
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            Đang tải thông tin giải đấu...
          </div>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="tournament-detail-page">
        <div className="tournament-detail-container">
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            Không tìm thấy giải đấu
          </div>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(computedStatus)

  return (
    <div className="tournament-detail-page">
      {/* Hero Banner */}
      <div 
        className="tournament-hero-banner"
        style={{ backgroundImage: `url(${tournament.banner || tournament.image || '/sports-meeting.webp'})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badges">
            <span className={statusBadge.className}>
              {computedStatus === 'ongoing' && (
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                </span>
              )}
              {statusBadge.text}
            </span>
            {tournament.sport && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20">
                {tournament.sport}
              </span>
            )}
          </div>
          <h1 className="hero-title">{tournament.name}</h1>
          <div className="hero-meta">
            <div className="meta-item">
              <Eye size={18} />
              <span>{tournament.views?.toLocaleString('vi-VN') || 0} lượt xem</span>
            </div>
            <div className="meta-item">
              <Users size={18} />
              <span>{tournament.participants}/{tournament.maxParticipants} đội</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tournament-detail-container">
        {/* Quick Info Cards */}
        <div className="quick-info-grid">
          <div className="info-card">
            <Calendar size={24} />
            <div>
              <div className="info-label">Thời gian</div>
              <div className="info-value">
                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
              </div>
            </div>
          </div>
          <div className="info-card">
            <MapPin size={24} />
            <div>
              <div className="info-label">Địa điểm</div>
              <div className="info-value">{tournament.location}</div>
            </div>
          </div>
          <div className="info-card">
            <Clock size={24} />
            <div>
              <div className="info-label">Hạn đăng ký</div>
              <div className="info-value">{formatDate(tournament.registrationDeadline)}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {isRegistrationOpen && !isFull ? (
            <button className="btn-register-primary" onClick={handleRegister}>
              Đăng ký tham gia
            </button>
          ) : (
            (!isRegistrationOpen || isFull) && (
              <button className="btn-register-primary btn-disabled" disabled>
                Đã hết thời gian đăng ký
              </button>
            )
          )}
          <button className="btn-secondary" onClick={handleShare}>
            <Share2 size={18} />
            <span>Chia sẻ</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <button 
            className={`tab-button ${currentTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabClick('overview')}
          >
            Tổng quan
          </button>
          <button 
            className={`tab-button ${currentTab === 'schedule' ? 'active' : ''}`}
            onClick={() => handleTabClick('schedule')}
          >
            Lịch thi đấu
          </button>
          <button 
            className={`tab-button ${currentTab === 'teams' ? 'active' : ''}`}
            onClick={() => handleTabClick('teams')}
          >
            Đội tham gia ({tournament.participants})
          </button>
          <button 
            className={`tab-button ${currentTab === 'custom' ? 'active' : ''}`}
            onClick={() => handleTabClick('custom')}
          >
            Tùy chỉnh
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <TournamentRoutes />
        </div>
      </div>
    </div>
  )
}

const TournamentDetail = () => {
  return (
    <TournamentProvider>
      <TournamentDetailContent />
    </TournamentProvider>
  )
}

export default TournamentDetail

