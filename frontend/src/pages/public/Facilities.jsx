import React, { useMemo, useState } from "react";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import VenueCard from "../../component/VenueCard";

const mockFacilities = [
  { id: 6, name: "Sân futsal Bình Tân", sport: "Futsal", city: "TP. HCM", district: "Bình Tân", open: "07:00 - 23:00", price: 280000, rating: 4.8, status: "Còn trống", image: "https://images.unsplash.com/photo-1521417531071-6d1448c1d2e8?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, name: "Sân bóng chuyền Minh Phương", sport: "Bóng chuyền", city: "TP. HCM", district: "Quận 7", open: "06:00 - 21:00", price: 180000, rating: 4.5, status: "Còn trống", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, name: "Sân cầu lông Ngọc Khánh", sport: "Cầu lông", city: "TP. HCM", district: "Quận 5", open: "05:00 - 22:00", price: 150000, rating: 4.7, status: "Còn trống", image: "https://images.unsplash.com/photo-1599134842279-fe807d23316e?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, name: "Sân tennis Vạn Phúc", sport: "Tennis", city: "TP. HCM", district: "Tân Bình", open: "06:00 - 23:00", price: 250000, rating: 4.9, status: "Còn trống", image: "https://images.unsplash.com/photo-1542144582-1ba00456b5d5?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, name: "Sân bóng rổ Hoàng Anh", sport: "Bóng rổ", city: "TP. HCM", district: "Quận 3", open: "07:00 - 21:00", price: 200000, rating: 4.6, status: "Còn trống", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1200&auto=format&fit=crop" },
  { id: 1, name: "Sân bóng đá Thành Công", sport: "Bóng đá", city: "TP. HCM", district: "Quận 1", open: "06:00 - 22:00", price: 300000, rating: 4.8, status: "Còn trống", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop" }
];

const sportChips = ["Tất cả", "Bóng đá", "Cầu lông", "Bóng rổ", "Bóng chuyền", "Tennis", "Futsal"];

export default function Facilities() {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("Tất cả");
  const [view, setView] = useState("grid");
  const [quick, setQuick] = useState("recent"); // recent | cheap | top

  const facilities = useMemo(() => {
    let data = [...mockFacilities];

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(x => x.name.toLowerCase().includes(q) || x.district.toLowerCase().includes(q) || x.city.toLowerCase().includes(q));
    }
    if (sport !== "Tất cả") data = data.filter(x => x.sport === sport);

    if (quick === "top") data.sort((a,b) => b.rating - a.rating);
    else if (quick === "cheap") data.sort((a,b) => a.price - b.price);
    else data.sort((a,b) => b.id - a.id);

    return data;
  }, [query, sport, quick]);

  const QuickButton = ({ value, label }) => (
                            <button
      onClick={() => setQuick(value)}
                                style={{
        border: "1px solid #e5e7eb",
        background: quick === value ? "#111827" : "#fff",
        color: quick === value ? "#fff" : "#111827",
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      {label}
                            </button>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ 
            flex: 1,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
            <FiSearch style={{ color: "#94a3b8" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên sân hoặc khu vực..."
              style={{ border: "none", outline: "none", width: "100%", fontSize: 14 }}
            />
                        </div>
          <select value={sport} onChange={e => setSport(e.target.value)} style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14
          }}>
            {sportChips.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <QuickButton value="recent" label="Gần đây" />
            <QuickButton value="cheap" label="Giá tốt" />
            <QuickButton value="top" label="Đánh giá cao" />
            <div style={{ display: "flex", background: "#e5e7eb", borderRadius: 10, padding: 4 }}>
              <button onClick={() => setView("grid")} style={{
                background: view === "grid" ? "#111827" : "transparent",
                color: view === "grid" ? "#fff" : "#374151",
                border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer"
              }}><FiGrid /></button>
              <button onClick={() => setView("list")} style={{
                background: view === "list" ? "#111827" : "transparent",
                color: view === "list" ? "#fff" : "#374151",
                border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer"
              }}><FiList /></button>
                                                </div>
                                            </div>
                                        </div>
                                        
        <div style={{ marginTop: 18, fontSize: 14, color: "#475569" }}>Tìm thấy {facilities.length} sân thể thao</div>

        {view === "grid" ? (
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {facilities.map(f => (
              <VenueCard
                key={f.id}
                image={f.image}
                name={f.name}
                address={`${f.district}, ${f.city}`}
                rating={f.rating}
                open={f.open}
                price={`${f.price.toLocaleString()} VND/giờ`}
                sport={f.sport}
                status={f.status}
                onBook={() => {}}
              />
            ))}
                                            </div>
        ) : (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            {facilities.map(f => (
              <div key={f.id} style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, overflow: "hidden" }}>
                <VenueCard
                  image={f.image}
                  name={f.name}
                  address={`${f.district}, ${f.city}`}
                  rating={f.rating}
                  open={f.open}
                  price={`${f.price.toLocaleString()} VND/giờ`}
                  sport={f.sport}
                  status={f.status}
                  onBook={() => {}}
                />
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
}