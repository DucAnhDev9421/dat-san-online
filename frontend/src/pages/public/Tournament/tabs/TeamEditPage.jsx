import React, { useState } from 'react'
import { useParams, useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Pencil, Upload, Trash2, Users, FileUp } from 'lucide-react'
import { toast } from 'react-toastify'
import { useTournament } from '../TournamentContext'

const TeamInfoTab = ({ team }) => {
  const [teamData, setTeamData] = useState({
    teamNumber: team?.teamNumber || `#${team?.id}`,
    contactPhone: team?.contactPhone || '',
    contactName: team?.contactName || '',
    logo: team?.logo || null
  })
  const [saving, setSaving] = useState(false)

  const handleInputChange = (field, value) => {
    setTeamData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTeamData(prev => ({ ...prev, logo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã lưu thông tin đội')
    } catch (error) {
      console.error('Error saving team:', error)
      toast.error('Không thể lưu thông tin đội')
    } finally {
      setSaving(false)
    }
  }

  if (!team) return null

  return (
    <div className="team-info-edit">
      <div className="team-logo-upload-section">
        <label>Logo đội</label>
        <div className="team-logo-preview-large">
          <img 
            src={teamData.logo || '/team.png'} 
            alt="Team Logo" 
            className="team-logo-preview-img-large"
          />
        </div>
        <label className="btn-upload-logo">
          <Upload size={16} />
          Tải lên logo
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
            onChange={(e) => handleInputChange('teamNumber', e.target.value)}
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
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
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
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div className="form-actions">
          <button 
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </div>
    </div>
  )
}

const TeamMembersTab = ({ team }) => {
  const handleAddMember = () => {
    toast.info('Tính năng thêm thành viên đang được phát triển')
  }

  const handleEditMember = () => {
    toast.info('Tính năng chỉnh sửa thành viên đang được phát triển')
  }

  const handleDeleteMember = () => {
    toast.info('Tính năng xóa thành viên đang được phát triển')
  }

  const handleDownloadSample = () => {
    toast.info('Tính năng tải file mẫu đang được phát triển')
  }

  const handleImportFile = () => {
    toast.info('Tính năng nhập file đang được phát triển')
  }

  if (!team) return null

  return (
    <div className="team-members-edit">
      <div className="members-header">
        <div>
          <h3>Danh sách thành viên</h3>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Quản lý các thành viên trong đội
          </p>
        </div>
        <button 
          className="btn-add-member"
          onClick={handleAddMember}
        >
          <Plus size={16} />
          Thêm thành viên
        </button>
      </div>

      {/* Import Actions */}
      <div className="members-import-actions">
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

      <div className="members-list">
        {team.members && team.members.length > 0 ? (
          team.members.map((member, index) => (
            <div key={index} className="member-item">
              <div className="member-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <div className="member-avatar-placeholder">
                    {member.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name || 'Chưa có tên'}</div>
                <div className="member-details">
                  {member.phone && <span>SĐT: {member.phone}</span>}
                  {member.position && <span>Vị trí: {member.position}</span>}
                </div>
              </div>
              <div className="member-actions">
                <button 
                  className="member-action-btn"
                  onClick={handleEditMember}
                >
                  <Pencil size={16} />
                </button>
                <button 
                  className="member-action-btn member-action-delete"
                  onClick={handleDeleteMember}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="members-empty-state">
            <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
            <p>Chưa có thành viên nào</p>
            <button 
              className="btn-add-member-secondary"
              onClick={handleAddMember}
            >
              <Plus size={16} />
              Thêm thành viên đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const TeamEditPage = () => {
  const { id, teamId } = useParams()
  const navigate = useNavigate()
  const { tournament, loading } = useTournament()
  const [activeTeamTab, setActiveTeamTab] = useState('info')

  // Tìm team với nhiều cách so sánh để đảm bảo tìm được
  let team = tournament?.teams?.find(t => {
    const tId = t.id || t._id
    const searchId = parseInt(teamId)
    // So sánh cả number và string
    return tId === searchId || tId === teamId || String(tId) === String(teamId) || String(tId) === String(searchId)
  })

  // Nếu không tìm thấy team trong tournament.teams, tạo team mặc định từ teamId
  if (!team && teamId) {
    const teamIdNum = parseInt(teamId)
    team = {
      id: teamIdNum,
      teamNumber: `Đội #${teamIdNum}`,
      contactPhone: '',
      contactName: '',
      logo: null,
      wins: 0,
      draws: 0,
      losses: 0,
      members: []
    }
  }

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p>Đang tải thông tin giải đấu...</p>
          </div>
        </div>
      </>
    )
  }

  if (!tournament) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        Không tìm thấy giải đấu
      </div>
    )
  }

  // Team sẽ luôn có giá trị (từ API hoặc default), nhưng vẫn check để an toàn
  if (!team) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        Không tìm thấy đội
      </div>
    )
  }

  const handleBack = () => {
    navigate(`/tournament/${id}/teams`)
  }

  const handleSubTabClick = (tab) => {
    setActiveTeamTab(tab)
  }

  return (
    <div className="team-edit-section">
      <div className="custom-layout">
        {/* Sidebar */}
        <div className="custom-sidebar">
          <button 
            className="sidebar-back-btn"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
          <div className="sidebar-menu">
            <button
              className={`sidebar-menu-item ${activeTeamTab === 'info' ? 'active' : ''}`}
              onClick={() => handleSubTabClick('info')}
            >
              Thông tin đội
            </button>
            <button
              className={`sidebar-menu-item ${activeTeamTab === 'members' ? 'active' : ''}`}
              onClick={() => handleSubTabClick('members')}
            >
              Thành viên
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="custom-content-wrapper">
          <div className="section-card">
            <div className="custom-tab-content">
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <h2>Chỉnh sửa đội</h2>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>
                  {team.teamNumber || `Đội #${team.id}`}
                </p>
              </div>

              {/* Tab Content */}
              {activeTeamTab === 'info' && <TeamInfoTab team={team} />}
              {activeTeamTab === 'members' && <TeamMembersTab team={team} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamEditPage

