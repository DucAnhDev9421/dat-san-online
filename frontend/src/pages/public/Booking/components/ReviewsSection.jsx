import React from 'react'
import ReviewCard from './ReviewCard'

export default function ReviewsSection({ reviews, venueRating }) {
  return (
    <div style={{
      background: '#fff',
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            Đánh giá từ khách hàng
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f59e0b', fontSize: '18px' }}>★★★★☆</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{venueRating}</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>({reviews.length} đánh giá)</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button style={{
            background: 'none',
            border: '1px solid #d1d5db',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Xem tất cả đánh giá
          </button>
        </div>
      </div>
    </div>
  )
}

