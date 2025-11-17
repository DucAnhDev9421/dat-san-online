import React, { useMemo, useState } from 'react'
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets'

const ScheduleTab = ({ tournament }) => {
  if (!tournament) return null

  // Kiểm tra format giải đấu
  const isRoundRobin = tournament.format === 'Vòng tròn' || tournament.format === 'round-robin'
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null) // null = hiển thị tất cả

  // Tính toán các vòng đấu dựa trên số đội
  const rounds = useMemo(() => {
    const numTeams = tournament?.maxParticipants || 4
    
    // Tạo mảng đội mặc định
    const defaultTeams = Array.from({ length: numTeams }, (_, index) => ({
      id: index + 1,
      teamNumber: `Đội #${index + 1}`
    }))

    // Merge với dữ liệu từ API nếu có
    const teams = tournament.teams && tournament.teams.length > 0
      ? defaultTeams.map((defaultTeam, index) => {
          const apiTeam = tournament.teams[index]
          return apiTeam ? {
            ...defaultTeam,
            ...apiTeam,
            id: apiTeam.id || index + 1,
            teamNumber: apiTeam.teamNumber || `Đội #${index + 1}`
          } : defaultTeam
        })
      : defaultTeams

    // Nếu là round-robin, không hiển thị bracket
    if (isRoundRobin) {
      return []
    }

    const calculatedRounds = []
    let currentTeams = teams
    let roundNumber = 1
    
    // Tính toán các vòng đấu từ vòng đầu tiên đến chung kết (single-elimination)
    while (currentTeams.length > 1) {
      const numMatches = Math.floor(currentTeams.length / 2)
      const seeds = []
      
      for (let i = 0; i < numMatches; i++) {
        const team1 = currentTeams[i * 2]
        const team2 = currentTeams[i * 2 + 1]
        
        seeds.push({
          id: i + 1,
          date: new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          teams: [
            { 
              name: team1?.teamNumber || `Đội #${team1?.id || i * 2 + 1}`, 
              score: 0 
            },
            { 
              name: team2?.teamNumber || `Đội #${team2?.id || i * 2 + 2}`, 
              score: 0 
            }
          ]
        })
      }
      
      // Đặt tên vòng đấu
      let roundTitle = ''
      if (currentTeams.length === 2) {
        roundTitle = 'Chung Kết'
      } else if (currentTeams.length === 4) {
        roundTitle = 'Bán Kết'
      } else if (currentTeams.length === 8) {
        roundTitle = 'Tứ Kết'
      } else {
        roundTitle = `Vòng ${roundNumber}`
      }
      
      calculatedRounds.push({
        title: roundTitle,
        seeds: seeds
      })
      
      // Tạo winner placeholders cho vòng tiếp theo
      currentTeams = Array.from({ length: numMatches }, (_, index) => ({
        id: `winner-${roundNumber}-${index + 1}`,
        teamNumber: `W#${index + 1} ${roundTitle}`
      }))
      
      roundNumber++
    }
    
    return calculatedRounds
  }, [tournament, isRoundRobin])


  // Tính toán các vòng đấu cho round-robin
  const roundRobinRounds = useMemo(() => {
    if (!isRoundRobin) return []
    
    const numTeams = tournament?.maxParticipants || 4
    const defaultTeams = Array.from({ length: numTeams }, (_, index) => ({
      id: index + 1,
      teamNumber: `Đội #${index + 1}`
    }))

    const teams = tournament.teams && tournament.teams.length > 0
      ? defaultTeams.map((defaultTeam, index) => {
          const apiTeam = tournament.teams[index]
          return apiTeam ? {
            ...defaultTeam,
            ...apiTeam,
            id: apiTeam.id || index + 1,
            teamNumber: apiTeam.teamNumber || `Đội #${index + 1}`
          } : defaultTeam
        })
      : defaultTeams

    // Thuật toán chia round-robin thành các vòng (Round-Robin Tournament Algorithm)
    // Với n đội: n-1 vòng (nếu n chẵn) hoặc n vòng (nếu n lẻ)
    const rounds = []
    const numRounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams
    const matchesPerRound = Math.floor(numTeams / 2)
    
    // Tạo mảng đội để xoay vòng (đội đầu tiên cố định)
    let rotatingTeams = [...teams]
    
    for (let round = 0; round < numRounds; round++) {
      const roundMatches = []
      
      // Đội đầu tiên (index 0) cố định
      const fixedTeam = rotatingTeams[0]
      const otherTeams = rotatingTeams.slice(1)
      
      // Tạo các cặp đấu cho vòng này
      // Đội đầu (cố định) đấu với đội cuối, đội thứ 2 đấu với đội gần cuối, ...
      for (let i = 0; i < matchesPerRound; i++) {
        let team1, team2
        
        if (i === 0) {
          // Trận đầu: đội cố định vs đội cuối
          team1 = fixedTeam
          team2 = otherTeams[otherTeams.length - 1]
        } else {
          // Các trận còn lại: đội thứ i vs đội đối diện
          team1 = otherTeams[i - 1]
          team2 = otherTeams[otherTeams.length - 1 - i]
        }
        
        roundMatches.push({
          id: roundMatches.length + 1,
          team1: team1,
          team2: team2,
          score1: 0,
          score2: 0,
          matchNumber: roundMatches.length + 1
        })
      }
      
      rounds.push({
        id: round + 1,
        title: `VÒNG ${round + 1}`,
        matches: roundMatches
      })
      
      // Xoay vòng: di chuyển đội cuối lên vị trí thứ 2 (sau đội đầu)
      // [1, 2, 3, 4] -> [1, 4, 2, 3] -> [1, 3, 4, 2] -> ...
      if (round < numRounds - 1 && otherTeams.length > 0) {
        const lastTeam = otherTeams.pop()
        rotatingTeams = [rotatingTeams[0], lastTeam, ...otherTeams]
      }
    }
    
    return rounds
  }, [tournament, isRoundRobin])

  const getTeamData = (teamName, index, seed, roundIndex) => {
    if (teamName.includes('W#') || teamName.includes('winner')) {
      return null // Winner placeholder, no logo yet
    }
    
    // Try to match by teamNumber or by index
    const teamNumber = teamName.replace('Đội ', '').replace('#', '')
    let team = tournament.teams?.find(t => {
      const tNumber = (t.teamNumber || `#${t.id}`).replace('Đội ', '').replace('#', '')
      return tNumber === teamNumber
    })
    
    // If not found, try by index (for first round)
    if (!team && tournament.teams && roundIndex === 0) {
      const teamIndex = parseInt(teamNumber) - 1
      if (teamIndex >= 0 && teamIndex < tournament.teams.length) {
        team = tournament.teams[teamIndex]
      }
    }
    
    return team
  }

  // Hiển thị round-robin: Theo từng vòng với selector
  if (isRoundRobin) {
    // Lấy các trận đấu để hiển thị (theo vòng được chọn hoặc tất cả)
    const matchesToDisplay = selectedRoundIndex === null
      ? roundRobinRounds.flatMap(round => round.matches)
      : roundRobinRounds[selectedRoundIndex]?.matches || []
    
    // Nhóm các trận đấu theo vòng nếu hiển thị tất cả
    const displayRounds = selectedRoundIndex === null
      ? roundRobinRounds
      : [roundRobinRounds[selectedRoundIndex]].filter(Boolean)

    return (
      <div className="schedule-section">
        <div className="section-card">
          <h2>Lịch thi đấu - Vòng tròn</h2>
          
          {/* Round Selector */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginTop: '24px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>VÒNG</span>
            <button
              onClick={() => setSelectedRoundIndex(null)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: selectedRoundIndex === null ? '#10b981' : '#10b981',
                backgroundColor: selectedRoundIndex === null ? '#10b981' : 'transparent',
                color: selectedRoundIndex === null ? '#fff' : '#10b981',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              TẤT
            </button>
            {roundRobinRounds.map((round, index) => (
              <button
                key={round.id}
                onClick={() => setSelectedRoundIndex(index)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: selectedRoundIndex === index ? '#10b981' : '#10b981',
                  backgroundColor: selectedRoundIndex === index ? '#10b981' : 'transparent',
                  color: selectedRoundIndex === index ? '#fff' : '#10b981',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {round.id}
              </button>
            ))}
          </div>

          {/* Hiển thị các vòng */}
          {displayRounds.map((round) => {
            const team1Data = (team) => tournament.teams?.find(t => t.id === team.id) || team
            const team2Data = (team) => tournament.teams?.find(t => t.id === team.id) || team
            
            return (
              <div key={round.id} style={{ marginBottom: '32px' }}>
                {/* Banner vòng đấu */}
                <div style={{
                  backgroundColor: '#7c3aed',
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '8px 8px 0 0',
                  fontWeight: '600',
                  fontSize: '16px',
                  marginBottom: '0',
                  textAlign: 'center'
                }}>
                  {round.title}
                </div>
                
                {/* Danh sách trận đấu */}
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  backgroundColor: '#fff'
                }}>
                  {round.matches.map((match, matchIndex) => {
                    const team1 = team1Data(match.team1)
                    const team2 = team2Data(match.team2)
                    const hasScore = match.score1 !== undefined && match.score2 !== undefined
                    const scoreText = hasScore ? `${match.score1 || 0}-${match.score2 || 0}` : 'Chưa có lịch thi đấu'
                    
                    return (
                      <div 
                        key={match.id || matchIndex}
                        className="match-row-hover"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px 20px',
                          borderBottom: matchIndex < round.matches.length - 1 ? '1px solid #e5e7eb' : 'none',
                          gap: '12px',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Số thứ tự trận - cố định bên trái */}
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#6b7280',
                          flexShrink: 0,
                          position: 'absolute',
                          left: '20px'
                        }}>
                          {match.matchNumber || matchIndex + 1}
                        </div>
                        
                        {/* Phần giữa - căn giữa */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          flexShrink: 0
                        }}>
                          {/* Đội 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <img 
                              src={team1.logo || '/team.png'} 
                              alt="Team" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {team1.teamNumber || `Đội #${team1.id}`}
                            </span>
                          </div>
                          
                          {/* Tỷ số */}
                          <div style={{
                            padding: '8px 16px',
                            backgroundColor: '#10b981',
                            color: '#fff',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            minWidth: '120px',
                            textAlign: 'center',
                            flexShrink: 0
                          }}>
                            {scoreText}
                          </div>
                          
                          {/* Đội 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {team2.teamNumber || `Đội #${team2.id}`}
                            </span>
                            <img 
                              src={team2.logo || '/team.png'} 
                              alt="Team" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                        
                        {/* Trạng thái - cố định bên phải */}
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'right',
                          flexShrink: 0,
                          minWidth: '150px',
                          position: 'absolute',
                          right: '20px'
                        }}>
                          Chưa có lịch thi đấu
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Hiển thị single-elimination: Bracket tree
  return (
    <div className="schedule-section">
      <div className="section-card">
        <h2>Lịch thi đấu</h2>
        <div className="bracket-container">
          <Bracket
            rounds={rounds}
            renderSeedComponent={(props) => {
              const roundIndex = rounds.findIndex(r => r.seeds.includes(props.seed))
              const team1Data = getTeamData(props.seed.teams[0]?.name || '', 0, props.seed, roundIndex)
              const team2Data = getTeamData(props.seed.teams[1]?.name || '', 1, props.seed, roundIndex)
              
              return (
                <Seed {...props}>
                  <SeedItem>
                    <div className="seed-header">
                      <div className="seed-title">{props.seed.date}</div>
                    </div>
                    <SeedTeam className="seed-team">
                      <div className="team-info-bracket">
                        <img 
                          src={team1Data?.logo || '/team.png'} 
                          alt="Team" 
                          className="team-logo-bracket"
                        />
                        <div className="team-name-bracket">{props.seed.teams[0]?.name || 'TBD'}</div>
                      </div>
                      <div className="team-score">{props.seed.teams[0]?.score || '-'}</div>
                    </SeedTeam>
                    <SeedTeam className="seed-team">
                      <div className="team-info-bracket">
                        <img 
                          src={team2Data?.logo || '/team.png'} 
                          alt="Team" 
                          className="team-logo-bracket"
                        />
                        <div className="team-name-bracket">{props.seed.teams[1]?.name || 'TBD'}</div>
                      </div>
                      <div className="team-score">{props.seed.teams[1]?.score || '-'}</div>
                    </SeedTeam>
                  </SeedItem>
                </Seed>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ScheduleTab

