import React, { useState, useEffect } from 'react'
import { X, Trophy } from 'lucide-react'
import { toast } from 'react-toastify'
import useClickOutside from '../../../../hook/use-click-outside'
import useBodyScrollLock from '../../../../hook/use-body-scroll-lock'
import useEscapeKey from '../../../../hook/use-escape-key'
import { categoryApi } from '../../../../api/categoryApi'
import { leagueApi } from '../../../../api/leagueApi'

const CreateLeagueModal = ({ isOpen, onClose, onSuccess, facilityId = null, facilityName = '' }) => {
  // Lock body scroll
  useBodyScrollLock(isOpen)
  
  // Handle escape key
  useEscapeKey(onClose, isOpen)
  
  // Handle click outside
  const modalRef = useClickOutside(onClose, isOpen)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    sport: '',
    format: 'single-elimination',
    type: 'individual',
    numParticipants: 2,
    membersPerTeam: 2,
    startDate: '',
    endDate: '',
    description: '',
    allowRegistration: false,
    registrationDeadline: ''
  })

  const [sportCategories, setSportCategories] = useState([])
  const [loadingSports, setLoadingSports] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSportCategories()
      // Reset form when modal opens
      setFormData({
        name: '',
        phone: '',
        sport: '',
        format: 'single-elimination',
        type: 'individual',
        numParticipants: 2,
        membersPerTeam: 2,
        startDate: '',
        endDate: '',
        description: '',
        allowRegistration: false,
        registrationDeadline: ''
      })
    }
  }, [isOpen])

  const fetchSportCategories = async () => {
    try {
      setLoadingSports(true)
      const result = await categoryApi.getSportCategories({ status: 'active' })
      if (result.success && result.data) {
        setSportCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching sport categories:', error)
    } finally {
      setLoadingSports(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên giải đấu')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }
    if (!formData.sport) {
      toast.error('Vui lòng chọn môn thể thao')
      return
    }
    if (!formData.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu')
      return
    }
    if (!formData.endDate) {
      toast.error('Vui lòng chọn ngày kết thúc')
      return
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }
    if (formData.allowRegistration && !formData.registrationDeadline) {
      toast.error('Vui lòng chọn hạn chót đăng ký')
      return
    }
    if (formData.allowRegistration && formData.registrationDeadline && new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
      toast.error('Hạn chót đăng ký phải trước ngày bắt đầu giải đấu')
      return
    }
    if (formData.numParticipants < 2) {
      toast.error('Số đội tham gia phải ít nhất 2')
      return
    }

    setSubmitting(true)

    try {
      const formatMapping = {
        'single-elimination': 'Loại Trực Tiếp',
        'round-robin': 'Vòng tròn'
      }

      const startDateTime = `${formData.startDate}T00:00:00`
      const endDateTime = `${formData.endDate}T23:59:59`

      const requestBody = {
        name: formData.name.trim(),
        format: formatMapping[formData.format] || formData.format,
        sport: formData.sport,
        phone: formData.phone.trim(),
        tournamentType: formData.type,
        membersPerTeam: formData.membersPerTeam,
        startDate: startDateTime,
        endDate: endDateTime,
        location: facilityName || '',
        address: '',
        maxParticipants: formData.numParticipants,
        description: formData.description.trim() || null,
        fullDescription: formData.description.trim() || null,
        registrationDeadline: formData.allowRegistration && formData.registrationDeadline
          ? `${formData.registrationDeadline}T00:00:00`
          : null,
        teams: [],
        matches: []
      }

      if (facilityId) {
        requestBody.facility = facilityId
      }

      const result = await leagueApi.createLeague(requestBody)
      
      if (result.success) {
        toast.success('Tạo giải đấu thành công')
        if (onSuccess) onSuccess(result.data)
        onClose()
      } else {
        throw new Error(result.message || 'Tạo giải đấu thất bại')
      }
    } catch (error) {
      console.error('Error creating league:', error)
      toast.error(error.message || 'Không thể tạo giải đấu')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#e6effe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={20} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#111827' }}>
              Tạo giải đấu mới
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
            }}
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Facility Info */}
          {facilityName && (
            <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: 13, color: '#0369a1', fontWeight: 600, marginBottom: 4 }}>Cơ sở:</div>
              <div style={{ fontSize: 14, color: '#0c4a6e' }}>{facilityName}</div>
            </div>
          )}

          {/* Tournament Name */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Tên giải đấu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Số điện thoại <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Sport */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Môn thể thao <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                cursor: 'pointer',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">-- Chọn môn thể thao --</option>
              {sportCategories.map((category) => (
                <option key={category._id || category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Hình thức thi đấu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                cursor: 'pointer',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="single-elimination">Loại trực tiếp</option>
              <option value="round-robin">Vòng tròn</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Loại giải đấu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                cursor: 'pointer',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="individual">Cá nhân</option>
              <option value="team">Đội</option>
            </select>
          </div>

          {/* Members Per Team */}
          {formData.type === 'team' && (
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Số thành viên mỗi đội
              </label>
              <input
                type="number"
                name="membersPerTeam"
                value={formData.membersPerTeam}
                onChange={handleInputChange}
                min="2"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          {/* Number of Participants */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Số đội tham gia <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="number"
              name="numParticipants"
              value={formData.numParticipants}
              onChange={handleInputChange}
              min="2"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Date Range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Ngày bắt đầu <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Ngày kết thúc <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Allow Registration */}
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: formData.allowRegistration ? 12 : 0 }}>
              <input
                type="checkbox"
                name="allowRegistration"
                checked={formData.allowRegistration}
                onChange={handleInputChange}
                style={{
                  width: 18,
                  height: 18,
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                Cho phép đăng ký tham gia
              </span>
            </label>
            
            {formData.allowRegistration && (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Hạn chót đăng ký <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  required={formData.allowRegistration}
                  min={new Date().toISOString().split('T')[0]}
                  max={formData.startDate || undefined}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, margin: 0 }}>
                  Hạn chót đăng ký phải trước ngày bắt đầu giải đấu
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              paddingTop: 12,
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: '#fff',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 24px',
                background: submitting ? '#d1d5db' : '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.background = '#2563eb'
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.background = '#3b82f6'
                }
              }}
            >
              {submitting ? 'Đang tạo...' : 'Tạo giải đấu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateLeagueModal

