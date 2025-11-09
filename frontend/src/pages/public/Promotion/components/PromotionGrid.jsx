import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PromotionCard from './PromotionCard'
import '../../../../styles/Promotion.css'

export default function PromotionGrid({ promotions, copiedCode, onCopy, onApply }) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkScrollButtons()
    }, 100)
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        clearTimeout(timer)
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
    return () => clearTimeout(timer)
  }, [promotions])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Card width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="promotion-slider-container">
      {canScrollLeft && (
        <button
          className="promotion-slider-btn promotion-slider-btn-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="promotion-slider"
      >
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            copiedCode={copiedCode}
            onCopy={onCopy}
            onApply={onApply}
          />
        ))}
      </div>

      {canScrollRight && (
        <button
          className="promotion-slider-btn promotion-slider-btn-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  )
}

