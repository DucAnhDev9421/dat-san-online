import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../../api/authService'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleGoogleRegister = () => {
    setLoading(true)
    try {
      // Same URL as Google login - backend handles account creation automatically
      authService.loginWithGoogle()
    } catch (error) {
      console.error('Google register error:', error)
      setError('Có lỗi xảy ra khi đăng ký Google')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    try {
      // TODO: Implement email registration when backend is ready
      setError('Tính năng đăng ký bằng email chưa được hỗ trợ. Vui lòng sử dụng Google OAuth2.')
    } catch (error) {
      console.error('Register error:', error)
      setError('Đăng ký thất bại. Vui lòng thử lại.')
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
            <div className="tabs">
              <Link to="/login" className="tab">Đăng nhập</Link>
              <Link to="/register" className="tab active">Đăng ký</Link>
            </div>

            <h3>Tạo tài khoản</h3>
            
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
                  name="name"
                  placeholder="Tên đầy đủ *" 
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <input 
                  className="input" 
                  name="email"
                  type="email"
                  placeholder="Email *" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-columns">
                <div className="password-field">
                  <input 
                    className="input" 
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Mật khẩu *" 
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
                <div className="password-field">
                  <input 
                    className="input" 
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'} 
                    placeholder="Nhập lại mật khẩu *" 
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
              </div>
              <button 
                className="btn btn-dark full" 
                type="submit"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>
            
            <div className="divider">Hoặc đăng nhập với</div>
            <button 
              className="btn btn-light full" 
              onClick={handleGoogleRegister}
              disabled={loading}
              style={{ 
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                'Đang chuyển hướng...'
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Đăng nhập với Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register

