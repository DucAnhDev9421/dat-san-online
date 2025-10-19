import React, { useState, useMemo } from "react";
import { Plus, Eye, Pencil, Trash2, UserPlus, Key, Lock, Unlock } from "lucide-react";
import { staffData } from "../data/mockData";

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

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = useMemo(
    () =>
      staffData.filter((s) =>
        [s.name, s.email, s.phone, s.position, s.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalStaff = filteredStaff.length;
  const activeStaff = filteredStaff.filter(s => s.status === 'active').length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý nhân sự</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("TODO: Thêm nhân viên mới")}
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
            <Plus size={16}/> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng nhân viên</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{totalStaff}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đang hoạt động</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{activeStaff}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tạm ngưng</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{totalStaff - activeStaff}</div>
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
              <strong>Tổng:</strong> {filteredStaff.length} nhân viên
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
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo tên, email, SĐT, chức vụ…"
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
                  "Họ tên",
                  "Liên hệ",
                  "Chức vụ",
                  "Lương",
                  "Ngày vào làm",
                  "Trạng thái",
                  "Hiệu suất",
                  "Đăng nhập cuối",
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
              {filteredStaff.map((staff) => (
                <tr key={staff.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>{staff.id}</td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{staff.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{staff.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{staff.email}</div>
                  </td>
                  <td style={{ padding: 12 }}>{staff.position}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                    {(staff.salary / 1e6).toFixed(1)}M VNĐ
                  </td>
                  <td style={{ padding: 12 }}>{staff.joinDate}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: staff.status === "active" ? "#e6f9f0" : "#fee2e2",
                      color: staff.status === "active" ? "#059669" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {staff.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      background: staff.performance === "Tốt" ? "#e6f9f0" : 
                                 staff.performance === "Trung bình" ? "#fef3c7" : "#fee2e2",
                      color: staff.performance === "Tốt" ? "#059669" : 
                            staff.performance === "Trung bình" ? "#d97706" : "#ef4444",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {staff.performance}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "#6b7280" }}>
                    {staff.lastLogin}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    <ActionButton
                      bg="#06b6d4"
                      Icon={Eye}
                      onClick={() => alert("Xem chi tiết " + staff.id)}
                      title="Xem chi tiết"
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => alert("Sửa " + staff.name)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#6b7280"
                      Icon={Key}
                      onClick={() => alert("Đặt lại mật khẩu " + staff.name)}
                      title="Đặt lại mật khẩu"
                    />
                    {staff.status === "active" ? (
                      <ActionButton
                        bg="#f59e0b"
                        Icon={Lock}
                        onClick={() => alert("Khóa tài khoản " + staff.name)}
                        title="Khóa tài khoản"
                      />
                    ) : (
                      <ActionButton
                        bg="#10b981"
                        Icon={Unlock}
                        onClick={() => alert("Mở khóa tài khoản " + staff.name)}
                        title="Mở khóa tài khoản"
                      />
                    )}
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => alert("Xóa " + staff.name)}
                      title="Xóa"
                    />
                  </td>
                </tr>
              ))}
              {!filteredStaff.length && (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 8 }}>👥</div>
                    Không có dữ liệu nhân viên
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

export default Staff;
