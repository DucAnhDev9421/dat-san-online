import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, Trash2, List, FileUp } from 'lucide-react'
import { toast } from 'react-toastify'

const TeamsManagementTab = ({ tournament }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [teamsList, setTeamsList] = useState([])
  const [savingTeams, setSavingTeams] = useState(false)

  useEffect(() => {
    // Lấy số lượng đội từ maxParticipants (mặc định 4 nếu không có)
    const numTeams = tournament?.maxParticipants || 4
    
    // Tạo mảng đội mặc định với số lượng đúng
    const defaultTeams = Array.from({ length: numTeams }, (_, index) => ({
      id: index + 1,
      teamNumber: `#${index + 1}`,
      contactPhone: '',
      contactName: '',
      logo: null
    }))

    // Merge với dữ liệu từ API nếu có
    if (tournament?.teams && tournament.teams.length > 0) {
      tournament.teams.forEach((team, index) => {
        if (defaultTeams[index]) {
          defaultTeams[index] = {
            ...defaultTeams[index],
            ...team,
            id: team.id || index + 1,
            teamNumber: team.teamNumber || `#${index + 1}`
          }
        }
      })
    }
    
    setTeamsList(defaultTeams)
  }, [tournament])

  const handleTeamInputChange = (teamId, field, value) => {
    setTeamsList(prev => prev.map(team => 
      team.id === teamId ? { ...team, [field]: value } : team
    ))
  }

  const handleReorderTeam = (teamId, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (id && teamId) {
      navigate(`/tournament/${id}/teams/${teamId}`)
    }
  }

  const handleDeleteTeam = (teamId) => {
    const minTeams = tournament?.maxParticipants || 4
    if (teamsList.length <= minTeams) {
      toast.error(`Phải có ít nhất ${minTeams} đội`)
      return
    }
    setTeamsList(prev => prev.filter(team => team.id !== teamId))
  }

  const handleDownloadSample = () => {
    toast.info('Tính năng tải file mẫu đang được phát triển')
  }

  const handleImportFile = () => {
    toast.info('Tính năng nhập file đang được phát triển')
  }

  const handleSaveTeams = async () => {
    try {
      setSavingTeams(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã lưu thông tin đội thành công')
    } catch (error) {
      console.error('Error saving teams:', error)
      toast.error('Không thể lưu thông tin đội')
    } finally {
      setSavingTeams(false)
    }
  }

  if (!tournament) return null

  return (
    <div className="custom-tab-content">
      <h2>Quản lý đội</h2>
      
      <div className="teams-management-header">
        <div className="teams-import-actions">
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

      <div className="teams-management-list">
        {teamsList.map((team, index) => (
          <div key={team.id} className="team-management-item">
            <div className="team-index-number">
              {index + 1}
            </div>
            
            <div className="team-logo-container">
              <img 
                src={team.logo || '/team.png'} 
                alt="Team" 
                className="team-logo-shield"
              />
            </div>
            
            <div className="team-actions">
              <button
                className="team-action-btn team-action-reorder"
                title="Sắp xếp"
                onClick={(e) => handleReorderTeam(team.id, e)}
                type="button"
              >
                <List size={18} />
              </button>
              <button
                className="team-action-btn team-action-delete"
                onClick={() => handleDeleteTeam(team.id)}
                title="Xóa"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="team-input-fields">
              <input
                type="text"
                className="team-input team-number-input"
                value={team.teamNumber}
                onChange={(e) => handleTeamInputChange(team.id, 'teamNumber', e.target.value)}
                placeholder="#1"
              />
              <input
                type="tel"
                className="team-input team-phone-input"
                value={team.contactPhone}
                onChange={(e) => handleTeamInputChange(team.id, 'contactPhone', e.target.value)}
                placeholder="SĐT liên hệ"
              />
              <input
                type="text"
                className="team-input team-name-input"
                value={team.contactName}
                onChange={(e) => handleTeamInputChange(team.id, 'contactName', e.target.value)}
                placeholder="Tên người liên hệ"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="teams-save-section">
        <button
          className="btn-save-teams"
          onClick={handleSaveTeams}
          disabled={savingTeams}
        >
          <Save size={16} />
          {savingTeams ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}

export default TeamsManagementTab

