import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SearchBar from "./Facilities/components/SearchBar"
import FilterBar from "./Facilities/components/FilterBar"
import ViewControls from "./Facilities/components/ViewControls"
import VenueGrid from "./Facilities/components/VenueGrid"
import VenueListItem from "./Facilities/components/VenueListItem"
import { facilityApi } from "../../api/facilityApi"
import { getProvinces } from "../../api/provinceApi"
import { toast } from "react-toastify"
import useUserLocation from "../../hook/use-user-location"
import "../../styles/Facilities.css"

export default function Facilities() {
  const navigate = useNavigate()
  const { userLocation } = useUserLocation()
  const [query, setQuery] = useState("")
  const [sport, setSport] = useState("Tất cả")
  const [view, setView] = useState("grid")
  const [quick, setQuick] = useState("recent") // recent | cheap | top | nearby
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [filterNearby, setFilterNearby] = useState(false) // Filter by location
  const [maxDistance, setMaxDistance] = useState(10) // km
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [facilities, setFacilities] = useState([])
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsPageLoading(true)
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
      } finally {
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
        setSelectedDistrict("")
      }
    } else {
      setDistricts([])
      setSelectedDistrict("")
    }
  }, [selectedProvince, provinces])

  // Transform facility data to component format
  const transformFacilityToVenue = (facility) => {
    // Format operating hours
    const formatOperatingHours = (hours) => {
      if (!hours) return "06:00 - 22:00"
      
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

    // Extract city and district from address
    const addressParts = facility.address?.split(',') || []
    const district = addressParts[addressParts.length - 2]?.trim() || ''
    const city = addressParts[addressParts.length - 1]?.trim() || ''

    // Format price
    const formatPrice = (pricePerHour) => {
      if (!pricePerHour) return 0
      return pricePerHour
    }

    return {
      id: facility._id || facility.id,
      name: facility.name,
      sport: facility.types?.[0] || 'Khác',
      city: city,
      district: district,
      open: formatOperatingHours(facility.operatingHours),
      price: formatPrice(facility.pricePerHour),
      rating: facility.averageRating || 0,
      totalReviews: facility.totalReviews || 0,
      status: facility.status === 'opening' ? 'Còn trống' : 'Đóng cửa',
      image: facility.images && facility.images.length > 0 
        ? facility.images[0].url 
        : null,
      _original: facility, // Keep original for navigation
      location: facility.location || null,
      services: facility.services || []
    }
  }

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [query, sport, selectedProvince, selectedDistrict, quick, filterNearby, maxDistance])

  // Fetch facilities from API
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setFacilitiesLoading(true)
        
        // Minimum loading time to show skeleton (800ms)
        const minLoadingTime = 800
        const startTime = Date.now()
        
        const params = {
          page,
          limit,
          status: 'opening' // Only get opening facilities
        }

        // Add search query
        if (query.trim()) {
          params.address = query.trim()
        }

        // Add sport filter
        if (sport !== "Tất cả") {
          params.type = sport
        }

        // Add province/district filter
        if (selectedProvince) {
          // Try to find province code or use name
          const province = provinces.find(p => p.name === selectedProvince)
          if (province) {
            // Add province to address search
            if (!params.address) {
              params.address = selectedProvince
            } else {
              params.address = `${params.address}, ${selectedProvince}`
            }
          }
        }

        if (selectedDistrict) {
          if (!params.address) {
            params.address = selectedDistrict
          } else {
            params.address = `${params.address}, ${selectedDistrict}`
          }
        }

        // Add location-based filter if enabled and user location is available
        if (filterNearby && userLocation && userLocation.latitude && userLocation.longitude) {
          params.lat = userLocation.latitude
          params.lng = userLocation.longitude
          params.maxDistance = maxDistance * 1000 // Convert km to meters
        }

        // Fetch data and wait for minimum loading time
        const [result] = await Promise.all([
          facilityApi.getFacilities(params),
          new Promise(resolve => setTimeout(resolve, minLoadingTime))
        ])
        
        // Calculate remaining time if API was faster than minLoadingTime
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime))
        }
        
        if (result.success && result.data?.facilities) {
          const transformed = result.data.facilities.map(transformFacilityToVenue)
          
          // Apply quick sort (only if not filtering by nearby, as backend already sorts by distance)
          let sorted = [...transformed]
          if (filterNearby && userLocation) {
            // When filtering by nearby, backend already sorts by distance, so keep the order
            sorted = transformed
          } else if (quick === "top") {
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          } else if (quick === "cheap") {
            sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
          } else {
            // Default - sort by createdAt descending (newest first)
            sorted.sort((a, b) => {
              const aDate = new Date(a._original?.createdAt || 0)
              const bDate = new Date(b._original?.createdAt || 0)
              return bDate - aDate
            })
          }
          
          setFacilities(sorted)
          setTotal(result.data.pagination?.total || 0)
        } else {
          setFacilities([])
          setTotal(0)
        }
      } catch (error) {
        console.error('Error fetching facilities:', error)
        toast.error('Không thể tải danh sách cơ sở. Vui lòng thử lại sau.')
        setFacilities([])
        setTotal(0)
      } finally {
        setFacilitiesLoading(false)
        setIsPageLoading(false)
      }
    }

    fetchFacilities()
  }, [query, sport, selectedProvince, selectedDistrict, quick, page, provinces, filterNearby, maxDistance, userLocation])

  const handleBookVenue = (venueId) => {
    navigate(`/booking?venue=${venueId}`)
  }

  const handleClearFilters = () => {
    setSelectedProvince("")
    setSelectedDistrict("")
    setSport("Tất cả")
    setFilterNearby(false)
  }

  const handleToggleNearby = () => {
    if (filterNearby) {
      setFilterNearby(false)
    } else {
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        setFilterNearby(true)
      } else {
        toast.warning('Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí.')
      }
    }
  }

  return (
    <div className="facilities-page">
      <div className="facilities-container">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
        />

        <FilterBar
          provinces={provinces}
          districts={districts}
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          sport={sport}
          onProvinceChange={setSelectedProvince}
          onDistrictChange={setSelectedDistrict}
          onSportChange={setSport}
          onClearFilters={handleClearFilters}
        />

        <ViewControls
          quick={quick}
          view={view}
          onQuickChange={setQuick}
          onViewChange={setView}
          filterNearby={filterNearby}
          onToggleNearby={handleToggleNearby}
          maxDistance={maxDistance}
          onMaxDistanceChange={setMaxDistance}
          userLocation={userLocation}
        />

        <div className="results-count">
          Tìm thấy {total || facilities.length} sân thể thao
        </div>

        {view === "grid" ? (
          <VenueGrid
            facilities={facilities}
            loading={facilitiesLoading || isPageLoading}
            onBookVenue={handleBookVenue}
            userLocation={userLocation}
          />
        ) : (
          <VenueListItem
            facilities={facilities}
            loading={facilitiesLoading || isPageLoading}
            onBookVenue={handleBookVenue}
            userLocation={userLocation}
          />
        )}

        {/* Empty state */}
        {!facilitiesLoading && facilities.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 600 }}>
              Không tìm thấy cơ sở nào
            </p>
            <p style={{ fontSize: '14px' }}>
              Vui lòng thử lại với bộ lọc khác
            </p>
          </div>
        )}

        {/* Pagination */}
        {!facilitiesLoading && total > limit && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '32px',
            padding: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              style={{
                padding: '10px 20px',
                background: page === 1 ? '#e5e7eb' : '#3b82f6',
                color: page === 1 ? '#9ca3af' : '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
                minWidth: '100px'
              }}
              onMouseEnter={(e) => {
                if (page !== 1) {
                  e.target.style.background = '#2563eb'
                }
              }}
              onMouseLeave={(e) => {
                if (page !== 1) {
                  e.target.style.background = '#3b82f6'
                }
              }}
            >
              ← Trước
            </button>
            <span style={{ 
              color: '#6b7280', 
              fontWeight: 600,
              padding: '0 16px',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              Trang {page} / {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= Math.ceil(total / limit)}
              style={{
                padding: '10px 20px',
                background: page >= Math.ceil(total / limit) ? '#e5e7eb' : '#3b82f6',
                color: page >= Math.ceil(total / limit) ? '#9ca3af' : '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: page >= Math.ceil(total / limit) ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
                minWidth: '100px'
              }}
              onMouseEnter={(e) => {
                if (page < Math.ceil(total / limit)) {
                  e.target.style.background = '#2563eb'
                }
              }}
              onMouseLeave={(e) => {
                if (page < Math.ceil(total / limit)) {
                  e.target.style.background = '#3b82f6'
                }
              }}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
