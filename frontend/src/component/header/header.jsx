import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div className="brand">
            <img 
              src="/Logo.png" 
              alt="Booking Sport Logo" 
              className="logo-image"
              style={{ 
                height: "40px", 
                width: "auto",
                objectFit: "contain"
              }}
            />
            <span className="brand-name">Booking sport</span>
          </div>
          <nav className="nav">
            <Link to="/">Trang chủ</Link>
            <a href="/partner">Đối tác</a>
          </nav>
        </div>
        <div className="auth-actions">
          <Link to="/login" className="btn btn-outline">Đăng ký / Đăng nhập</Link>
        </div>
      </div>
    </header>
  )
}

export default Header

