import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Users, Eye } from 'lucide-react'
import { TournamentProvider, useTournament } from './TournamentContext'
import { useAuth } from '../../../contexts/AuthContext'
import TournamentRoutes from './TournamentRoutes'
import ChampionCelebration from '../../../components/tournament/ChampionCelebration'
import { hasChampion } from '../../../utils/tournamentHelpers'
import '../../../styles/TournamentDetail.css'

const TournamentDetailContent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { tournament, loading } = useTournament()
  const { user } = useAuth()
  const [showChampionCelebration, setShowChampionCelebration] = useState(false)

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { className: 'badge badge-yellow', text: 'Sắp diễn ra' },
      ongoing: { className: 'badge badge-green', text: 'Đang diễn ra' },
      completed: { className: 'badge badge-gray', text: 'Đã kết thúc' },
      cancelled: { className: 'badge badge-red', text: 'Đã hủy' }
    }
    return badges[status] || badges.upcoming
  }

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname
    if (path.includes('/custom')) return 'custom'
    if (path.includes('/register')) return 'register'
    if (path.includes('/registrations')) return 'registrations'
    if (path.includes('/teams')) return 'teams'
    if (path.includes('/standings')) return 'standings'
    if (path.includes('/results')) return 'results'
    if (path.includes('/schedule')) return 'schedule'
    if (path.includes('/overview') || path.endsWith(`/tournament/${id}`) || path.endsWith(`/tournament/${id}/`)) return 'overview'
    return 'overview'
  }
  
  // Kiểm tra format giải đấu
  const isRoundRobin = tournament?.format === 'Vòng tròn' || tournament?.format === 'round-robin'

  // Kiểm tra quyền: chỉ owner của sân hoặc người tạo giải mới thấy tab "Đội tham gia" và "Tùy chỉnh"
  const canManageTournament = React.useMemo(() => {
    if (!user || !tournament) return false
    
    const userId = user._id || user.id
    const creatorId = tournament.creator?._id || tournament.creator?.id || tournament.creator
    const facilityOwnerId = tournament.facility?.owner?._id || tournament.facility?.owner?.id || tournament.facility?.owner
    
    // Kiểm tra nếu là người tạo giải
    if (creatorId && String(creatorId) === String(userId)) {
      return true
    }
    
    // Kiểm tra nếu là owner của facility
    if (facilityOwnerId && String(facilityOwnerId) === String(userId)) {
      return true
    }
    
    return false
  }, [user, tournament])

  const currentTab = getCurrentTab()

  const handleTabClick = (tab) => {
    if (tab === 'overview') {
      navigate(`/tournament/${id}/overview`)
    } else {
      navigate(`/tournament/${id}/${tab}`)
    }
  }

  // Hiển thị màn hình chúc mừng đội vô địch khi vào trang và giải đã có đội vô địch
  useEffect(() => {
    if (tournament && !loading && hasChampion(tournament)) {
      // Kiểm tra xem đã hiển thị chưa (dùng sessionStorage để tránh hiển thị lại khi refresh)
      const hasShown = sessionStorage.getItem(`champion-celebration-${id}`)
      if (!hasShown) {
        setShowChampionCelebration(true)
        sessionStorage.setItem(`champion-celebration-${id}`, 'true')
      }
    }
  }, [tournament, loading, id])

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

  const statusBadge = getStatusBadge(tournament.status)

  return (
    <div className="tournament-detail-page">
      {/* Champion Celebration Modal */}
      {showChampionCelebration && tournament && (
        <ChampionCelebration 
          tournament={tournament}
          onClose={() => setShowChampionCelebration(false)}
        />
      )}

      {/* Hero Banner */}
      <div 
        className="tournament-hero-banner"
        style={{ backgroundImage: `url(${tournament.banner || tournament.image || '/sports-meeting.webp'})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-main-content">
            <div className="hero-badges">
              <span className={statusBadge.className}>
                {tournament.status === 'ongoing' && (
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
            <div className="hero-details">
              {tournament.format && (
                <span className="hero-detail-item">{tournament.format}</span>
              )}
              {tournament.sport && (
                <>
                  {tournament.format && <span className="hero-detail-separator">||</span>}
                  <span className="hero-detail-item">{tournament.sport}</span>
                </>
              )}
              {tournament.creatorName && (
                <>
                  {(tournament.format || tournament.sport) && <span className="hero-detail-separator">||</span>}
                  <span className="hero-detail-item">{tournament.creatorName}</span>
                </>
              )}
              {(tournament.address || tournament.facility?.name || tournament.courtId?.name) && (
                <>
                  {(tournament.format || tournament.sport || tournament.creatorName) && <span className="hero-detail-separator">||</span>}
                  <span className="hero-detail-item">
                    {(() => {
                      const parts = []
                      if (tournament.facility?.name) {
                        parts.push(tournament.facility.name)
                      }
                      if (tournament.courtId?.name) {
                        parts.push(tournament.courtId.name)
                      }
                      if (tournament.address) {
                        parts.push(tournament.address)
                      }
                      return parts.length > 0 ? parts.join(' - ') : (tournament.facility?.name || tournament.courtId?.name || tournament.address)
                    })()}
                  </span>
                </>
              )}
            </div>
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
          
          {/* Tabs inside Hero */}
          <div className="hero-tabs">
            <button 
              className={`hero-tab-button ${currentTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabClick('overview')}
            >
              Tổng quan
              {currentTab === 'overview' && <span className="tab-indicator"></span>}
            </button>
            {tournament?.registrationDeadline && new Date(tournament.registrationDeadline) > new Date() && (
              <button 
                className={`hero-tab-button ${currentTab === 'register' ? 'active' : ''}`}
                onClick={() => handleTabClick('register')}
              >
                Đăng ký thi đấu
                {currentTab === 'register' && <span className="tab-indicator"></span>}
              </button>
            )}
            <button 
              className={`hero-tab-button ${currentTab === 'registrations' ? 'active' : ''}`}
              onClick={() => handleTabClick('registrations')}
            >
              Danh sách đăng ký
              {currentTab === 'registrations' && <span className="tab-indicator"></span>}
            </button>
            <button 
              className={`hero-tab-button ${currentTab === 'schedule' ? 'active' : ''}`}
              onClick={() => handleTabClick('schedule')}
            >
              Lịch thi đấu
              {currentTab === 'schedule' && <span className="tab-indicator"></span>}
            </button>
            <button 
              className={`hero-tab-button ${currentTab === 'results' ? 'active' : ''}`}
              onClick={() => handleTabClick('results')}
            >
              Thi đấu
              {currentTab === 'results' && <span className="tab-indicator"></span>}
            </button>
            {isRoundRobin && (
              <button 
                className={`hero-tab-button ${currentTab === 'standings' ? 'active' : ''}`}
                onClick={() => handleTabClick('standings')}
              >
                Bảng xếp hạng
                {currentTab === 'standings' && <span className="tab-indicator"></span>}
              </button>
            )}
            {canManageTournament && (
              <button 
                className={`hero-tab-button ${currentTab === 'teams' ? 'active' : ''}`}
                onClick={() => handleTabClick('teams')}
              >
                Đội tham gia
                {currentTab === 'teams' && <span className="tab-indicator"></span>}
              </button>
            )}
            {canManageTournament && (
              <button 
                className={`hero-tab-button ${currentTab === 'custom' ? 'active' : ''}`}
                onClick={() => handleTabClick('custom')}
              >
                Tùy chỉnh
                {currentTab === 'custom' && <span className="tab-indicator"></span>}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tournament-detail-container">

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
