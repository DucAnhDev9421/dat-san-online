import React, { useState, useEffect, useMemo } from 'react'
import { Save, FileUp, X, Zap, AlertTriangle, Lightbulb, Clock } from 'lucide-react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { leagueApi } from '../../../../../api/leagueApi'
import { courtApi } from '../../../../../api/courtApi'
import { useTournament } from '../../TournamentContext'

const ScheduleManagementTab = ({ tournament }) => {
  const { id } = useParams()
  const { refreshTournament } = useTournament()
  const [activeRoundIndex, setActiveRoundIndex] = useState(0)
  const [scheduleData, setScheduleData] = useState([])
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [courts, setCourts] = useState([])
  const [loadingCourts, setLoadingCourts] = useState(false)
  const [autoScheduling, setAutoScheduling] = useState(false)
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false)
  const [autoScheduleOptions, setAutoScheduleOptions] = useState({
    startDate: '',
    endDate: '',
    matchDuration: 90,
    breakTime: 30,
    preferredStartTime: '08:00',
    preferredEndTime: '22:00'
  })
  const [conflicts, setConflicts] = useState([])
  const [warnings, setWarnings] = useState([])
  const [suggestions, setSuggestions] = useState({}) // { matchId: [...suggestions] }
  const [loadingSuggestions, setLoadingSuggestions] = useState({}) // { matchId: true/false }
  const [showSuggestions, setShowSuggestions] = useState({}) // { matchId: true/false }
  const [showDatePickerModal, setShowDatePickerModal] = useState(false)
  const [selectedMatchForSuggestion, setSelectedMatchForSuggestion] = useState(null) // { matchId, stage }
  const [selectedDateForSuggestion, setSelectedDateForSuggestion] = useState('')
  const [confirmingSchedule, setConfirmingSchedule] = useState(false)
  
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

  // Fetch courts từ facility của tournament
  useEffect(() => {
    const fetchCourts = async () => {
      if (!tournament?.facility) {
        setCourts([])
        return
      }

      try {
        setLoadingCourts(true)
        const facilityId = typeof tournament.facility === 'object' 
          ? (tournament.facility._id || tournament.facility.id)
          : tournament.facility

        if (!facilityId) {
          setCourts([])
          return
        }

        // Lấy danh sách sân, filter theo courtType nếu tournament có
        const params = {
          facility: facilityId,
          status: 'active',
          limit: 100
        }

        // Nếu tournament có courtType, filter theo courtType
        // Kiểm tra cả trong tournament trực tiếp và trong tournament.data (nếu có)
        const tournamentData = tournament?.data || tournament
        const courtTypeValue = tournamentData?.courtType || tournament?.courtType
        
        if (courtTypeValue) {
          let courtTypeId = null
          
          // Xử lý nhiều trường hợp: object có _id, object có id, hoặc string
          if (typeof courtTypeValue === 'object' && courtTypeValue !== null) {
            courtTypeId = courtTypeValue._id || courtTypeValue.id
            // Nếu vẫn không có, thử toString()
            if (!courtTypeId) {
              // Kiểm tra xem có phải là ObjectId trực tiếp không
              if (courtTypeValue.toString && typeof courtTypeValue.toString === 'function') {
                const str = courtTypeValue.toString()
                // Kiểm tra xem có phải ObjectId string không
                if (str.length === 24 && /^[0-9a-fA-F]{24}$/.test(str)) {
                  courtTypeId = str
                }
              }
            }
          } else if (courtTypeValue) {
            courtTypeId = courtTypeValue
          }
          
          if (courtTypeId) {
            // Đảm bảo là string
            params.typeId = courtTypeId.toString()
          }
        }

        const result = await courtApi.getCourts(params)

        if (result.success && result.data?.courts) {
          setCourts(result.data.courts)
        } else {
          setCourts([])
        }
      } catch (error) {
        console.error('Error fetching courts:', error)
        setCourts([])
      } finally {
        setLoadingCourts(false)
      }
    }

    fetchCourts()
  }, [tournament?.facility, tournament?.courtType])

  // Tính toán rounds CHỈ từ matches trong API (không tính toán lại)
  const rounds = useMemo(() => {
    if (!tournament?.matches || tournament.matches.length === 0) {
      return []
    }

    if (isRoundRobin) {
      // Round-robin: Nhóm matches theo vòng (dựa trên matchNumber)
      const roundRobinMatches = tournament.matches
        .filter(m => {
          // Lọc bỏ matches có BYE
          const hasBye = m.team1Id === "BYE" || m.team2Id === "BYE";
          return m.stage === 'round-robin' && !hasBye;
        })
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
          .filter(match => {
            // Lọc bỏ matches có BYE (cả 2 đội đều BYE hoặc 1 trong 2 là BYE)
            const hasBye = match.team1Id === "BYE" || match.team2Id === "BYE";
            return !hasBye;
          })
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
          time: dbMatch?.time || '',
          endTime: dbMatch?.endTime || '',
          courtId: dbMatch?.courtId ? (dbMatch.courtId._id || dbMatch.courtId || dbMatch.courtId.toString()) : ''
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
      setConflicts([])
      setWarnings([])
      
      // Chuyển đổi scheduleData sang format API
      const schedules = scheduleData.map(item => ({
        stage: item.stage,
        matchNumber: parseInt(item.matchId) || item.matchId,
        date: item.date || null,
        time: item.time || null,
        endTime: item.endTime || null,
        courtId: item.courtId || null
      }))
      
      // Gọi API để lưu lịch đấu
      const result = await leagueApi.updateMatchSchedule(id, schedules)
      
      if (result.success) {
        // Xử lý warnings nếu có
        if (result.warnings && result.warnings.length > 0) {
          setWarnings(result.warnings)
          toast.warning(`Đã lưu lịch đấu thành công. Có ${result.warnings.length} cảnh báo.`)
        } else {
          toast.success('Đã lưu lịch đấu thành công')
        }
        refreshTournament()
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      
      // Xử lý conflicts từ error response
      const errorData = error.response?.data || error
      if (errorData.conflicts && Array.isArray(errorData.conflicts)) {
        setConflicts(errorData.conflicts)
        setWarnings(errorData.warnings || [])
        toast.error(`Phát hiện ${errorData.conflicts.length} xung đột lịch đấu. Vui lòng kiểm tra và sửa lại.`)
      } else {
        toast.error(errorData.message || error.message || 'Không thể lưu lịch đấu')
      }
    } finally {
      setSavingSchedule(false)
    }
  }

  const handleSuggestTime = (matchId, stage) => {
    // Mở date picker modal
    setSelectedMatchForSuggestion({ matchId, stage })
    setSelectedDateForSuggestion('')
    setShowDatePickerModal(true)
  }

  const handleConfirmDateForSuggestion = async () => {
    if (!selectedDateForSuggestion || !selectedMatchForSuggestion) {
      toast.error('Vui lòng chọn ngày')
      return
    }

    const { matchId, stage } = selectedMatchForSuggestion
    
    try {
      setLoadingSuggestions(prev => ({ ...prev, [matchId]: true }))
      setShowDatePickerModal(false)
      
      const matchIdForApi = `${stage}_${matchId}`
      
      const result = await leagueApi.suggestMatchTime(id, matchIdForApi, {
        preferredDate: selectedDateForSuggestion,
        matchDuration: autoScheduleOptions.matchDuration,
        breakTime: autoScheduleOptions.breakTime
      })
      
      if (result.success && result.data?.suggestions) {
        // Helper để so sánh thời gian
        const timeToMinutes = (timeStr) => {
          if (!timeStr) return null
          const [hours, minutes] = timeStr.split(':').map(Number)
          return hours * 60 + minutes
        }

        // Filter bỏ các suggestions đã được sử dụng bởi các matches khác
        const filteredSuggestions = result.data.suggestions.filter(suggestion => {
          // Kiểm tra với scheduleData (chưa lưu)
          const isUsedInScheduleData = scheduleData.some(item => {
            // Bỏ qua chính match đang xem
            if (item.matchId === matchId) return false
            
            // Kiểm tra nếu có date, time, courtId trùng
            if (!item.date || !item.time || !item.courtId) return false
            
            // So sánh date
            const itemDate = new Date(item.date).toISOString().split('T')[0]
            const suggestionDate = new Date(suggestion.date).toISOString().split('T')[0]
            if (itemDate !== suggestionDate) return false
            
            // So sánh courtId
            const itemCourtId = item.courtId.toString()
            const suggestionCourtId = suggestion.courtId.toString()
            if (itemCourtId !== suggestionCourtId) return false
            
            // So sánh thời gian (có overlap)
            const itemTime = item.time
            const itemEndTime = item.endTime || item.time
            const suggestionTime = suggestion.time
            const suggestionEndTime = suggestion.endTime || suggestion.time
            
            const itemStartMin = timeToMinutes(itemTime)
            const itemEndMin = timeToMinutes(itemEndTime)
            const suggestionStartMin = timeToMinutes(suggestionTime)
            const suggestionEndMin = timeToMinutes(suggestionEndTime)
            
            if (itemStartMin === null || itemEndMin === null || 
                suggestionStartMin === null || suggestionEndMin === null) {
              return false
            }
            
            // Kiểm tra overlap
            return !(itemEndMin <= suggestionStartMin || itemStartMin >= suggestionEndMin)
          })

          // Kiểm tra với tournament.matches (đã lưu)
          const isUsedInTournament = tournament?.matches?.some(match => {
            // Bỏ qua match đang xem
            const currentScheduleItem = scheduleData.find(item => item.matchId === matchId)
            if (currentScheduleItem && 
                match.stage === currentScheduleItem.stage && 
                match.matchNumber === parseInt(matchId)) {
              return false
            }
            
            // Kiểm tra nếu có date, time, courtId
            if (!match.date || !match.time || !match.courtId) return false
            
            // So sánh date
            const matchDate = new Date(match.date).toISOString().split('T')[0]
            const suggestionDate = new Date(suggestion.date).toISOString().split('T')[0]
            if (matchDate !== suggestionDate) return false
            
            // So sánh courtId
            const matchCourtId = typeof match.courtId === 'object' 
              ? (match.courtId._id || match.courtId.id || match.courtId).toString()
              : match.courtId.toString()
            const suggestionCourtId = suggestion.courtId.toString()
            if (matchCourtId !== suggestionCourtId) return false
            
            // So sánh thời gian (có overlap)
            const matchTime = match.time
            const matchEndTime = match.endTime || match.time
            const suggestionTime = suggestion.time
            const suggestionEndTime = suggestion.endTime || suggestion.time
            
            const matchStartMin = timeToMinutes(matchTime)
            const matchEndMin = timeToMinutes(matchEndTime)
            const suggestionStartMin = timeToMinutes(suggestionTime)
            const suggestionEndMin = timeToMinutes(suggestionEndTime)
            
            if (matchStartMin === null || matchEndMin === null || 
                suggestionStartMin === null || suggestionEndMin === null) {
              return false
            }
            
            // Kiểm tra overlap
            return !(matchEndMin <= suggestionStartMin || matchStartMin >= suggestionEndMin)
          })
          
          return !isUsedInScheduleData && !isUsedInTournament
        })

        if (filteredSuggestions.length === 0) {
          toast.info('Không tìm thấy thời gian trống phù hợp. Tất cả các gợi ý đã được sử dụng hoặc có xung đột.')
        } else {
          setSuggestions(prev => ({
            ...prev,
            [matchId]: filteredSuggestions
          }))
          setShowSuggestions(prev => ({
            ...prev,
            [matchId]: !prev[matchId]
          }))
          const filteredCount = result.data.suggestions.length - filteredSuggestions.length
          const message = filteredCount > 0
            ? `Tìm thấy ${filteredSuggestions.length} gợi ý thời gian (đã ẩn ${filteredCount} gợi ý đã được sử dụng)`
            : `Tìm thấy ${filteredSuggestions.length} gợi ý thời gian`
          toast.success(message)
        }
      } else {
        toast.warning('Không tìm thấy gợi ý thời gian')
      }
    } catch (error) {
      console.error('Error getting suggestions:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Không thể lấy gợi ý thời gian'
      toast.error(errorMessage)
    } finally {
      setLoadingSuggestions(prev => ({ ...prev, [matchId]: false }))
      setSelectedMatchForSuggestion(null)
      setSelectedDateForSuggestion('')
    }
  }

  const handleApplySuggestion = async (matchId, suggestion) => {
    // Lưu giá trị cũ để revert nếu có lỗi
    const originalScheduleItem = scheduleData.find(item => item.matchId === matchId)
    if (!originalScheduleItem) {
      toast.error('Không tìm thấy trận đấu')
      return
    }

    try {
      // Cập nhật scheduleData trước (optimistic update)
      const updatedScheduleData = scheduleData.map(item => {
        if (item.matchId === matchId) {
          return {
            ...item,
            date: new Date(suggestion.date).toISOString().split('T')[0],
            time: suggestion.time,
            endTime: suggestion.endTime,
            courtId: suggestion.courtId
          }
        }
        return item
      })
      setScheduleData(updatedScheduleData)

      // Tự động lưu ngay
      setSavingSchedule(true)
      setConflicts([])
      setWarnings([])

      // Chuyển đổi sang format API - chỉ gửi match được chọn
      const scheduleToSave = {
        stage: originalScheduleItem.stage,
        matchNumber: parseInt(originalScheduleItem.matchId) || originalScheduleItem.matchId,
        date: new Date(suggestion.date).toISOString().split('T')[0],
        time: suggestion.time,
        endTime: suggestion.endTime,
        courtId: suggestion.courtId
      }

      const result = await leagueApi.updateMatchSchedule(id, [scheduleToSave])

      if (result.success) {
        // Xử lý warnings nếu có
        if (result.warnings && result.warnings.length > 0) {
          setWarnings(result.warnings)
          toast.warning(`Đã lưu lịch đấu thành công. Có ${result.warnings.length} cảnh báo.`)
        } else {
          toast.success('Đã áp dụng và lưu gợi ý thời gian thành công')
        }
        setShowSuggestions(prev => ({ ...prev, [matchId]: false }))
        // Xóa suggestions của match này vì đã được áp dụng
        setSuggestions(prev => {
          const newSuggestions = { ...prev }
          delete newSuggestions[matchId]
          return newSuggestions
        })
        refreshTournament()
      }
    } catch (error) {
      console.error('Error applying suggestion:', error)
      
      // Revert lại scheduleData cho match này
      setScheduleData(prev => prev.map(item => 
        item.matchId === matchId ? originalScheduleItem : item
      ))

      // Xử lý conflicts từ error response
      const errorData = error.response?.data || error
      if (errorData.conflicts && Array.isArray(errorData.conflicts)) {
        setConflicts(errorData.conflicts)
        setWarnings(errorData.warnings || [])
        toast.error(`Phát hiện ${errorData.conflicts.length} xung đột lịch đấu. Vui lòng chọn gợi ý khác.`)
      } else {
        toast.error(errorData.message || error.message || 'Không thể lưu lịch đấu')
      }
    } finally {
      setSavingSchedule(false)
    }
  }

  const handleConfirmSchedule = async () => {
    try {
      setConfirmingSchedule(true)
      
      const result = await leagueApi.confirmSchedule(id)
      
      if (result.success) {
        const { confirmed, failed } = result.data
        if (failed && failed.length > 0) {
          toast.warning(`Đã chốt ${confirmed.length} lịch đấu. ${failed.length} lịch đấu không thể chốt.`)
        } else {
          toast.success(`Đã chốt ${confirmed.length} lịch đấu thành công. Các khung giờ đã được block.`)
        }
        refreshTournament()
      }
    } catch (error) {
      console.error('Error confirming schedule:', error)
      toast.error(error.message || 'Không thể chốt lịch thi đấu')
    } finally {
      setConfirmingSchedule(false)
    }
  }

  // Khởi tạo auto schedule options từ tournament
  useEffect(() => {
    if (tournament) {
      setAutoScheduleOptions(prev => ({
        ...prev,
        startDate: tournament.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : '',
        endDate: tournament.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : ''
      }))
    }
  }, [tournament])

  const handleAutoSchedule = async () => {
    if (!tournament?.facility) {
      toast.error('Giải đấu chưa có cơ sở thể thao. Vui lòng chọn cơ sở trước.')
      return
    }

    if (!autoScheduleOptions.startDate || !autoScheduleOptions.endDate) {
      toast.error('Vui lòng chọn ngày bắt đầu và ngày kết thúc')
      return
    }

    try {
      setAutoScheduling(true)
      const result = await leagueApi.autoSchedule(id, autoScheduleOptions)
      
      if (result.success) {
        const { scheduled, failed } = result.data
        const message = failed.length > 0
          ? `Đã tự động sắp xếp ${scheduled.length} trận đấu. ${failed.length} trận không thể sắp xếp.`
          : `Đã tự động sắp xếp ${scheduled.length} trận đấu thành công`
        toast.success(message)
        setShowAutoScheduleModal(false)
        refreshTournament()
      }
    } catch (error) {
      console.error('Error auto scheduling:', error)
      toast.error(error.message || 'Không thể tự động sắp xếp lịch đấu')
    } finally {
      setAutoScheduling(false)
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
          Bạn có thể quản lý lịch thi đấu (ngày, giờ, sân) của toàn giải đấu.
        </p>
        <div className="schedule-import-actions">
          <button
            className="btn-auto-schedule"
            onClick={() => setShowAutoScheduleModal(true)}
            disabled={!tournament?.facility}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: tournament?.facility ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              opacity: tournament?.facility ? 1 : 0.6
            }}
          >
            <Zap size={16} />
            Tự động sắp xếp lịch
          </button>
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

      {/* Date Picker Modal for Suggestions */}
      {showDatePickerModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowDatePickerModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
              Chọn ngày thi đấu
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Ngày thi đấu *
              </label>
              <input
                type="date"
                value={selectedDateForSuggestion}
                onChange={(e) => setSelectedDateForSuggestion(e.target.value)}
                min={tournament?.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : undefined}
                max={tournament?.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : undefined}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDatePickerModal(false)
                  setSelectedMatchForSuggestion(null)
                  setSelectedDateForSuggestion('')
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDateForSuggestion}
                disabled={!selectedDateForSuggestion}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedDateForSuggestion ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: selectedDateForSuggestion ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Tìm gợi ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Schedule Modal */}
      {showAutoScheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAutoScheduleModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
              Tự động sắp xếp lịch đấu
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Ngày bắt đầu *
                </label>
                <input
                  type="date"
                  value={autoScheduleOptions.startDate}
                  onChange={(e) => setAutoScheduleOptions(prev => ({ ...prev, startDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Ngày kết thúc *
                </label>
                <input
                  type="date"
                  value={autoScheduleOptions.endDate}
                  onChange={(e) => setAutoScheduleOptions(prev => ({ ...prev, endDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Thời lượng mỗi trận (phút)
                </label>
                <input
                  type="number"
                  value={autoScheduleOptions.matchDuration}
                  onChange={(e) => setAutoScheduleOptions(prev => ({ ...prev, matchDuration: parseInt(e.target.value) || 90 }))}
                  min="30"
                  max="180"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Khoảng cách giữa các trận (phút)
                </label>
                <input
                  type="number"
                  value={autoScheduleOptions.breakTime}
                  onChange={(e) => setAutoScheduleOptions(prev => ({ ...prev, breakTime: parseInt(e.target.value) || 30 }))}
                  min="0"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Giờ bắt đầu ưu tiên
                </label>
                <input
                  type="time"
                  value={autoScheduleOptions.preferredStartTime}
                  onChange={(e) => setAutoScheduleOptions(prev => ({ ...prev, preferredStartTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Giờ kết thúc ưu tiên
                </label>
                <input
                  type="time"
                  value={autoScheduleOptions.preferredEndTime}
                  onChange={(e) => setAutoScheduleOptions(prev => ({ ...prev, preferredEndTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAutoScheduleModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleAutoSchedule}
                disabled={autoScheduling}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: autoScheduling ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: autoScheduling ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {autoScheduling ? 'Đang sắp xếp...' : 'Sắp xếp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conflicts và Warnings */}
      {conflicts.length > 0 && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          borderLeft: '4px solid #ef4444'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={18} color="#dc2626" />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#991b1b' }}>
              Xung đột lịch đấu ({conflicts.length})
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b' }}>
            {conflicts.map((conflict, idx) => (
              <li key={idx} style={{ marginBottom: '4px', fontSize: '14px' }}>
                {conflict.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={18} color="#d97706" />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#92400e' }}>
              Cảnh báo ({warnings.length})
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
            {warnings.map((warning, idx) => (
              <li key={idx} style={{ marginBottom: '4px', fontSize: '14px' }}>
                {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

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
                  
                  // Kiểm tra conflicts cho match này
                  const matchConflicts = conflicts.filter(c => 
                    c.match.stage === scheduleItem.stage && 
                    c.match.matchNumber === parseInt(scheduleItem.matchId)
                  )
                  const hasConflict = matchConflicts.length > 0
                  
                  // Kiểm tra warnings cho match này
                  const matchWarnings = warnings.filter(w => 
                    w.match.stage === scheduleItem.stage && 
                    w.match.matchNumber === parseInt(scheduleItem.matchId)
                  )
                  const hasWarning = matchWarnings.length > 0

                  return (
                    <div key={scheduleItem.matchId}>
                      <div 
                        className="schedule-match-item"
                        style={{
                          backgroundColor: (isTeam1Bye || isTeam2Bye) ? '#fef3c7' : (hasConflict ? '#fee2e2' : 'white'),
                          border: (isTeam1Bye || isTeam2Bye) ? '2px solid #f59e0b' : (hasConflict ? '2px solid #ef4444' : (hasWarning ? '2px solid #f59e0b' : '1px solid #e5e7eb'))
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                          
                          <div className="schedule-match-teams" style={{ flex: 1 }}>
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

                          {/* Nút gợi ý thời gian */}
                          {!isTeam1Bye && !isTeam2Bye && tournament?.facility && (
                            <button
                              onClick={() => handleSuggestTime(scheduleItem.matchId, scheduleItem.stage)}
                              disabled={loadingSuggestions[scheduleItem.matchId]}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loadingSuggestions[scheduleItem.matchId] ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                opacity: loadingSuggestions[scheduleItem.matchId] ? 0.6 : 1
                              }}
                              title="Gợi ý thời gian tối ưu"
                            >
                              {loadingSuggestions[scheduleItem.matchId] ? (
                                <Clock size={14} />
                              ) : (
                                <Lightbulb size={14} />
                              )}
                              {loadingSuggestions[scheduleItem.matchId] ? 'Đang tìm...' : 'Gợi ý'}
                            </button>
                          )}
                        </div>
                        
                        <div className="schedule-match-inputs">
                          <input
                            type="date"
                            className="schedule-input schedule-date"
                            value={scheduleItem.date}
                            onChange={(e) => handleScheduleChange(scheduleItem.matchId, 'date', e.target.value)}
                            onClick={(e) => e.target.showPicker?.()}
                            style={{
                              borderColor: hasConflict ? '#ef4444' : (hasWarning ? '#f59e0b' : undefined)
                            }}
                          />
                          <input
                            type="time"
                            className="schedule-input schedule-time"
                            value={scheduleItem.time || ''}
                            onChange={(e) => handleScheduleChange(scheduleItem.matchId, 'time', e.target.value)}
                            placeholder="Bắt đầu"
                            onClick={(e) => e.target.showPicker?.()}
                            style={{
                              borderColor: hasConflict ? '#ef4444' : (hasWarning ? '#f59e0b' : undefined)
                            }}
                            title="Thời gian bắt đầu"
                          />
                          <input
                            type="time"
                            className="schedule-input schedule-time"
                            value={scheduleItem.endTime || ''}
                            onChange={(e) => handleScheduleChange(scheduleItem.matchId, 'endTime', e.target.value)}
                            placeholder="Kết thúc"
                            onClick={(e) => e.target.showPicker?.()}
                            style={{
                              borderColor: hasConflict ? '#ef4444' : (hasWarning ? '#f59e0b' : undefined)
                            }}
                            title="Thời gian kết thúc"
                          />
                          {tournament?.facility && (
                            <select
                              className="schedule-input schedule-court"
                              value={scheduleItem.courtId || ''}
                              onChange={(e) => handleScheduleChange(scheduleItem.matchId, 'courtId', e.target.value || null)}
                              style={{
                                padding: '8px 12px',
                                border: `1px solid ${hasConflict ? '#ef4444' : (hasWarning ? '#f59e0b' : '#d1d5db')}`,
                                borderRadius: '6px',
                                fontSize: '14px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                minWidth: '150px'
                              }}
                            >
                              <option value="">Chọn sân</option>
                              {loadingCourts ? (
                                <option disabled>Đang tải...</option>
                              ) : courts.length === 0 ? (
                                <option disabled>Không có sân</option>
                              ) : (
                                courts.map((court) => (
                                  <option key={court._id || court.id} value={court._id || court.id}>
                                    {court.name || `Sân ${court._id || court.id}`}
                                  </option>
                                ))
                              )}
                            </select>
                          )}
                        </div>

                        {/* Hiển thị conflicts/warnings cho match này */}
                        {hasConflict && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#991b1b'
                          }}>
                            {matchConflicts.map((c, idx) => (
                              <div key={idx}>⚠️ {c.message}</div>
                            ))}
                          </div>
                        )}
                        {hasWarning && !hasConflict && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#92400e'
                          }}>
                            {matchWarnings.map((w, idx) => (
                              <div key={idx}>⚠️ {w.message}</div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hiển thị suggestions */}
                      {showSuggestions[scheduleItem.matchId] && suggestions[scheduleItem.matchId] && (
                        <div style={{
                          marginTop: '8px',
                          padding: '12px',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          borderRadius: '6px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                          }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1' }}>
                              Gợi ý thời gian ({suggestions[scheduleItem.matchId].length})
                            </span>
                            <button
                              onClick={() => setShowSuggestions(prev => ({ ...prev, [scheduleItem.matchId]: false }))}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#0369a1',
                                fontSize: '18px',
                                padding: 0
                              }}
                            >
                              ×
                            </button>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '6px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            paddingRight: '4px'
                          }}>
                            {suggestions[scheduleItem.matchId].map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleApplySuggestion(scheduleItem.matchId, suggestion)}
                                style={{
                                  padding: '8px 12px',
                                  backgroundColor: 'white',
                                  border: '1px solid #bae6fd',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontSize: '13px',
                                  color: '#0369a1',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#e0f2fe'
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'white'
                                }}
                              >
                                <span>
                                  {new Date(suggestion.date).toLocaleDateString('vi-VN')} • {suggestion.time} - {suggestion.endTime}
                                </span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                  {suggestion.courtName}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="schedule-save-section" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          className="btn-save-schedule"
          onClick={handleSaveSchedule}
          disabled={savingSchedule || scheduleData.length === 0}
        >
          <Save size={16} />
          {savingSchedule ? 'Đang lưu...' : 'Lưu'}
        </button>

        {/* Nút chốt lịch thi đấu */}
        {scheduleData.some(item => item.date && item.time && item.courtId) && (
          <button
            onClick={handleConfirmSchedule}
            disabled={confirmingSchedule}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: confirmingSchedule ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: confirmingSchedule ? 0.6 : 1
            }}
            title="Chốt lịch thi đấu để block các khung giờ realtime"
          >
            <Zap size={16} />
            {confirmingSchedule ? 'Đang chốt lịch...' : 'Chốt lịch thi đấu'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ScheduleManagementTab
