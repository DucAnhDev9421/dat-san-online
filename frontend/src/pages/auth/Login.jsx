import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
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
              <Link to="/login" className="tab active">Đăng nhập</Link>
              <Link to="/register" className="tab">Đăng ký</Link>
            </div>

            <h3>Đăng nhập tài khoản</h3>
            <div className="form-group">
              <input className="input" placeholder="Nhập số điện thoại hoặc email" />
            </div>
            <div className="form-group password-field">
              <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" />
              <button type="button" className="eye-btn" aria-label="toggle password" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="btn btn-dark full">Đăng nhập</button>
            <div className="row-between">
              <span />
              <a href="#">Quên mật khẩu</a>
            </div>
            <div className="divider">Hoặc đăng nhập với</div>
            <button className="btn btn-light full">Đăng nhập với Google</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login

