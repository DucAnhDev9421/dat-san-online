import React from 'react'
import { Link } from 'react-router-dom'
import FuzzyText from '../../components/FuzzyText'

function NotFound() {
  return (
    <div style={{ 
      background: '#000000',
      position: 'relative'
    }}>
      <style>{`
        body > #root .site-footer {
          margin-top: 0 !important;
        }
      `}</style>
      <main style={{ 
        minHeight: 'calc(100vh - 64px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000000',
        padding: '20px',
        boxSizing: 'border-box',
        margin: 0
      }}>
      <div style={{ 
        textAlign: 'center', 
        padding: 'clamp(24px, 5vw, 48px)',
        maxWidth: '100%',
        width: '100%'
      }}>
        <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
          <FuzzyText
            fontSize="clamp(4rem, 12vw, 8rem)"
            fontWeight={900}
            color="#ffffff"
            enableHover={true}
            baseIntensity={0.18}
            hoverIntensity={0.6}
          >
            404
          </FuzzyText>
        </div>
        <p style={{ 
          color: '#e5e7eb', 
          marginTop: 'clamp(12px, 2vw, 16px)',
          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
          opacity: 0.8
        }}>
          Trang bạn tìm không tồn tại.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary" 
          style={{ 
            marginTop: 'clamp(24px, 4vw, 32px)', 
            display: 'inline-block',
            background: '#0ea5e9',
            color: '#ffffff',
            border: 'none',
            padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#0284c7';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#0ea5e9';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Về trang chủ
        </Link>
      </div>
      </main>
    </div>
  )
}

export default NotFound

