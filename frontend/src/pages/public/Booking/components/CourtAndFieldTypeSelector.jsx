import React, { useState } from 'react'
import { MapPin, Grid3x3 } from 'lucide-react'
import useDeviceType from '../../../../hook/use-device-type'
import useClickOutside from '../../../../hook/use-click-outside'
import useToggle from '../../../../hook/use-toggle'

export default function CourtAndFieldTypeSelector({ 
  selectedCourt,
  onCourtChange,
  selectedFieldType,
  onFieldTypeChange
}) {
  const { isMobile, isTablet } = useDeviceType()
  const [showCourtPicker, { toggle: toggleCourtPicker, setFalse: closeCourtPicker }] = useToggle(false)
  const [showFieldTypePicker, { toggle: toggleFieldTypePicker, setFalse: closeFieldTypePicker }] = useToggle(false)
  
  const courtPickerRef = useClickOutside(() => closeCourtPicker(), showCourtPicker)
  const fieldTypePickerRef = useClickOutside(() => closeFieldTypePicker(), showFieldTypePicker)

  const courts = ['Sân số 1', 'Sân số 2', 'Sân số 3', 'Sân số 4', 'Sân số 5']
  const fieldTypes = ['Bóng đá mini', 'Bóng đá 7 người', 'Bóng đá 11 người', 'Bóng rổ', 'Tennis']

  return (
    <div style={{ 
      background: '#fff', 
      padding: isMobile ? '16px' : isTablet ? '20px' : '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginBottom: isMobile ? '16px' : isTablet ? '18px' : '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: isMobile ? '16px' : isTablet ? '17px' : '18px', 
            fontWeight: '600', 
            color: '#1f2937' 
          }}>
            Chọn sân và loại sân
          </h3>

          {/* Court and Field Type Pickers */}
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '8px' : isTablet ? '10px' : '12px', 
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            {/* Court Picker */}
            <div ref={courtPickerRef} style={{ position: 'relative', flex: isMobile ? 'none' : '1', minWidth: isMobile ? '100%' : '150px', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => {
                  toggleCourtPicker()
                  closeFieldTypePicker()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#6b7280',
                  transition: 'all 0.2s',
                  width: '100%'
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
                <MapPin size={16} />
                <span style={{ flex: 1, textAlign: 'left' }}>{selectedCourt}</span>
              </button>

              {/* Court Dropdown */}
              {showCourtPicker && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  zIndex: 1000,
                  minWidth: '100%'
                }}>
                  {courts.map((court) => (
                    <button
                      key={court}
                      onClick={() => {
                        onCourtChange(court)
                        closeCourtPicker()
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        border: 'none',
                        background: selectedCourt === court ? '#f3f4f6' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: selectedCourt === court ? '#1f2937' : '#6b7280',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCourt !== court) {
                          e.target.style.background = '#f9fafb'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCourt !== court) {
                          e.target.style.background = 'transparent'
                        }
                      }}
                    >
                      {selectedCourt === court && <MapPin size={14} color="#1f2937" />}
                      {court}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field Type Picker */}
            <div ref={fieldTypePickerRef} style={{ position: 'relative', flex: isMobile ? 'none' : '1', minWidth: isMobile ? '100%' : '150px', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => {
                  toggleFieldTypePicker()
                  closeCourtPicker()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#6b7280',
                  transition: 'all 0.2s',
                  width: '100%'
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
                <Grid3x3 size={16} />
                <span style={{ flex: 1, textAlign: 'left' }}>{selectedFieldType}</span>
              </button>

              {/* Field Type Dropdown */}
              {showFieldTypePicker && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  zIndex: 1000,
                  minWidth: '100%'
                }}>
                  {fieldTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        onFieldTypeChange(type)
                        closeFieldTypePicker()
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        border: 'none',
                        background: selectedFieldType === type ? '#f3f4f6' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: selectedFieldType === type ? '#1f2937' : '#6b7280',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFieldType !== type) {
                          e.target.style.background = '#f9fafb'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFieldType !== type) {
                          e.target.style.background = 'transparent'
                        }
                      }}
                    >
                      {selectedFieldType === type && <Grid3x3 size={14} color="#1f2937" />}
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

