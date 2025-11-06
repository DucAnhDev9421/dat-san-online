import React, { useState } from 'react'
import FavoritesTab from '../tabs/FavoritesTab'
import { mockFavoriteVenues } from '../mockData'

export default function Favorites() {
  const [favoriteVenues] = useState(mockFavoriteVenues)
  return <FavoritesTab venues={favoriteVenues} />
}

