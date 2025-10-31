import React from 'react'
import VenueCard from '../../../../components/VenueCard'
import { SkeletonVenueCard } from '../../../../components/ui/Skeleton'
import { getVenueImage } from '../mockData'
import '../../../../styles/HomePage.css'

export default function VenuesSection({ 
  id, 
  title, 
  venues, 
  loading, 
  onBookVenue 
}) {
  return (
    <section id={id} className="venues-section">
      <div className="container">
        <div className="section-head">
          <h3>{title}</h3>
          <a href="#">Xem tất cả →</a>
        </div>
        {loading ? (
          <div className="venues-grid">
            {[...Array(id === 'featured' ? 4 : 8)].map((_, i) => (
              <SkeletonVenueCard key={i} />
            ))}
          </div>
        ) : (
          <div className="venues-grid">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venueId={venue.id}
                image={getVenueImage(venue.id)}
                name={venue.name}
                address={venue.address}
                rating={venue.rating}
                open={venue.operatingHours}
                price={venue.price}
                chip={venue.facilities && venue.facilities[0]}
                onBook={() => onBookVenue(venue.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

