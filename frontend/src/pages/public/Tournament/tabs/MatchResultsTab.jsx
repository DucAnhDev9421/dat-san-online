import React, { useState, useEffect, useMemo } from 'react'
import { Save, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { leagueApi } from '../../../../api/leagueApi'
import { useTournament } from '../TournamentContext'

const MatchResultsTab = ({ tournament }) => {
  const { id } = useParams()
  const { refreshTournament } = useTournament()
  const [selectedStage, setSelectedStage] = useState(null)
  const [matches, setMatches] = useState([])
  const [savingResults, setSavingResults] = useState(false)
  
  const isRoundRobin = tournament?.format === 'Vòng tròn' || tournament?.format === 'round-robin'

  // Helper: Lấy tên stage để hiển thị
  const getStageTitle = (stage) => {
    const stageMap = {
      'final': 'Chung Kết',
      'semi': 'Bán Kết',
      'round3': 'Tứ Kết',
      'round4': 'Vòng 4',
      'round2': 'Vòng 2',
      'round1': 'Vòng 1',
      'round-robin': 'Vòng tròn'
    }
    return stageMap[stage] || stage
  }

  // Helper: Tìm team từ tournament.teams dựa trên teamId
  const findTeamById = (teamId) => {
    if (!teamId || teamId === "BYE") return null
    return tournament.teams?.find(t => 
      (t.id === teamId) || 
      (t._id?.toString() === teamId?.toString())
    ) || null
  }

  // Lấy danh sách các stage có matches từ API
  const availableStages = useMemo(() => {
    if (!tournament?.matches || tournament.matches.length === 0) {
      return []
    }

    const stages = [...new Set(tournament.matches.map(m => m.stage).filter(Boolean))]
    
    // Sắp xếp theo thứ tự: round1, round2, round3, round4, semi, final, round-robin
    const stageOrder = ['round1', 'round2', 'round3', 'round4', 'semi', 'final', 'round-robin']
    return stages.sort((a, b) => {
      const indexA = stageOrder.indexOf(a)
      const indexB = stageOrder.indexOf(b)
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    })
  }, [tournament?.matches])

  // Tự động chọn stage đầu tiên khi có matches
  useEffect(() => {
    if (availableStages.length > 0 && !selectedStage) {
      setSelectedStage(availableStages[0])
    }
  }, [availableStages, selectedStage])

  // Load matches từ API dựa trên selectedStage
  useEffect(() => {
    if (!selectedStage || !tournament?.matches) {
      setMatches([])
      return
    }

    const stageMatches = tournament.matches
      .filter(match => match.stage === selectedStage)
      // Lọc bỏ các match có BYE (ẩn trận bye)
      .filter(match => {
        const hasBye = match.team1Id === "BYE" || match.team2Id === "BYE"
        return !hasBye
      })
      .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))

    const loadedMatches = stageMatches.map(match => ({
      id: match.matchNumber || match.id,
      team1Id: match.team1Id || null,
      team2Id: match.team2Id || null,
      score1: match.score1 ?? null,
      score2: match.score2 ?? null,
      stage: match.stage,
      date: match.date,
      time: match.time,
      _match: match
    }))

    setMatches(loadedMatches)
  }, [selectedStage, tournament?.matches])

  // Thay đổi điểm số
  const handleScoreChange = (matchId, field, value) => {
    const numValue = value === '' ? null : parseInt(value)
    if (numValue !== null && (isNaN(numValue) || numValue < 0)) {
      return // Không cho phép giá trị không hợp lệ
    }
    
    setMatches(prev => prev.map(match => 
      match.id === matchId ? { ...match, [field]: numValue } : match
    ))
  }

  // Lưu kết quả một trận đấu
  const handleSaveMatchResult = async (match) => {
    if (match.score1 === null || match.score2 === null) {
      toast.error('Vui lòng nhập đầy đủ điểm số cho cả hai đội')
      return
    }

    try {
      setSavingResults(true)
      
      const result = await leagueApi.updateMatchResult(
        id,
        match.stage,
        match.id,
        match.score1,
        match.score2
      )

      if (result.success) {
        toast.success('Đã cập nhật kết quả trận đấu thành công')
        refreshTournament()
      }
    } catch (error) {
      console.error('Error saving match result:', error)
      toast.error(error.message || 'Không thể cập nhật kết quả trận đấu')
    } finally {
      setSavingResults(false)
    }
  }

  // Hủy kết quả một trận đấu
  const handleClearMatchResult = async (match) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy kết quả trận đấu này? Đội thắng sẽ bị xóa khỏi vòng tiếp theo.')) {
      return
    }

    try {
      setSavingResults(true)
      
      const result = await leagueApi.updateMatchResult(
        id,
        match.stage,
        match.id,
        null, // score1 = null để hủy
        null  // score2 = null để hủy
      )

      if (result.success) {
        toast.success('Đã hủy kết quả trận đấu')
        refreshTournament()
      }
    } catch (error) {
      console.error('Error clearing match result:', error)
      toast.error(error.message || 'Không thể hủy kết quả trận đấu')
    } finally {
      setSavingResults(false)
    }
  }

  if (!tournament) return null

  // Nếu chưa có matches, hiển thị thông báo
  if (availableStages.length === 0) {
    return (
      <div className="custom-tab-content">
        <h2>Thi đấu</h2>
        
        <p className="matches-description">
          Chưa có lịch đấu. Vui lòng bốc thăm để tạo lịch đấu.
        </p>
      </div>
    )
  }

  return (
    <div className="custom-tab-content">
      <h2>Thi đấu</h2>
      
      <p className="matches-description">
        Cập nhật kết quả các trận đấu. Kết quả sẽ tự động cập nhật vào vòng tiếp theo.
      </p>

      {/* Stage Selector */}
      {availableStages.length > 1 && (
        <div className="matches-stage-selector" style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {availableStages.map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: selectedStage === stage ? '#10b981' : '#e5e7eb',
                backgroundColor: selectedStage === stage ? '#10b981' : 'white',
                color: selectedStage === stage ? 'white' : '#374151',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {getStageTitle(stage)}
            </button>
          ))}
        </div>
      )}

      <div className="matches-section">
        <div className="matches-stage-box" style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {selectedStage ? getStageTitle(selectedStage) : 'Chọn vòng đấu'} ({matches.length} trận)
          </h3>
          
          {matches.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              Chưa có trận đấu nào cho vòng này.
            </div>
          ) : (
            <div className="matches-list">
              {matches.map((match) => {
                const team1 = findTeamById(match.team1Id)
                const team2 = findTeamById(match.team2Id)
                const team1Name = team1?.teamNumber || `Đội #${match.team1Id}`
                const team2Name = team2?.teamNumber || `Đội #${match.team2Id}`
                
                return (
                  <div 
                    key={match.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}
                  >
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      minWidth: '40px'
                    }}>
                      #{match.id}
                    </span>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flex: 1
                    }}>
                      {/* Team 1 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flex: 1
                      }}>
                        {team1?.logo && (
                          <img 
                            src={team1.logo} 
                            alt="Team" 
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              objectFit: 'cover', 
                              borderRadius: '4px' 
                            }}
                          />
                        )}
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1f2937'
                        }}>
                          {team1Name}
                        </span>
                      </div>
                      
                      {/* Score Input */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <input
                          type="number"
                          min="0"
                          value={match.score1 ?? ''}
                          onChange={(e) => handleScoreChange(match.id, 'score1', e.target.value)}
                          placeholder="0"
                          style={{
                            width: '60px',
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center'
                          }}
                        />
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#6b7280'
                        }}>
                          -
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={match.score2 ?? ''}
                          onChange={(e) => handleScoreChange(match.id, 'score2', e.target.value)}
                          placeholder="0"
                          style={{
                            width: '60px',
                            padding: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      
                      {/* Team 2 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flex: 1,
                        justifyContent: 'flex-end'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1f2937'
                        }}>
                          {team2Name}
                        </span>
                        {team2?.logo && (
                          <img 
                            src={team2.logo} 
                            alt="Team" 
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              objectFit: 'cover', 
                              borderRadius: '4px' 
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      {/* Save Button */}
                      <button
                        onClick={() => handleSaveMatchResult(match)}
                        disabled={savingResults || match.score1 === null || match.score2 === null}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: (match.score1 !== null && match.score2 !== null) ? '#10b981' : '#d1d5db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: (match.score1 !== null && match.score2 !== null) ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Save size={16} />
                        Lưu
                      </button>
                      
                      {/* Clear Button - chỉ hiển thị khi đã có kết quả */}
                      {match.score1 !== null && match.score2 !== null && (
                        <button
                          onClick={() => handleClearMatchResult(match)}
                          disabled={savingResults}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: savingResults ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <X size={16} />
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchResultsTab

