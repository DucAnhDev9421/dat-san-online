import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { leagueApi } from '../../api/leagueApi'
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

  // Fetch public tournaments from API
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true)
        
        // Map frontend filters to API params
        const apiParams = {
          page: 1,
          limit: 100, // Lấy nhiều để filter ở frontend
          ...(filters.status !== 'all' && { status: filters.status }),
          ...(filters.sport !== 'all' && { sport: filters.sport }),
          ...(filters.format !== 'all' && { format: filters.format }),
          ...(searchQuery.trim() && { search: searchQuery.trim() }),
          ...(filters.sort !== 'default' && { sort: filters.sort === 'updated' ? 'updated' : filters.sort === 'views' ? 'views' : 'createdAt' })
        }
        
        const result = await leagueApi.getPublicLeagues(apiParams)
        
        if (result.success) {
          // Map API data to frontend format
          const mappedTournaments = (result.data || []).map(league => ({
            id: league._id || league.id,
            name: league.name,
            sport: league.sport,
            format: league.format === 'Loại Trực Tiếp' ? 'single-elimination' : 
                    league.format === 'Vòng tròn' ? 'round-robin' : league.format,
            image: league.image || league.banner || '/sports-meeting.webp',
            startDate: league.startDate,
            endDate: league.endDate,
            location: league.location || league.facility?.name || '',
            address: league.address || league.facility?.address || '',
            participants: league.participants || 0,
            maxParticipants: league.maxParticipants || 0,
            prize: league.prize || '',
            status: league.status || 'upcoming',
            description: league.description || league.fullDescription || '',
            registrationDeadline: league.registrationDeadline,
            views: league.views || 0,
            createdAt: league.createdAt,
            updatedAt: league.updatedAt,
            creatorName: league.creatorName || league.creator?.name || league.creator?.email || ''
          }))
          
          setTournaments(mappedTournaments)
        } else {
          throw new Error(result.message || 'Không thể tải danh sách giải đấu')
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error)
        toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách giải đấu')
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [filters.status, filters.sport, filters.format, filters.sort])

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

