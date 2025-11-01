import React, { useState, useEffect } from 'react';

const ReportReviewModal = ({ isOpen, onClose, review = {}, onSubmit }) => {
  const [reason, setReason] = useState('inappropriate');
  const [otherText, setOtherText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('inappropriate');
      setOtherText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason === 'other' && !otherText.trim()) {
      return alert('Vui lòng nhập lý do báo cáo');
    }
    onSubmit && onSubmit({ reason, note: otherText.trim() });
    onClose && onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 640, background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Báo cáo đánh giá</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>✕</button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Chọn lý do</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="reason" value="inappropriate" checked={reason === 'inappropriate'} onChange={() => setReason('inappropriate')} />
              <span>Nội dung không phù hợp / xúc phạm</span>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="reason" value="spam" checked={reason === 'spam'} onChange={() => setReason('spam')} />
              <span>Spam / Quảng cáo</span>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="reason" value="false" checked={reason === 'false'} onChange={() => setReason('false')} />
              <span>Nội dung sai sự thật</span>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="reason" value="other" checked={reason === 'other'} onChange={() => setReason('other')} />
              <span>Khác (mô tả lý do)</span>
            </label>
          </div>

          {reason === 'other' && (
            <div style={{ marginTop: 12 }}>
              <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="Mô tả lý do báo cáo" style={{ width: '100%', minHeight: 100, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </div>
          )}

          <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
            <strong>Đánh giá:</strong>
            <div style={{ marginTop: 8, border: '1px solid #f3f4f6', padding: 8, borderRadius: 8, background: '#fafafa' }}>
              <div style={{ fontWeight: 700 }}>{review.customer} • {review.court}</div>
              <div style={{ marginTop: 6 }}>{review.comment}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: 16, borderTop: '1px solid #eee' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Quay lại</button>
          <button onClick={handleSubmit} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Gửi báo cáo</button>
        </div>
      </div>
    </div>
  );
};

export default ReportReviewModal;
