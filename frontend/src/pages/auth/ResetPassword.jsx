import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState(true)

  useEffect(() => {
    // Validate token exists
    if (!token) {
      setTokenValid(false)
      setError('Token không hợp lệ hoặc đã hết hạn')
    }
    // TODO: Validate token with backend when API is ready
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords
    if (!formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp')
      setLoading(false)
      return
    }

    try {
      // TODO: Implement reset password API call when backend is ready
      // await authService.resetPassword(token, formData.password)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
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
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#fee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#c33',
                  fontSize: '24px'
                }}>
                  ✕
                </div>
                <h3 style={{ marginBottom: '12px' }}>Link không hợp lệ</h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                  Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                </p>
                <Link to="/forgot-password" className="btn btn-dark" style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  marginBottom: '12px'
                }}>
                  Yêu cầu link mới
                </Link>
                <br />
                <Link to="/login" style={{
                  color: '#666',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}>
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (success) {
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
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#2e7d32'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ marginBottom: '12px' }}>Đặt lại mật khẩu thành công!</h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                  Mật khẩu của bạn đã được thay đổi thành công.
                  <br />
                  Bạn sẽ được chuyển đến trang đăng nhập...
                </p>
                <Link to="/login" className="btn btn-dark" style={{
                  display: 'inline-block',
                  textDecoration: 'none'
                }}>
                  Đăng nhập ngay
                </Link>
              </div>
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
            <h3>Đặt lại mật khẩu</h3>
            <p style={{ 
              color: '#666', 
              fontSize: '14px', 
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
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

            <form onSubmit={handleSubmit}>
              <div className="form-group password-field">
                <input 
                  className="input" 
                  name="password"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" 
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  aria-label="toggle password" 
                  onClick={() => setShowPassword(v => !v)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="form-group password-field">
                <input 
                  className="input" 
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'} 
                  placeholder="Nhập lại mật khẩu mới" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  aria-label="toggle confirm" 
                  onClick={() => setShowConfirm(v => !v)}
                  disabled={loading}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div style={{ 
                  fontSize: '12px', 
                  marginBottom: '16px',
                  color: '#666'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ 
                      color: formData.password.length >= 6 ? '#2e7d32' : '#999' 
                    }}>
                      {formData.password.length >= 6 ? '✓' : '○'}
                    </span>
                    Ít nhất 6 ký tự
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px'
                  }}>
                    <span style={{ 
                      color: formData.password === formData.confirmPassword && formData.confirmPassword ? '#2e7d32' : '#999' 
                    }}>
                      {formData.password === formData.confirmPassword && formData.confirmPassword ? '✓' : '○'}
                    </span>
                    Mật khẩu khớp nhau
                  </div>
                </div>
              )}
              
              <button 
                className="btn btn-dark full" 
                type="submit"
                disabled={loading}
                style={{ 
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '16px'
                }}
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              paddingTop: '16px',
              borderTop: '1px solid #eee'
            }}>
              Nhớ mật khẩu?{' '}
              <Link to="/login" style={{
                color: '#333',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ResetPassword

