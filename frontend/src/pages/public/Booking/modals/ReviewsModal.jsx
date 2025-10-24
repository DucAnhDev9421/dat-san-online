import React, { useState, useMemo } from 'react'
import ReviewCard from '../components/ReviewCard'

export default function ReviewsModal({ isOpen, onClose, reviews, venueRating }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    // Filter by rating
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating)
      filtered = filtered.filter(review => review.rating === rating)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort reviews
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date)
        case 'oldest':
          return new Date(a.date) - new Date(b.date)
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, filterRating, sortBy, searchTerm])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1f2937', 
              margin: '0 0 12px 0' 
            }}>
              {reviews.length} lượt đánh giá
            </h2>
            
            {/* Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#f59e0b', fontSize: '20px' }}>★★★★☆</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{venueRating}</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>({reviews.length} đánh giá)</span>
              </div>
            </div>

            {/* Rating Distribution */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{rating}★</span>
                    <div style={{ 
                      width: '40px', 
                      height: '4px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: rating >= 4 ? '#10b981' : rating >= 3 ? '#f59e0b' : '#ef4444'
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6'
              e.target.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Search and Filters */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            gap: '16px',
            alignItems: window.innerWidth <= 768 ? 'stretch' : 'center'
          }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Tìm kiếm tất cả đánh giá"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Rating Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>
                Lọc:
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">Tất cả sao</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>
                Sắp xếp:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="highest">Cao nhất</option>
                <option value="lowest">Thấp nhất</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '12px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>
              Hiển thị {filteredReviews.length} trong {reviews.length} đánh giá
            </span>
            {(filterRating !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setFilterRating('all')
                  setSearchTerm('')
                }}
                style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {filteredReviews.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Không tìm thấy đánh giá nào
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
