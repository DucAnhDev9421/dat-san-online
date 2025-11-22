import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { leagueApi } from '../../../../../api/leagueApi'
import { useTournament } from '../../TournamentContext'

const MatchesTab = ({ tournament }) => {
  const { id } = useParams()
  const { refreshTournament } = useTournament()
  const [teamsList, setTeamsList] = useState([])
  const [matches, setMatches] = useState([])
  const [savingMatches, setSavingMatches] = useState(false)
  const [drawingMatches, setDrawingMatches] = useState(false)
  
  // Kiểm tra format giải đấu
  const isRoundRobin = tournament?.format === 'Vòng tròn' || tournament?.format === 'round-robin'

  // Helper function: Tính toán stage đúng dựa trên số đội (cho single-elimination)
  const calculateFirstStage = (numTeams) => {
    if (numTeams === 2) {
      return 'final'
    } else if (numTeams === 4) {
      return 'semi'
    } else if (numTeams === 8) {
      return 'round3'
    } else if (numTeams === 16) {
      return 'round4'
    } else {
      // Với số đội lớn hơn, tính toán vòng đầu tiên
      let roundNumber = 1
      let currentTeams = numTeams
      while (currentTeams > 16) {
        currentTeams = Math.floor(currentTeams / 2)
        roundNumber++
      }
      if (currentTeams === 16) {
        return 'round4'
      } else if (currentTeams === 8) {
        return 'round3'
      } else if (currentTeams === 4) {
        return 'semi'
      } else if (currentTeams === 2) {
        return 'final'
      } else {
        return `round${roundNumber}`
      }
    }
  }

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

  useEffect(() => {
    // Load matches từ tournament nếu có
    if (tournament?.matches && tournament.matches.length > 0) {
      // Tính toán stage đúng dựa trên số đội
      let currentStage = 'round-robin'
      if (!isRoundRobin) {
        const numTeams = teamsList.length
        currentStage = calculateFirstStage(numTeams)
        
        // Nếu không tìm thấy matches cho stage tính toán, tìm stage từ matches có sẵn
        const stageMatches = tournament.matches.filter(m => m.stage === currentStage)
        if (stageMatches.length === 0) {
          // Tìm stage từ matches có sẵn
          const availableStages = [...new Set(tournament.matches.map(m => m.stage).filter(s => s !== 'round-robin'))]
          if (availableStages.length > 0) {
            // Ưu tiên các stage theo thứ tự: round1, round2, round3, round4, semi, final
            const stageOrder = ['round1', 'round2', 'round3', 'round4', 'semi', 'final']
            currentStage = availableStages.sort((a, b) => {
              const indexA = stageOrder.indexOf(a)
              const indexB = stageOrder.indexOf(b)
              return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
            })[0] || currentStage
          }
        }
      }
      
      const stageMatches = tournament.matches.filter(match => match.stage === currentStage)
      
      if (stageMatches.length > 0) {
        const loadedMatches = stageMatches.map(match => ({
          id: match.matchNumber || match.id,
          team1: match.team1Id || null,
          team2: match.team2Id || null,
          stage: match.stage,
          date: match.date,
          time: match.time,
          score1: match.score1,
          score2: match.score2
        }))
        setMatches(loadedMatches)
      } else {
        // Nếu không có matches cho stage hiện tại, tạo mặc định
        const numTeams = teamsList.length
        
        if (isRoundRobin) {
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
          setMatches(allMatches)
        } else {
          const numMatches = Math.floor(numTeams / 2)
          const firstRoundMatches = Array.from({ length: numMatches }, (_, index) => ({
            id: index + 1,
            team1: teamsList[index * 2]?.id || null,
            team2: teamsList[index * 2 + 1]?.id || null
          }))
          setMatches(firstRoundMatches)
        }
      }
    } else {
      // Nếu không có matches từ API, tạo mặc định
      const numTeams = teamsList.length
      
      if (isRoundRobin) {
        // Round-robin: tạo tất cả các cặp đấu (mỗi đội đấu với tất cả đội khác)
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
        setMatches(allMatches)
      } else {
        // Single-elimination: tính số cặp đấu cho vòng đầu tiên (số cặp = số đội / 2)
        const numMatches = Math.floor(numTeams / 2)
        
        // Tạo các cặp đấu cho vòng đầu tiên
        const firstRoundMatches = Array.from({ length: numMatches }, (_, index) => ({
          id: index + 1,
          team1: teamsList[index * 2]?.id || null,
          team2: teamsList[index * 2 + 1]?.id || null
        }))
        
        setMatches(firstRoundMatches)
      }
    }
  }, [tournament?.matches, teamsList, isRoundRobin])

  const handleRandomDraw = async () => {
    const numTeams = teamsList.length
    if (numTeams < 2) {
      toast.error('Cần ít nhất 2 đội để bốc thăm')
      return
    }

    try {
      setDrawingMatches(true)
      
      // Tính toán stage đúng dựa trên số đội (cho single-elimination)
      let currentStage = 'round-robin'
      if (!isRoundRobin) {
        currentStage = calculateFirstStage(numTeams)
      }
      
      // Gọi API để bốc thăm (clear existing matches cho cùng stage)
      const result = await leagueApi.drawMatches(id, {
        stage: currentStage,
        clearExisting: true // Xóa matches cũ của cùng stage trước khi bốc thăm mới
      })
      
      if (result.success) {
        toast.success(result.message || 'Đã bốc thăm ngẫu nhiên thành công')
        refreshTournament()
      }
    } catch (error) {
      console.error('Error drawing matches:', error)
      toast.error(error.message || 'Không thể bốc thăm ngẫu nhiên')
    } finally {
      setDrawingMatches(false)
    }
  }

  const handleMatchChange = (matchId, field, teamId) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId ? { ...match, [field]: teamId || null } : match
    ))
  }

  const handleSaveMatches = async () => {
    try {
      setSavingMatches(true)
      
      // Tính toán stage đúng dựa trên số đội (cho single-elimination)
      let currentStage = 'round-robin'
      if (!isRoundRobin) {
        const numTeams = teamsList.length
        currentStage = calculateFirstStage(numTeams)
      }
      
      // Lấy matches hiện có từ tournament (để giữ lại các stage khác)
      const existingMatches = tournament?.matches || []
      const otherStageMatches = existingMatches.filter(m => m.stage !== currentStage)
      
      // Chuyển đổi matches hiện tại sang format backend
      const matchesToSave = matches.map(match => ({
        stage: currentStage,
        matchNumber: match.id,
        team1Id: match.team1 || null,
        team2Id: match.team2 || null,
        date: match.date || null,
        time: match.time || null,
        score1: match.score1 || null,
        score2: match.score2 || null,
      }))
      
      // Merge với các matches của stage khác
      const allMatches = [...otherStageMatches, ...matchesToSave]
      
      // Gọi API để lưu matches
      await leagueApi.updateLeague(id, {
        matches: allMatches
      })
      
      toast.success('Đã lưu cặp đấu thành công')
      refreshTournament()
    } catch (error) {
      console.error('Error saving matches:', error)
      toast.error(error.message || 'Không thể lưu cặp đấu')
    } finally {
      setSavingMatches(false)
    }
  }

  if (!tournament) return null

  return (
    <div className="custom-tab-content">
      <h2>Sắp xếp cặp đấu</h2>
      
      <p className="matches-description">
        Bạn có thể thay đổi cấu hình cho từng trận đấu.
      </p>

      <div className="matches-actions">
        <button
          className="btn-random-draw"
          onClick={handleRandomDraw}
          disabled={drawingMatches}
        >
          {drawingMatches ? 'Đang bốc thăm...' : 'Bốc thăm ngẫu nhiên'}
        </button>
      </div>

      <div className="matches-section">
        <div className="matches-stage-box">
          <h3 className="matches-stage-title">
            {isRoundRobin 
              ? `Tất cả các trận đấu (${matches.length} trận)` 
              : matches.length === 1 ? 'Chung Kết' : matches.length === 2 ? 'Bán Kết' : `Vòng 1 (${matches.length} cặp đấu)`
            }
          </h3>
          
          <div className="matches-list">
            {matches.map((match) => {
              const team1 = teamsList.find(t => t.id === match.team1)
              const team2 = teamsList.find(t => t.id === match.team2)
              
              return (
                <div key={match.id} className="match-item">
                  <span className="match-number">#{match.id}</span>
                  
                  <div className="match-teams">
                    <select
                      className="match-team-select"
                      value={match.team1 || ''}
                      onChange={(e) => handleMatchChange(match.id, 'team1', e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">Chọn đội</option>
                      {teamsList.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.teamNumber || `Đội #${team.id}`}
                        </option>
                      ))}
                    </select>
                    
                    <span className="match-vs">-</span>
                    
                    <select
                      className="match-team-select"
                      value={match.team2 || ''}
                      onChange={(e) => handleMatchChange(match.id, 'team2', e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">Chọn đội</option>
                      {teamsList.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.teamNumber || `Đội #${team.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="matches-save-section">
        <button
          className="btn-save-matches"
          onClick={handleSaveMatches}
          disabled={savingMatches}
        >
          <Save size={16} />
          {savingMatches ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}

export default MatchesTab

