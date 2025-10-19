import React, { useState, useMemo } from "react";
import { Plus, Eye, Pencil, Trash2, Power, PowerOff, Wrench } from "lucide-react";
import { courtData } from "../data/mockData";

const ActionButton = ({ bg, Icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: bg,
      color: "#fff",
      border: 0,
      borderRadius: 8,
      padding: 8,
      marginRight: 6,
      cursor: "pointer",
    }}
  >
    <Icon size={16} />
  </button>
);

const Courts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourts = useMemo(
    () => courtData.filter(c => 
      [c.name, c.type, c.description, c.status]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý sân</h1>
        <button
          onClick={() => alert("TODO: Mở modal thêm sân mới")}
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            background: "#10b981", 
            color: "#fff", 
            border: 0, 
            borderRadius: 10, 
            padding: "10px 14px", 
            cursor: "pointer", 
            fontWeight: 700 
          }}
        >
          <Plus size={16}/> Thêm sân mới
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng sân</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{filteredCourts.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đang hoạt động</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {filteredCourts.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Bảo trì</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {filteredCourts.filter(c => c.status === 'maintenance').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tạm ngưng</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {filteredCourts.filter(c => c.status === 'inactive').length}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredCourts.length} sân
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả loại sân</option>
                <option value="5 người">5 người</option>
                <option value="7 người">7 người</option>
                <option value="Tennis">Tennis</option>
              </select>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tên, loại, mô tả…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Tên sân", "Loại", "Sức chứa", "Giá/giờ", "Trạng thái", "Bảo trì", "Hành động"].map(h => (
                  <th key={h} style={{ padding: 12, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCourts.map((court) => (
                <tr key={court.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{court.name}</td>
                  <td style={{ padding: 12 }}>{court.type}</td>
                  <td style={{ padding: 12 }}>{court.capacity} người</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {court.price.toLocaleString()} VNĐ
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: court.status === "active" ? "#e6f9f0" : 
                                 court.status === "maintenance" ? "#fef3c7" : "#fee2e2",
                      color: court.status === "active" ? "#059669" : 
                            court.status === "maintenance" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {court.status === "active" ? "Hoạt động" : 
                       court.status === "maintenance" ? "Bảo trì" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {court.maintenance}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton bg="#06b6d4" Icon={Eye} onClick={() => alert("Xem sân " + court.name)} title="Xem" />
                    <ActionButton bg="#22c55e" Icon={Pencil} onClick={() => alert("Sửa " + court.name)} title="Sửa" />
                    {court.status === "active" ? (
                      <ActionButton bg="#f59e0b" Icon={PowerOff} onClick={() => alert("Tạm ngưng " + court.name)} title="Tạm ngưng" />
                    ) : (
                      <ActionButton bg="#10b981" Icon={Power} onClick={() => alert("Kích hoạt " + court.name)} title="Kích hoạt" />
                    )}
                    <ActionButton bg="#6b7280" Icon={Wrench} onClick={() => alert("Bảo trì " + court.name)} title="Bảo trì" />
                    <ActionButton bg="#ef4444" Icon={Trash2} onClick={() => alert("Xóa " + court.name)} title="Xóa" />
                  </td>
                </tr>
              ))}
              {!filteredCourts.length && (
                <tr><td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Courts;
