import React, { useEffect, useState } from "react";

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBox = {
  width: 560,
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 10px 40px rgba(2,6,23,0.15)",
};

const ScheduleMaintenanceModal = ({ isOpen, onClose, court, onConfirm }) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isTimepickerOpen, setIsTimepickerOpen] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState("start");
  const [selectedSlot, setSelectedSlot] = useState("12:00");
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [selectedCalDate, setSelectedCalDate] = useState("");

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const weekdayOf = (y, m, d) => new Date(y, m, d).getDay();

  useEffect(() => {
    if (isOpen && court) {
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setNote("");
      setError("");
    }
  }, [isOpen, court]);

  if (!isOpen) return null;

  const handleSave = () => {
    setError("");
    if (startDate && endDate) {
      const start = new Date(`${startDate}T${startTime || "00:00"}`);
      const end = new Date(`${endDate}T${endTime || "23:59"}`);
      if (end < start) {
        setError("Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu.");
        return;
      }
    }

    let parts = [];
    if (startDate) parts.push(`từ ${startDate}${startTime ? ` ${startTime}` : ""}`);
    if (endDate) parts.push(`đến ${endDate}${endTime ? ` ${endTime}` : ""}`);
    const when = parts.length ? parts.join(" ") : "";
    const maintenanceText = when ? `Bảo trì ${when}${note ? ` — ${note}` : ""}` : `${note || "Bảo trì"}`;

    const updated = { ...court, maintenance: maintenanceText || "Đang bảo trì", status: "maintenance" };
    if (onConfirm) onConfirm(updated);
    if (onClose) onClose();
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Lên lịch bảo trì</h3>
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>Sân: {court?.name || "-"}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Ngày bắt đầu</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Giờ bắt đầu (tùy chọn)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <button
                type="button"
                onClick={() => {
                  setTimePickerTarget("start");
                  setSelectedSlot(startTime || "12:00");
                  const sd = startDate || new Date().toISOString().slice(0,10);
                  setSelectedCalDate(sd);
                  const dt = new Date(sd);
                  setCalMonth(dt.getMonth());
                  setCalYear(dt.getFullYear());
                  setIsTimepickerOpen(true);
                }}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
              >
                Chọn
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Ngày kết thúc</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Giờ kết thúc (tùy chọn)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <button
                type="button"
                onClick={() => {
                  setTimePickerTarget("end");
                  setSelectedSlot(endTime || "12:00");
                  const ed = endDate || new Date().toISOString().slice(0,10);
                  setSelectedCalDate(ed);
                  const dt2 = new Date(ed);
                  setCalMonth(dt2.getMonth());
                  setCalYear(dt2.getFullYear());
                  setIsTimepickerOpen(true);
                }}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
              >
                Chọn
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Ghi chú (tùy chọn)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lý do bảo trì, phần việc, người phụ trách..." style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }} />
        </div>

        {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
          <button onClick={() => onClose && onClose()} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Đóng</button>
          <button onClick={handleSave} style={{ padding: "8px 12px", borderRadius: 8, border: 0, background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Lưu</button>
        </div>

        {/* Timepicker modal (embedded) */}
        {isTimepickerOpen && (
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
            <div style={{ background: "rgba(0,0,0,0.45)", position: "absolute", inset: 0 }} onClick={() => setIsTimepickerOpen(false)} />
            <div style={{ position: "relative", width: "360px", background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 30px 60px rgba(2,6,23,0.18)", zIndex: 10001 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <button onClick={() => { const nm = new Date(calYear, calMonth - 1); setCalMonth(nm.getMonth()); setCalYear(nm.getFullYear()); }} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 18, padding: 6 }} aria-label="Prev month">←</button>
                <div style={{ fontWeight: 800, fontSize: 16, padding: '6px 12px', borderRadius: 8, background: '#fff' }}>{new Date(calYear, calMonth).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
                <button onClick={() => { const nm = new Date(calYear, calMonth + 1); setCalMonth(nm.getMonth()); setCalYear(nm.getFullYear()); }} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 18, padding: 6 }} aria-label="Next month">→</button>
              </div>

              {/* Calendar */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', color: '#9ca3af', fontSize: 12, marginBottom: 8 }}>
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ padding: 4 }}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {(() => {
                    const days = [];
                    const firstWeekday = weekdayOf(calYear, calMonth, 1); // 0..6
                    const total = daysInMonth(calYear, calMonth);
                    for (let i = 0; i < firstWeekday; i++) days.push(null);
                    for (let d = 1; d <= total; d++) days.push(d);
                    return days.map((d, idx) => {
                      if (d === null) return <div key={idx} />;
                      const iso = new Date(calYear, calMonth, d).toISOString().slice(0,10);
                      const isSelected = selectedCalDate === iso;
                      return (
                        <button key={iso} onClick={() => setSelectedCalDate(iso)} style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 8, border: isSelected ? '2px solid #2563eb' : '1px solid transparent', background: isSelected ? '#ffffff' : 'transparent', cursor: 'pointer', boxShadow: isSelected ? '0 12px 30px rgba(37,99,235,0.12)' : 'none', color: isSelected ? '#2563eb' : '#111827', fontWeight: 600 }}>{d}</button>
                      )
                    })
                  })()}
                </div>
              </div>

              {/* Time slots under calendar */}
              <div style={{ fontSize: 13, marginBottom: 8, color: '#6b7280', fontWeight: 600 }}>Pick your time</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                {[
                  ['10:00','10:00 AM'],['10:30','10:30 AM'],['11:00','11:00 AM'],
                  ['11:30','11:30 AM'],['12:00','12:00 PM'],['12:30','12:30 PM'],
                  ['13:00','01:00 PM'],['13:30','01:30 PM'],['14:00','02:00 PM'],
                  ['14:30','02:30 PM'],['15:00','03:00 PM'],['15:30','03:30 PM']
                ].map(([val,label]) => {
                  const active = selectedSlot === val;
                  return (
                    <button key={val} onClick={() => setSelectedSlot(val)} style={{ padding: '10px 8px', borderRadius: 12, border: active ? '2px solid #2563eb' : '1px solid #e6e9ef', background: '#fff', cursor: 'pointer', boxShadow: active ? '0 10px 30px rgba(37,99,235,0.12)' : '0 2px 8px rgba(15,23,42,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-pressed={active}>
                      <div style={{ fontSize: 13, color: active ? '#2563eb' : '#374151', fontWeight: 700 }}>{label}</div>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={() => { setIsTimepickerOpen(false); }} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Discard</button>
                <button type="button" onClick={() => {
                  // apply selected date/time to target
                  if (selectedCalDate) {
                    if (timePickerTarget === 'start') setStartDate(selectedCalDate);
                    else setEndDate(selectedCalDate);
                  }
                  if (timePickerTarget === "start") setStartTime(selectedSlot);
                  else setEndTime(selectedSlot);
                  setIsTimepickerOpen(false);
                }} style={{ padding: "10px 18px", borderRadius: 12, border: 0, background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 800, boxShadow: '0 10px 30px rgba(37,99,235,0.18)' }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleMaintenanceModal;
