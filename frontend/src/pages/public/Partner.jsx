import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import PartnerHero from './Partner/components/PartnerHero'
import StatsSection from './Partner/components/StatsSection'
import BenefitsSection from './Partner/components/BenefitsSection'
import HowItWorksSection from './Partner/components/HowItWorksSection'
import RegistrationForm from './Partner/components/RegistrationForm'
import '../../styles/Partner.css'

export default function Partner() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    })
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  const handleScrollToForm = () => {
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="partner-page">
      <PartnerHero onScrollToForm={handleScrollToForm} />

      <StatsSection />

      <BenefitsSection />

      <HowItWorksSection />

      <RegistrationForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
