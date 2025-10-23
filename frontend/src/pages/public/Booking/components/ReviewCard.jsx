import React from 'react'
import { getRatingStars } from '../utils/bookingHelpers'

export default function ReviewCard({ review }) {
  return (
    <div style={{
      background: '#f9fafb',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          {review.avatar}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {review.user}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f59e0b', fontSize: '14px' }}>
              {getRatingStars(review.rating)}
            </span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {new Date(review.date).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
      <p style={{
        fontSize: '14px',
        color: '#374151',
        lineHeight: '1.5',
        margin: 0
      }}>
        {review.comment}
      </p>
    </div>
  )
}

