import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <span className="logo-circle" />
          <span className="brand-name">Booking sport</span>
        </div>
        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <a href="#">Đặt sân</a>
          <a href="#">Liên hệ</a>
        </nav>
        <div className="auth-actions">
          <Link to="/login" className="btn btn-outline">Đăng ký / Đăng nhập</Link>
        </div>
      </div>
    </header>
  )
}

export default Header

