import React, { useState, useEffect } from 'react'
import { Save, FileUp, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { leagueApi } from '../../../../../api/leagueApi'
import { useTournament } from '../../TournamentContext'

const ScheduleManagementTab = ({ tournament }) => {
  const { id } = useParams()
  const { refreshTournament } = useTournament()
  const [teamsList, setTeamsList] = useState([])
  const [rounds, setRounds] = useState([])
  const [activeRoundIndex, setActiveRoundIndex] = useState(0)
  const [scheduleData, setScheduleData] = useState([])
  const [savingSchedule, setSavingSchedule] = useState(false)
  
  const isRoundRobin = tournament?.format === 'Vòng tròn' || tournament?.format === 'round-robin'

  useEffect(() => {
    // Lấy số lượng đội từ maxParticipants (mặc định 4 nếu không có)
    const numTeams = tournament?.maxParticipants || 4
    
    // Tạo mảng đội mặc định với số lượng đúng
    const defaultTeams = Array.from({ length: numTeams }, (_, index) => ({
      id: index + 1,
      teamNumber: `Đội #${index + 1}`
    }))

    // Merge với dữ liệu từ API nếu có
    if (tournament?.teams && tournament.teams.length > 0) {
      tournament.teams.forEach((team, index) => {
        if (defaultTeams[index]) {
          defaultTeams[index] = {
            ...defaultTeams[index],
            ...team,
            id: team.id || index + 1,
            teamNumber: team.teamNumber || `Đội #${index + 1}`
          }
        }
      })
    }
    setTeamsList(defaultTeams)
  }, [tournament])

  // Tính toán các vòng đấu dựa trên matches từ database
  useEffect(() => {
    if (teamsList.length === 0) return
    
    const numTeams = teamsList.length
    
    if (isRoundRobin) {
      // Round-robin: tạo rounds dựa trên matches từ database
      if (tournament?.matches && tournament.matches.length > 0) {
        const roundRobinMatches = tournament.matches
          .filter(m => m.stage === 'round-robin')
          .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
        
        if (roundRobinMatches.length > 0) {
          // Nhóm matches theo vòng (giả sử matchNumber 1-6 là vòng 1, 7-12 là vòng 2, ...)
          const matchesPerRound = Math.floor(numTeams / 2)
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
                team2: match.team2Id || null
              }))
            
            rounds.push({
              id: round + 1,
              name: 'round-robin',
              label: round === 0 ? 'Tất cả' : `V${round + 1}`,
              fullName: round === 0 ? 'TẤT CẢ CÁC TRẬN ĐẤU' : `VÒNG ${round + 1}`,
              matches: roundMatches,
              numTeams: numTeams
            })
          }
          
          setRounds(rounds)
          return
        }
      }
      
      // Fallback: tạo một "vòng" duy nhất chứa tất cả các trận đấu
      const allMatches = []
      for (let i = 0; i < numTeams; i++) {
        for (let j = i + 1; j < numTeams; j++) {
          allMatches.push({
            id: allMatches.length + 1,
            team1: teamsList[i]?.id || null,
            team2: teamsList[j]?.id || null
          })
        }
      }
      
      setRounds([{
        id: 1,
        name: 'round-robin',
        label: 'Tất cả',
        fullName: 'TẤT CẢ CÁC TRẬN ĐẤU',
        matches: allMatches,
        numTeams: numTeams
      }])
    } else {
      // Single-elimination: luôn tính toán tất cả các vòng từ đầu đến chung kết
      // Tính toán cấu trúc tất cả các vòng cần thiết
      const allRoundsStructure = []
      let currentTeams = numTeams
      let roundNumber = 1
      
      while (currentTeams > 1) {
        const numMatches = Math.floor(currentTeams / 2)
        let roundName = ''
        let roundLabel = ''
        let fullName = ''
        
        if (currentTeams === 2) {
          roundName = 'final'
          roundLabel = 'CK'
          fullName = 'CHUNG KẾT'
        } else if (currentTeams === 4) {
          roundName = 'semi'
          roundLabel = 'BK'
          fullName = 'BÁN KẾT'
        } else if (currentTeams === 8) {
          roundName = 'round3'
          roundLabel = 'TK'
          fullName = 'TỨ KẾT'
        } else {
          roundName = `round${roundNumber}`
          roundLabel = `V${roundNumber}`
          fullName = `VÒNG ${roundNumber}`
        }
        
        allRoundsStructure.push({
          stage: roundName,
          numMatches: numMatches,
          roundNumber: roundNumber,
          label: roundLabel,
          fullName: fullName
        })
        
        currentTeams = numMatches
        roundNumber++
      }

      // Nhóm matches từ database theo stage
      const matchesByStage = {}
      if (tournament?.matches && tournament.matches.length > 0) {
        tournament.matches.forEach(match => {
          if (!matchesByStage[match.stage]) {
            matchesByStage[match.stage] = []
          }
          matchesByStage[match.stage].push(match)
        })
      }

      // Tạo rounds dựa trên cấu trúc đã tính toán
      const calculatedRounds = []
      
      allRoundsStructure.forEach((roundStructure, index) => {
        const stageMatches = matchesByStage[roundStructure.stage] || []
        const sortedMatches = stageMatches.sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
        
        let roundMatches = []
        
        // Nếu có matches từ database, sử dụng chúng (ưu tiên)
        if (sortedMatches.length > 0) {
          roundMatches = sortedMatches.map(match => ({
            id: match.matchNumber || match.id,
            team1: match.team1Id || null,
            team2: match.team2Id || null
          }))
        } else {
          // Nếu không có matches, tạo placeholder
          // Vòng đầu tiên: sử dụng teams thật
          // Các vòng sau: sử dụng placeholder từ vòng trước
          if (index === 0) {
            // Vòng đầu tiên: sử dụng teams thật
            roundMatches = Array.from({ length: roundStructure.numMatches }, (_, i) => {
              const teamIndex1 = i * 2
              const teamIndex2 = i * 2 + 1
              return {
                id: i + 1,
                team1: teamsList[teamIndex1]?.id || null,
                team2: teamsList[teamIndex2]?.id || null
              }
            })
          } else {
            // Vòng sau: sử dụng placeholder từ vòng trước
            roundMatches = Array.from({ length: roundStructure.numMatches }, (_, i) => ({
              id: i + 1,
              team1: null, // Placeholder
              team2: null // Placeholder
            }))
          }
        }
        
        calculatedRounds.push({
          id: roundStructure.roundNumber,
          name: roundStructure.stage,
          label: roundStructure.label,
          fullName: roundStructure.fullName,
          matches: roundMatches,
          numTeams: roundStructure.numMatches * 2
        })
      })
      
      setRounds(calculatedRounds)
    }
  }, [teamsList, isRoundRobin, tournament?.matches])

  // Cập nhật scheduleData khi chuyển vòng hoặc tournament thay đổi
  useEffect(() => {
    if (rounds.length > 0 && rounds[activeRoundIndex]) {
      const currentRound = rounds[activeRoundIndex]
      const stage = isRoundRobin ? 'round-robin' : currentRound.name
      
      // Lấy matches từ database nếu có
      const dbMatches = tournament?.matches?.filter(m => m.stage === stage) || []
      
      const initialSchedule = currentRound.matches.map(match => {
        // Tìm match tương ứng trong database
        const dbMatch = dbMatches.find(m => m.matchNumber === match.id)
        
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
    try {
      setSavingSchedule(true)
      
      // Chuyển đổi scheduleData sang format API
      const schedules = scheduleData.map(item => ({
        stage: item.stage,
        matchNumber: parseInt(item.matchId) || item.matchId, // Đảm bảo là number
        date: item.date || null,
        time: item.time || null
      }))
      
      // Debug: Log để kiểm tra
      console.log('Saving schedules:', schedules)
      console.log('Tournament matches:', tournament?.matches?.map(m => ({
        stage: m.stage,
        matchNumber: m.matchNumber,
        matchNumberType: typeof m.matchNumber
      })))
      
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

  return (
    <div className="custom-tab-content">
      <h2>Quản lý lịch đấu</h2>
      
      <div className="schedule-management-header">
        <p className="schedule-description">
          Bạn có thể quản lý địa điểm thi đấu của toàn giải đấu.
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

      {!isRoundRobin && (
        <div className="schedule-stage-selector">
          {rounds.map((round, index) => (
            <button
              key={round.id}
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
            
            <div className="schedule-matches-list">
              {scheduleData.map((scheduleItem) => {
                const currentRound = rounds[activeRoundIndex]
                const match = currentRound.matches.find(m => m.id === scheduleItem.matchId)
                
                // Tìm team bằng cách so sánh id (hỗ trợ cả number và string)
                const team1 = teamsList.find(t => {
                  const teamId = t.id || t._id
                  const matchTeamId = match?.team1
                  return teamId === matchTeamId || 
                         teamId?.toString() === matchTeamId?.toString() ||
                         parseInt(teamId) === parseInt(matchTeamId)
                })
                const team2 = teamsList.find(t => {
                  const teamId = t.id || t._id
                  const matchTeamId = match?.team2
                  return teamId === matchTeamId || 
                         teamId?.toString() === matchTeamId?.toString() ||
                         parseInt(teamId) === parseInt(matchTeamId)
                })
                
                // Kiểm tra nếu match có teamId = null (từ database) hoặc không tìm thấy team
                const hasTeam1 = match?.team1 !== null && match?.team1 !== undefined && team1
                const hasTeam2 = match?.team2 !== null && match?.team2 !== undefined && team2
                const isLaterRound = !isRoundRobin && activeRoundIndex > 0 && (!hasTeam1 || !hasTeam2)
                const previousRoundName = rounds[activeRoundIndex - 1]?.fullName || 'Vòng trước'
                
                const team1Name = hasTeam1
                  ? (team1.teamNumber?.startsWith('Đội') ? team1.teamNumber : `Đội ${team1.teamNumber || `#${team1.id}`}`)
                  : (isLaterRound 
                      ? `W#${scheduleItem.matchId} ${previousRoundName}`
                      : 'Chưa chọn')
                
                const team2Name = hasTeam2
                  ? (team2.teamNumber?.startsWith('Đội') ? team2.teamNumber : `Đội ${team2.teamNumber || `#${team2.id}`}`)
                  : (isLaterRound
                      ? `W#${scheduleItem.matchId + 1} ${previousRoundName}`
                      : 'Chưa chọn')
                
                return (
                  <div key={scheduleItem.matchId} className="schedule-match-item">
                    <span className="schedule-match-number">#{scheduleItem.matchId}.</span>
                    
                    <div className="schedule-match-teams">
                      <span className="schedule-team-name">
                        {team1Name}
                      </span>
                      <X size={16} className="schedule-team-vs" />
                      <span className="schedule-team-name">
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
          </>
        )}
      </div>

      <div className="schedule-save-section">
        <button
          className="btn-save-schedule"
          onClick={handleSaveSchedule}
          disabled={savingSchedule}
        >
          <Save size={16} />
          {savingSchedule ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}

export default ScheduleManagementTab

