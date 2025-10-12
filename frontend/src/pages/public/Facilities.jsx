//Trang danh sách sân
import React, { useState } from "react";

// Dữ liệu mẫu
const fieldTypes = [
    { name: "Bóng đá", icon: "🌱", color: "#bbf7d0" },
    { name: "Cầu lông", icon: "🚫", color: "#dbeafe" },
    { name: "Bóng rổ", icon: "🛒", color: "#fef3c7" },
    { name: "Bóng bàn", icon: "🟪", color: "#ede9fe" },
    { name: "Tennis", icon: "🚗", color: "#fef9c3" },
];

const facilities = [
    {
        id: 1,
        name: "Phát Lê",
        address: "TP.HCM",
        open: "06:00 - 23:00",
        distance: "0 km",
        price: "200,000đ",
        type: "Bóng đá",
        rating: 4.5,
        image: "",
    },
    {
        id: 2,
        name: "0092_ Nguyễn Trần Đức Anh",
        address: "TP.HCM",
        open: "06:00 - 23:00",
        distance: "0 km",
        price: "200,000đ",
        type: "Bóng đá",
        rating: 4.5,
        image: "",
    },
    {
        id: 3,
        name: "Lê Ngọc Hào",
        address: "TP.HCM",
        open: "06:00 - 23:00",
        distance: "0 km",
        price: "200,000đ",
        type: "Bóng đá",
        rating: 4.5,
        image: "",
    },
];

const distances = ["1km", "3km", "5km", "10km", "20km+"];

export default function Facilities() {
    const [selectedType, setSelectedType] = useState("Bóng đá");
    const [selectedDistance, setSelectedDistance] = useState("5km");
    const [search, setSearch] = useState("");

    return (
        <div style={{ background: "#fafbfc", minHeight: "100vh", fontFamily: "Inter, Arial, sans-serif" }}>
            {/* Header */}
            <h1
                style={{
                    textAlign: "center",
                    color: "#15803d", // text-green-700
                    fontWeight: 700,  // font-bold
                    fontSize: "1.5rem", // text-2xl
                    marginBottom: "0.5rem", // mb-2
                    marginTop: 28,
                    letterSpacing: 0.5,
                    lineHeight: 1.2,
                }}
            >
                Tìm Kiếm Sân Thể Thao
            </h1>
            <div style={{ textAlign: "center", color: "#374151", fontSize: 16, marginBottom: 18 }}>
                Tìm và đặt sân bóng đá, cầu lông, bóng rổ, bóng bàn và nhiều loại sân khác với giao diện hiện đại và dễ sử dụng
            </div>
            {/* Search bar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên sân, địa điểm, loại sân..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: 480,
                        padding: "12px 18px",
                        borderRadius: 12,
                        border: "1px solid #d1d5db",
                        fontSize: 15,
                        marginRight: 8,
                        outline: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        background: "#fff",
                        transition: "box-shadow 0.2s"
                    }}
                />
                <button style={{
                    background: "#16a34a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    borderRadius: 12,
                    padding: "0 32px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(22,163,74,0.08)",
                    height: 44
                }}>
                    Tìm kiếm
                </button>
            </div>
            {/* Main layout */}
            <div style={{ display: "flex", maxWidth: 1300, margin: "0 auto", gap: 24 }}>
                {/* Sidebar */}
                <div style={{
                    width: 270,
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 2px 12px rgba(22,163,74,0.07)",
                    padding: 22,
                    marginBottom: 24,
                    height: "fit-content"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <span style={{ color: "#16a34a", fontSize: 24 }}>🧃</span>
                        <span style={{ fontWeight: 700, fontSize: 22, color: "#16a34a" }}>Bộ lọc tìm kiếm</span>
                    </div>
                    <div style={{ fontWeight: 600, color: "#16a34a", marginBottom: 6, fontSize: 15 }}>Loại sân <span style={{ float: "right", fontWeight: 400, fontSize: 13, color: "#6b7280" }}>Thu gọn</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                        {fieldTypes.map(ft => (
                            <button
                                key={ft.name}
                                onClick={() => setSelectedType(ft.name)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    background: selectedType === ft.name ? ft.color : "#f3f4f6",
                                    color: selectedType === ft.name ? "#16a34a" : "#374151",
                                    border: "none",
                                    borderRadius: 12,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    boxShadow: selectedType === ft.name ? "0 2px 8px rgba(22,163,74,0.08)" : "none",
                                    transition: "background 0.2s"
                                }}
                            >
                                <span style={{ fontSize: 20 }}>{ft.icon}</span>
                                {ft.name}
                            </button>
                        ))}
                    </div>
                    <div style={{ fontWeight: 600, color: "#16a34a", marginBottom: 6, fontSize: 15 }}>Khoảng cách <span style={{ float: "right", fontWeight: 400, fontSize: 13, color: "#6b7280" }}>Thu gọn</span></div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                        {distances.map(d => (
                            <button
                                key={d}
                                onClick={() => setSelectedDistance(d)}
                                style={{
                                    background: selectedDistance === d ? "#16a34a" : "#fff",
                                    color: selectedDistance === d ? "#fff" : "#16a34a",
                                    border: "1.2px solid #16a34a",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    fontSize: 13,
                                    padding: "6px 16px",
                                    cursor: "pointer",
                                    marginBottom: 2,
                                    transition: "background 0.2s"
                                }}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    <button style={{
                        width: "100%",
                        background: "#fff",
                        color: "#16a34a",
                        border: "1.2px solid #d1d5db",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        padding: "10px 0",
                        cursor: "pointer",
                        marginTop: 10
                    }}>
                        Xóa tất cả bộ lọc
                    </button>
                </div>
                {/* Danh sách sân */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: "#16a34a" }}>
                        {facilities.length} kết quả tìm kiếm
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 20,
                    }}>
                        {facilities
                            .filter(f => f.type === selectedType)
                            .map(facility => (
                                <div key={facility.id} style={{
                                    background: "#fff",
                                    borderRadius: 18,
                                    boxShadow: "0 2px 12px rgba(22,163,74,0.08)",
                                    overflow: "hidden",
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                    minHeight: 240,
                                    position: "relative"
                                }}>
                                    {/* Rating */}
                                    <div style={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        background: "#fff",
                                        borderRadius: 12,
                                        padding: "2px 10px",
                                        fontWeight: 700,
                                        color: "#f59e42",
                                        fontSize: 14,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 3
                                    }}>
                                        <span style={{ fontSize: 15 }}>★</span> {facility.rating}
                                    </div>
                                    {/* Ảnh */}
                                    <div style={{
                                        width: "100%",
                                        height: 90,
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        {facility.image ? (
                                            <img src={facility.image} alt={facility.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ color: "#9ca3af", fontSize: 22, textAlign: "center" }}>
                                                <div style={{ fontSize: 36 }}>📷</div>
                                                No photo
                                            </div>
                                        )}
                                    </div>
                                    {/* Nội dung */}
                                    <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: "#222", marginBottom: 4 }}>{facility.name}</div>
                                        <div style={{ color: "#16a34a", fontSize: 13, marginBottom: 2 }}>
                                            <span style={{ marginRight: 4 }}>📍</span>{facility.address}
                                        </div>
                                        <div style={{ color: "#16a34a", fontSize: 13, marginBottom: 2 }}>
                                            <span style={{ marginRight: 4 }}>🕒</span>{facility.open}
                                        </div>
                                        <div style={{ color: "#16a34a", fontSize: 13, marginBottom: 6 }}>
                                            <span style={{ marginRight: 4 }}>📏</span>{facility.distance}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
                                            <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 16 }}>{facility.price}<span style={{ fontWeight: 400, fontSize: 13 }}>/giờ</span></span>
                                            <button style={{
                                                marginLeft: "auto",
                                                background: "#16a34a",
                                                color: "#fff",
                                                fontWeight: 700,
                                                fontSize: 14,
                                                border: "none",
                                                borderRadius: 8,
                                                padding: "6px 18px",
                                                cursor: "pointer",
                                                boxShadow: "0 1px 4px rgba(22,163,74,0.08)"
                                            }}>
                                                Đặt sân
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}