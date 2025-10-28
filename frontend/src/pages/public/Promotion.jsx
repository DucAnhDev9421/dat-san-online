import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Gift, Zap, TrendingUp, Star, Tag, Clock, CheckCircle, Flame, Copy, Percent } from 'lucide-react'

const Promotion = () => {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const promotions = [
    {
      id: 1,
      title: 'Giảm 50% đặt sân đầu tiên',
      description: 'Ưu đãi đặc biệt dành cho thành viên mới',
      discount: '50%',
      icon: Gift,
      color: '#3b82f6',
      image: '/pngtree-sports-poster-background.jpg',
      validUntil: '33 ngày 13 giờ',
      code: 'FIRST50',
      usage: { current: 342, total: 1000 },
      features: ['Áp dụng cho khách hàng mới', 'Giảm tối đa 200,000₫'],
      badges: ['HOT', 'MỚI']
    },
    {
      id: 2,
      title: 'Giảm 30% đặt sân cuối tuần',
      description: 'Đặt sân vào thứ 7, Chủ nhật và nhận giảm giá',
      discount: '30%',
      icon: Clock,
      color: '#ef4444',
      image: '/sports-meeting.webp',
      validUntil: '28 ngày 5 giờ',
      code: 'WEEKEND30',
      usage: { current: 156, total: 500 },
      features: ['Áp dụng cho cuối tuần', 'Tối đa 3 giờ/sân'],
      badges: ['HOT']
    },
    {
      id: 3,
      title: 'Tặng 1 giờ chơi miễn phí',
      description: 'Đặt sân 3 giờ được tặng thêm 1 giờ',
      discount: '1h',
      icon: Star,
      color: '#f59e0b',
      image: '/all-sports-banner.webp',
      validUntil: '45 ngày 22 giờ',
      code: 'FREE1H',
      usage: { current: 89, total: 200 },
      features: ['Áp dụng cho đơn từ 3 giờ', 'Chỉ áp dụng giờ off-peak'],
      badges: ['MỚI']
    },
    {
      id: 4,
      title: 'Member VIP - Giảm 20% mãi mãi',
      description: 'Đăng ký thành viên VIP cho giảm giá trọn đời',
      discount: '20%',
      icon: TrendingUp,
      color: '#8b5cf6',
      image: '/sports-meeting.webp',
      validUntil: 'Mãi mãi',
      code: 'VIP20',
      usage: { current: 523, total: 1000 },
      features: ['Phí đăng ký: 500.000đ', 'Giảm 20% mọi đơn hàng'],
      badges: []
    }
  ]

  const currentPromotion = promotions[0]

  return (
    <div className="promotion-page" style={{ padding: '24px 0 48px' }}>
      <div className="container">
        {/* Hero Banner Section */}
        <div style={{ 
          backgroundImage: 'url(/all-sports-banner.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '48px',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.8))' 
          }} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 20px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px', color: 'white' }}>
              Chương Trình Khuyến Mãi
            </h1>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.95)', maxWidth: '700px', margin: '0 auto' }}>
              Những ưu đãi đặc biệt dành cho bạn. Đặt sân ngay hôm nay để nhận nhiều phần quà hấp dẫn!
            </p>
          </div>
        </div>

        {/* Featured Promotion Alert */}
        <div style={{ marginBottom: '32px' }}>
          <Alert style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '2px solid #f59e0b', borderRadius: '12px', padding: '20px' }}>
            <Zap style={{ color: '#f59e0b' }} />
            <AlertTitle style={{ fontSize: '20px', fontWeight: '700', color: '#d97706' }}>
              Khuyến mãi nổi bật trong tháng
            </AlertTitle>
            <AlertDescription style={{ color: '#92400e', fontSize: '16px', marginTop: '8px' }}>
              {currentPromotion.title} - Mã: <strong>{currentPromotion.code}</strong>
            </AlertDescription>
            <button
              onClick={() => alert(`Áp dụng mã: ${currentPromotion.code}`)}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 14px rgba(245, 158, 11, 0.4)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <Tag size={16} /> Áp dụng ngay
            </button>
          </Alert>
        </div>

        {/* Promotions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px', marginBottom: '48px' }}>
          {promotions.map((promo) => {
            const usagePercent = (promo.usage.current / promo.usage.total) * 100
            return (
              <Card key={promo.id} style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                overflow: 'hidden', 
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }} 
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' 
              }}>
                {/* Image Header */}
                <div style={{ 
                  position: 'relative',
                  height: '180px',
                  backgroundImage: `url(${promo.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {/* Gradient Overlay */}
                  <div style={{ 
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))'
                  }} />
                  
                  {/* Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 10
                  }}>
                    {promo.badges.map((badge, idx) => (
                      <Badge 
                        key={idx}
                        variant="default"
                        className={badge === 'HOT' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-lg' : 'bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg'}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {badge === 'HOT' ? <Flame size={14} /> : <Star size={14} />}
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Discount Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '800',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    zIndex: 10
                  }}>
                    {promo.discount}
                  </span>
                </div>

                <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Title */}
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#111827',
                    lineHeight: '1.3'
                  }}>
                    {promo.title}
                  </div>

                  {/* Description */}
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {promo.description}
                  </div>

                  {/* Timer */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <Clock size={16} />
                    <span>{promo.validUntil}</span>
                  </div>

                  {/* Usage Progress */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px',
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      <span>Đã sử dụng</span>
                      <span style={{ fontWeight: '600', color: '#374151' }}>
                        {promo.usage.current}/{promo.usage.total}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${usagePercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* Conditions Section */}
                  <div style={{
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#111827',
                      marginBottom: '12px'
                    }}>
                      Điều kiện:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {promo.features.map((feature, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          fontSize: '13px',
                          color: '#374151'
                        }}>
                          <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div style={{
                    background: '#f9fafb',
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} style={{ color: '#6b7280' }} />
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: '700', 
                        letterSpacing: '1px',
                        color: '#111827'
                      }}>
                        {promo.code}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      style={{
                        padding: '6px 12px',
                        background: copiedCode === promo.code ? '#10b981' : '#f3f4f6',
                        color: copiedCode === promo.code ? 'white' : '#6b7280',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Copy size={14} />
                      {copiedCode === promo.code ? 'Đã copy' : 'Copy'}
                    </button>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => alert(`Áp dụng mã: ${promo.code}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #111827, #1f2937)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(17, 24, 39, 0.2)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #1f2937, #374151)'
                      e.target.style.boxShadow = '0 6px 20px rgba(17, 24, 39, 0.3)'
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #111827, #1f2937)'
                      e.target.style.boxShadow = '0 4px 12px rgba(17, 24, 39, 0.2)'
                      e.target.style.transform = 'translateY(0)'
                    }}
                  >
                    <Gift size={18} />
                    Sử dụng ngay
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Section */}
        <Card style={{ marginTop: '48px' }}>
          <CardHeader>
            <CardTitle style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Gift style={{ color: '#10b981' }} /> 
              Hướng dẫn sử dụng mã khuyến mãi
            </CardTitle>
            <CardDescription style={{ fontSize: '16px', marginTop: '20px' }}>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', fontWeight: '700', color: 'white' }}>
                  1
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Chọn sân và thời gian</h3>
                <p style={{ color: '#6b7280' }}>Chọn sân thể thao yêu thích và khung giờ phù hợp với bạn</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', fontWeight: '700', color: 'white' }}>
                  2
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Nhập mã khuyến mãi</h3>
                <p style={{ color: '#6b7280' }}>Tìm ô nhập mã khuyến mãi và nhập code nhận được từ chương trình</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', fontWeight: '700', color: 'white' }}>
                  3
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Hoàn tất đặt sân</h3>
                <p style={{ color: '#6b7280' }}>Xác nhận thông tin và thanh toán để hoàn tất đặt sân với giá ưu đãi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Promotion

