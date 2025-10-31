import React, { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SearchBar from "./Facilities/components/SearchBar"
import FilterBar from "./Facilities/components/FilterBar"
import ViewControls from "./Facilities/components/ViewControls"
import VenueGrid from "./Facilities/components/VenueGrid"
import VenueListItem from "./Facilities/components/VenueListItem"
import { mockFacilities } from "./Facilities/mockData"
import { filterFacilities } from "./Facilities/utils/filters"
import "../../styles/Facilities.css"

export default function Facilities() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [sport, setSport] = useState("Tất cả")
  const [view, setView] = useState("grid")
  const [quick, setQuick] = useState("recent") // recent | cheap | top
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [isPageLoading, setIsPageLoading] = useState(true)

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
        }, 1200)
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
        setSelectedDistrict("")
      }
    } else {
      setDistricts([])
      setSelectedDistrict("")
    }
  }, [selectedProvince, provinces])

  const facilities = useMemo(() => {
    return filterFacilities(mockFacilities, {
      query,
      sport,
      selectedProvince,
      selectedDistrict,
      quick
    })
  }, [query, sport, quick, selectedProvince, selectedDistrict])

  const handleBookVenue = (venueId) => {
    navigate(`/booking?venue=${venueId}`)
  }

  const handleClearFilters = () => {
    setSelectedProvince("")
    setSelectedDistrict("")
  }

  return (
    <div className="facilities-page">
      <div className="facilities-container">
        <SearchBar
          query={query}
          sport={sport}
          onQueryChange={setQuery}
          onSportChange={setSport}
        />

        <FilterBar
          provinces={provinces}
          districts={districts}
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          onProvinceChange={setSelectedProvince}
          onDistrictChange={setSelectedDistrict}
          onClearFilters={handleClearFilters}
        />

        <ViewControls
          quick={quick}
          view={view}
          onQuickChange={setQuick}
          onViewChange={setView}
        />

        <div className="results-count">
          Tìm thấy {facilities.length} sân thể thao
        </div>

        {view === "grid" ? (
          <VenueGrid
            facilities={facilities}
            loading={isPageLoading}
            onBookVenue={handleBookVenue}
          />
        ) : (
          <VenueListItem
            facilities={facilities}
            loading={isPageLoading}
            onBookVenue={handleBookVenue}
          />
        )}
      </div>
    </div>
  )
}
