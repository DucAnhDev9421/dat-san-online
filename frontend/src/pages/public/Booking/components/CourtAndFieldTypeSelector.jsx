import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Grid3x3 } from 'lucide-react'

export default function CourtAndFieldTypeSelector({ 
  selectedCourt,
  onCourtChange,
  selectedFieldType,
  onFieldTypeChange
}) {
  const [showCourtPicker, setShowCourtPicker] = useState(false)
  const [showFieldTypePicker, setShowFieldTypePicker] = useState(false)
  
  const courtPickerRef = useRef(null)
  const fieldTypePickerRef = useRef(null)

  const courts = ['Sân số 1', 'Sân số 2', 'Sân số 3', 'Sân số 4', 'Sân số 5']
  const fieldTypes = ['Bóng đá mini', 'Bóng đá 7 người', 'Bóng đá 11 người', 'Bóng rổ', 'Tennis']

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (courtPickerRef.current && !courtPickerRef.current.contains(event.target)) {
        setShowCourtPicker(false)
      }
      if (fieldTypePickerRef.current && !fieldTypePickerRef.current.contains(event.target)) {
        setShowFieldTypePicker(false)
      }
    }

    if (showCourtPicker || showFieldTypePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCourtPicker, showFieldTypePicker])

  return (
    <div style={{ 
      background: '#fff', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937' 
          }}>
            Chọn sân và loại sân
          </h3>

          {/* Court and Field Type Pickers */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap'
          }}>
            {/* Court Picker */}
            <div ref={courtPickerRef} style={{ position: 'relative', flex: '1', minWidth: '150px' }}>
              <button
                onClick={() => {
                  setShowCourtPicker(!showCourtPicker)
                  setShowFieldTypePicker(false)
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
                        setShowCourtPicker(false)
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
            <div ref={fieldTypePickerRef} style={{ position: 'relative', flex: '1', minWidth: '150px' }}>
              <button
                onClick={() => {
                  setShowFieldTypePicker(!showFieldTypePicker)
                  setShowCourtPicker(false)
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
                        setShowFieldTypePicker(false)
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

