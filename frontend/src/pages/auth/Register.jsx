import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
            <div className="form-columns">
              <input className="input" placeholder="Tên đầy đủ" />
              <input className="input" placeholder="Số điện thoại" />
            </div>
            <div className="form-group">
              <input className="input" placeholder="Email" />
            </div>
            <div className="form-columns">
              <div className="password-field">
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" />
                <button type="button" className="eye-btn" aria-label="toggle password" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="password-field">
                <input className="input" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" />
                <button type="button" className="eye-btn" aria-label="toggle confirm" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="btn btn-dark full">Đăng ký</button>
            <div className="divider">Hoặc đăng ký với</div>
            <button className="btn btn-light full">Đăng ký với Google</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register

