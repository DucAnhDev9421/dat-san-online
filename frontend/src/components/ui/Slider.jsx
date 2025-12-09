import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { debounce } from '../../utils/optimization'
import './Slider.css'

export default function Slider({ children, className = '', itemWidth = 320, gap = 16 }) {
    const scrollContainerRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            // Use a small buffer (1px) for floating point calculations
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
        }
    }

    useEffect(() => {
        // Delay to ensure DOM is ready and content is populated
        const timer = setTimeout(() => {
            checkScrollButtons()
        }, 100)

        const container = scrollContainerRef.current
        if (container) {
            // Create a debounced resize handler
            const debouncedCheck = debounce(checkScrollButtons, 200)

            container.addEventListener('scroll', checkScrollButtons)
            window.addEventListener('resize', debouncedCheck)

            return () => {
                clearTimeout(timer)
                container.removeEventListener('scroll', checkScrollButtons)
                window.removeEventListener('resize', debouncedCheck)
            }
        }
        return () => clearTimeout(timer)
    }, [children])

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = itemWidth + gap
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
        <div className={`ui-slider-container ${className}`}>
            {canScrollLeft && (
                <button
                    className="ui-slider-btn ui-slider-btn-left"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            <div
                ref={scrollContainerRef}
                className="ui-slider-track"
                style={{ gap: `${gap}px` }}
            >
                {children}
            </div>

            {canScrollRight && (
                <button
                    className="ui-slider-btn ui-slider-btn-right"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <ChevronRight size={24} />
                </button>
            )}
        </div>
    )
}
