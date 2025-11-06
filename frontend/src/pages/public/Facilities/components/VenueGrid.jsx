import React from 'react'
import VenueCard from '../../../../components/VenueCard'
import { SkeletonVenueCard } from '../../../../components/ui/Skeleton'
import '../../../../styles/Facilities.css'

export default function VenueGrid({ facilities, loading, onBookVenue }) {
  if (loading) {
    return (
      <div className="venues-grid">
        {[...Array(6)].map((_, i) => (
          <SkeletonVenueCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="venues-grid">
      {facilities.map(f => (
        <VenueCard
          key={f.id}
          venueId={f.id}
          image={f.image}
          name={f.name}
          address={`${f.district}, ${f.city}`}
          rating={f.rating}
          open={f.open}
          price={typeof f.price === 'number' ? `${f.price.toLocaleString()} VND/giờ` : f.price}
          sport={f.sport}
          status={f.status}
          onBook={() => onBookVenue?.(f.id)}
        />
      ))}
    </div>
  )
}

