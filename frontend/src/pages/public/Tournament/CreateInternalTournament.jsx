import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { toast } from 'react-toastify'
import { categoryApi } from '../../../api/categoryApi'
import { facilityApi } from '../../../api/facilityApi'
import { userApi } from '../../../api/userApi'
import { leagueApi } from '../../../api/leagueApi'
import { useAuth } from '../../../contexts/AuthContext'
import useClickOutside from '../../../hook/use-click-outside'
import '../../../styles/CreateTournament.css'

const CreateInternalTournament = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    description: '',
    phone: '',
    location: '',
    type: 'individual', // team or individual (mặc định individual)
    sport: '', // selected sport category
    format: 'single-elimination', // tournament format
    numParticipants: 2,
    membersPerTeam: 2, // số lượng người mỗi đội
    startDate: '',
    endDate: ''
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [sportCategories, setSportCategories] = useState([])
  const [loadingSports, setLoadingSports] = useState(false)
  const [facilitySearchQuery, setFacilitySearchQuery] = useState('')
  const [facilitySearchResults, setFacilitySearchResults] = useState([])
  const [loadingFacilities, setLoadingFacilities] = useState(false)
  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [favoriteFacilities, setFavoriteFacilities] = useState([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const facilityDropdownRef = useClickOutside(() => {
    setShowFacilityDropdown(false)
  }, showFacilityDropdown)

  // Fetch sport categories
  useEffect(() => {
    const fetchSportCategories = async () => {
      try {
        setLoadingSports(true)
        const result = await categoryApi.getSportCategories({ status: 'active' })
        if (result.success && result.data) {
          setSportCategories(result.data)
        }
      } catch (error) {
        console.error('Error fetching sport categories:', error)
        toast.error('Không thể tải danh sách môn thể thao')
      } finally {
        setLoadingSports(false)
      }
    }

    fetchSportCategories()
  }, [])

  // Search facilities with debounce
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

  // Fetch favorite facilities
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
        // Không hiển thị toast vì đây là optional feature
        setFavoriteFacilities([])
      } finally {
        setLoadingFavorites(false)
      }
    }

    fetchFavorites()
  }, [])

  // Set default phone from user if available
  useEffect(() => {
    if (user && user.phone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone }))
    }
  }, [user])

  const tournamentFormats = [
    { id: 'single-elimination', icon: '⚔️', label: 'Loại trực tiếp' },
    { id: 'round-robin', icon: '🔁', label: 'Vòng tròn' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
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
    if (!formData.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu')
      return
    }
    if (!formData.endDate) {
      toast.error('Vui lòng chọn ngày kết thúc')
      return
    }
    // Validate date range
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }
    if (formData.numParticipants < 2) {
      toast.error('Số đội tham gia phải ít nhất 2')
      return
    }
    if (!formData.sport) {
      toast.error('Vui lòng chọn môn thể thao')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Map format từ frontend sang backend
      const formatMapping = {
        'single-elimination': 'Loại Trực Tiếp',
        'round-robin': 'Vòng tròn'
      }

      // 2. Combine date với time mặc định (00:00:00) thành ISO datetime
      const startDateTime = `${formData.startDate}T00:00:00`
      const endDateTime = `${formData.endDate}T23:59:59`

      // 3. Lấy thông tin facility
      const facilityName = selectedFacility?.name || ''
      const facilityAddress = selectedFacility?.address || ''
      const facilityId = selectedFacility?._id || selectedFacility?.id || null

      // 4. Prepare request body
      const requestBody = {
        name: formData.name.trim(),
        format: formatMapping[formData.format] || formData.format,
        sport: formData.sport,
        phone: formData.phone.trim(),
        tournamentType: formData.type, // 'team' | 'individual'
        membersPerTeam: formData.membersPerTeam,
        startDate: startDateTime,
        endDate: endDateTime,
        location: facilityName || null,
        address: facilityAddress || null,
        maxParticipants: formData.numParticipants,
        description: formData.description.trim() || null,
        fullDescription: formData.description.trim() || null,
        type: 'PRIVATE', // Giải đấu nội bộ luôn là PRIVATE
        teams: [],
        matches: []
      }

      // Nếu có facility ID, thêm vào request body (nhưng không bắt buộc)
      if (facilityId) {
        requestBody.facility = facilityId
      }

      // 4. Create league
      const result = await leagueApi.createLeague(requestBody)
      
      if (!result.success) {
        throw new Error(result.message || 'Tạo giải đấu thất bại')
      }

      const leagueId = result.data._id || result.data.id

      // 5. Upload image if exists
      if (formData.image && leagueId) {
        try {
          const uploadResult = await leagueApi.uploadImage(leagueId, formData.image)
          if (uploadResult.success && uploadResult.data) {
            // Update league with image URL
            await leagueApi.updateLeague(leagueId, {
              image: uploadResult.data.image || uploadResult.data.imageUrl,
              banner: uploadResult.data.image || uploadResult.data.imageUrl
            })
          }
        } catch (uploadError) {
          // Log error but don't block success
          console.error('Error uploading image:', uploadError)
          toast.warning('Tạo giải đấu thành công nhưng upload ảnh thất bại. Bạn có thể upload ảnh sau.')
        }
      }

      toast.success('Tạo giải đấu nội bộ thành công!')
      navigate(`/tournament/${leagueId}`)
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi tạo giải đấu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-tournament-page">
      <div className="create-tournament-container">
        <form onSubmit={handleSubmit} className="tournament-form">
          {/* Header */}
          <div className="create-tournament-header">
            <div className="header-left">
              <h1>Tạo giải đấu mới</h1>
              <p className="header-subtitle">
                Điền thông tin để tạo giải đấu của bạn
              </p>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="form-section">
            <div className="form-row">
              {/* Image Upload */}
              <div className="image-upload-container">
                <label className="image-upload-label">Hình giải đấu</label>
                <div className="image-upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                    id="tournament-image"
                  />
                  <label htmlFor="tournament-image" className="image-upload-area">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Tournament preview" className="uploaded-image" />
                        <div className="edit-overlay">
                          <Pencil size={16} />
                        </div>
                      </>
                    ) : (
                      <div className="upload-placeholder">
                        <img 
                          src="/givetour-compact.png" 
                          alt="Tournament default" 
                          className="default-tournament-image"
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="form-fields-group">
                <div className="form-field">
                  <label htmlFor="name">
                    Tên giải đấu <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên giải đấu"
                    required
                  />
                </div>

                {/* Sport Selection */}
                <div className="form-field">
                  <label htmlFor="sport">
                    Môn thể thao <span className="required">*</span>
                  </label>
                  <select
                    id="sport"
                    name="sport"
                    value={formData.sport}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Chọn môn thể thao --</option>
                    {sportCategories.map((sport) => (
                      <option key={sport._id || sport.id} value={sport.name}>
                        {sport.icon ? `${sport.icon} ` : ''}{sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Competition Format */}
                <div className="form-field">
                  <label htmlFor="format">
                    Hình thức thi đấu <span className="required">*</span>
                  </label>
                  <select
                    id="format"
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    required
                  >
                    {tournamentFormats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Participants */}
                <div className="form-field">
                  <label htmlFor="numParticipants">
                    Số đội tham gia <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="numParticipants"
                    name="numParticipants"
                    value={formData.numParticipants}
                    onChange={handleInputChange}
                    min="2"
                    required
                  />
                </div>

                <div className="form-row-inline">
                  <div className="form-field">
                    <label htmlFor="phone">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                {/* Tournament Date & Time */}
                <div className="form-row-inline">
                  <div className="form-field">
                    <label htmlFor="startDate">
                      Ngày bắt đầu <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="endDate">
                      Ngày kết thúc <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Facility Search */}
                <div className="form-field facility-search-field">
                  <label htmlFor="facilitySearch">
                    Địa điểm (tùy chọn)
                  </label>
                  <div className="facility-search-wrapper" ref={facilityDropdownRef}>
                    <input
                      type="text"
                      id="facilitySearch"
                      name="facilitySearch"
                      value={facilitySearchQuery}
                      onChange={handleFacilitySearchChange}
                      onFocus={() => {
                        if (facilitySearchResults.length > 0 || favoriteFacilities.length > 0) {
                          setShowFacilityDropdown(true)
                        }
                      }}
                      placeholder="Tìm theo tên cơ sở, quận huyện..."
                      autoComplete="off"
                    />
                    {loadingFacilities && (
                      <div className="facility-search-loading">
                        <span>Đang tìm...</span>
                      </div>
                    )}
                    {showFacilityDropdown && (
                      <div className="facility-search-dropdown">
                        {/* Favorite Facilities Section */}
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

                        {/* Search Results Section */}
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

                        {/* Empty State */}
                        {facilitySearchQuery.trim() && !loadingFacilities && facilitySearchResults.length === 0 && (
                          <div className="facility-search-empty">
                            Không tìm thấy cơ sở nào
                          </div>
                        )}

                        {/* No Favorites and No Search */}
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="form-section">
            <div className="form-field">
              <label htmlFor="description">
                Mô tả giải đấu
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả về giải đấu..."
                rows="4"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang tạo giải đấu...' : 'Tạo giải đấu nội bộ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInternalTournament

