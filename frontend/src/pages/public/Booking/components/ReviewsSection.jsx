import React, { useState, useMemo } from 'react'
import { MessageSquare, Star, ChevronLeft, ChevronRight, Filter, ArrowUpDown, RotateCcw } from 'lucide-react'
import ReviewCard from './ReviewCard'

export default function ReviewsSection({ reviews, venueRating }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')
  
  const itemsPerPage = 10

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    // Filter by rating
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating)
      filtered = filtered.filter(review => review.rating === rating)
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
  }, [reviews, filterRating, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReviews = filteredReviews.slice(startIndex, endIndex)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filterRating, sortBy])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of reviews section
    const element = document.getElementById('reviews-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <div id="reviews-section">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
          marginBottom: '24px',
          gap: window.innerWidth <= 768 ? '12px' : '0'
        }}>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Đánh giá từ khách hàng
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Tổng hợp ý kiến từ {reviews.length} khách hàng
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={18} 
                  fill={star <= Math.floor(venueRating) ? '#fbbf24' : 'none'} 
                  color="#fbbf24" 
                />
              ))}
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{venueRating}</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>({reviews.length} đánh giá)</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            gap: '16px',
            alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
            marginBottom: '16px'
          }}>
            {/* Rating Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} color="#6b7280" />
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>
                  Lọc:
                </label>
              </div>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  minWidth: '120px'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={16} color="#6b7280" />
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>
                  Sắp xếp:
                </label>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  minWidth: '140px'
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
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} color="#6b7280" />
              <span>
                Hiển thị {currentReviews.length} trong {filteredReviews.length} đánh giá
                {filteredReviews.length !== reviews.length && ` (từ ${reviews.length} tổng)`}
              </span>
            </div>
            {filterRating !== 'all' && (
              <button
                onClick={() => setFilterRating('all')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}
              >
                <RotateCcw size={14} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {currentReviews.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {currentReviews.map((review, index) => (
              <div 
                key={review.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderLeft: '4px solid #667eea'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.borderLeftColor = '#764ba2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.borderLeftColor = '#667eea'
                }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '2px dashed #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: '500' }}>
              Không tìm thấy đánh giá nào
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px'
          }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? '#f3f4f6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                color: currentPage === 1 ? '#9ca3af' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s ease',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={16} />
              Trước
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        background: page === currentPage ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
                        border: page === currentPage ? 'none' : '2px solid #e5e7eb',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: page === currentPage ? '#fff' : '#374151',
                        cursor: 'pointer',
                        fontWeight: page === currentPage ? '600' : '500',
                        transition: 'all 0.3s ease',
                        minWidth: '40px'
                      }}
                      onMouseEnter={(e) => {
                        if (page !== currentPage) {
                          e.target.style.borderColor = '#3b82f6'
                          e.target.style.backgroundColor = '#f8fafc'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== currentPage) {
                          e.target.style.borderColor = '#e5e7eb'
                          e.target.style.backgroundColor = '#fff'
                        }
                      }}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} style={{ padding: '10px 4px', color: '#9ca3af' }}>
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? '#f3f4f6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                color: currentPage === totalPages ? '#9ca3af' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s ease',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        )}
    </div>
  )
}

