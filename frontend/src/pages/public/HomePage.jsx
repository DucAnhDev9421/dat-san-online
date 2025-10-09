import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Booking sport</h1>
            <p>Đặt sân thể thao dễ dàng, nhanh chóng</p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">Đăng nhập / Đăng ký</Link>
              <button className="btn btn-light">Tải ứng dụng</button>
            </div>
          </div>
        </div>
      </section>

      <section className="search-card">
        <div className="container">
          <h3>Đặt sân thể thao ngay</h3>
          <div className="search-row">
            <input className="input" placeholder="Chọn môn thể thao" />
            <input className="input" placeholder="Tỉnh/Thành phố" />
            <input className="input" placeholder="Quận/Huyện" />
            <button className="btn btn-primary">Tìm kiếm ngay</button>
          </div>
        </div>
      </section>

      <section className="cards">
        <div className="container">
          <div className="section-head">
            <h3>Cơ sở thể thao gần đây</h3>
            <a href="#">Xem tất cả →</a>
          </div>
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <article key={i} className="card">
                <div className="card-thumb">No photo</div>
                <div className="card-body">
                  <h4>Trung tâm thể thao {i + 1}</h4>
                  <p>08:00 - 22:00</p>
                  <button className="btn btn-outline small">Đặt lịch</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage

