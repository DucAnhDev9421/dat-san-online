import React, { useState, useEffect, useMemo } from 'react'
import { Save, FileUp, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { leagueApi } from '../../../../../api/leagueApi'
import { useTournament } from '../../TournamentContext'

const ScheduleManagementTab = ({ tournament }) => {
  const { id } = useParams()
  const { refreshTournament } = useTournament()
  const [activeRoundIndex, setActiveRoundIndex] = useState(0)
  const [scheduleData, setScheduleData] = useState([])
  const [savingSchedule, setSavingSchedule] = useState(false)
  
  const isRoundRobin = tournament?.format === 'Vòng tròn' || tournament?.format === 'round-robin'

  // Helper: Lấy tên stage để hiển thị
  const getStageTitle = (stage) => {
    const stageMap = {
      'final': 'CHUNG KẾT',
      'semi': 'BÁN KẾT',
      'round3': 'TỨ KẾT',
      'round4': 'VÒNG 4',
      'round2': 'VÒNG 2',
      'round1': 'VÒNG 1',
      'round-robin': 'VÒNG TRÒN'
    }
    return stageMap[stage] || stage
  }

  // Helper: Lấy label ngắn cho stage
  const getStageLabel = (stage, index) => {
    if (isRoundRobin) {
      return index === 0 ? 'Tất cả' : `V${index + 1}`
    }
    const labelMap = {
      'final': 'CK',
      'semi': 'BK',
      'round3': 'TK',
      'round4': 'V4',
      'round2': 'V2',
      'round1': 'V1'
    }
    return labelMap[stage] || `V${index + 1}`
  }

  // Helper: Tìm team từ tournament.teams dựa trên teamId
  const findTeamById = (teamId) => {
    if (!teamId || teamId === "BYE") return null
    return tournament.teams?.find(t => 
      (t.id === teamId) || 
      (t._id?.toString() === teamId?.toString())
    ) || null
  }

  // Helper: Lấy tên team để hiển thị
  const getTeamDisplayName = (teamId) => {
    if (teamId === "BYE") {
      return "BYE"
    }
    if (!teamId) {
      return "TBD"
    }
    const team = findTeamById(teamId)
    if (team) {
      return team.teamNumber || `Đội #${team.id}`
    }
    return `Đội #${teamId}`
  }

  // Lấy danh sách teams từ API (không tạo defaultTeams)
  const teamsList = useMemo(() => {
    return tournament?.teams || []
  }, [tournament?.teams])

  // Tính toán rounds CHỈ từ matches trong API (không tính toán lại)
  const rounds = useMemo(() => {
    if (!tournament?.matches || tournament.matches.length === 0) {
      return []
    }

    if (isRoundRobin) {
      // Round-robin: Nhóm matches theo vòng (dựa trên matchNumber)
      const roundRobinMatches = tournament.matches
        .filter(m => m.stage === 'round-robin')
        .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
      
      if (roundRobinMatches.length === 0) {
        return []
      }

      // Nhóm matches theo vòng (giả sử backend đã sắp xếp matchNumber theo vòng)
      const matchesPerRound = Math.ceil(roundRobinMatches.length / (tournament.maxParticipants || 4))
      const rounds = []
      const numRounds = Math.ceil(roundRobinMatches.length / matchesPerRound)
      
      for (let round = 0; round < numRounds; round++) {
        const startIndex = round * matchesPerRound
        const endIndex = startIndex + matchesPerRound
        const roundMatches = roundRobinMatches
          .slice(startIndex, endIndex)
          .map(match => ({
            id: match.matchNumber || match.id,
            team1: match.team1Id || null,
            team2: match.team2Id || null,
            _match: match
          }))
        
        rounds.push({
          id: round + 1,
          name: 'round-robin',
          label: round === 0 ? 'Tất cả' : `V${round + 1}`,
          fullName: round === 0 ? 'TẤT CẢ CÁC TRẬN ĐẤU' : `VÒNG ${round + 1}`,
          matches: roundMatches
        })
      }
      
      return rounds
    } else {
      // Single-elimination: CHỈ nhóm matches theo stage từ API
      const singleEliminationMatches = tournament.matches.filter(
        m => m.stage && m.stage !== 'round-robin'
      )

      if (singleEliminationMatches.length === 0) {
        return []
      }

      // Nhóm matches theo stage
      const matchesByStage = {}
      singleEliminationMatches.forEach(match => {
        if (!matchesByStage[match.stage]) {
          matchesByStage[match.stage] = []
        }
        matchesByStage[match.stage].push(match)
      })

      // Sắp xếp các stage theo thứ tự: round1, round2, round3, round4, semi, final
      const stageOrder = ['round1', 'round2', 'round3', 'round4', 'semi', 'final']
      const sortedStages = Object.keys(matchesByStage).sort((a, b) => {
        const indexA = stageOrder.indexOf(a)
        const indexB = stageOrder.indexOf(b)
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      })

      // Tạo rounds từ matches đã nhóm
      const calculatedRounds = sortedStages.map((stage, index) => {
        const stageMatches = matchesByStage[stage]
          .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))

        return {
          id: index + 1,
          name: stage,
          label: getStageLabel(stage, index),
          fullName: getStageTitle(stage),
          matches: stageMatches.map(match => ({
            id: match.matchNumber || match.id,
            team1: match.team1Id || null,
            team2: match.team2Id || null,
            _match: match
          }))
        }
      })

      return calculatedRounds
    }
  }, [tournament?.matches, isRoundRobin, tournament?.maxParticipants])

  // Cập nhật scheduleData khi chuyển vòng hoặc tournament thay đổi
  useEffect(() => {
    if (rounds.length > 0 && rounds[activeRoundIndex]) {
      const currentRound = rounds[activeRoundIndex]
      const stage = isRoundRobin ? 'round-robin' : currentRound.name
      
      // Lấy matches từ database
      const dbMatches = tournament?.matches?.filter(m => m.stage === stage) || []
      
      const initialSchedule = currentRound.matches.map(match => {
        // Tìm match tương ứng trong database
        const dbMatch = dbMatches.find(m => 
          (m.matchNumber === match.id) || 
          (m.matchNumber === parseInt(match.id)) ||
          (parseInt(m.matchNumber) === match.id)
        )
        
        return {
          matchId: match.id,
          roundId: currentRound.id,
          stage: stage,
          team1: match.team1,
          team2: match.team2,
          date: dbMatch?.date ? new Date(dbMatch.date).toISOString().split('T')[0] : '',
          time: dbMatch?.time || ''
        }
      })
      setScheduleData(initialSchedule)
    } else {
      setScheduleData([])
    }
  }, [rounds, activeRoundIndex, tournament?.matches, isRoundRobin])

  const handleDownloadScheduleSample = async () => {
    try {
      await leagueApi.downloadScheduleTemplate(id)
      toast.success('Đã tải file mẫu thành công')
    } catch (error) {
      console.error('Error downloading template:', error)
      toast.error(error.message || 'Không thể tải file mẫu')
    }
  }

  const handleImportScheduleFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      try {
        setSavingSchedule(true)
        const result = await leagueApi.importSchedule(id, file)
        
        if (result.success) {
          const message = result.details?.notFound?.length > 0
            ? `Đã import ${result.details.updated}/${result.details.total} lịch đấu. ${result.details.notFound.length} trận không tìm thấy.`
            : result.message || 'Import thành công'
          toast.success(message)
          refreshTournament()
        }
      } catch (error) {
        console.error('Error importing schedule:', error)
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach(err => toast.error(err))
        } else {
          toast.error(error.message || 'Không thể import lịch đấu')
        }
      } finally {
        setSavingSchedule(false)
      }
    }
    input.click()
  }

  const handleScheduleChange = (matchId, field, value) => {
    setScheduleData(prev => prev.map(item => 
      item.matchId === matchId ? { ...item, [field]: value } : item
    ))
  }

  const handleSaveSchedule = async () => {
    if (scheduleData.length === 0) {
      toast.error('Không có lịch đấu để lưu')
      return
    }

    try {
      setSavingSchedule(true)
      
      // Chuyển đổi scheduleData sang format API
      const schedules = scheduleData.map(item => ({
        stage: item.stage,
        matchNumber: parseInt(item.matchId) || item.matchId,
        date: item.date || null,
        time: item.time || null
      }))
      
      // Gọi API để lưu lịch đấu
      const result = await leagueApi.updateMatchSchedule(id, schedules)
      
      if (result.success) {
        toast.success('Đã lưu lịch đấu thành công')
        refreshTournament()
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast.error(error.message || 'Không thể lưu lịch đấu')
    } finally {
      setSavingSchedule(false)
    }
  }

  if (!tournament) return null

  // Nếu chưa có matches, hiển thị thông báo
  if (rounds.length === 0) {
    return (
      <div className="custom-tab-content">
        <h2>Quản lý lịch đấu</h2>
        
        <p className="schedule-description">
          Chưa có lịch đấu. Vui lòng bốc thăm để tạo lịch đấu.
        </p>
      </div>
    )
  }

  return (
    <div className="custom-tab-content">
      <h2>Quản lý lịch đấu</h2>
      
      <div className="schedule-management-header">
        <p className="schedule-description">
          Bạn có thể quản lý lịch thi đấu (ngày, giờ) của toàn giải đấu.
        </p>
        <div className="schedule-import-actions">
          <button
            className="download-schedule-link"
            onClick={handleDownloadScheduleSample}
          >
            Tải về tệp tin mẫu
          </button>
          <button
            className="btn-import-schedule-file"
            onClick={handleImportScheduleFile}
          >
            <FileUp size={16} />
            Nhập tệp tin
          </button>
        </div>
      </div>

      {/* Stage Selector */}
      {rounds.length > 1 && (
        <div className="schedule-stage-selector">
          {rounds.map((round, index) => (
            <button
              key={round.id || index}
              className={`stage-circle ${activeRoundIndex === index ? 'active' : ''}`}
              onClick={() => setActiveRoundIndex(index)}
              title={round.fullName}
            >
              {round.label}
            </button>
          ))}
        </div>
      )}

      <div className="schedule-section">
        {rounds[activeRoundIndex] && (
          <>
            <h3 className="schedule-stage-title">
              {rounds[activeRoundIndex].fullName}
            </h3>
            
            {scheduleData.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                Chưa có trận đấu nào cho vòng này.
              </div>
            ) : (
              <div className="schedule-matches-list">
                {scheduleData.map((scheduleItem) => {
                  const currentRound = rounds[activeRoundIndex]
                  const match = currentRound.matches.find(m => m.id === scheduleItem.matchId)
                  
                  // Lấy teamId từ match
                  const team1Id = match?.team1 || null
                  const team2Id = match?.team2 || null
                  
                  // Kiểm tra BYE
                  const isTeam1Bye = team1Id === "BYE"
                  const isTeam2Bye = team2Id === "BYE"
                  
                  // Lấy tên team để hiển thị
                  const team1Name = getTeamDisplayName(team1Id)
                  const team2Name = getTeamDisplayName(team2Id)
                  
                  return (
                    <div 
                      key={scheduleItem.matchId} 
                      className="schedule-match-item"
                      style={{
                        backgroundColor: (isTeam1Bye || isTeam2Bye) ? '#fef3c7' : 'white',
                        border: (isTeam1Bye || isTeam2Bye) ? '2px solid #f59e0b' : '1px solid #e5e7eb'
                      }}
                    >
                      <span className="schedule-match-number">
                        #{scheduleItem.matchId}.
                        {(isTeam1Bye || isTeam2Bye) && (
                          <span style={{
                            fontSize: '10px',
                            color: '#92400e',
                            fontWeight: '600',
                            marginLeft: '4px'
                          }}>
                            (BYE)
                          </span>
                        )}
                      </span>
                      
                      <div className="schedule-match-teams">
                        <span className="schedule-team-name" style={{
                          color: isTeam1Bye ? '#92400e' : '#1f2937',
                          fontWeight: isTeam1Bye ? '600' : '500'
                        }}>
                          {team1Name}
                        </span>
                        <X size={16} className="schedule-team-vs" />
                        <span className="schedule-team-name" style={{
                          color: isTeam2Bye ? '#92400e' : '#1f2937',
                          fontWeight: isTeam2Bye ? '600' : '500'
                        }}>
                          {team2Name}
                        </span>
                      </div>
                      
                      <div className="schedule-match-inputs">
                        <input
                          type="date"
                          className="schedule-input schedule-date"
                          value={scheduleItem.date}
                          onChange={(e) => handleScheduleChange(scheduleItem.matchId, 'date', e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                        />
                        <input
                          type="time"
                          className="schedule-input schedule-time"
                          value={scheduleItem.time}
                          onChange={(e) => handleScheduleChange(scheduleItem.matchId, 'time', e.target.value)}
                          placeholder="giờ:phút"
                          onClick={(e) => e.target.showPicker?.()}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="schedule-save-section">
        <button
          className="btn-save-schedule"
          onClick={handleSaveSchedule}
          disabled={savingSchedule || scheduleData.length === 0}
        >
          <Save size={16} />
          {savingSchedule ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}

export default ScheduleManagementTab
