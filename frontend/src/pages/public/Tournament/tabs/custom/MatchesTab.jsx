import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'react-toastify'

const MatchesTab = ({ tournament }) => {
  const [teamsList, setTeamsList] = useState([])
  const [matches, setMatches] = useState([])
  const [savingMatches, setSavingMatches] = useState(false)
  
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

  useEffect(() => {
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
  }, [teamsList, isRoundRobin])

  const handleRandomDraw = () => {
    const numTeams = teamsList.length
    if (numTeams < 2) {
      toast.error('Cần ít nhất 2 đội để bốc thăm')
      return
    }
    
    const shuffled = [...teamsList].sort(() => Math.random() - 0.5)
    
    if (isRoundRobin) {
      // Round-robin: tạo tất cả các cặp đấu với thứ tự ngẫu nhiên
      const allMatches = []
      for (let i = 0; i < numTeams; i++) {
        for (let j = i + 1; j < numTeams; j++) {
          allMatches.push({
            id: allMatches.length + 1,
            team1: shuffled[i]?.id || null,
            team2: shuffled[j]?.id || null
          })
        }
      }
      setMatches(allMatches)
    } else {
      // Single-elimination: bốc thăm cho vòng đầu tiên
      const numMatches = Math.floor(numTeams / 2)
      
      const newMatches = Array.from({ length: numMatches }, (_, index) => ({
        id: index + 1,
        team1: shuffled[index * 2]?.id || null,
        team2: shuffled[index * 2 + 1]?.id || null
      }))
      
      setMatches(newMatches)
    }
    
    toast.success('Đã bốc thăm ngẫu nhiên thành công')
  }

  const handleMatchChange = (matchId, field, teamId) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId ? { ...match, [field]: teamId || null } : match
    ))
  }

  const handleSaveMatches = async () => {
    try {
      setSavingMatches(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã lưu cặp đấu thành công')
    } catch (error) {
      console.error('Error saving matches:', error)
      toast.error('Không thể lưu cặp đấu')
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
        >
          Bốc thăm ngẫu nhiên
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

