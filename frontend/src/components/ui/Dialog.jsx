import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Custom Dialog Component
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog closes
 * @param {ReactNode} children - Dialog content
 * @param {string} title - Dialog title (optional)
 * @param {string} description - Dialog description (optional)
 * @param {boolean} showCloseButton - Whether to show X button (default: true)
 * @param {string} maxWidth - Max width of dialog (default: '500px')
 */
const Dialog = ({ 
  open, 
  onClose, 
  children, 
  title, 
  description, 
  showCloseButton = true,
  maxWidth = '500px'
}) => {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-in-out'
        }}
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: maxWidth,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          animation: 'slideDown 0.2s ease-in-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div style={{ marginBottom: '20px' }}>
            {title && (
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Children Content */}
        {children}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
      </div>
    </>
  )
}

export default Dialog
