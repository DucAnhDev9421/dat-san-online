import React from 'react'

export default function VenueGallery({ images }) {
  return (
    <div>
      <div style={{
        background: '#f3f4f6',
        borderRadius: '12px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
        border: '2px dashed #d1d5db'
      }}>
        <span style={{ color: '#6b7280', fontSize: '16px' }}>Hình ảnh sân bóng</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            height: '60px',
            width: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #d1d5db'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Hình {i}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

