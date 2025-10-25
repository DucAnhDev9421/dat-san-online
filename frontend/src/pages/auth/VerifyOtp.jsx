import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../api/authService'
import { useAuth } from '../../contexts/AuthContext'

function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const email = location.state?.email || ''
  const message = location.state?.message || ''

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only numbers, max 6 digits
    setOtp(value)
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 số OTP')
      setLoading(false)
      return
    }

    try {
      const result = await authService.verifyOtp(email, otp)
      
      if (result.success) {
        // OTP verified successfully - redirect to login
        navigate('/login', { 
          state: { 
            message: 'Xác thực thành công! Vui lòng đăng nhập.',
            email: email
          }
        })
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      setError(error.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    
    setResendLoading(true)
    setError('')

    try {
      // Re-register to get new OTP
      const result = await authService.register({
        name: 'Temp User', // We don't have the name here, backend will handle
        email: email,
        password: 'temp123' // Temporary password, backend will ignore for existing users
      })
      
      if (result.success) {
        setCountdown(60) // 60 seconds countdown
        setError('')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError(error.message || 'Không thể gửi lại OTP. Vui lòng thử lại.')
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) {
    return (
      <main className="auth-wrapper">
        <section className="hero hero-slim" />
        <div className="container">
          <div className="auth-card">
            <div className="auth-right">
              <h3>Lỗi</h3>
              <p>Không tìm thấy email để xác thực.</p>
              <Link to="/register" className="btn btn-dark full">
                Quay lại đăng ký
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
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
            <h3>Xác thực tài khoản</h3>
            
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Chúng tôi đã gửi mã OTP đến email <strong>{email}</strong>
            </p>

            {message && (
              <div className="success-message" style={{
                background: '#d4edda',
                color: '#155724',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {message}
              </div>
            )}
            
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

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  className="input" 
                  name="otp"
                  type="text"
                  placeholder="Nhập mã OTP (6 số)" 
                  value={otp}
                  onChange={handleOtpChange}
                  disabled={loading}
                  style={{ 
                    textAlign: 'center',
                    fontSize: '18px',
                    letterSpacing: '2px'
                  }}
                />
              </div>
              
              <button 
                className="btn btn-dark full" 
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{ opacity: (loading || otp.length !== 6) ? 0.7 : 1 }}
              >
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                Không nhận được mã OTP?
              </p>
              <button 
                className="btn btn-light" 
                onClick={handleResendOtp}
                disabled={resendLoading || countdown > 0}
                style={{ 
                  opacity: (resendLoading || countdown > 0) ? 0.7 : 1,
                  fontSize: '14px'
                }}
              >
                {resendLoading ? 'Đang gửi...' : 
                 countdown > 0 ? `Gửi lại sau ${countdown}s` : 
                 'Gửi lại mã OTP'}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{ color: '#666', fontSize: '14px' }}>
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default VerifyOtp
