import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validate email
    if (!email) {
      setError('Vui lòng nhập địa chỉ email')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ')
      setLoading(false)
      return
    }

    try {
      // TODO: Implement forgot password API call when backend is ready
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-wrapper">
      <section className="hero hero-slim" />
      <div className="container">
        <div className="auth-card">
          <div className="auth-left">
            <h2>Sport Booking</h2>
            <p>Đặt sân thể thao dễ dàng, tiện lợi</p>
            <div className="auth-illustration" />
          </div>
          <div className="auth-right">
            <Link to="/login" className="back-link" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#666',
              textDecoration: 'none',
              marginBottom: '24px',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}>
              <ArrowLeft size={18} />
              Quay lại đăng nhập
            </Link>

            <h3>Quên mật khẩu</h3>
            <p style={{ 
              color: '#666', 
              fontSize: '14px', 
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
            </p>
            
            {error && (
              <div className="error-message" style={{
                background: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" style={{
                background: '#e8f5e9',
                color: '#2e7d32',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <strong>Email đã được gửi!</strong>
                <br />
                Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={18} 
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }}
                  />
                  <input 
                    className="input" 
                    name="email"
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn" 
                    value={email}
                    onChange={handleInputChange}
                    disabled={loading || success}
                    style={{
                      paddingLeft: '40px'
                    }}
                  />
                </div>
              </div>
              
              <button 
                className="btn btn-dark full" 
                type="submit"
                disabled={loading || success}
                style={{ 
                  opacity: (loading || success) ? 0.7 : 1,
                  marginBottom: '16px'
                }}
              >
                {loading ? 'Đang gửi...' : success ? 'Đã gửi email' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              paddingTop: '16px',
              borderTop: '1px solid #eee'
            }}>
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" style={{
                color: '#333',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword

