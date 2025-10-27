import React, { useMemo, useState, useEffect } from "react";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import VenueCard from "../../components/VenueCard";
import { SkeletonVenueCard, SkeletonVenueCardList } from "../../components/ui/Skeleton";

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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsPageLoading(true);
        const response = await fetch('https://provinces.open-api.vn/api/v1/?depth=2');
        const data = await response.json();
        setProvinces(data);
        // Simulate API loading
        setTimeout(() => {
          setIsPageLoading(false);
        }, 1200);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        setIsPageLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.name === selectedProvince);
      if (province && province.districts) {
        setDistricts(province.districts);
        setSelectedDistrict("");
      }
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedProvince, provinces]);

  const facilities = useMemo(() => {
    let data = [...mockFacilities];

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(x => x.name.toLowerCase().includes(q) || x.district.toLowerCase().includes(q) || x.city.toLowerCase().includes(q));
    }
    if (sport !== "Tất cả") data = data.filter(x => x.sport === sport);
    if (selectedProvince) data = data.filter(x => x.city === selectedProvince);
    if (selectedDistrict) data = data.filter(x => x.district === selectedDistrict);

    if (quick === "top") data.sort((a,b) => b.rating - a.rating);
    else if (quick === "cheap") data.sort((a,b) => a.price - b.price);
    else data.sort((a,b) => b.id - a.id);

    return data;
  }, [query, sport, quick, selectedProvince, selectedDistrict]);

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
        {/* Search Bar Row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
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
              placeholder="Tìm kiếm theo tên sân..."
              style={{ border: "none", outline: "none", width: "100%", fontSize: 14 }}
            />
          </div>
          <select value={sport} onChange={e => setSport(e.target.value)} style={{
            background: "#fff", 
            border: "1px solid #e5e7eb", 
            borderRadius: 10, 
            padding: "10px 12px", 
            fontSize: 14,
            minWidth: 130
          }}>
            {sportChips.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Filter Row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <select 
            value={selectedProvince} 
            onChange={e => setSelectedProvince(e.target.value)}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 14,
              minWidth: 200
            }}
          >
            <option value="">Tất cả Tỉnh/Thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
          <select 
            value={selectedDistrict} 
            onChange={e => setSelectedDistrict(e.target.value)}
            disabled={!selectedProvince}
            style={{
              background: selectedProvince ? "#fff" : "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 14,
              minWidth: 200,
              cursor: selectedProvince ? "pointer" : "not-allowed",
              opacity: selectedProvince ? 1 : 0.6
            }}
          >
            <option value="">Tất cả Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
          {(selectedProvince || selectedDistrict) && (
            <button
              onClick={() => {
                setSelectedProvince("");
                setSelectedDistrict("");
              }}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 14,
                cursor: "pointer",
                color: "#6b7280",
                whiteSpace: "nowrap"
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* View Toggle Row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
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

        {isPageLoading ? (
          view === "grid" ? (
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {[...Array(6)].map((_, i) => (
                <SkeletonVenueCard key={i} />
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(6)].map((_, i) => (
                <SkeletonVenueCardList key={i} />
              ))}
            </div>
          )
        ) : (
          <>
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
              <div key={f.id} style={{ 
                display: "flex", 
                background: "#fff", 
                border: "1px solid #eef2f7", 
                borderRadius: 16, 
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,24,40,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(16,24,40,0.04)";
              }}>
                {/* Image Section */}
                <div style={{ width: 200, height: 150, background: "#f3f4f6", position: "relative", flexShrink: 0 }}>
                  <img 
                    src={f.image} 
                    alt={f.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  <span style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#111827",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                    ★ {f.rating}
                  </span>
                </div>
                
                {/* Content Section */}
                <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    {/* Tags */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: 999 }}>
                        {f.sport}
                      </span>
                      <span style={{ fontSize: 12, color: "#10b981", background: "#ecfdf5", padding: "2px 8px", borderRadius: 999 }}>
                        {f.status}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                      {f.name}
                    </h3>
                    
                    {/* Address */}
                    <div style={{ fontSize: 14, color: "#6b7280", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      📍 {f.district}, {f.city}
                    </div>
                    
                    {/* Hours */}
                    <div style={{ fontSize: 14, color: "#6b7280", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      🕒 {f.open}
                    </div>
                  </div>
                  
                  {/* Bottom Section */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      💰 {f.price.toLocaleString()} VND/giờ
                    </div>
                    <button 
                      onClick={() => {}}
                      style={{ 
                        background: "#111827", 
                        color: "#fff", 
                        fontWeight: 700, 
                        border: "none", 
                        borderRadius: 10, 
                        padding: "10px 16px", 
                        cursor: "pointer",
                        fontSize: 14
                      }}
                    >
                      Đặt sân ngay
                    </button>
                  </div>
                </div>
              </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}