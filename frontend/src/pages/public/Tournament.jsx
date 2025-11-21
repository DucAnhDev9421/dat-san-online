import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TournamentFilterBar from './Tournament/components/TournamentFilterBar'
import TournamentViewControls from './Tournament/components/TournamentViewControls'
import TournamentGrid from './Tournament/components/TournamentGrid'
import TournamentList from './Tournament/components/TournamentList'
import '../../styles/Tournament.css'

const Tournament = () => {
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filters, setFilters] = useState({
    status: 'all', // all, upcoming, ongoing, completed
    sport: 'all', // all, football, basketball, volleyball, etc.
    format: 'all', // all, knockout, round-robin, group-stage
    sort: 'default' // default, updated, views
  })

  // Mock data - sẽ thay thế bằng API call sau
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true)
        // TODO: Thay thế bằng API call thực tế
        // const result = await tournamentApi.getTournaments()
        
        // Mock data
        const mockTournaments = [
          {
            id: 1,
            name: 'Giải Bóng Đá Cúp Mùa Hè 2025',
            sport: 'Bóng đá',
            format: 'single-elimination',
            image: '/sports-meeting.webp',
            startDate: '2025-06-01',
            endDate: '2025-07-15',
            location: 'Hà Nội',
            participants: 32,
            maxParticipants: 32,
            prize: '50,000,000 VNĐ',
            status: 'upcoming',
            description: 'Giải đấu bóng đá lớn nhất mùa hè với giải thưởng hấp dẫn',
            registrationDeadline: '2025-05-25',
            views: 1250,
            createdAt: '2025-01-15',
            updatedAt: '2025-01-20'
          },
          {
            id: 2,
            name: 'Giải Bóng Rổ Thanh Niên',
            sport: 'Bóng rổ',
            format: 'round-robin',
            image: '/all-sports-banner.webp',
            startDate: '2025-05-15',
            endDate: '2025-06-30',
            location: 'TP. Hồ Chí Minh',
            participants: 24,
            maxParticipants: 24,
            prize: '30,000,000 VNĐ',
            status: 'upcoming',
            description: 'Giải đấu dành cho các đội bóng rổ trẻ tuổi',
            registrationDeadline: '2025-05-10',
            views: 980,
            createdAt: '2025-01-10',
            updatedAt: '2025-01-18'
          },
          {
            id: 3,
            name: 'Giải Bóng Chuyền Cộng Đồng',
            sport: 'Bóng chuyền',
            format: 'single-elimination',
            image: '/pngtree-sports-poster-background.jpg',
            startDate: '2025-04-20',
            endDate: '2025-05-20',
            location: 'Đà Nẵng',
            participants: 16,
            maxParticipants: 16,
            prize: '20,000,000 VNĐ',
            status: 'ongoing',
            description: 'Giải đấu bóng chuyền cộng đồng thân thiện',
            registrationDeadline: '2025-04-15',
            views: 2100,
            createdAt: '2025-01-05',
            updatedAt: '2025-01-22'
          },
          {
            id: 4,
            name: 'Giải Bóng Đá Mini 5x5',
            sport: 'Bóng đá',
            format: 'round-robin',
            image: '/sports-meeting.webp',
            startDate: '2025-07-01',
            endDate: '2025-07-31',
            location: 'Hải Phòng',
            participants: 0,
            maxParticipants: 16,
            prize: '15,000,000 VNĐ',
            status: 'upcoming',
            description: 'Giải đấu bóng đá mini sân 5x5',
            registrationDeadline: '2025-06-25',
            views: 650,
            createdAt: '2025-01-20',
            updatedAt: '2025-01-20'
          },
          {
            id: 5,
            name: 'Giải Bóng Rổ 3x3',
            sport: 'Bóng rổ',
            format: 'single-elimination',
            image: '/all-sports-banner.webp',
            startDate: '2025-08-01',
            endDate: '2025-08-20',
            location: 'Cần Thơ',
            participants: 8,
            maxParticipants: 16,
            prize: '25,000,000 VNĐ',
            status: 'upcoming',
            description: 'Giải đấu bóng rổ 3x3 đường phố',
            registrationDeadline: '2025-07-25',
            views: 1450,
            createdAt: '2025-01-18',
            updatedAt: '2025-01-21'
          },
          {
            id: 6,
            name: 'Giải Bóng Đá Nữ',
            sport: 'Bóng đá',
            format: 'round-robin',
            image: '/pngtree-sports-poster-background.jpg',
            startDate: '2025-09-01',
            endDate: '2025-09-30',
            location: 'Hà Nội',
            participants: 12,
            maxParticipants: 16,
            prize: '40,000,000 VNĐ',
            status: 'upcoming',
            description: 'Giải đấu bóng đá dành riêng cho nữ',
            registrationDeadline: '2025-08-25',
            views: 1890,
            createdAt: '2025-01-12',
            updatedAt: '2025-01-19'
          }
        ]
        
        setTournaments(mockTournaments)
      } catch (error) {
        console.error('Error fetching tournaments:', error)
        toast.error('Có lỗi xảy ra khi tải danh sách giải đấu')
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  // Filter and sort tournaments
  const filteredTournaments = useMemo(() => {
    let filtered = tournaments.filter(tournament => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const nameMatch = tournament.name.toLowerCase().includes(query)
        // Add manager name matching when available
        if (!nameMatch) return false
      }

      // Status filter
      if (filters.status !== 'all' && tournament.status !== filters.status) {
        return false
      }

      // Sport filter
      if (filters.sport !== 'all' && tournament.sport !== filters.sport) {
        return false
      }

      // Format filter (if tournament has format property)
      if (filters.format !== 'all' && tournament.format && tournament.format !== filters.format) {
        return false
      }

      return true
    })

    // Sort tournaments
    if (filters.sort && filters.sort !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sort) {
          case 'updated':
            // Sort by updatedAt or createdAt (newest updated first)
            const updatedA = new Date(a.updatedAt || a.createdAt || 0)
            const updatedB = new Date(b.updatedAt || b.createdAt || 0)
            return updatedB - updatedA
          case 'views':
            // Sort by views count (most views first)
            return (b.views || 0) - (a.views || 0)
          default:
            return 0
        }
      })
    }

    return filtered
  }, [tournaments, searchQuery, filters])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleSearch = () => {
    // Search is handled by filteredTournaments useMemo
    // This function can be used for additional search logic if needed
  }

  const handleRegister = (tournamentId) => {
    // TODO: Navigate to registration page or show modal
    navigate(`/tournament/${tournamentId}/register`)
  }

  const handleViewDetails = (tournamentId) => {
    navigate(`/tournament/${tournamentId}`)
  }

  return (
    <div className="tournament-page">
      <div className="tournament-container">
        {/* Filter Bar - Gộp search và filters */}
        <TournamentFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          tournaments={tournaments}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        {/* View Controls */}
        <TournamentViewControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sort={filters.sort}
          onSortChange={(value) => handleFilterChange('sort', value)}
        />

        {/* Results Count */}
        {!loading && (
          <div className="results-count">
            Tìm thấy {filteredTournaments.length} giải đấu
          </div>
        )}
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            Đang tải danh sách giải đấu...
          </div>
        ) : (
          <>
            {filteredTournaments.length > 0 ? (
              viewMode === 'grid' ? (
                <TournamentGrid
                  tournaments={filteredTournaments}
                  onRegister={handleRegister}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <TournamentList
                  tournaments={filteredTournaments}
                  onRegister={handleRegister}
                  onViewDetails={handleViewDetails}
                />
              )
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                Không tìm thấy giải đấu nào phù hợp với bộ lọc đã chọn
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Tournament

