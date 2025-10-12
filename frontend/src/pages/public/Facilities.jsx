//Trang danh sách sân
import React, { useState, useEffect, useRef } from "react";

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
        name: "Sân Thể Thao Quận 1",
        address: "Quận 1, TP.HCM",
        open: "06:00 - 23:00",
        distance: "2 km",
        distanceValue: 2,
        price: "300,000đ",
        priceValue: 300000,
        type: "Bóng đá",
        rating: 4.8,
        image: "",
        createdAt: "2024-10-01"
    },
    {
        id: 2,
        name: "Sân Bóng Đá Tân Bình",
        address: "Tân Bình, TP.HCM",
        open: "05:00 - 22:00",
        distance: "5 km",
        distanceValue: 5,
        price: "200,000đ",
        priceValue: 200000,
        type: "Bóng đá",
        rating: 4.5,
        image: "",
        createdAt: "2024-09-15"
    },
    {
        id: 3,
        name: "Sân Thể Thao Phú Nhuận",
        address: "Phú Nhuận, TP.HCM",
        open: "06:00 - 23:00",
        distance: "1 km",
        distanceValue: 1,
        price: "250,000đ",
        priceValue: 250000,
        type: "Bóng đá",
        rating: 4.9,
        image: "",
        createdAt: "2024-10-10"
    },
    {
        id: 4,
        name: "Sân Bóng Quận 3",
        address: "Quận 3, TP.HCM",
        open: "06:00 - 23:00",
        distance: "3 km",
        distanceValue: 3,
        price: "280,000đ",
        priceValue: 280000,
        type: "Bóng đá",
        rating: 4.6,
        image: "",
        createdAt: "2024-09-20"
    },
    {
        id: 5,
        name: "Sân Thể Thao Bình Thạnh",
        address: "Bình Thạnh, TP.HCM",
        open: "05:30 - 22:30",
        distance: "4 km",
        distanceValue: 4,
        price: "220,000đ",
        priceValue: 220000,
        type: "Bóng đá",
        rating: 4.7,
        image: "",
        createdAt: "2024-10-05"
    },
];

const distances = ["1km", "3km", "5km", "10km", "20km+"];

const sortOptions = [
    { id: "distance", label: "Khoảng cách", subLabel: "Gần nhất trước", icon: "📍" },
    { id: "price", label: "Giá cả", subLabel: "Rẻ nhất trước", icon: "💲" },
    { id: "rating", label: "Đánh giá", subLabel: "Cao nhất trước", icon: "⭐" },
    { id: "newest", label: "Mới nhất", subLabel: "Mới cập nhất", icon: "🕒" },
];

export default function Facilities() {
    const [selectedType, setSelectedType] = useState("Bóng đá");
    const [selectedDistance, setSelectedDistance] = useState("5km");
    const [sortBy, setSortBy] = useState("distance");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // "grid" hoặc "list"
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };

        if (showSortDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSortDropdown]);

    // Sắp xếp facilities
    const getSortedFacilities = () => {
        const filtered = facilities.filter(f => f.type === selectedType);
        
        return [...filtered].sort((a, b) => {
            switch(sortBy) {
                case "distance":
                    return a.distanceValue - b.distanceValue;
                case "price":
                    return a.priceValue - b.priceValue;
                case "rating":
                    return b.rating - a.rating; // Cao nhất trước
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt); // Mới nhất trước
                default:
                    return 0;
            }
        });
    };

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
            <div style={{ textAlign: "center", color: "#374151", fontSize: 16, marginBottom: 32 }}>
                Tìm và đặt sân bóng đá, cầu lông, bóng rổ, bóng bàn và nhiều loại sân khác với giao diện hiện đại và dễ sử dụng
            </div>
            {/* Main layout */}
            <div style={{ display: "flex", maxWidth: 1300, margin: "0 auto", gap: 24 }}>
                {/* Sidebar */}
                <div style={{
                    width: 300,
                    background: "#fff",
                    borderRadius: 20,
                    boxShadow: "0 4px 24px rgba(22,163,74,0.1)",
                    padding: 0,
                    marginBottom: 24,
                    height: "fit-content",
                    overflow: "hidden",
                    border: "1px solid rgba(22,163,74,0.08)"
                }}>
                    {/* Header với gradient */}
                    <div style={{ 
                        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                        padding: "20px 24px",
                        marginBottom: 24
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 28 }}>🎯</span>
                            <span style={{ fontWeight: 700, fontSize: 20, color: "#fff" }}>Bộ lọc tìm kiếm</span>
                        </div>
                    </div>

                    <div style={{ padding: "0 24px 24px 24px" }}>
                        {/* Loại sân */}
                        <div style={{ 
                            fontWeight: 700, 
                            color: "#1f2937", 
                            marginBottom: 14, 
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
                            <span style={{ fontSize: 18 }}>⚽</span>
                            Loại sân
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                        {fieldTypes.map(ft => (
                            <button
                                key={ft.name}
                                onClick={() => setSelectedType(ft.name)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                        gap: 12,
                                        background: selectedType === ft.name 
                                            ? "linear-gradient(135deg, " + ft.color + " 0%, " + ft.color + " 100%)"
                                            : "#f9fafb",
                                        color: selectedType === ft.name ? "#15803d" : "#4b5563",
                                        border: selectedType === ft.name ? "2px solid #16a34a" : "2px solid transparent",
                                        borderRadius: 14,
                                        fontWeight: selectedType === ft.name ? 700 : 600,
                                    fontSize: 15,
                                        padding: "12px 18px",
                                    cursor: "pointer",
                                        boxShadow: selectedType === ft.name 
                                            ? "0 4px 12px rgba(22,163,74,0.15)" 
                                            : "0 2px 6px rgba(0,0,0,0.03)",
                                        transition: "all 0.3s ease",
                                        transform: selectedType === ft.name ? "translateX(4px)" : "translateX(0)"
                                    }}
                                    onMouseEnter={e => {
                                        if (selectedType !== ft.name) {
                                            e.currentTarget.style.background = "#f3f4f6";
                                            e.currentTarget.style.transform = "translateX(2px)";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (selectedType !== ft.name) {
                                            e.currentTarget.style.background = "#f9fafb";
                                            e.currentTarget.style.transform = "translateX(0)";
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: 22 }}>{ft.icon}</span>
                                    <span>{ft.name}</span>
                            </button>
                        ))}
                    </div>

                        {/* Khoảng cách */}
                        <div style={{ 
                            fontWeight: 700, 
                            color: "#1f2937", 
                            marginBottom: 14, 
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
                            <span style={{ fontSize: 18 }}>📍</span>
                            Khoảng cách
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                        {distances.map(d => (
                            <button
                                key={d}
                                onClick={() => setSelectedDistance(d)}
                                style={{
                                        background: selectedDistance === d 
                                            ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
                                            : "#fff",
                                    color: selectedDistance === d ? "#fff" : "#16a34a",
                                        border: "2px solid #16a34a",
                                        borderRadius: 10,
                                        fontWeight: 700,
                                    fontSize: 13,
                                        padding: "8px 18px",
                                    cursor: "pointer",
                                        boxShadow: selectedDistance === d 
                                            ? "0 4px 12px rgba(22,163,74,0.25)"
                                            : "0 2px 6px rgba(0,0,0,0.04)",
                                        transition: "all 0.3s ease",
                                        transform: selectedDistance === d ? "scale(1.05)" : "scale(1)"
                                    }}
                                    onMouseEnter={e => {
                                        if (selectedDistance !== d) {
                                            e.currentTarget.style.background = "#f0fdf4";
                                            e.currentTarget.style.transform = "scale(1.05)";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (selectedDistance !== d) {
                                            e.currentTarget.style.background = "#fff";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }
                                }}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                        {/* Nút xóa bộ lọc */}
                        <button 
                            style={{
                        width: "100%",
                        background: "#fff",
                                color: "#dc2626",
                                border: "2px solid #fecaca",
                                borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 14,
                                padding: "12px 0",
                        cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(220,38,38,0.08)",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#fef2f2";
                                e.currentTarget.style.borderColor = "#dc2626";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.borderColor = "#fecaca";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <span style={{ fontSize: 16 }}>🗑️</span>
                        Xóa tất cả bộ lọc
                    </button>
                    </div>
                </div>
                {/* Danh sách sân */}
                <div style={{ flex: 1 }}>
                    {/* Header với số lượng kết quả và bộ sắp xếp */}
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        marginBottom: 16 
                    }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "#16a34a" }}>
                            {getSortedFacilities().length} kết quả tìm kiếm
                        </div>
                        
                        {/* Sort và View controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {/* Sort dropdown */}
                            <div ref={dropdownRef} style={{ position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 14 }}>
                                    <span style={{ fontSize: 16 }}>↕️</span>
                                    <span>Sắp xếp:</span>
                                    <button
                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #d1d5db",
                                            borderRadius: 8,
                                            padding: "8px 14px",
                                            cursor: "pointer",
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: "#16a34a",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = "#16a34a";
                                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,163,74,0.15)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
                                        }}
                                    >
                                        {sortOptions.find(opt => opt.id === sortBy)?.label || "Khoảng cách"}
                                        <span style={{ fontSize: 12, transform: showSortDropdown ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                                    </button>
                                </div>

                                {/* Dropdown menu */}
                                {showSortDropdown && (
                                    <div style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: 0,
                                        background: "#fff",
                                        borderRadius: 12,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                        border: "1px solid #e5e7eb",
                                        minWidth: 220,
                                        zIndex: 100,
                                        overflow: "hidden"
                                    }}>
                                        {sortOptions.map((option, index) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setSortBy(option.id);
                                                    setShowSortDropdown(false);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "12px 16px",
                                                    border: "none",
                                                    background: sortBy === option.id ? "#f0fdf4" : "#fff",
                                                    cursor: "pointer",
                                                    fontSize: 14,
                                                    textAlign: "left",
                                                    borderBottom: index < sortOptions.length - 1 ? "1px solid #f3f4f6" : "none",
                                                    transition: "background 0.2s ease"
                                                }}
                                                onMouseEnter={e => {
                                                    if (sortBy !== option.id) {
                                                        e.currentTarget.style.background = "#f9fafb";
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (sortBy !== option.id) {
                                                        e.currentTarget.style.background = "#fff";
                                                    }
                                                }}
                                            >
                                                <span style={{ fontSize: 20 }}>{option.icon}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ 
                                                        fontWeight: sortBy === option.id ? 700 : 600, 
                                                        color: "#1f2937",
                                                        marginBottom: 2
                                                    }}>
                                                        {option.label}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                                                        {option.subLabel}
                                                    </div>
                                                </div>
                                                {sortBy === option.id && (
                                                    <span style={{ color: "#16a34a", fontSize: 18 }}>✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View toggle buttons */}
                            <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 8, padding: 4 }}>
                                <button 
                                    onClick={() => setViewMode("grid")}
                                    style={{
                                        background: viewMode === "grid" ? "#16a34a" : "transparent",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        color: viewMode === "grid" ? "#fff" : "#6b7280",
                                        fontSize: 16,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: viewMode === "grid" ? "0 2px 4px rgba(22,163,74,0.2)" : "none",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    ⊞
                                </button>
                                <button 
                                    onClick={() => setViewMode("list")}
                                    style={{
                                        background: viewMode === "list" ? "#16a34a" : "transparent",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        color: viewMode === "list" ? "#fff" : "#6b7280",
                                        fontSize: 16,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: viewMode === "list" ? "0 2px 4px rgba(22,163,74,0.2)" : "none",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    ☰
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Grid View */}
                    {viewMode === "grid" && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 20,
                    }}>
                            {getSortedFacilities().map(facility => (
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
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {getSortedFacilities().map(facility => (
                                <div key={facility.id} style={{
                                    background: "#fff",
                                    borderRadius: 18,
                                    boxShadow: "0 2px 12px rgba(22,163,74,0.08)",
                                    overflow: "hidden",
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "stretch",
                                    position: "relative",
                                    minHeight: 160
                                }}>
                                    {/* Ảnh bên trái */}
                                    <div style={{
                                        width: 240,
                                        minWidth: 240,
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative"
                                    }}>
                                        {facility.image ? (
                                            <img src={facility.image} alt={facility.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ color: "#9ca3af", fontSize: 22, textAlign: "center" }}>
                                                <div style={{ fontSize: 48 }}>📷</div>
                                                <div style={{ fontSize: 14, marginTop: 8 }}>No photo</div>
                                            </div>
                                        )}
                                        {/* Rating */}
                                        <div style={{
                                            position: "absolute",
                                            top: 12,
                                            left: 12,
                                            background: "#fff",
                                            borderRadius: 12,
                                            padding: "4px 12px",
                                            fontWeight: 700,
                                            color: "#f59e42",
                                            fontSize: 14,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4
                                        }}>
                                            <span style={{ fontSize: 16 }}>★</span> {facility.rating}
                                        </div>
                                    </div>

                                    {/* Nội dung bên phải */}
                                    <div style={{ 
                                        padding: "20px 24px", 
                                        flex: 1, 
                                        display: "flex", 
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 18, color: "#222", marginBottom: 10 }}>
                                                {facility.name}
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
                                                <div style={{ color: "#16a34a", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                                    <span style={{ fontSize: 16 }}>📍</span>
                                                    <span>{facility.address}</span>
                                                </div>
                                                <div style={{ color: "#16a34a", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                                    <span style={{ fontSize: 16 }}>🕒</span>
                                                    <span>{facility.open}</span>
                                                </div>
                                                <div style={{ color: "#16a34a", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                                    <span style={{ fontSize: 16 }}>📏</span>
                                                    <span>{facility.distance}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "space-between",
                                            marginTop: 12,
                                            paddingTop: 12,
                                            borderTop: "1px solid #f3f4f6"
                                        }}>
                                            <div>
                                                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Giá thuê</div>
                                                <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 20 }}>
                                                    {facility.price}
                                                    <span style={{ fontWeight: 400, fontSize: 14, color: "#6b7280" }}>/giờ</span>
                                                </span>
                                            </div>
                                            <button style={{
                                                background: "#16a34a",
                                                color: "#fff",
                                                fontWeight: 700,
                                                fontSize: 15,
                                                border: "none",
                                                borderRadius: 10,
                                                padding: "10px 32px",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 8px rgba(22,163,74,0.15)",
                                                transition: "all 0.2s ease"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = "#15803d";
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.25)";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = "#16a34a";
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,163,74,0.15)";
                                            }}>
                                                Đặt sân ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}