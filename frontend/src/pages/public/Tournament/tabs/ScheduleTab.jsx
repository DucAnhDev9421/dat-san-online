import React, { useMemo, useState } from 'react'
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets'

const ScheduleTab = ({ tournament }) => {
  if (!tournament) return null

  // Kiểm tra format giải đấu
  const isRoundRobin = tournament.format === 'Vòng tròn' || tournament.format === 'round-robin'
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null) // null = hiển thị tất cả

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
    // Xử lý round-robin-round1, round-robin-round2, ...
    if (stage && stage.startsWith('round-robin-round')) {
      const roundMatch = stage.match(/round-robin-round(\d+)/)
      if (roundMatch) {
        return `Lượt ${roundMatch[1]}`
      }
    }
    // Xử lý round-robin-v1, round-robin-v2, ... hoặc round-robin-round1-v1, ...
    if (stage && stage.includes('-v')) {
      const vMatch = stage.match(/-v(\d+)$/)
      if (vMatch) {
        const roundMatch = stage.match(/round-robin(?:-round(\d+))?-v/)
        if (roundMatch && roundMatch[1]) {
          return `Lượt ${roundMatch[1]} - Vòng ${vMatch[1]}`
        }
        return `Vòng ${vMatch[1]}`
      }
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

  // Helper: Lấy stage trước đó dựa trên matches thực tế
  const getPreviousStage = (currentStage) => {
    if (!tournament?.matches) return null

    // Lấy tất cả các stage có matches (single-elimination)
    const allStages = [...new Set(
      tournament.matches
        .filter(m => m.stage && !m.stage.startsWith('round-robin'))
        .map(m => m.stage)
    )]

    if (allStages.length === 0) return null

    // Sắp xếp các stage theo thứ tự
    const stageOrder = ['round1', 'round2', 'round3', 'round4', 'semi', 'final']
    const sortedStages = allStages.sort((a, b) => {
      const indexA = stageOrder.indexOf(a)
      const indexB = stageOrder.indexOf(b)
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    })

    // Tìm index của currentStage trong sortedStages
    const currentIndex = sortedStages.indexOf(currentStage)
    if (currentIndex > 0) {
      return sortedStages[currentIndex - 1]
    }

    return null
  }

  // Helper: Tính toán matchNumber và stage của match trước đó
  const getPreviousMatchInfo = (currentMatch, isTeam1) => {
    if (!currentMatch) return null

    const currentStage = currentMatch.stage
    const currentMatchNumber = currentMatch.matchNumber || 1
    const previousStage = getPreviousStage(currentStage)

    if (!previousStage) return null

    // Tính matchNumber ở vòng trước:
    // Match 1, 2 ở vòng trước -> Match 1 ở vòng hiện tại (team1 từ match 1, team2 từ match 2)
    // Match 3, 4 ở vòng trước -> Match 2 ở vòng hiện tại (team1 từ match 3, team2 từ match 4)
    // Công thức: 
    // - team1: matchNumber = (currentMatchNumber - 1) * 2 + 1
    // - team2: matchNumber = (currentMatchNumber - 1) * 2 + 2
    const previousMatchNumber = isTeam1
      ? (currentMatchNumber - 1) * 2 + 1
      : (currentMatchNumber - 1) * 2 + 2

    return {
      stage: previousStage,
      matchNumber: previousMatchNumber,
      stageTitle: getStageTitle(previousStage)
    }
  }

  // Helper: Lấy tên team để hiển thị
  const getTeamDisplayName = (teamId, match, isTeam1 = true) => {
    // Xử lý BYE
    if (teamId === "BYE") {
      return "BYE"
    }

    // Nếu teamId là null/undefined, hiển thị W#matchNumber tên_vòng
    if (!teamId && match) {
      const prevMatchInfo = getPreviousMatchInfo(match, isTeam1)
      if (prevMatchInfo) {
        return `W#${prevMatchInfo.matchNumber} ${prevMatchInfo.stageTitle}`
      }
      return "TBD"
    }

    // Tìm team từ tournament.teams
    const team = findTeamById(teamId)
    if (team) {
      return team.teamNumber || `Đội #${team.id}`
    }

    // Fallback: hiển thị ID
    return `Đội #${teamId}`
  }

  // Helper: Lấy tên sân từ match
  const getCourtName = (match) => {
    if (!match?.courtId) return null
    // courtId có thể là object (đã populate) hoặc string (chưa populate)
    if (typeof match.courtId === 'object') {
      return match.courtId.name || null
    }
    return null
  }

  // Tính toán rounds cho Single-Elimination: CHỈ nhóm matches từ API, KHÔNG tính toán
  const rounds = useMemo(() => {
    // Nếu là round-robin, không hiển thị bracket
    if (isRoundRobin) {
      return []
    }

    // Nếu không có matches, trả về mảng rỗng
    if (!tournament?.matches || tournament.matches.length === 0) {
      return []
    }

    // Lọc chỉ matches single-elimination (không phải round-robin)
    const singleEliminationMatches = tournament.matches.filter(
      m => m.stage && !m.stage.startsWith('round-robin')
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
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })

    // Tạo rounds từ matches đã nhóm
    const calculatedRounds = sortedStages.map(stage => {
      const stageMatches = matchesByStage[stage]
        .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))

      const seeds = stageMatches
        // --- QUAN TRỌNG: ĐÃ XÓA ĐOẠN .filter() TẠI ĐÂY ---
        // Chúng ta phải giữ lại match BYE để renderSeedComponent có cái mà render (dù là ẩn)
        // thì dây nối mới có chỗ để bám vào.
        .map(match => {
          const team1Name = getTeamDisplayName(match.team1Id, match, true)
          const team2Name = getTeamDisplayName(match.team2Id, match, false)

          return {
            id: match.matchNumber || match.id || `${stage}_${match.matchNumber}`,
            date: match.date
              ? new Date(match.date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
              : new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
            courtName: getCourtName(match),
            teams: [
              {
                name: team1Name,
                score: match.score1 ?? null,
                teamId: match.team1Id
              },
              {
                name: team2Name,
                score: match.score2 ?? null,
                teamId: match.team2Id
              }
            ],
            _match: match
          }
        })

      return {
        title: getStageTitle(stage),
        seeds: seeds
      }
    })

    return calculatedRounds
  }, [tournament, isRoundRobin])

  // Tính toán rounds cho Round-Robin: CHỈ nhóm matches từ API
  const roundRobinRounds = useMemo(() => {
    if (!isRoundRobin) return []

    // Nếu không có matches, trả về mảng rỗng
    if (!tournament?.matches || tournament.matches.length === 0) {
      return []
    }

    // Lọc tất cả matches round-robin (bao gồm round-robin, round-robin-round1, round-robin-round2, ...)
    const roundRobinMatches = tournament.matches.filter(m =>
      m.stage === 'round-robin' || (m.stage && m.stage.startsWith('round-robin'))
    )

    if (roundRobinMatches.length === 0) {
      return []
    }

    // Nhóm matches theo stage và lượt
    // Format stage: round-robin-v1, round-robin-v2, ... (1 lượt)
    // hoặc: round-robin-round1-v1, round-robin-round1-v2, ... (nhiều lượt)
    const matchesByStage = {}
    roundRobinMatches.forEach(match => {
      const stage = match.stage || 'round-robin'
      if (!matchesByStage[stage]) {
        matchesByStage[stage] = []
      }
      matchesByStage[stage].push(match)
    })

    // Sắp xếp các stage theo thứ tự: lượt -> vòng
    const sortedStages = Object.keys(matchesByStage).sort((a, b) => {
      // Extract lượt và vòng từ stage name
      const parseStage = (stageName) => {
        // round-robin-round1-v2 -> round=1, v=2
        // round-robin-v2 -> round=1, v=2
        const roundMatch = stageName.match(/round-robin(?:-round(\d+))?-v(\d+)/)
        if (roundMatch) {
          return {
            round: roundMatch[1] ? parseInt(roundMatch[1]) : 1,
            v: parseInt(roundMatch[2])
          }
        }
        // round-robin-round1 -> round=1, v=0
        const roundOnlyMatch = stageName.match(/round-robin(?:-round(\d+))?$/)
        if (roundOnlyMatch) {
          return {
            round: roundOnlyMatch[1] ? parseInt(roundOnlyMatch[1]) : 1,
            v: 0
          }
        }
        return { round: 1, v: 0 }
      }

      const aParsed = parseStage(a)
      const bParsed = parseStage(b)

      if (aParsed.round !== bParsed.round) {
        return aParsed.round - bParsed.round
      }
      return aParsed.v - bParsed.v
    })

    // Tạo danh sách rounds đơn giản, đánh số liên tục từ 1
    const rounds = []
    let roundCounter = 1

    sortedStages.forEach(stage => {
      const stageMatches = matchesByStage[stage]
        .sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
        .map(match => {
          const team1 = findTeamById(match.team1Id)
          const team2 = findTeamById(match.team2Id)

          return {
            id: match.matchNumber || match.id,
            team1: team1 || { id: match.team1Id, teamNumber: getTeamDisplayName(match.team1Id, match, true) },
            team2: team2 || { id: match.team2Id, teamNumber: getTeamDisplayName(match.team2Id, match, false) },
            score1: match.score1 ?? 0,
            score2: match.score2 ?? 0,
            matchNumber: match.matchNumber || match.id,
            date: match.date,
            time: match.time,
            courtName: getCourtName(match)
          }
        })

      rounds.push({
        id: roundCounter,
        title: `VÒNG ${roundCounter}`,
        matches: stageMatches
      })

      roundCounter++
    })

    return rounds
  }, [tournament, isRoundRobin])

  // Helper: Lấy team data để hiển thị logo (dùng trực tiếp teamId từ match)
  const getTeamDataFromId = (teamId) => {
    if (!teamId || teamId === "BYE") return null
    return findTeamById(teamId)
  }

  // Helper: Kiểm tra trạng thái match (BYE, EMPTY, hoặc NORMAL)
  const checkMatchStatus = (seed) => {
    // Lưu ý: seed.teams có thể chưa có nếu data không chuẩn, cần optional chaining
    const team1Name = seed.teams?.[0]?.name;
    const team2Name = seed.teams?.[1]?.name;

    // Kiểm tra xem có phải là trận đấu thủ tục (Bye) hay không
    // Logic: Nếu tên đội là "BYE" hoặc teamId là "BYE"
    const isTeam1Bye = team1Name === 'BYE' || seed.teams?.[0]?.teamId === 'BYE';
    const isTeam2Bye = team2Name === 'BYE' || seed.teams?.[1]?.teamId === 'BYE';

    if (isTeam1Bye && isTeam2Bye) return 'EMPTY'; // Cả 2 là BYE (Nhánh chết)
    if (isTeam1Bye || isTeam2Bye) return 'BYE';   // 1 trong 2 là BYE
    return 'NORMAL';
  }

  // Hiển thị round-robin: Theo từng vòng với selector
  if (isRoundRobin) {
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
                    const team1 = match.team1
                    const team2 = match.team2
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

                        {/* Trạng thái và sân - cố định bên phải */}
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'right',
                          flexShrink: 0,
                          minWidth: '150px',
                          position: 'absolute',
                          right: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          alignItems: 'flex-end'
                        }}>
                          {match.courtName ? (
                            <div style={{
                              fontSize: '11px',
                              color: '#10b981',
                              fontWeight: '500'
                            }}>
                              {match.courtName}
                            </div>
                          ) : (
                            <div>Chưa có lịch thi đấu</div>
                          )}
                          {match.date && match.time && (
                            <div style={{ fontSize: '11px' }}>
                              {new Date(match.date).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit'
                              })} {match.time}
                            </div>
                          )}
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
        {rounds.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Chưa có lịch đấu. Vui lòng bốc thăm để tạo lịch đấu.
          </div>
        ) : (
          <div className="bracket-container">
            <Bracket
              rounds={rounds}
              renderSeedComponent={(props) => {
                const status = checkMatchStatus(props.seed);

                // Kiểm tra xem có cần ẩn không (Double Bye hoặc Single Bye)
                // Nếu là EMPTY (Cả 2 là Bye) -> Có thể return null nếu muốn xóa hẳn nhánh
                // Nhưng nếu là BYE (1 đội đấu với Bye) -> BẮT BUỘC PHẢI GIỮ KHUNG (dùng visibility hidden)
                const isHidden = status === 'EMPTY' || status === 'BYE';

                // --- LOGIC QUAN TRỌNG: CHUẨN BỊ NỘI DUNG ---
                // Chúng ta tính toán nội dung y như trận đấu thật để lấy chiều cao chính xác
                const match = props.seed._match
                const team1Id = match?.team1Id || props.seed.teams[0]?.teamId
                const team2Id = match?.team2Id || props.seed.teams[1]?.teamId
                const team1Data = getTeamDataFromId(team1Id)
                const team2Data = getTeamDataFromId(team2Id)
                const team1Name = props.seed.teams[0]?.name || 'TBD'
                const team2Name = props.seed.teams[1]?.name || 'TBD'

                // Logic hiển thị màu sắc (copy từ code cũ)
                const isTeam1Bye = team1Id === "BYE"
                const isTeam2Bye = team2Id === "BYE"
                const hasBye = isTeam1Bye || isTeam2Bye

                return (
                  <Seed
                    {...props}
                    style={{
                      // QUAN TRỌNG: KHÔNG ĐƯỢC ẨN SEED, NẾU KHÔNG SẼ MẤT DÂY
                      fontSize: '12px',
                      opacity: 1
                    }}
                  >
                    <SeedItem
                      style={{
                        // CHỈ ẨN NỘI DUNG BÊN TRONG
                        // Dùng opacity: 0 để nó vẫn chiếm diện tích (giữ dây thẳng hàng) nhưng không nhìn thấy
                        opacity: isHidden ? 0 : 1,
                        pointerEvents: isHidden ? 'none' : 'auto', // Không cho click vào vùng ẩn
                        backgroundColor: isHidden ? 'transparent' : undefined, // Đảm bảo nền trong suốt
                        boxShadow: isHidden ? 'none' : undefined, // Xóa bóng đổ nếu có
                        border: isHidden ? 'none' : undefined // Xóa viền nếu có
                      }}
                    >
                      {/* Render nội dung ĐẦY ĐỦ y hệt trận thật để chiếm đúng chiều cao */}
                      <div className="seed-header" style={{
                        backgroundColor: hasBye ? '#f59e0b' : '#10b981',
                        padding: '4px 8px' // Đảm bảo padding giống thật
                      }}>
                        <div className="seed-title" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          fontSize: '11px'
                        }}>
                          <div>{props.seed.date}</div>
                          {props.seed.courtName && (
                            <div style={{
                              fontSize: '10px',
                              opacity: 0.9,
                              fontWeight: '500'
                            }}>
                              {props.seed.courtName}
                            </div>
                          )}
                          {hasBye && !props.seed.courtName && (
                            <span style={{
                              fontSize: '10px',
                              opacity: 0.9
                            }}>
                              (BYE)
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                        {/* Team 1 - Render đầy đủ */}
                        <SeedTeam className="seed-team" style={{
                          padding: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          height: '40px',
                          alignItems: 'center',
                          backgroundColor: isTeam1Bye ? '#fef3c7' : 'white'
                        }}>
                          <div className="team-info-bracket" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {/* Giữ nguyên cấu trúc ảnh/text để chiều cao không đổi */}
                            {isTeam1Bye ? (
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                backgroundColor: '#f59e0b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '10px'
                              }}>
                                BYE
                              </div>
                            ) : (
                              <img
                                src={team1Data?.logo || '/team.png'}
                                alt="Team"
                                className="team-logo-bracket"
                                style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            )}
                            <div className="team-name-bracket" style={{
                              color: isTeam1Bye ? '#92400e' : '#1f2937',
                              fontWeight: isTeam1Bye ? '600' : '500'
                            }}>
                              {team1Name}
                            </div>
                          </div>
                          <div className="team-score" style={{
                            color: isTeam1Bye ? '#f59e0b' : '#10b981'
                          }}>
                            {props.seed.teams[0]?.score !== null && props.seed.teams[0]?.score !== undefined
                              ? props.seed.teams[0].score
                              : '-'}
                          </div>
                        </SeedTeam>

                        {/* Team 2 - Render đầy đủ */}
                        <SeedTeam className="seed-team" style={{
                          padding: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          height: '40px',
                          alignItems: 'center',
                          backgroundColor: isTeam2Bye ? '#fef3c7' : 'white'
                        }}>
                          <div className="team-info-bracket" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isTeam2Bye ? (
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                backgroundColor: '#f59e0b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '10px'
                              }}>
                                BYE
                              </div>
                            ) : (
                              <img
                                src={team2Data?.logo || '/team.png'}
                                alt="Team"
                                className="team-logo-bracket"
                                style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            )}
                            <div className="team-name-bracket" style={{
                              color: isTeam2Bye ? '#92400e' : '#1f2937',
                              fontWeight: isTeam2Bye ? '600' : '500'
                            }}>
                              {team2Name}
                            </div>
                          </div>
                          <div className="team-score" style={{
                            color: isTeam2Bye ? '#f59e0b' : '#10b981'
                          }}>
                            {props.seed.teams[1]?.score !== null && props.seed.teams[1]?.score !== undefined
                              ? props.seed.teams[1].score
                              : '-'}
                          </div>
                        </SeedTeam>
                      </div>
                    </SeedItem>
                  </Seed>
                )
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleTab
