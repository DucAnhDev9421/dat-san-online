import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

// Modal to set maintenance note/period for a court
const MaintenanceCourtModal = ({ isOpen, onClose, court = {}, onConfirm }) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen && court) {
      setNote(court.maintenance || "");
    }
    if (!isOpen) setNote("");
  }, [isOpen, court]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof onConfirm === "function") onConfirm({ ...court, maintenance: note, status: "maintenance" });
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 18, borderBottom: "1px solid #eee" }}>
          <div style={{ fontWeight: 700 }}>Đặt lịch bảo trì</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer" }} aria-label="Đóng"><X size={20} /></button>
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>Sân</div>
            <div style={{ fontWeight: 700 }}>{court.name}</div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Ghi chú / Khoảng thời gian bảo trì</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} placeholder="VD: Bảo trì từ 20/01/2025 đến 25/01/2025" />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8, background: "#fff", border: "1px solid #e5e7eb" }}>Hủy</button>
            <button onClick={handleSave} style={{ padding: "8px 12px", borderRadius: 8, background: "#f59e0b", color: "#fff", border: 0, display: "inline-flex", alignItems: "center", gap: 8 }}><Save size={14} /> Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCourtModal;
