import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="container" style={{ padding: '48px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 48 }}>404</h1>
        <p style={{ color: '#6b7280', marginTop: 8 }}>Trang bạn tìm không tồn tại.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>Về trang chủ</Link>
      </div>
    </main>
  )
}

export default NotFound

