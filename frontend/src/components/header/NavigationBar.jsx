import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Settings, Handshake, Search, Gift, Trophy, Plus, List } from 'lucide-react'

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
      <div className="nav-item-dropdown">
        <div className="nav-item nav-item-with-dropdown">
          <Trophy size={20} />
          <span>Giải đấu</span>
        </div>
        <div className="tournament-dropdown">
          <Link to="/tournament/create" className="dropdown-item" onClick={handleClick}>
            <Plus size={18} />
            <span>Tạo giải đấu</span>
          </Link>
          <Link to="/tournament" className="dropdown-item" onClick={handleClick}>
            <List size={18} />
            <span>Tìm giải đấu</span>
          </Link>
        </div>
      </div>
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

