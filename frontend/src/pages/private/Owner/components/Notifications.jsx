import React, { useState, useMemo } from "react";
import { Send, Eye, Trash2 } from "lucide-react";
import { notificationData } from "../data/mockData";

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

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = useMemo(
    () =>
      notificationData.filter((r) =>
        [r.title, r.message, r.type, r.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý thông báo</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Gửi thông báo mới")}
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
            <Send size={16}/> Gửi thông báo
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredNotifications.length} thông báo
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
                <option value="all">Tất cả loại</option>
                <option value="booking">Đặt sân</option>
                <option value="payment">Thanh toán</option>
                <option value="cancellation">Hủy đặt sân</option>
                <option value="review">Đánh giá</option>
                <option value="maintenance">Bảo trì</option>
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
                <option value="unread">Chưa đọc</option>
                <option value="read">Đã đọc</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tiêu đề, nội dung, loại…"
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
                {[
                  "Mã",
                  "Tiêu đề",
                  "Nội dung",
                  "Loại",
                  "Trạng thái",
                  "Thời gian",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 12,
                      fontSize: 13,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                  </td>
                  <td style={{ padding: 12, maxWidth: "300px" }}>
                    <div style={{ 
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }} title={r.message}>
                      {r.message}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.type === "booking" ? "#e6f3ff" : 
                                 r.type === "payment" ? "#e6f9f0" : 
                                 r.type === "cancellation" ? "#fee2e2" : 
                                 r.type === "review" ? "#fef3c7" : "#e6f3ff",
                      color: r.type === "booking" ? "#1d4ed8" : 
                            r.type === "payment" ? "#059669" : 
                            r.type === "cancellation" ? "#ef4444" : 
                            r.type === "review" ? "#d97706" : "#1d4ed8",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "capitalize"
                    }}>
                      {r.type === "booking" ? "Đặt sân" : 
                       r.type === "payment" ? "Thanh toán" : 
                       r.type === "cancellation" ? "Hủy đặt sân" : 
                       r.type === "review" ? "Đánh giá" : "Bảo trì"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "unread" ? "#e6f3ff" : "#e6f9f0",
                      color: r.status === "unread" ? "#1d4ed8" : "#059669",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {r.status === "unread" ? "Chưa đọc" : "Đã đọc"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{r.date}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.time}</div>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết " + r.id)}
                      title="Xem chi tiết"
                    />
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => alert("Xóa " + r.id)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredNotifications.length && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>🔔</div>
                    Không có dữ liệu thông báo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
