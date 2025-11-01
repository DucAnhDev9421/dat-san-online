import React, { useState, useEffect } from 'react';

const ReplyReviewModal = ({ isOpen, onClose, review = {}, onSubmit }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    // Prefill with a friendly template if none
    if (isOpen) {
      setText((prev) => prev || 'Cảm ơn bạn đã đánh giá! Chúng tôi sẽ cải thiện...');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = (text || '').trim();
    if (!trimmed) return alert('Vui lòng nhập nội dung phản hồi');
    onSubmit && onSubmit(trimmed);
    onClose && onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 720, background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Phản hồi đánh giá</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>✕</button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Đánh giá gốc</div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, background: '#f9fafb' }}>
            <div style={{ fontWeight: 700 }}>{review.customer} • {review.court}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{review.comment}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>{review.date}</div>
          </div>

          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Nội dung phản hồi</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cảm ơn bạn đã đánh giá! Chúng tôi sẽ cải thiện..."
            style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: 16, borderTop: '1px solid #eee' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Hủy</button>
          <button onClick={handleSubmit} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0ea5a9', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Gửi phản hồi</button>
        </div>
      </div>
    </div>
  );
};

export default ReplyReviewModal;
