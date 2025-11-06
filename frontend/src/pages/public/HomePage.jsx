import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import HeroSection from './HomePage/components/HeroSection'
import SearchBar from './HomePage/components/SearchBar'
import FeaturesSection from './HomePage/components/FeaturesSection'
import PopularLocationsSection from './HomePage/components/PopularLocationsSection'
import VenuesSection from './HomePage/components/VenuesSection'
import { scrollToElement, buildSearchParams } from './HomePage/utils/helpers'
import { getProvinces } from '../../api/provinceApi'
import { facilityApi } from '../../api/facilityApi'
import { toast } from 'react-toastify'
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
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)
  const [facilities, setFacilities] = useState([])
  const [featuredFacilities, setFeaturedFacilities] = useState([])

  const handleBookVenue = (venueId) => {
    navigate(`/booking?venue=${venueId}`)
  }

  const scrollToFeatured = () => {
    scrollToElement('featured')
  }

  const scrollToRecent = () => {
    scrollToElement('recent')
  }

  // Transform facility data to venue format
  const transformFacilityToVenue = (facility) => {
    // Format operating hours
    const formatOperatingHours = (hours) => {
      if (!hours) return null
      
      // Get current day
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const today = days[new Date().getDay()]
      const todayHours = hours[today]
      
      if (todayHours && todayHours.isOpen) {
        return `${todayHours.open} - ${todayHours.close}`
      }
      
      // Fallback: return first available day
      for (const day of days) {
        if (hours[day] && hours[day].isOpen) {
          return `${hours[day].open} - ${hours[day].close}`
        }
      }
      
      return '06:00 - 22:00'
    }

    // Format price
    const formatPrice = (pricePerHour) => {
      if (!pricePerHour) return null
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      }).format(pricePerHour) + '/giờ'
    }

    return {
      id: facility._id || facility.id,
      name: facility.name,
      address: facility.address,
      rating: facility.averageRating || facility.rating || 0,
      price: formatPrice(facility.pricePerHour),
      operatingHours: formatOperatingHours(facility.operatingHours),
      image: facility.images && facility.images.length > 0 
        ? facility.images[0].url 
        : null,
      images: facility.images?.map(img => img.url) || [],
      facilities: facility.types || [],
      sportCategory: facility.types?.[0] || null,
      status: facility.status === 'opening' ? 'Còn trống' : 'Đóng cửa'
    }
  }

  // Fetch facilities data from API
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setFacilitiesLoading(true)
        
        // Fetch all facilities (recent)
        const result = await facilityApi.getFacilities({
          limit: 8,
          page: 1
        })
        
        if (result.success && result.data && result.data.facilities) {
          // Ratings are already included in the response from backend
          const transformedFacilities = result.data.facilities.map(transformFacilityToVenue)
          setFacilities(transformedFacilities)
          
          // Featured facilities: sort by rating (or use first 4 if no rating)
          const featured = [...transformedFacilities]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 4)
          setFeaturedFacilities(featured)
        } else {
          console.warn('No facilities data received')
          setFacilities([])
          setFeaturedFacilities([])
        }
      } catch (error) {
        console.error('Error fetching facilities:', error)
        setFacilities([])
        setFeaturedFacilities([])
        toast.error('Không thể tải danh sách sân thể thao. Vui lòng thử lại sau.')
      } finally {
        setFacilitiesLoading(false)
      }
    }
    
    fetchFacilities()
  }, [])

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const result = await getProvinces()
        
        if (result.success && result.data && result.data.length > 0) {
          setProvinces(result.data)
        } else {
          console.warn('No provinces data received')
          setProvinces([])
          if (result.error) {
            toast.error(result.error)
          }
        }
      } catch (error) {
        console.error('Error fetching provinces:', error)
        setProvinces([])
        toast.error('Không thể tải danh sách tỉnh thành. Vui lòng thử lại sau.')
      }
    }
    fetchProvinces()
  }, [])

  // Update page loading state when both facilities and provinces are loaded
  useEffect(() => {
    if (!facilitiesLoading) {
      setIsPageLoading(false)
    }
  }, [facilitiesLoading])

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
        venues={featuredFacilities}
        loading={facilitiesLoading}
        onBookVenue={handleBookVenue}
      />

      <VenuesSection
        id="recent"
        title="Sân thể thao gần đây"
        venues={facilities}
        loading={facilitiesLoading}
        onBookVenue={handleBookVenue}
      />

      <PopularLocationsSection />

      <FeaturesSection />
    </main>
  )
}

export default HomePage
