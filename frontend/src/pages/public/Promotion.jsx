import React, { useState } from 'react'
import PromotionHero from './Promotion/components/PromotionHero'
import FeaturedPromotion from './Promotion/components/FeaturedPromotion'
import PromotionGrid from './Promotion/components/PromotionGrid'
import InfoSection from './Promotion/components/InfoSection'
import { promotions } from './Promotion/constants'
import { copyToClipboard } from './Promotion/utils/helpers'
import '../../styles/Promotion.css'

const Promotion = () => {
  const [copiedCode, setCopiedCode] = useState(null)

  const handleCopy = (code) => {
    copyToClipboard(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleApply = (code) => {
    alert(`Áp dụng mã: ${code}`)
  }

  const currentPromotion = promotions[0]

  return (
    <div className="promotion-page">
      <div className="container">
        <PromotionHero />

        <FeaturedPromotion 
          promotion={currentPromotion}
          onApply={handleApply}
        />

        <PromotionGrid
          promotions={promotions}
          copiedCode={copiedCode}
          onCopy={handleCopy}
          onApply={handleApply}
        />

        <InfoSection />
      </div>
    </div>
  )
}

export default Promotion
