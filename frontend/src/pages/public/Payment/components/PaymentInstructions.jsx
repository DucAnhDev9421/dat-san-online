import React from 'react'
import { 
  FiSmartphone, 
  FiCreditCard, 
  FiDollarSign, 
  FiShield,
  FiInfo,
  FiAlertTriangle
} from 'react-icons/fi'
import '../../../../styles/Payment.css'

export default function PaymentInstructions({ selectedMethod }) {
  if (!selectedMethod) return null

  const instructions = {
    momo: {
      icon: <FiSmartphone className="instruction-icon" size={32} />,
      title: 'Hướng dẫn thanh toán MoMo',
      steps: [
        'Bấm "Xác nhận thanh toán" để chuyển đến ứng dụng MoMo',
        'Đăng nhập vào ứng dụng MoMo',
        'Xác nhận thông tin giao dịch',
        'Nhập mã PIN để hoàn tất thanh toán'
      ],
      note: {
        icon: <FiInfo size={20} />,
        text: 'Giao dịch được mã hóa và bảo mật tuyệt đối'
      }
    },
    vnpay: {
      icon: <FiCreditCard className="instruction-icon" size={32} />,
      title: 'Hướng dẫn thanh toán VNPay',
      steps: [
        'Bấm "Xác nhận thanh toán" để chuyển đến cổng VNPay',
        'Chọn ngân hàng hoặc ví điện tử',
        'Nhập thông tin thẻ/tài khoản',
        'Xác thực OTP để hoàn tất thanh toán'
      ],
      note: {
        icon: <FiShield size={20} />,
        text: 'Hỗ trợ hơn 40 ngân hàng và ví điện tử tại Việt Nam'
      }
    },
    cash: {
      icon: <FiDollarSign className="instruction-icon" size={32} />,
      title: 'Thanh toán tiền mặt tại sân',
      steps: [
        'Bấm "Xác nhận thanh toán" để hoàn tất đặt sân',
        'Bạn sẽ nhận được mã đặt sân qua SMS/Email',
        'Đến sân đúng giờ đã đặt',
        'Xuất trình mã đặt sân và thanh toán trực tiếp'
      ],
      note: {
        icon: <FiAlertTriangle size={20} />,
        text: 'Vui lòng đến sớm 10 phút và mang theo đủ tiền mặt',
        warning: true
      }
    }
  }

  const instruction = instructions[selectedMethod]
  if (!instruction) return null

  return (
    <div className="payment-info-section">
      <div className={`payment-instructions ${selectedMethod}-info`}>
        <div className="instruction-header">
          {instruction.icon}
          <h4>{instruction.title}</h4>
        </div>
        <ol>
          {instruction.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <div className={`info-note ${instruction.note.warning ? 'warning' : ''}`}>
          {instruction.note.icon}
          <p>{instruction.note.text}</p>
        </div>
      </div>
    </div>
  )
}

