import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Save, Plus, Minus, Pencil, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import { categoryApi } from '../../../../../api/categoryApi'
import { facilityApi } from '../../../../../api/facilityApi'
import { userApi } from '../../../../../api/userApi'
import { leagueApi } from '../../../../../api/leagueApi'
import { useTournament } from '../../TournamentContext'
import useClickOutside from '../../../../../hook/use-click-outside'

const ConfigTab = ({ tournament: tournamentProp }) => {
  const { id } = useParams()
  const { tournament: tournamentFromContext, refreshTournament } = useTournament()
  const tournament = tournamentProp || tournamentFromContext
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    mode: 'private',
    location: '',
    format: '',
    sport: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    formatSport: false
  })
  const [tournamentImage, setTournamentImage] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [facilitySearchQuery, setFacilitySearchQuery] = useState('')
  const [facilitySearchResults, setFacilitySearchResults] = useState([])
  const [loadingFacilities, setLoadingFacilities] = useState(false)
  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [favoriteFacilities, setFavoriteFacilities] = useState([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [sportCategories, setSportCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  
  const facilityDropdownRef = useClickOutside(() => {
    setShowFacilityDropdown(false)
  }, showFacilityDropdown)

  useEffect(() => {
    if (tournament) {
      const locationName = tournament.location || ''
      const locationAddress = tournament.address || ''
      
      // Map format từ backend sang frontend
      const formatMapping = {
        'Loại Trực Tiếp': 'single-elimination',
        'Vòng tròn': 'round-robin'
      }
      
      setFormData({
        name: tournament.name || '',
        phone: tournament.phone || '',
        mode: 'private', // Backend mặc định là PRIVATE
        location: locationName || '',
        format: formatMapping[tournament.format] || tournament.format || 'single-elimination',
        sport: tournament.sport || '',
        description: tournament.description || tournament.fullDescription || ''
      })
      setTournamentImage(tournament.image || null)
      setCoverImage(tournament.banner || tournament.image || null)
      
      if (locationName || locationAddress) {
        setFacilitySearchQuery(locationName ? `${locationName}${locationAddress ? ` - ${locationAddress}` : ''}` : locationAddress || '')
      }
    }
  }, [tournament])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const result = await categoryApi.getSportCategories({ status: 'active' })
        if (result.success && result.data) {
          setSportCategories(Array.isArray(result.data) ? result.data : [])
        }
      } catch (error) {
        console.error('Error fetching sport categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoadingFavorites(true)
        const result = await userApi.getFavorites()
        if (result.success && result.data?.favorites) {
          setFavoriteFacilities(result.data.favorites)
        } else {
          setFavoriteFacilities([])
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        setFavoriteFacilities([])
      } finally {
        setLoadingFavorites(false)
      }
    }
    fetchFavorites()
  }, [])

  useEffect(() => {
    const searchFacilities = async () => {
      if (!facilitySearchQuery.trim()) {
        setFacilitySearchResults([])
        setShowFacilityDropdown(false)
        return
      }

      try {
        setLoadingFacilities(true)
        const result = await facilityApi.getFacilities({ 
          limit: 20, 
          status: 'opening',
          address: facilitySearchQuery.trim()
        })
        if (result.success && result.data) {
          const facilitiesList = result.data.facilities || result.data || []
          setFacilitySearchResults(facilitiesList)
          setShowFacilityDropdown(true)
        }
      } catch (error) {
        console.error('Error searching facilities:', error)
        setFacilitySearchResults([])
      } finally {
        setLoadingFacilities(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      searchFacilities()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [facilitySearchQuery])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility)
    setFormData(prev => ({ ...prev, location: facility._id || facility.id }))
    setFacilitySearchQuery(facility.name + (facility.address ? ` - ${facility.address}` : ''))
    setShowFacilityDropdown(false)
  }

  const handleFacilitySearchChange = (e) => {
    const value = e.target.value
    setFacilitySearchQuery(value)
    if (!value.trim()) {
      setSelectedFacility(null)
      setFormData(prev => ({ ...prev, location: '' }))
      setShowFacilityDropdown(false)
    }
  }

  const handleImageChange = (type, e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'tournament') {
          setTournamentImage(reader.result)
          setImageFile(file)
        } else {
          setCoverImage(reader.result)
          setBannerFile(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên giải đấu')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }
    if (!formData.location.trim() && !selectedFacility) {
      toast.error('Vui lòng chọn địa điểm')
      return
    }

    try {
      setSaving(true)
      
      // Map format từ frontend sang backend
      const formatMapping = {
        'single-elimination': 'Loại Trực Tiếp',
        'round-robin': 'Vòng tròn',
        'group-stage': 'Chia bảng đấu',
        'knockout': 'Loại Trực Tiếp'
      }
      
      // Lấy thông tin facility
      const facilityName = selectedFacility?.name || formData.location || tournament?.location || ''
      const facilityAddress = selectedFacility?.address || tournament?.address || ''
      
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        format: formatMapping[formData.format] || formData.format,
        sport: formData.sport,
        description: formData.description.trim() || null,
        fullDescription: formData.description.trim() || null,
        location: facilityName,
        address: facilityAddress
      }
      
      // Update tournament
      const result = await leagueApi.updateLeague(id, updateData)
      
      if (!result.success) {
        throw new Error(result.message || 'Cập nhật thông tin giải đấu thất bại')
      }
      
      // Upload images if changed
      if (imageFile && id) {
        try {
          await leagueApi.uploadImage(id, imageFile)
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError)
          toast.warning('Cập nhật thông tin thành công nhưng upload ảnh thất bại')
        }
      }
      
      // Refresh tournament data
      if (refreshTournament) {
        refreshTournament()
      }
      
      toast.success('Cập nhật thông tin giải đấu thành công')
      setIsEditing(false)
      setImageFile(null)
      setBannerFile(null)
    } catch (error) {
      console.error('Error updating tournament:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật giải đấu')
    } finally {
      setSaving(false)
    }
  }

  const tournamentFormats = [
    { value: 'single-elimination', label: 'Loại trực tiếp' },
    { value: 'round-robin', label: 'Vòng tròn' },
    { value: 'group-stage', label: 'Chia bảng đấu' },
    { value: 'knockout', label: 'Loại trực tiếp' }
  ]

  if (!tournament) return null

  return (
    <div className="custom-tab-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Cấu hình giải đấu</h2>
        {!isEditing && (
          <button 
            className="btn-edit"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="tournament-edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Section: Thông tin cơ bản */}
          <div className="collapsible-section">
            <div 
              className="section-header-expandable"
              onClick={() => toggleSection('basicInfo')}
            >
              {expandedSections.basicInfo ? <Minus size={20} /> : <Plus size={20} />}
              <span>Thông tin cơ bản</span>
            </div>
            
            {expandedSections.basicInfo && (
              <div className="section-content-expandable">
                <div className="basic-info-layout">
                  {/* Left: Image Upload */}
                  <div className="image-upload-section">
                    <label className="image-upload-label">Đổi hình giải đấu</label>
                    <div className="image-upload-container">
                      <img 
                        src={tournamentImage || '/sports-meeting.webp'} 
                        alt="Tournament" 
                        className="tournament-image-preview"
                      />
                      <label className="image-edit-button">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('tournament', e)}
                          style={{ display: 'none' }}
                        />
                        <Pencil size={16} />
                      </label>
                    </div>
                  </div>

                  {/* Right: Form Fields */}
                  <div className="form-fields-section">
                    <div className="form-group">
                      <label>
                        Tên giải đấu <span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tên giải đấu"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Số điện thoại <span className="required-asterisk">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div className="form-group">
                      <label>Chế độ</label>
                      <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleInputChange}
                      >
                        <option value="private">Riêng tư</option>
                        <option value="public">Công khai</option>
                      </select>
                    </div>
                    <div className="form-group facility-search-field">
                      <label>
                        Địa điểm <span className="required-asterisk">*</span>
                      </label>
                      <div className="facility-search-wrapper" ref={facilityDropdownRef}>
                        <input
                          type="text"
                          name="facilitySearch"
                          value={facilitySearchQuery}
                          onChange={handleFacilitySearchChange}
                          onFocus={() => {
                            if (facilitySearchResults.length > 0 || favoriteFacilities.length > 0) {
                              setShowFacilityDropdown(true)
                            }
                          }}
                          placeholder="Tìm theo tên cơ sở, quận huyện..."
                          required={!formData.location}
                          autoComplete="off"
                        />
                        {loadingFacilities && (
                          <div className="facility-search-loading">
                            <span>Đang tìm...</span>
                          </div>
                        )}
                        {showFacilityDropdown && (
                          <div className="facility-search-dropdown">
                            {!facilitySearchQuery.trim() && favoriteFacilities.length > 0 && (
                              <>
                                <div className="facility-search-section-header">
                                  <span className="facility-search-section-title">Sân yêu thích</span>
                                </div>
                                {favoriteFacilities.map((facility) => (
                                  <div
                                    key={facility._id || facility.id}
                                    className="facility-search-item facility-search-item-favorite"
                                    onClick={() => handleFacilitySelect(facility)}
                                  >
                                    <div className="facility-search-item-name">
                                      {facility.name}
                                      <span className="favorite-badge">★</span>
                                    </div>
                                    {facility.address && (
                                      <div className="facility-search-item-address">{facility.address}</div>
                                    )}
                                  </div>
                                ))}
                                {facilitySearchResults.length > 0 && (
                                  <div className="facility-search-divider"></div>
                                )}
                              </>
                            )}
                            {facilitySearchResults.length > 0 && (
                              <>
                                {!facilitySearchQuery.trim() && favoriteFacilities.length > 0 && (
                                  <div className="facility-search-section-header">
                                    <span className="facility-search-section-title">Kết quả tìm kiếm</span>
                                  </div>
                                )}
                                {facilitySearchResults.map((facility) => (
                                  <div
                                    key={facility._id || facility.id}
                                    className="facility-search-item"
                                    onClick={() => handleFacilitySelect(facility)}
                                  >
                                    <div className="facility-search-item-name">{facility.name}</div>
                                    {facility.address && (
                                      <div className="facility-search-item-address">{facility.address}</div>
                                    )}
                                  </div>
                                ))}
                              </>
                            )}
                            {facilitySearchQuery.trim() && !loadingFacilities && facilitySearchResults.length === 0 && (
                              <div className="facility-search-empty">
                                Không tìm thấy cơ sở nào
                              </div>
                            )}
                            {!facilitySearchQuery.trim() && favoriteFacilities.length === 0 && !loadingFavorites && (
                              <div className="facility-search-empty">
                                Nhập để tìm kiếm cơ sở hoặc thêm sân vào yêu thích
                              </div>
                            )}
                          </div>
                        )}
                        <input
                          type="hidden"
                          name="location"
                          value={formData.location}
                          required
                        />
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="btn-update-cover"
                      onClick={() => document.getElementById('cover-image-input')?.click()}
                    >
                      <Upload size={16} />
                      Cập nhật ảnh bìa
                    </button>
                    <input
                      id="cover-image-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange('cover', e)}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                
                {/* Description Field */}
                <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                  <label>Mô tả giải đấu</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Nhập mô tả về giải đấu..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#1f2937',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Thể thức và môn thi đấu */}
          <div className="collapsible-section">
            <div 
              className="section-header-expandable"
              onClick={() => toggleSection('formatSport')}
            >
              {expandedSections.formatSport ? <Minus size={20} /> : <Plus size={20} />}
              <span>Thể thức và môn thi đấu</span>
            </div>
            
            {expandedSections.formatSport && (
              <div className="section-content-expandable">
                <div className="form-row">
                  <div className="form-group">
                    <label>Môn thi đấu</label>
                    <select
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      disabled={loadingCategories}
                    >
                      <option value="">Chọn môn thi đấu</option>
                      {sportCategories.map((category) => (
                        <option key={category._id || category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Thể thức thi đấu</label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                    >
                      {tournamentFormats.map((format) => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button 
              className="btn-cancel"
              onClick={() => {
                setIsEditing(false)
                if (tournament) {
                  // Reset form data
                  const formatMapping = {
                    'Loại Trực Tiếp': 'single-elimination',
                    'Vòng tròn': 'round-robin'
                  }
                  
                  const locationName = tournament.location || ''
                  const locationAddress = tournament.address || ''
                  
                  setFormData({
                    name: tournament.name || '',
                    phone: tournament.phone || '',
                    mode: 'private',
                    location: locationName || '',
                    format: formatMapping[tournament.format] || tournament.format || 'single-elimination',
                    sport: tournament.sport || '',
                    description: tournament.description || tournament.fullDescription || ''
                  })
                  setTournamentImage(tournament.image || null)
                  setCoverImage(tournament.banner || tournament.image || null)
                  setImageFile(null)
                  setBannerFile(null)
                  
                  if (locationName || locationAddress) {
                    setFacilitySearchQuery(locationName ? `${locationName}${locationAddress ? ` - ${locationAddress}` : ''}` : locationAddress || '')
                  } else {
                    setFacilitySearchQuery('')
                  }
                  setSelectedFacility(null)
                }
              }}
            >
              Hủy
            </button>
            <button 
              className="btn-save"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      ) : (
        <div className="custom-content">
          {/* View mode - similar structure but read-only */}
          <div className="collapsible-section">
            <div 
              className="section-header-expandable"
              onClick={() => toggleSection('basicInfo')}
            >
              {expandedSections.basicInfo ? <Minus size={20} /> : <Plus size={20} />}
              <span>Thông tin cơ bản</span>
            </div>
            
            {expandedSections.basicInfo && (
              <div className="section-content-expandable">
                <div className="basic-info-layout">
                  <div className="image-upload-section">
                    <label className="image-upload-label">Hình giải đấu</label>
                    <div className="image-upload-container">
                      <img 
                        src={tournamentImage || tournament.image || '/sports-meeting.webp'} 
                        alt="Tournament" 
                        className="tournament-image-preview"
                      />
                    </div>
                  </div>
                  <div className="form-fields-section">
                    <div className="info-display">
                      <div className="info-row">
                        <strong>Tên giải đấu:</strong>
                        <span>{tournament.name || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="info-row">
                        <strong>Số điện thoại:</strong>
                        <span>{tournament.contact?.phone || tournament.phone || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="info-row">
                        <strong>Chế độ:</strong>
                        <span>
                          {tournament.mode === 'private' ? 'Riêng tư' : 
                           tournament.mode === 'public' ? 'Công khai' : 
                           'Chưa cập nhật'}
                        </span>
                      </div>
                      <div className="info-row">
                        <strong>Địa điểm:</strong>
                        <span>{tournament.address || tournament.location || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="info-display" style={{ marginTop: '16px', gridColumn: '1 / -1' }}>
                  <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <strong>Mô tả giải đấu:</strong>
                    <span style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {tournament.description || tournament.fullDescription || 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="collapsible-section">
            <div 
              className="section-header-expandable"
              onClick={() => toggleSection('formatSport')}
            >
              {expandedSections.formatSport ? <Minus size={20} /> : <Plus size={20} />}
              <span>Thể thức và môn thi đấu</span>
            </div>
            
            {expandedSections.formatSport && (
              <div className="section-content-expandable">
                <div className="info-display">
                  <div className="info-row">
                    <strong>Môn thi đấu:</strong>
                    <span>{tournament.sport || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="info-row">
                    <strong>Thể thức thi đấu:</strong>
                    <span>
                      {tournament.format === 'knockout' || tournament.format === 'single-elimination' ? 'Loại trực tiếp' :
                       tournament.format === 'round-robin' ? 'Vòng tròn' :
                       tournament.format === 'group-stage' ? 'Chia bảng đấu' :
                       tournament.format || 'Chưa xác định'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigTab

