import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import HeroSection from './HomePage/components/HeroSection'
import SearchBar from './HomePage/components/SearchBar'
import VenuesSection from './HomePage/components/VenuesSection'
import { venues, getVenueImage } from './HomePage/mockData'
import { scrollToElement, buildSearchParams } from './HomePage/utils/helpers'
import '../../styles/HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  const handleBookVenue = (venueId) => {
    navigate(`/booking?venue=${venueId}`)
  }

  const scrollToFeatured = () => {
    scrollToElement('featured')
  }

  const scrollToRecent = () => {
    scrollToElement('recent')
  }

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsPageLoading(true)
        const response = await fetch('https://provinces.open-api.vn/api/v1/?depth=2')
        const data = await response.json()
        setProvinces(data)
        // Simulate API loading
        setTimeout(() => {
          setIsPageLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching provinces:', error)
        setIsPageLoading(false)
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.name === selectedProvince)
      if (province && province.districts) {
        setDistricts(province.districts)
        setSelectedDistrict('')
      }
    } else {
      setDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedProvince, provinces])

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const params = buildSearchParams(selectedSport, selectedProvince, selectedDistrict)
      navigate(`/facilities?${params}`)
    }, 1000)
  }

  const featuredVenues = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <main>
      <HeroSection 
        onScrollToFeatured={scrollToFeatured}
        onScrollToRecent={scrollToRecent}
        searchBarProps={{
          selectedSport,
          selectedProvince,
          selectedDistrict,
          provinces,
          districts,
          loading,
          onSportChange: setSelectedSport,
          onProvinceChange: setSelectedProvince,
          onDistrictChange: setSelectedDistrict,
          onSearch: handleSearch
        }}
      />

      <VenuesSection
        id="featured"
        title="Sân thể thao nổi bật"
        venues={featuredVenues}
        loading={isPageLoading}
        onBookVenue={handleBookVenue}
      />

      <VenuesSection
        id="recent"
        title="Sân thể thao gần đây"
        venues={venues}
        loading={isPageLoading}
        onBookVenue={handleBookVenue}
      />
    </main>
  )
}

export default HomePage
