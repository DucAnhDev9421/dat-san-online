import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { paymentMethods } from '../constants'
import { getMethodIcon } from '../utils/getMethodIcon'
import '../../../../styles/Payment.css'

export default function PaymentMethods({ selectedMethod, onMethodSelect }) {
  return (
    <div className="payment-methods">
      <h3>Phương thức thanh toán</h3>
      <div className="methods-grid">
        {paymentMethods.map(method => (
          <div
            key={method.id}
            className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => onMethodSelect(method.id)}
          >
            <div className="method-radio">
              <div className="radio-outer">
                {selectedMethod === method.id && <div className="radio-inner" />}
              </div>
            </div>
            
            <div 
              className="method-icon"
              style={{ 
                background: method.id === 'cash' ? '#ffffff' : method.gradient,
                border: method.id === 'cash' ? '2px solid #e5e7eb' : 'none',
                boxShadow: method.id === 'cash' ? 'none' : undefined
              }}
            >
              {getMethodIcon(method)}
            </div>
            
            <div className="method-info">
              <h4>{method.name}</h4>
              <p>{method.description}</p>
            </div>

            {selectedMethod === method.id && (
              <div className="method-badge">
                <FiCheck size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

