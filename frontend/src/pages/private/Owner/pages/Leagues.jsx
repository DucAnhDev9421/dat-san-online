import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, MapPin, Calendar, Users, Trophy, Building2, Award, Eye, User, Phone, Clock, Settings, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { leagueApi } from '../../../../api/leagueApi'
import { facilityApi } from '../../../../api/facilityApi'
import { useAuth } from '../../../../contexts/AuthContext'
import LeagueDetailModal from '../modals/LeagueDetailModal'
import RejectLeagueModal from '../modals/RejectLeagueModal'
import AssignCourtModal from '../modals/AssignCourtModal'

const Leagues = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isAssignCourtModalOpen, setIsAssignCourtModalOpen] = useState(false)
  const [resolvedFacilityId, setResolvedFacilityId] = useState(null)
  const [ownerFacilities, setOwnerFacilities] = useState([])
  const [loadingFacilities, setLoadingFacilities] = useState(false)

  useEffect(() => {
    fetchLeagues()
    if (user) {
      fetchOwnerFacilities()
    }
  }, [activeTab, user])

  const fetchOwnerFacilities = async () => {
    try {
      if (!user?._id) return
      setLoadingFacilities(true)
      const ownerId = user._id || user.id
      const result = await facilityApi.getFacilities({ ownerId, status: 'opening' })
      if (result.success) {
        const facilities = result.data?.facilities || result.data || []
        setOwnerFacilities(facilities)
      }
    } catch (error) {
      console.error('Error fetching owner facilities:', error)
    } finally {
      setLoadingFacilities(false)
    }
  }

  const handleCreateTournament = () => {
    if (ownerFacilities.length === 0) {
      toast.error('Bạn chưa có cơ sở nào. Vui lòng tạo cơ sở trước.')
      return
    }
    
    if (ownerFacilities.length === 1) {
      // Nếu chỉ có 1 facility, navigate với facility ID
      navigate(`/tournament/create?facility=${ownerFacilities[0]._id || ownerFacilities[0].id}`)
    } else {
      // Nếu có nhiều facility, navigate với facility đầu tiên (có thể cải thiện sau)
      navigate(`/tournament/create?facility=${ownerFacilities[0]._id || ownerFacilities[0].id}`)
    }
  }

  const fetchLeagues = async () => {
    try {
      setLoading(true)
      let result
      if (activeTab === 'pending') {
        result = await leagueApi.getPendingLeagues()
      } else {
        result = await leagueApi.getOwnerLeagues({ approvalStatus: activeTab === 'all' ? undefined : activeTab })
      }
      
      if (result.success) {
        setLeagues(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching leagues:', error)
      toast.error(error.message || 'Không thể tải danh sách giải đấu')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (leagueId) => {
    try {
      const result = await leagueApi.approveLeague(leagueId)
      if (result.success) {
        toast.success('Đã duyệt giải đấu thành công')
        fetchLeagues()
      }
    } catch (error) {
      console.error('Error approving league:', error)
      toast.error(error.message || 'Không thể duyệt giải đấu')
    }
  }

  const handleReject = async (reason) => {
    if (!selectedLeague) return
    
    try {
      const result = await leagueApi.rejectLeague(selectedLeague._id || selectedLeague.id, reason)
      if (result.success) {
        toast.success('Đã từ chối giải đấu')
        setIsRejectModalOpen(false)
        setSelectedLeague(null)
        fetchLeagues()
      }
    } catch (error) {
      console.error('Error rejecting league:', error)
      toast.error(error.message || 'Không thể từ chối giải đấu')
    }
  }

  const handleAssignCourt = async (courtId) => {
    if (!selectedLeague) return

    try {
      const result = await leagueApi.assignCourtToLeague(selectedLeague._id || selectedLeague.id, courtId)
      if (result.success) {
        toast.success('Đã chốt sân cho giải đấu thành công')
        setIsAssignCourtModalOpen(false)
        setSelectedLeague(null)
        fetchLeagues()
      }
    } catch (error) {
      console.error('Error assigning court:', error)
      toast.error(error.message || 'Không thể chốt sân')
    }
  }

  const openRejectModal = (league) => {
    setSelectedLeague(league)
    setIsRejectModalOpen(true)
  }

  const openAssignCourtModal = async (league) => {
    setSelectedLeague(league)
    
    // Nếu chưa có facilityId nhưng có location, tìm facility theo tên
    let facilityId = league?.facility?._id || league?.facility || null
    
    if (!facilityId && league?.location) {
      try {
        const result = await facilityApi.getFacilities({ 
          search: league.location,
          limit: 1 
        })
        
        if (result.success && result.data?.facilities?.length > 0) {
          const facility = result.data.facilities.find(f => 
            f.name === league.location || f.name.includes(league.location)
          )
          if (facility) {
            facilityId = facility._id || facility.id
          }
        }
      } catch (error) {
        console.error('Error finding facility by location:', error)
      }
    }
    
    setResolvedFacilityId(facilityId)
    setIsAssignCourtModalOpen(true)
  }

  const openDetailModal = (league) => {
    setSelectedLeague(league)
    setIsDetailModalOpen(true)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Chờ duyệt', bg: '#fef3c7', color: '#92400e' },
      approved: { label: 'Đã duyệt', bg: '#d1fae5', color: '#065f46' },
      rejected: { label: 'Đã từ chối', bg: '#fee2e2', color: '#991b1b' }
    }
    const badge = badges[status] || badges.pending
    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
          background: badge.bg,
          color: badge.color
        }}
      >
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '4px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}
          />
          <p style={{ color: '#6b7280', fontSize: 14 }}>Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>Quản lý giải đấu</h1>
        <button
          onClick={handleCreateTournament}
          disabled={loadingFacilities}
          style={{
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            background: '#3b82f6',
            border: 'none',
            cursor: loadingFacilities ? 'not-allowed' : 'pointer',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s',
            opacity: loadingFacilities ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loadingFacilities) {
              e.target.style.background = '#2563eb'
            }
          }}
          onMouseLeave={(e) => {
            if (!loadingFacilities) {
              e.target.style.background = '#3b82f6'
            }
          }}
        >
          <Plus size={18} />
          Tạo giải đấu
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0,0,0,.06)',
        }}
      >
        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #e5e7eb' }}>
          <nav style={{ display: 'flex', marginBottom: -1 }}>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                padding: '16px 24px',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                borderBottom: activeTab === 'pending' ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === 'pending' ? '#3b82f6' : '#6b7280',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'pending') {
                  e.target.style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'pending') {
                  e.target.style.color = '#6b7280'
                }
              }}
            >
              Chờ duyệt {activeTab === 'pending' && `(${leagues.length})`}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              style={{
                padding: '16px 24px',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                borderBottom: activeTab === 'approved' ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === 'approved' ? '#3b82f6' : '#6b7280',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'approved') {
                  e.target.style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'approved') {
                  e.target.style.color = '#6b7280'
                }
              }}
            >
              Đã duyệt {activeTab === 'approved' && `(${leagues.length})`}
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              style={{
                padding: '16px 24px',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                borderBottom: activeTab === 'rejected' ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === 'rejected' ? '#3b82f6' : '#6b7280',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'rejected') {
                  e.target.style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'rejected') {
                  e.target.style.color = '#6b7280'
                }
              }}
            >
              Đã từ chối {activeTab === 'rejected' && `(${leagues.length})`}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Tên giải đấu
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Môn thể thao
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Ngày bắt đầu
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Ngày kết thúc
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Số đội
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  SĐT
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Người tạo
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                  }}
                >
                  Trạng thái
                </th>
                <th
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {leagues.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 48, textAlign: 'center', color: '#6b7280' }}>
                    <Trophy size={48} color="#9ca3af" style={{ margin: '0 auto 16px', display: 'block' }} />
                    <p style={{ margin: 0, fontSize: 14 }}>Không có giải đấu nào</p>
                  </td>
                </tr>
              ) : (
                leagues.map((league) => (
                  <tr
                    key={league._id || league.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                          {league.name}
                        </span>
                      </div>
                      {league.rejectionReason && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: 8,
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 6,
                            fontSize: 12,
                            color: '#991b1b',
                          }}
                        >
                          <strong>Lý do:</strong> {league.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} color="#6b7280" />
                        <span style={{ fontSize: 14, color: '#374151' }}>{league.sport || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      {league.startDate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={14} color="#6b7280" />
                          <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                            {new Date(league.startDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      {league.endDate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={14} color="#6b7280" />
                          <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                            {new Date(league.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Trophy size={14} color="#6b7280" />
                        <span style={{ fontSize: 14, color: '#374151' }}>
                          {league.maxParticipants ? `${league.maxParticipants}` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      {league.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone size={14} color="#6b7280" />
                          <span style={{ fontSize: 14, color: '#374151' }}>{league.phone}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      {league.creator ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <User size={14} color="#6b7280" />
                          <span style={{ fontSize: 14, color: '#374151' }}>
                            {league.creator.name || league.creator.email || 'N/A'}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, color: '#9ca3af' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      {getStatusBadge(league.approvalStatus)}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openDetailModal(league)}
                          style={{
                            padding: '6px 12px',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#3b82f6',
                            background: 'transparent',
                            border: '1px solid #3b82f6',
                            cursor: 'pointer',
                            borderRadius: 6,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#eff6ff'
                            e.target.style.borderColor = '#2563eb'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent'
                            e.target.style.borderColor = '#3b82f6'
                          }}
                        >
                          Chi tiết
                        </button>
                        
                        {league.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(league._id || league.id)}
                              style={{
                                padding: '6px 12px',
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#fff',
                                background: '#10b981',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#059669'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#10b981'
                              }}
                            >
                              <CheckCircle2 size={14} />
                              Duyệt
                            </button>
                            <button
                              onClick={() => openRejectModal(league)}
                              style={{
                                padding: '6px 12px',
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#fff',
                                background: '#ef4444',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#dc2626'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#ef4444'
                              }}
                            >
                              <XCircle size={14} />
                              Từ chối
                            </button>
                          </>
                        )}

                        {league.approvalStatus === 'approved' && !league.courtId && (
                          <button
                            onClick={() => openAssignCourtModal(league)}
                            style={{
                              padding: '6px 12px',
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#fff',
                              background: '#3b82f6',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#2563eb'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#3b82f6'
                            }}
                          >
                            <MapPin size={14} />
                            Chốt sân
                          </button>
                        )}

                        {league.approvalStatus === 'approved' && (
                          <button
                            onClick={() => navigate(`/tournament/${league._id || league.id}/custom/matches`)}
                            style={{
                              padding: '6px 12px',
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#fff',
                              background: '#8b5cf6',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#7c3aed'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#8b5cf6'
                            }}
                          >
                            <Settings size={14} />
                            Quản lý
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <LeagueDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedLeague(null)
        }}
        league={selectedLeague}
      />

      <RejectLeagueModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false)
          setSelectedLeague(null)
        }}
        onConfirm={handleReject}
        leagueName={selectedLeague?.name || ''}
      />

      <AssignCourtModal
        isOpen={isAssignCourtModalOpen}
        onClose={() => {
          setIsAssignCourtModalOpen(false)
          setSelectedLeague(null)
          setResolvedFacilityId(null)
        }}
        onConfirm={handleAssignCourt}
        league={selectedLeague}
        facilityId={
          resolvedFacilityId 
            ? String(resolvedFacilityId)
            : selectedLeague?.facility?._id 
              ? String(selectedLeague.facility._id)
              : selectedLeague?.facility 
                ? String(selectedLeague.facility)
                : null
        }
      />
    </div>
  )
}

export default Leagues
