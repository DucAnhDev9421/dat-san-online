import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Settings, Handshake, Search, Gift } from 'lucide-react'

function NavigationBar({ user, mobile, onLinkClick, className }) {
  // Kiểm tra nếu user có role owner
  const isOwner = user && user.role === 'owner'
  
  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick()
    }
  }
  
  return (
    <nav className={`nav ${mobile ? 'mobile' : ''} ${className || ''}`} onClick={handleClick}>
      <Link to="/" className="nav-item" onClick={handleClick}>
        <Home size={20} />
        <span>Trang chủ</span>
      </Link>
      <Link to="/facilities" className="nav-item" onClick={handleClick}>
        <Search size={20} />
        <span>Tìm sân</span>
      </Link>
      <Link to="/promotion" className="nav-item" onClick={handleClick}>
        <Gift size={20} />
        <span>Khuyến mãi</span>
      </Link>
      {isOwner ? (
        <Link to="/owner" className="nav-item" onClick={handleClick}>
          <Settings size={20} />
          <span>Quản lý sân</span>
        </Link>
      ) : (
        <a href="/partner" className="nav-item" onClick={handleClick}>
          <Handshake size={20} />
          <span>Đối tác</span>
        </a>
      )}
    </nav>
  )
}

export default NavigationBar

