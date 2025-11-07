import React from 'react'
import { MapPin, Grid3x3 } from 'lucide-react'
import useDeviceType from '../../../../hook/use-device-type'
import useClickOutside from '../../../../hook/use-click-outside'
import useToggle from '../../../../hook/use-toggle'

export default function CourtAndFieldTypeSelector({ 
  courts = [],
  courtTypes = [],
  selectedCourt,
  onCourtChange,
  selectedFieldType,
  onFieldTypeChange,
  loading = false
}) {
  const { isMobile, isTablet } = useDeviceType()
  const [showCourtPicker, { toggle: toggleCourtPicker, setFalse: closeCourtPicker }] = useToggle(false)
  
  const courtPickerRef = useClickOutside(() => closeCourtPicker(), showCourtPicker)

  // Get field type names
  const fieldTypeNames = courtTypes.map(type => type.name)

  // Courts are already filtered by API, so we just use them directly
  // No need to filter on frontend anymore
  const filteredCourts = courts

  // Get court name from ID
  const getCourtName = (courtId) => {
    if (!courtId) return 'Chọn sân'
    const court = courts.find(c => c.id === courtId || c._id === courtId)
    return court ? court.name : 'Chọn sân'
  }

  return (
    <div style={{ 
      background: '#fff', 
      padding: isMobile ? '16px' : isTablet ? '20px' : '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginBottom: isMobile ? '16px' : isTablet ? '18px' : '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section 1: Chọn loại sân */}
        <div style={{ 
          marginBottom: isMobile ? '24px' : '28px',
          paddingBottom: isMobile ? '20px' : '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: isMobile ? '12px' : '16px' 
          }}>
            <Grid3x3 size={18} color="#3b82f6" />
            <h3 style={{ 
              margin: 0, 
              fontSize: isMobile ? '16px' : isTablet ? '17px' : '18px', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              Chọn loại sân
            </h3>
          </div>

          {/* Field Type Picker - Grid Layout */}
          {loading ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Đang tải loại sân...
            </div>
          ) : fieldTypeNames.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? 'repeat(auto-fill, minmax(120px, 1fr))' 
                : isTablet 
                ? 'repeat(auto-fill, minmax(140px, 1fr))' 
                : 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px'
            }}>
              {fieldTypeNames.map((type) => {
                const isSelected = selectedFieldType === type
                return (
                  <button
                    key={type}
                    onClick={() => onFieldTypeChange(type)}
                    style={{
                      padding: isMobile ? '12px 8px' : '14px 12px',
                      borderRadius: '10px',
                      border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                      background: isSelected ? '#dbeafe' : '#fff',
                      cursor: 'pointer',
                      fontSize: isMobile ? '13px' : '14px',
                      fontWeight: isSelected ? '600' : '400',
                      color: isSelected ? '#1e40af' : '#374151',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      minHeight: isMobile ? '48px' : '52px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#9ca3af'
                        e.currentTarget.style.background = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.background = '#fff'
                      }
                    }}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Không có loại sân nào
            </div>
          )}
          
          {/* Selected field type indicator */}
          {selectedFieldType && (
            <div style={{ 
              marginTop: '12px', 
              fontSize: '13px', 
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Đã chọn:</span>
              <span style={{ 
                fontWeight: '600', 
                color: '#1e40af',
                padding: '4px 8px',
                background: '#dbeafe',
                borderRadius: '6px'
              }}>
                {selectedFieldType}
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Chọn sân */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: isMobile ? '12px' : '16px' 
          }}>
            <MapPin size={18} color="#059669" />
            <h3 style={{ 
              margin: 0, 
              fontSize: isMobile ? '16px' : isTablet ? '17px' : '18px', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              Chọn sân
            </h3>
          </div>

          {/* Court Picker */}
          <div ref={courtPickerRef} style={{ 
            position: 'relative', 
            maxWidth: isMobile ? '100%' : '300px' 
          }}>
            <button
              onClick={toggleCourtPicker}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151',
                transition: 'all 0.2s',
                width: '100%',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9ca3af'
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.background = '#fff'
              }}
            >
              <MapPin size={16} color="#059669" />
              <span style={{ flex: 1, textAlign: 'left' }}>{getCourtName(selectedCourt)}</span>
              <span style={{ 
                fontSize: '12px', 
                color: '#9ca3af',
                transition: 'transform 0.2s',
                transform: showCourtPicker ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </span>
            </button>

            {/* Court Dropdown */}
            {showCourtPicker && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                zIndex: 1000,
                overflow: 'hidden',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {loading ? (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    Đang tải danh sách sân...
                  </div>
                ) : filteredCourts.length > 0 ? (
                  filteredCourts.map((court, index) => {
                    const courtId = court.id || court._id
                    const isSelected = selectedCourt === courtId
                    return (
                      <button
                        key={courtId || index}
                        onClick={() => {
                          onCourtChange(courtId)
                          closeCourtPicker()
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 16px',
                          border: 'none',
                          background: isSelected ? '#ecfdf5' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: isSelected ? '#059669' : '#374151',
                          width: '100%',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          fontWeight: isSelected ? '600' : '400',
                          borderBottom: index !== filteredCourts.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.target.style.background = '#f9fafb'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.target.style.background = 'transparent'
                          }
                        }}
                      >
                        {isSelected && <MapPin size={14} color="#059669" />}
                        {court.name}
                      </button>
                    )
                  })
                ) : (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    {selectedFieldType ? 'Không có sân nào thuộc loại này' : 'Không có sân nào'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

