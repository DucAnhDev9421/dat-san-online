import React from 'react'
import '../../../../styles/Partner.css'

export default function RegistrationForm({ formData, onInputChange, onSubmit }) {
  return (
    <section id="register-form" className="registration-section">
      <div className="form-container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">
            Đăng Ký Trở Thành Đối Tác
          </h2>
          <p className="section-description">
            Điền thông tin bên dưới và chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ
          </p>
        </div>

        <form onSubmit={onSubmit} className="registration-form" data-aos="fade-up" data-aos-delay="200">
          <div className="form-group">
            <label className="form-label">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => onInputChange('name', e.target.value)}
              className="form-input"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => onInputChange('email', e.target.value)}
                className="form-input"
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => onInputChange('phone', e.target.value)}
                className="form-input"
                placeholder="0901234567"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Tên sân thể thao <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.facilityName}
              onChange={e => onInputChange('facilityName', e.target.value)}
              className="form-input"
              placeholder="Sân thể thao XYZ"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Địa chỉ sân <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => onInputChange('address', e.target.value)}
              className="form-input"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
            />
          </div>

          <button type="submit" className="submit-btn">
            Gửi Đăng Ký →
          </button>

          <p className="form-footer">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="form-link">Điều khoản dịch vụ</a> và{' '}
            <a href="#" className="form-link">Chính sách bảo mật</a> của chúng tôi
          </p>
        </form>
      </div>
    </section>
  )
}

