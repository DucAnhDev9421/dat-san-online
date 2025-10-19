import React, { useState, useMemo } from "react";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import { paymentData } from "../data/mockData";

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

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = useMemo(
    () =>
      paymentData.filter((r) =>
        [r.id, r.bookingId, r.customer, r.facility, r.method, r.status, r.transactionId]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý thanh toán & Hóa đơn</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Xuất báo cáo doanh thu")}
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
            <Download size={16}/> Xuất báo cáo
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
              <strong>Tổng:</strong> {filteredPayments.length} giao dịch
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
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Chờ xử lý</option>
                <option value="failed">Thất bại</option>
                <option value="refunded">Hoàn tiền</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo mã, khách hàng, sân, phương thức…"
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
                  "Mã GD",
                  "Mã đặt sân",
                  "Khách hàng",
                  "Sân",
                  "Số tiền",
                  "Phương thức",
                  "Trạng thái",
                  "Mã giao dịch",
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
              {filteredPayments.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{r.id}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#3b82f6" }}>{r.bookingId}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{r.customer}</div>
                  </td>
                  <td style={{ padding: 12 }}>{r.facility}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {r.amount.toLocaleString()} VNĐ
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.method === "bank_transfer" ? "#e6f3ff" : 
                                 r.method === "momo" ? "#f0e6ff" : "#e6f9f0",
                      color: r.method === "bank_transfer" ? "#1d4ed8" : 
                            r.method === "momo" ? "#7c3aed" : "#059669",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "capitalize"
                    }}>
                      {r.method === "bank_transfer" ? "Chuyển khoản" : 
                       r.method === "momo" ? "MoMo" : "VNPay"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: r.status === "completed" ? "#e6f9f0" : 
                                 r.status === "pending" ? "#fef3c7" : 
                                 r.status === "failed" ? "#fee2e2" : "#e6f3ff",
                      color: r.status === "completed" ? "#059669" : 
                            r.status === "pending" ? "#d97706" : 
                            r.status === "failed" ? "#ef4444" : "#1d4ed8",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {r.status === "completed" ? "Hoàn thành" : 
                       r.status === "pending" ? "Chờ xử lý" : 
                       r.status === "failed" ? "Thất bại" : "Hoàn tiền"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {r.transactionId}
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
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => alert("Sửa " + r.id)}
                      title="Sửa"
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
              {!filteredPayments.length && (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>💳</div>
                    Không có dữ liệu thanh toán
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

export default Payments;
