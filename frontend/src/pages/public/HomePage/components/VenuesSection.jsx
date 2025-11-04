import React, { useState, useMemo } from 'react'
import { Filter } from 'lucide-react'
import VenueCard from '../../../../components/VenueCard'
import { SkeletonVenueCard } from '../../../../components/ui/Skeleton'
import '../../../../styles/HomePage.css'

const sports = [
  { id: 'all', name: 'Tất cả', value: '' },
  { id: 'football', name: 'Bóng đá', value: 'Bóng đá' },
  { id: 'badminton', name: 'Cầu lông', value: 'Cầu lông' },
  { id: 'tennis', name: 'Tennis', value: 'Tennis' },
  { id: 'pickleball', name: 'Pickleball', value: 'Pickleball' }
]

export default function VenuesSection({ 
  id, 
  title, 
  venues, 
  loading, 
  onBookVenue 
}) {
  const [selectedSport, setSelectedSport] = useState('all')

  const filteredVenues = useMemo(() => {
    if (selectedSport === 'all' || !selectedSport) {
      return venues
    }
    const sportFilter = sports.find(s => s.id === selectedSport)
    if (!sportFilter) return venues
    
    return venues.filter(venue => {
      // Check if venue facilities include the selected sport
      const facilities = venue.facilities || []
      return facilities.some(facility => 
        facility.toLowerCase().includes(sportFilter.value.toLowerCase()) ||
        sportFilter.value.toLowerCase().includes(facility.toLowerCase())
      )
    })
  }, [venues, selectedSport])

  return (
    <section id={id} className="venues-section">
      <div className="container">
        <div className="section-head">
          <h3>{title}</h3>
          <a href="#">Xem tất cả →</a>
        </div>

        <div className="sport-filters">
          <div className="sport-filters-header">
            <Filter size={18} />
            <span>Lọc theo môn thể thao</span>
          </div>
          <div className="sport-filters-list">
            {sports.map((sport) => (
              <button
                key={sport.id}
                className={`sport-filter-btn ${selectedSport === sport.id ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport.id)}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="venues-grid">
            {[...Array(id === 'featured' ? 4 : 8)].map((_, i) => (
              <SkeletonVenueCard key={i} />
            ))}
          </div>
        ) : filteredVenues.length > 0 ? (
          <div className="venues-grid">
            {filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venueId={venue.id}
                image={venue.image || venue.images?.[0] || venue.imageUrl}
                name={venue.name}
                address={venue.address}
                rating={venue.rating || venue.averageRating}
                open={venue.operatingHours || venue.hours}
                price={venue.price || venue.pricePerHour}
                chip={venue.facilities?.[0] || venue.sportCategory}
                onBook={() => onBookVenue(venue.id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-venues-message">
            <p>Không tìm thấy sân thể thao nào cho môn này.</p>
          </div>
        )}
      </div>
    </section>
  )
}

