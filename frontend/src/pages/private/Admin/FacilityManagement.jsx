import React, { useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

// Mock data (giống bố cục ảnh quản lý sân)
const initData = [
  { id: 1, name: "Sân 1", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 2, name: "Sân 2", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 3, name: "Sân 3", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 4, name: "Sân 4", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 5, name: "Sân 5", capacity: 7, openAt: "07:00", closeAt: "22:00", price: 500000, peakPrice: 600000, status: "Hoạt động" },
  { id: 6, name: "Sân 3 + 2", capacity: 11, openAt: "07:00", closeAt: "22:00", price: 1000000, peakPrice: 1200000, status: "Hoạt động" },
  { id: 7, name: "Sân 3 + 4", capacity: 11, openAt: "07:00", closeAt: "22:00", price: 1000000, peakPrice: 1200000, status: "Hoạt động" },
];

export default function FacilityManagement() {
  const [rows, setRows] = useState(initData);
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  const actionBtn = (bg, label, Icon, onClick) => (
    <button onClick={onClick} title={label}
      style={{ background: bg, border: 0, color: "#fff", borderRadius: 8, padding: 8, marginRight: 6, cursor: "pointer" }}>
      <Icon size={16}/>
    </button>
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý sân bóng</h1>
        <button
          onClick={() => alert("TODO: mở modal tạo sân")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#10b981", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
          <Plus size={16}/> Thêm sân bóng
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <label style={{ marginRight: 8 }}>Show</label>
            <select value={pageSize} onChange={(e)=>{setPageSize(Number(e.target.value)); setPage(1);}} style={{ padding: 6, borderRadius: 8, border: "1px solid #e5e7eb" }}>
              {[5,10,20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ marginLeft: 8 }}>entries</span>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Search:</label>
            <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);}} placeholder="Tên sân…" style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}/>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["#", "Tên", "Số người", "Bắt đầu lúc", "Kết thúc lúc", "Giá/giờ", "Giá/giờ cao điểm", "Tình trạng", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12 }}>{(page-1)*pageSize + idx + 1}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.capacity}</td>
                  <td style={{ padding: 12 }}>{r.openAt}</td>
                  <td style={{ padding: 12 }}>{r.closeAt}</td>
                  <td style={{ padding: 12 }}>{r.price.toLocaleString()}</td>
                  <td style={{ padding: 12 }}>{r.peakPrice.toLocaleString()}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ background: "#e6f9f0", color: "#059669", padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{r.status}</span>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {actionBtn("#06b6d4", "Xem", Eye, ()=>alert("Xem sân " + r.name))}
                    {actionBtn("#22c55e", "Sửa", Pencil, ()=>alert("Sửa " + r.name))}
                    {actionBtn("#ef4444", "Xóa", Trash2, ()=>setRows(rows.filter(x => x.id !== r.id)))}
                  </td>
                </tr>
              ))}
              {!slice.length && (
                <tr><td colSpan={9} style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: 12 }}>
          <div>Showing {(page-1)*pageSize + 1} to {Math.min(page*pageSize, filtered.length)} of {filtered.length} entries</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Previous</button>
            <div style={{ padding: "6px 10px", borderRadius: 8, background: "#10b981", color: "#fff" }}>{page}</div>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
