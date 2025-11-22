import React, { useMemo, useState } from 'react'
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets'

const ScheduleTab = ({ tournament }) => {
  if (!tournament) return null

  // Kiểm tra format giải đấu
  const isRoundRobin = tournament.format === 'Vòng tròn' || tournament.format === 'round-robin'
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null) // null = hiển thị tất cả

  // Tính toán các vòng đấu dựa trên số đội hoặc matches từ database
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

    // Tính toán tất cả các vòng cần thiết dựa trên số đội
    const calculateAllRounds = () => {
      const allRounds = []
      let currentTeams = teams
      let roundNumber = 1
      
      while (currentTeams.length > 1) {
        const numMatches = Math.floor(currentTeams.length / 2)
        let roundTitle = ''
        let stage = ''
        
        if (currentTeams.length === 2) {
          roundTitle = 'Chung Kết'
          stage = 'final'
        } else if (currentTeams.length === 4) {
          roundTitle = 'Bán Kết'
          stage = 'semi'
        } else if (currentTeams.length === 8) {
          roundTitle = 'Tứ Kết'
          stage = 'round3'
        } else {
          roundTitle = `Vòng ${roundNumber}`
          stage = `round${roundNumber}`
        }
        
        allRounds.push({
          title: roundTitle,
          numMatches: numMatches,
          roundNumber: roundNumber,
          stage: stage
        })
        
        currentTeams = Array.from({ length: numMatches }, (_, index) => ({
          id: `winner-${roundNumber}-${index + 1}`,
          teamNumber: `W#${index + 1} ${roundTitle}`
        }))
        
        roundNumber++
      }
      
      return allRounds
    }

    const allRoundsStructure = calculateAllRounds()
    
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

    const calculatedRounds = []
    
    // Duyệt qua tất cả các vòng cần thiết
    allRoundsStructure.forEach((roundStructure, roundIndex) => {
      const stageMatches = matchesByStage[roundStructure.stage] || []
      const sortedMatches = stageMatches.sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
      
      const seeds = []
      
      // Nếu có matches cho vòng này, sử dụng chúng
      if (sortedMatches.length > 0) {
        sortedMatches.forEach(match => {
          const team1 = teams.find(t => (t.id === match.team1Id) || (t._id?.toString() === match.team1Id?.toString()))
          const team2 = teams.find(t => (t.id === match.team2Id) || (t._id?.toString() === match.team2Id?.toString()))
          
          // Nếu là vòng sau vòng đầu tiên và không có team (teamId = null), hiển thị winner placeholder
          const previousRound = roundIndex > 0 ? allRoundsStructure[roundIndex - 1] : null
          const previousRoundName = previousRound?.title || 'Vòng trước'
          
          let team1Name = 'TBD'
          let team2Name = 'TBD'
          
          if (team1) {
            team1Name = team1.teamNumber || `Đội #${team1.id}`
          } else if (match.team1Id === null || match.team1Id === undefined) {
            // Nếu teamId = null và là vòng sau, hiển thị winner placeholder
            team1Name = roundIndex > 0 ? `W#${match.matchNumber} ${previousRoundName}` : 'TBD'
          } else {
            team1Name = `Đội #${match.team1Id}`
          }
          
          if (team2) {
            team2Name = team2.teamNumber || `Đội #${team2.id}`
          } else if (match.team2Id === null || match.team2Id === undefined) {
            // Nếu teamId = null và là vòng sau, hiển thị winner placeholder
            team2Name = roundIndex > 0 ? `W#${match.matchNumber + 1} ${previousRoundName}` : 'TBD'
          } else {
            team2Name = `Đội #${match.team2Id}`
          }
          
          seeds.push({
            id: match.matchNumber || match.id,
            date: match.date ? new Date(match.date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : new Date().toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            teams: [
              { 
                name: team1Name, 
                score: match.score1 ?? 0 
              },
              { 
                name: team2Name, 
                score: match.score2 ?? 0 
              }
            ]
          })
        })
      } else {
        // Nếu không có matches, tạo placeholder seeds
        // Nếu là vòng đầu tiên, dùng teams thật
        // Nếu là vòng sau, dùng placeholder từ vòng trước (#W1, #W2, ...)
        if (roundIndex === 0) {
          // Vòng đầu tiên: sử dụng teams thật
          for (let i = 0; i < roundStructure.numMatches; i++) {
            const team1 = teams[i * 2]
            const team2 = teams[i * 2 + 1]
            
            seeds.push({
              id: i + 1,
              date: new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              teams: [
                { 
                  name: team1?.teamNumber || `Đội #${team1?.id || i * 2 + 1}` || 'TBD', 
                  score: 0 
                },
                { 
                  name: team2?.teamNumber || `Đội #${team2?.id || i * 2 + 2}` || 'TBD', 
                  score: 0 
                }
              ]
            })
          }
        } else {
          // Vòng sau: sử dụng placeholder từ vòng trước
          const previousRound = allRoundsStructure[roundIndex - 1]
          for (let i = 0; i < roundStructure.numMatches; i++) {
            seeds.push({
              id: i + 1,
              date: new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              teams: [
                { 
                  name: `#W${i * 2 + 1} ${previousRound.title}`, 
                  score: 0 
                },
                { 
                  name: `#W${i * 2 + 2} ${previousRound.title}`, 
                  score: 0 
                }
              ]
            })
          }
        }
      }
      
      calculatedRounds.push({
        title: roundStructure.title,
        seeds: seeds
      })
    })
    
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

    // Ưu tiên sử dụng matches từ database nếu có
    if (tournament?.matches && tournament.matches.length > 0) {
      const roundRobinMatches = tournament.matches.filter(m => m.stage === 'round-robin')
      
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
            .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
            .map(match => {
              const team1 = teams.find(t => (t.id === match.team1Id) || (t._id?.toString() === match.team1Id?.toString()))
              const team2 = teams.find(t => (t.id === match.team2Id) || (t._id?.toString() === match.team2Id?.toString()))
              
              return {
                id: match.matchNumber || match.id,
                team1: team1 || { id: match.team1Id, teamNumber: `Đội #${match.team1Id}` },
                team2: team2 || { id: match.team2Id, teamNumber: `Đội #${match.team2Id}` },
                score1: match.score1 ?? 0,
                score2: match.score2 ?? 0,
                matchNumber: match.matchNumber || match.id,
                date: match.date,
                time: match.time
              }
            })
          
          rounds.push({
            id: round + 1,
            title: `VÒNG ${round + 1}`,
            matches: roundMatches
          })
        }
        
        return rounds
      }
    }

    // Fallback: Thuật toán chia round-robin thành các vòng (Round-Robin Tournament Algorithm)
    const rounds = []
    const numRounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams
    const matchesPerRound = Math.floor(numTeams / 2)
    
    let rotatingTeams = [...teams]
    
    for (let round = 0; round < numRounds; round++) {
      const roundMatches = []
      
      const fixedTeam = rotatingTeams[0]
      const otherTeams = rotatingTeams.slice(1)
      
      for (let i = 0; i < matchesPerRound; i++) {
        let team1, team2
        
        if (i === 0) {
          team1 = fixedTeam
          team2 = otherTeams[otherTeams.length - 1]
        } else {
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

