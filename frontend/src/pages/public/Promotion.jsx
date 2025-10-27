import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Gift, Zap, TrendingUp, Star, Tag, Clock, CheckCircle } from 'lucide-react'

const Promotion = () => {
  const promotions = [
    {
      id: 1,
      title: 'Giảm 50% cho đặt sân cuối tuần',
      description: 'Áp dụng cho tất cả các sân bóng đá, tennis, cầu lông. Đặt sân vào thứ 7, Chủ nhật.',
      discount: '50%',
      icon: Gift,
      color: 'bg-red-500',
      image: '/sports-meeting.webp',
      validUntil: '31/12/2024',
      code: 'CUOITUAN50',
      features: ['Áp dụng cho khung giờ từ 15:00 - 22:00', 'Tối đa 2 giờ/sân', 'Không áp dụng chung voucher khác']
    },
    {
      id: 2,
      title: 'Giảm 30% đặt sân theo giờ',
      description: 'Đặt sân trước 1 ngày và được giảm 30% giá trị hóa đơn.',
      discount: '30%',
      icon: Clock,
      color: 'bg-blue-500',
      image: '/all-sports-banner.webp',
      validUntil: '31/12/2024',
      code: 'SOM30',
      features: ['Đặt sân trước 24h', 'Áp dụng cho tất cả khung giờ', 'Không giới hạn số lần sử dụng']
    },
    {
      id: 3,
      title: 'Tặng 1 giờ chơi miễn phí',
      description: 'Đặt sân 3 giờ liên tiếp được tặng thêm 1 giờ chơi miễn phí.',
      discount: '1h',
      icon: Star,
      color: 'bg-yellow-500',
      image: '/pngtree-sports-poster-background.jpg',
      validUntil: '28/02/2025',
      code: 'TANG1H',
      features: ['Áp dụng cho đơn từ 3 giờ trở lên', 'Chỉ áp dụng vào giờ off-peak', 'Phải đặt trực tiếp']
    },
    {
      id: 4,
      title: 'Member VIP - Giảm 20% mãi mãi',
      description: 'Đăng ký thành viên VIP để nhận giảm 20% cho mọi đặt sân.',
      discount: '20%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      image: '/sports-meeting.webp',
      validUntil: 'Mãi mãi',
      code: 'VIP20',
      features: ['Phí đăng ký: 500.000đ', 'Giảm 20% mọi đơn hàng', 'Quà tặng sinh nhật hàng năm']
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {promotions.map((promo) => {
            const IconComponent = promo.icon
            return (
              <Card key={promo.id} style={{ 
                overflow: 'hidden', 
                transition: 'all 0.3s', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }} 
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)' }}>
                <CardHeader style={{ 
                  backgroundImage: `url(${promo.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative', 
                  minHeight: '200px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 0
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))' 
                  }} />
                  <div style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    right: '16px',
                    fontSize: '20px',
                    fontWeight: '800',
                    padding: '10px 20px',
                    background: 'white',
                    color: promo.color,
                    zIndex: 2,
                    borderRadius: '25px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    -{promo.discount}
                  </div>
                  <IconComponent size={48} style={{ color: 'white', zIndex: 1 }} />
                </CardHeader>
                <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardTitle style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                    {promo.title}
                  </CardTitle>
                  <CardDescription style={{ fontSize: '16px', color: '#6b7280', marginBottom: '20px' }}>
                    {promo.description}
                  </CardDescription>
                  
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Mã khuyến mãi:</span>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '700', 
                        letterSpacing: '2px', 
                        background: 'linear-gradient(135deg, #10b981, #059669)', 
                        color: 'white', 
                        padding: '8px 16px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                      }}>
                        {promo.code}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Hiệu lực đến:</span>
                      <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>{promo.validUntil}</span>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
                    {promo.features.map((feature, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: '#374151' }}>
                        <CheckCircle size={16} style={{ color: '#10b981', marginRight: '8px' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter style={{ padding: '0 24px 24px 24px', marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => alert(`Áp dụng mã: ${promo.code}`)}
                    style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)'
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)'
                      e.target.style.transform = 'translateY(0)'
                    }}
                  >
                    Sử dụng mã này
                  </button>
                </CardFooter>
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

