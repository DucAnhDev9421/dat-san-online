import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import PromotionHero from './Promotion/components/PromotionHero'
import PromotionGrid from './Promotion/components/PromotionGrid'
import PromotionSidebar from './Promotion/components/PromotionSidebar'
import InfoSection from './Promotion/components/InfoSection'
import { promotionApi } from '../../api/promotionApi'
import { copyToClipboard } from './Promotion/utils/helpers'
import '../../styles/Promotion.css'

const Promotion = () => {
  const [allPromotions, setAllPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)
  const [filters, setFilters] = useState({
    voucher: false,
    limitedTime: false,
    specialCampaign: false,
  })

  // Transform promotion from API format to component format
  const transformPromotion = (promo) => {
    const now = new Date()
    const endDate = new Date(promo.endDate)
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    const hoursRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60)) % 24

    let validUntil = 'Đã hết hạn'
    if (daysRemaining > 0) {
      validUntil = `${daysRemaining} ngày ${hoursRemaining} giờ`
    } else if (promo.maxUsage === null) {
      validUntil = 'Mãi mãi'
    }

    const discount = promo.discountType === 'percentage' 
      ? `${promo.discountValue}%`
      : `${new Intl.NumberFormat('vi-VN').format(promo.discountValue)}₫`

    // Generate badges based on status and usage
    const badges = []
    if (promo.computedStatus === 'active' && promo.usageCount > 0) {
      badges.push('HOT')
    }
    const daysSinceCreated = Math.floor((now - new Date(promo.createdAt)) / (1000 * 60 * 60 * 24))
    if (daysSinceCreated <= 7) {
      badges.push('MỚI')
    }

    // Generate features from applicableFacilities and applicableAreas
    const features = []
    if (promo.isAllFacilities) {
      features.push('Áp dụng cho tất cả sân')
    } else if (promo.applicableFacilities && promo.applicableFacilities.length > 0) {
      const facilityNames = promo.applicableFacilities
        .map(f => typeof f === 'object' ? f.name : f)
        .slice(0, 2)
      features.push(`Áp dụng cho: ${facilityNames.join(', ')}`)
    }
    if (promo.applicableAreas && promo.applicableAreas.length > 0) {
      features.push(`Khu vực: ${promo.applicableAreas.join(', ')}`)
    }
    if (promo.maxUsage) {
      features.push(`Giới hạn ${promo.maxUsage} lượt sử dụng`)
    }

    // Determine promotion categories
    const isLimitedTime = daysRemaining > 0 && daysRemaining <= 7
    const isSpecialCampaign = badges.includes('HOT') || badges.includes('MỚI')
    const isVoucher = true // All promotions with code are vouchers

    return {
      id: promo._id,
      title: promo.name,
      description: promo.description || promo.name,
      discount,
      icon: null,
      color: '#3b82f6',
      image: promo.image?.url || '/pngtree-sports-poster-background.jpg',
      validUntil,
      code: promo.code,
      usage: {
        current: promo.usageCount || 0,
        total: promo.maxUsage || 1000,
      },
      features: features.length > 0 ? features : ['Áp dụng cho tất cả đơn hàng'],
      badges,
      // Category flags
      isVoucher,
      isLimitedTime,
      isSpecialCampaign,
    }
  }

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        const result = await promotionApi.getPromotions({
          isActive: true,
          limit: 50,
        })

        if (result.success) {
          const transformed = result.data.promotions
            .filter(p => p.computedStatus === 'active' || p.status === 'active')
            .map(transformPromotion)
          setAllPromotions(transformed)
        }
      } catch (error) {
        console.error('Error fetching promotions:', error)
        toast.error('Có lỗi xảy ra khi tải khuyến mãi')
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  // Calculate promotion counts by category
  const promotionCounts = useMemo(() => {
    return {
      voucher: allPromotions.filter(p => p.isVoucher).length,
      limitedTime: allPromotions.filter(p => p.isLimitedTime).length,
      specialCampaign: allPromotions.filter(p => p.isSpecialCampaign).length,
    }
  }, [allPromotions])

  // Filter promotions based on selected filters
  const filteredPromotions = useMemo(() => {
    if (!filters.voucher && !filters.limitedTime && !filters.specialCampaign) {
      // If no filters selected, show all
      return allPromotions
    }

    return allPromotions.filter(promo => {
      if (filters.voucher && promo.isVoucher) return true
      if (filters.limitedTime && promo.isLimitedTime) return true
      if (filters.specialCampaign && promo.isSpecialCampaign) return true
      return false
    })
  }, [allPromotions, filters])

  const handleFilterChange = (filterType, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked,
    }))
  }

  const handleCopy = (code) => {
    copyToClipboard(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
    toast.success('Đã copy mã khuyến mãi!')
  }

  const handleApply = (code) => {
    // Navigate to booking page with promotion code
    window.location.href = `/booking?promo=${code}`
  }

  return (
    <div className="promotion-page">
      <div className="container">
        <PromotionHero />

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            Đang tải khuyến mãi...
          </div>
        ) : (
          <div className="promotion-content-layout">
            {/* Sidebar */}
            <PromotionSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              promotionCounts={promotionCounts}
            />

            {/* Main Content */}
            <div className="promotion-main-content">
              {filteredPromotions.length > 0 ? (
                <PromotionGrid
                  promotions={filteredPromotions}
                  copiedCode={copiedCode}
                  onCopy={handleCopy}
                  onApply={handleApply}
                />
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                  {Object.values(filters).some(f => f) 
                    ? 'Không tìm thấy khuyến mãi nào phù hợp với bộ lọc đã chọn'
                    : 'Hiện tại không có khuyến mãi nào'
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Section - Full width, outside container */}
      {!loading && <InfoSection />}
    </div>
  )
}

export default Promotion
