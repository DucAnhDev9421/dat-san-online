import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, X, Upload, ArrowLeft, ArrowRight, Save, ChevronDown, FileUp } from 'lucide-react'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'
import { useTournament } from '../TournamentContext'
import { leagueApi } from '../../../../api/leagueApi'
import { useAuth } from '../../../../contexts/AuthContext'
import '../../../../styles/TournamentDetail.css'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      const url = URL.createObjectURL(blob)
      resolve(url)
    }, 'image/jpeg')
  })
}

const RegistrationTab = ({ tournament }) => {
  const { id } = useParams()
  const { refreshTournament } = useTournament()
  const { user } = useAuth()
  const [step, setStep] = useState(0) // 0: countdown, 1: form đội, 2: form thành viên
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form data
  const [teamData, setTeamData] = useState({
    teamNumber: '',
    contactPhone: '',
    contactName: '',
    logo: null,
    logoFile: null
  })
  const [members, setMembers] = useState([])

  // Crop modal state for member avatar
  const [cropModalState, setCropModalState] = useState({
    show: false,
    memberIndex: null,
    image: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null
  })

  const positions = [
    'Thủ môn',
    'Hậu vệ',
    'Tiền vệ',
    'Tiền đạo',
    'Khác'
  ]

  useEffect(() => {
    if (!tournament?.registrationDeadline) {
      setIsExpired(true)
      return
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const deadline = new Date(tournament.registrationDeadline).getTime()
      const difference = deadline - now

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
      setIsExpired(false)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [tournament?.registrationDeadline])

  // Initialize members array based on membersPerTeam
  useEffect(() => {
    if (step === 2 && tournament?.membersPerTeam) {
      const requiredMembers = tournament.membersPerTeam
      if (members.length < requiredMembers) {
        const newMembers = Array.from({ length: requiredMembers }, (_, index) => ({
          name: '',
          phone: '',
          position: '',
          jerseyNumber: '',
          avatar: null
        }))
        setMembers(newMembers)
      }
    }
  }, [step, tournament?.membersPerTeam])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleStartRegister = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng ký tham gia')
      return
    }
    setStep(1)
  }

  const handleTeamInputChange = (field, value) => {
    setTeamData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    try {
      const teamId = 'temp'
      const result = await leagueApi.uploadTeamLogo(id, teamId, file)
      
      if (result.success && result.data?.logo) {
        setTeamData(prev => ({
          ...prev,
          logo: result.data.logo,
          logoFile: file
        }))
        toast.success('Đã upload logo thành công')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      // If upload fails, just store locally
      const reader = new FileReader()
      reader.onloadend = () => {
        setTeamData(prev => ({
          ...prev,
          logo: reader.result,
          logoFile: file
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteLogo = () => {
    setTeamData(prev => ({
      ...prev,
      logo: null,
      logoFile: null
    }))
  }

  const handleNextStep = () => {
    // Validate step 1
    if (step === 1) {
      if (!teamData.teamNumber.trim()) {
        toast.error('Vui lòng nhập tên đội')
        return
      }
      if (!teamData.contactPhone.trim()) {
        toast.error('Vui lòng nhập số điện thoại liên hệ')
        return
      }
      if (!teamData.contactName.trim()) {
        toast.error('Vui lòng nhập tên người liên hệ')
        return
      }
      setStep(2)
    }
  }

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 1) {
      setStep(0)
    }
  }

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ))
  }

  const handleAddMember = () => {
    setMembers(prev => [...prev, {
      name: '',
      phone: '',
      position: '',
      jerseyNumber: '',
      avatar: null
    }])
  }

  const handleRemoveMember = (index) => {
    setMembers(prev => prev.filter((_, i) => i !== index))
  }

  const handleMemberAvatarChange = (memberIndex, e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setCropModalState({
          show: true,
          memberIndex,
          image: reader.result,
          crop: { x: 0, y: 0 },
          zoom: 1,
          croppedAreaPixels: null
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCropModalState(prev => ({
      ...prev,
      croppedAreaPixels
    }))
  }, [])

  const handleCropComplete = async () => {
    if (!cropModalState.image || !cropModalState.croppedAreaPixels) return

    try {
      const croppedImageUrl = await getCroppedImg(cropModalState.image, cropModalState.croppedAreaPixels)
      if (croppedImageUrl) {
        setMembers(prev => prev.map((member, i) => 
          i === cropModalState.memberIndex ? { ...member, avatar: croppedImageUrl } : member
        ))
        setCropModalState({
          show: false,
          memberIndex: null,
          image: null,
          crop: { x: 0, y: 0 },
          zoom: 1,
          croppedAreaPixels: null
        })
      }
    } catch (error) {
      console.error('Error cropping image:', error)
      toast.error('Không thể xử lý ảnh')
    }
  }

  const handleCropCancel = () => {
    setCropModalState({
      show: false,
      memberIndex: null,
      image: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      croppedAreaPixels: null
    })
  }

  const handleDownloadSample = async () => {
    try {
      await leagueApi.downloadRegistrationTemplate(id)
      toast.success('Đã tải file mẫu thành công')
    } catch (error) {
      console.error('Error downloading template:', error)
      toast.error(error.message || 'Không thể tải file mẫu')
    }
  }

  const handleImportFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      try {
        const result = await leagueApi.parseMembersForRegistration(id, file)
        
        if (result.success && result.data) {
          // Update members state with parsed data
          setMembers(result.data)
          toast.success(result.message || 'Đã import thành viên thành công')
        }
      } catch (error) {
        console.error('Error importing members:', error)
        toast.error(error.message || 'Không thể import thành viên')
      }
    }
    input.click()
  }

  const handleSubmit = async () => {
    // Validate step 2
    if (step === 2) {
      const requiredMembers = tournament?.membersPerTeam || 0
      if (members.length < requiredMembers) {
        toast.error(`Vui lòng nhập đủ ${requiredMembers} thành viên`)
        return
      }

      const isFootball = tournament?.sport === 'Bóng đá'

      // Validate members
      for (let i = 0; i < requiredMembers; i++) {
        const member = members[i]
        if (!member.name.trim()) {
          toast.error(`Vui lòng nhập tên thành viên thứ ${i + 1}`)
          return
        }
        if (isFootball && !member.jerseyNumber) {
          toast.error(`Vui lòng nhập số áo cho thành viên thứ ${i + 1}`)
          return
        }
      }

      try {
        setSubmitting(true)

        // Prepare registration data
        const registrationData = {
          teamData: {
            teamNumber: teamData.teamNumber.trim(),
            contactPhone: teamData.contactPhone.trim(),
            contactName: teamData.contactName.trim()
          },
          members: members.map(member => ({
            name: member.name.trim(),
            phone: member.phone.trim() || '',
            position: member.position.trim() || '',
            jerseyNumber: isFootball ? (member.jerseyNumber || '') : undefined,
            avatar: member.avatar || null
          }))
        }

        // Register to league
        const result = await leagueApi.registerToLeague(id, registrationData)
        
        if (result.success) {
          toast.success('Đăng ký tham gia giải đấu thành công!')
          refreshTournament()
          // Reset form
          setStep(0)
          setTeamData({
            teamNumber: '',
            contactPhone: '',
            contactName: '',
            logo: null,
            logoFile: null
          })
          setMembers([])
        }
      } catch (error) {
        console.error('Error registering:', error)
        toast.error(error.message || 'Không thể đăng ký tham gia giải đấu')
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (!tournament) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        Đang tải thông tin giải đấu...
      </div>
    )
  }

  const hasRegistration = tournament.registrationDeadline && new Date(tournament.registrationDeadline) > new Date()
  const minMembers = tournament.membersPerTeam || 0
  const maxMembers = tournament.membersPerTeam || 0
  const isFootball = tournament.sport === 'Bóng đá'

  // Step 0: Countdown and start button
  if (step === 0) {
    return (
      <div style={{
        minHeight: '600px',
        background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
        borderRadius: 16,
        padding: '60px 40px',
        color: '#fff',
        textAlign: 'center'
      }}>
        {/* Registration Deadline Info */}
        {tournament.registrationDeadline && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ 
              fontSize: 18, 
              fontWeight: 500, 
              margin: 0,
              marginBottom: 8,
              color: '#fff'
            }}>
              Giải cho phép đăng ký trực tuyến đến hết ngày{' '}
              <span style={{ 
                color: '#fbbf24', 
                fontWeight: 700,
                fontSize: 20
              }}>
                {formatDate(tournament.registrationDeadline)}
              </span>
            </p>
          </div>
        )}

        {/* Team Requirements */}
        {tournament.tournamentType === 'team' && tournament.membersPerTeam && (
          <div style={{ marginBottom: 40 }}>
            <p style={{ 
              fontSize: 16, 
              fontWeight: 400, 
              margin: 0,
              color: '#fff'
            }}>
              Giải đấu yêu cầu số lượng thành viên mỗi đội ít nhất là{' '}
              <strong style={{ color: '#fbbf24' }}>{minMembers}</strong>
              {maxMembers > minMembers ? (
                <>
                  , nhiều nhất là <strong style={{ color: '#fbbf24' }}>{maxMembers}</strong>.
                </>
              ) : (
                '.'
              )}
            </p>
          </div>
        )}

        {/* Countdown Timer */}
        {hasRegistration && !isExpired && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 40,
            flexWrap: 'wrap'
          }}>
            {/* Days */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 12,
              padding: '24px 32px',
              minWidth: 100,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 8,
                fontFamily: 'monospace'
              }}>
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.9
              }}>
                Ngày
              </div>
            </div>

            {/* Hours */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 12,
              padding: '24px 32px',
              minWidth: 100,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 8,
                fontFamily: 'monospace'
              }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.9
              }}>
                Giờ
              </div>
            </div>

            {/* Minutes */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 12,
              padding: '24px 32px',
              minWidth: 100,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 8,
                fontFamily: 'monospace'
              }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.9
              }}>
                Phút
              </div>
            </div>

            {/* Seconds */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 12,
              padding: '24px 32px',
              minWidth: 100,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 8,
                fontFamily: 'monospace'
              }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                opacity: 0.9
              }}>
                Giây
              </div>
            </div>
          </div>
        )}

        {/* Expired Message */}
        {isExpired && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 40
          }}>
            <p style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              margin: 0,
              color: '#fff'
            }}>
              Đã hết hạn đăng ký
            </p>
          </div>
        )}

        {/* Register Button */}
        {hasRegistration && !isExpired && (
          <button
            onClick={handleStartRegister}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '16px 48px',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)'
            }}
          >
            Bắt đầu đăng ký
          </button>
        )}

        {/* No Registration Message */}
        {!tournament.registrationDeadline && (
          <div style={{
            background: 'rgba(107, 114, 128, 0.2)',
            border: '2px solid rgba(107, 114, 128, 0.5)',
            borderRadius: 12,
            padding: 24,
            marginTop: 40
          }}>
            <p style={{ 
              fontSize: 16, 
              fontWeight: 500, 
              margin: 0,
              color: '#fff'
            }}>
              Giải đấu này không cho phép đăng ký trực tuyến
            </p>
          </div>
        )}
      </div>
    )
  }

  // Step 1: Team Info Form
  if (step === 1) {
    return (
      <div className="section-card">
        <div className="team-info-edit">
          <div className="team-logo-upload-section">
            <label>Logo đội</label>
            <div className="team-logo-preview-large" style={{ position: 'relative' }}>
              <img 
                src={teamData.logo || '/team.png'} 
                alt="Team Logo" 
                className="team-logo-preview-img-large"
              />
              {teamData.logo && (
                <button
                  className="btn-delete-logo"
                  onClick={handleDeleteLogo}
                  type="button"
                  title="Xóa logo"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <label className="btn-upload-logo">
              <Upload size={16} />
              {teamData.logo ? 'Thay đổi logo' : 'Tải lên logo'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleLogoChange}
              />
            </label>
          </div>

          <div className="team-info-form">
            <div className="form-group">
              <label>
                Số đội <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={teamData.teamNumber}
                onChange={(e) => handleTeamInputChange('teamNumber', e.target.value)}
                placeholder="#1"
              />
            </div>

            <div className="form-group">
              <label>
                Số điện thoại liên hệ <span className="required-asterisk">*</span>
              </label>
              <input
                type="tel"
                className="form-input"
                value={teamData.contactPhone}
                onChange={(e) => handleTeamInputChange('contactPhone', e.target.value)}
                placeholder="0123456789"
              />
            </div>

            <div className="form-group">
              <label>
                Tên người liên hệ <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={teamData.contactName}
                onChange={(e) => handleTeamInputChange('contactName', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="form-actions">
              <button 
                className="btn-save" 
                onClick={handleBackStep}
                style={{ background: '#6b7280', marginRight: 12 }}
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <button 
                className="btn-save" 
                onClick={handleNextStep}
              >
                Tiếp theo
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Members Form
  if (step === 2) {
    return (
      <div className="section-card">
        {/* Crop Modal */}
        {cropModalState.show && (
          <div className="crop-modal-overlay">
            <div className="crop-modal-container">
              <div className="crop-modal-header">
                <h3>Chỉnh sửa ảnh đại diện</h3>
                <button className="crop-modal-close" onClick={handleCropCancel}>
                  <X size={20} />
                </button>
              </div>
              <div className="crop-container">
                <Cropper
                  image={cropModalState.image}
                  crop={cropModalState.crop}
                  zoom={cropModalState.zoom}
                  aspect={1}
                  onCropChange={(crop) => setCropModalState(prev => ({ ...prev, crop }))}
                  onZoomChange={(zoom) => setCropModalState(prev => ({ ...prev, zoom }))}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="crop-controls">
                <div className="crop-zoom-control">
                  <label>Phóng to:</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={cropModalState.zoom}
                    onChange={(e) => setCropModalState(prev => ({ ...prev, zoom: Number(e.target.value) }))}
                  />
                </div>
                <div className="crop-actions">
                  <button className="btn-crop-cancel" onClick={handleCropCancel}>
                    Hủy
                  </button>
                  <button className="btn-crop-save" onClick={handleCropComplete}>
                    <Save size={16} />
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="team-members-edit">
          <div className="members-header">
            <div>
              <h3>Thông tin thành viên</h3>
              <p style={{ color: '#6b7280', marginTop: '4px' }}>
                {members.length}/{minMembers} thành viên
              </p>
            </div>
          </div>

          {/* Import Actions */}
          <div className="members-import-actions">
            <div className="members-import-actions-right">
              <button
                className="download-sample-link"
                onClick={handleDownloadSample}
              >
                Tải về tệp tin mẫu
              </button>
              <button
                className="btn-import-file"
                onClick={handleImportFile}
              >
                <FileUp size={16} />
                Nhập tệp tin
              </button>
            </div>
          </div>

          <div className="members-list">
            {members.map((member, index) => (
              <div key={index} className="add-member-form-inline">
                <div className="member-avatar-section">
                  <label className="member-avatar-upload-label">
                    {member.avatar ? (
                      <img src={member.avatar} alt="Avatar" className="member-avatar-preview" />
                    ) : (
                      <img src="/player.png" alt="Default Avatar" className="member-avatar-preview" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleMemberAvatarChange(index, e)}
                    />
                  </label>
                </div>

                <div className="add-member-form-content">
                  <div className="member-form-fields">
                    {isFootball && (
                      <div className="member-form-group">
                        <label className="member-form-label">
                          Số áo <span className="required-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          className="member-form-input"
                          value={member.jerseyNumber}
                          onChange={(e) => handleMemberChange(index, 'jerseyNumber', e.target.value)}
                          placeholder="Số áo"
                        />
                      </div>
                    )}

                    <div className="member-form-group">
                      <label className="member-form-label">
                        Vị Trí Thi Đấu
                      </label>
                      <div className="member-form-select-wrapper">
                        <select
                          className="member-form-select"
                          value={member.position}
                          onChange={(e) => handleMemberChange(index, 'position', e.target.value)}
                        >
                          <option value="">Chọn vị trí</option>
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="select-chevron" />
                      </div>
                    </div>

                    <div className="member-form-group">
                      <label className="member-form-label">
                        Họ tên đầy đủ <span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        className="member-form-input"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        placeholder="Họ tên đầy đủ"
                      />
                    </div>

                    <div className="member-form-group">
                      <label className="member-form-label">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        className="member-form-input"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        placeholder="Số điện thoại"
                      />
                    </div>
                  </div>
                </div>

                {members.length > minMembers && (
                  <div className="member-form-actions-inline">
                    <button 
                      className="btn-cancel-member" 
                      onClick={() => handleRemoveMember(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {members.length < maxMembers && (
            <button
              className="btn-add-member"
              onClick={handleAddMember}
              style={{ marginTop: 16 }}
            >
              <Plus size={16} />
              Thêm thành viên
            </button>
          )}

          <div className="form-actions" style={{ marginTop: 24 }}>
            <button 
              className="btn-save" 
              onClick={handleBackStep}
              disabled={submitting}
              style={{ background: '#6b7280', marginRight: 12 }}
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
            <button 
              className="btn-save" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default RegistrationTab
