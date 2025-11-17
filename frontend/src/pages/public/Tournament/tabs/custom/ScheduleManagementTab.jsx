import React, { useState, useEffect } from 'react'
import { Save, FileUp, X } from 'lucide-react'
import { toast } from 'react-toastify'

const ScheduleManagementTab = ({ tournament }) => {
  const [teamsList, setTeamsList] = useState([])
  const [rounds, setRounds] = useState([]) // Mảng các vòng đấu
  const [activeRoundIndex, setActiveRoundIndex] = useState(0)
  const [scheduleData, setScheduleData] = useState([])
  const [savingSchedule, setSavingSchedule] = useState(false)
  
  // Kiểm tra format giải đấu
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

  // Tính toán các vòng đấu dựa trên số đội
  useEffect(() => {
    if (teamsList.length === 0) return
    
    const numTeams = teamsList.length
    
    if (isRoundRobin) {
      // Round-robin: tạo một "vòng" duy nhất chứa tất cả các trận đấu
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
        name: 'all',
        label: 'Tất cả',
        fullName: 'TẤT CẢ CÁC TRẬN ĐẤU',
        matches: allMatches,
        numTeams: numTeams
      }])
    } else {
      // Single-elimination: tính toán các vòng đấu từ vòng đầu tiên đến chung kết
      const calculatedRounds = []
      let currentTeams = numTeams
      let roundNumber = 1
      
      while (currentTeams > 1) {
      const numMatches = Math.floor(currentTeams / 2)
      const roundMatches = Array.from({ length: numMatches }, (_, index) => {
        const teamIndex1 = index * 2
        const teamIndex2 = index * 2 + 1
        return {
          id: index + 1,
          team1: teamsList[teamIndex1]?.id || null,
          team2: teamsList[teamIndex2]?.id || null
        }
      })
      
      // Đặt tên vòng đấu
      let roundName = ''
      let roundLabel = ''
      if (currentTeams === 2) {
        roundName = 'final'
        roundLabel = 'CK' // Chung Kết
      } else if (currentTeams === 4) {
        roundName = 'semi'
        roundLabel = 'BK' // Bán Kết
      } else if (currentTeams === 8) {
        roundName = 'quarter'
        roundLabel = 'TK' // Tứ Kết
      } else {
        roundName = `round${roundNumber}`
        roundLabel = `V${roundNumber}` // Vòng 1, Vòng 2, ...
      }
      
      calculatedRounds.push({
        id: roundNumber,
        name: roundName,
        label: roundLabel,
        fullName: currentTeams === 2 ? 'CHUNG KẾT' : 
                 currentTeams === 4 ? 'BÁN KẾT' : 
                 currentTeams === 8 ? 'TỨ KẾT' : 
                 `VÒNG ${roundNumber}`,
        matches: roundMatches,
        numTeams: currentTeams
      })
      
        currentTeams = numMatches
        roundNumber++
      }
      
      setRounds(calculatedRounds)
    }
  }, [teamsList, isRoundRobin])

  // Cập nhật scheduleData khi chuyển vòng
  useEffect(() => {
    if (rounds.length > 0 && rounds[activeRoundIndex]) {
      const currentRound = rounds[activeRoundIndex]
      const initialSchedule = currentRound.matches.map(match => ({
        matchId: match.id,
        roundId: currentRound.id,
        team1: match.team1,
        team2: match.team2,
        date: '',
        time: ''
      }))
      setScheduleData(initialSchedule)
    }
  }, [rounds, activeRoundIndex])

  const handleDownloadScheduleSample = () => {
    toast.info('Tính năng tải file mẫu đang được phát triển')
  }

  const handleImportScheduleFile = () => {
    toast.info('Tính năng nhập file đang được phát triển')
  }

  const handleScheduleChange = (matchId, field, value) => {
    setScheduleData(prev => prev.map(item => 
      item.matchId === matchId ? { ...item, [field]: value } : item
    ))
  }

  const handleSaveSchedule = async () => {
    try {
      setSavingSchedule(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã lưu lịch đấu thành công')
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast.error('Không thể lưu lịch đấu')
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
                const team1 = teamsList.find(t => t.id === match?.team1)
                const team2 = teamsList.find(t => t.id === match?.team2)
                
                // Nếu là vòng sau vòng đầu tiên (single-elimination), hiển thị winner placeholder
                const isLaterRound = !isRoundRobin && activeRoundIndex > 0
                const team1Name = isLaterRound 
                  ? `W#${scheduleItem.matchId} ${rounds[activeRoundIndex - 1]?.fullName || 'Vòng trước'}`
                  : (team1 ? (team1.teamNumber?.startsWith('Đội') ? team1.teamNumber : `Đội ${team1.teamNumber || `#${team1.id}`}`) : 'Chưa chọn')
                const team2Name = isLaterRound
                  ? `W#${scheduleItem.matchId + 1} ${rounds[activeRoundIndex - 1]?.fullName || 'Vòng trước'}`
                  : (team2 ? (team2.teamNumber?.startsWith('Đội') ? team2.teamNumber : `Đội ${team2.teamNumber || `#${team2.id}`}`) : 'Chưa chọn')
                
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

