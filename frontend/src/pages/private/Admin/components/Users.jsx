import React, { useState, useMemo } from "react";
import {
  Eye,
  Lock,
  Unlock,
  Trash2,
  UserPlus,
  Search,
  Filter,
} from "lucide-react";
import { userData } from "../data/mockData";

const Users = () => {
  const [users, setUsers] = useState(userData);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all, customer, owner
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, locked, deleted
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Lọc dữ liệu
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        [user.name, user.email, user.phone, user.role]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.isLocked && !user.isDeleted) ||
        (statusFilter === "locked" && user.isLocked) ||
        (statusFilter === "deleted" && user.isDeleted);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const userSlice = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleLock = (user) => {
    if (
      window.confirm(
        `Bạn có chắc muốn khóa tài khoản "${user.name}"?`
      )
    ) {
      setUsers((current) =>
        current.map((u) =>
          u.id === user.id ? { ...u, isLocked: true } : u
        )
      );
    }
  };

  const handleUnlock = (user) => {
    if (
      window.confirm(
        `Bạn có chắc muốn mở khóa tài khoản "${user.name}"?`
      )
    ) {
      setUsers((current) =>
        current.map((u) =>
          u.id === user.id ? { ...u, isLocked: false } : u
        )
      );
    }
  };

  const handleSoftDelete = (user) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa tài khoản "${user.name}"? Tài khoản sẽ bị ẩn khỏi hệ thống.`
      )
    ) {
      setUsers((current) =>
        current.map((u) =>
          u.id === user.id ? { ...u, isDeleted: true, isLocked: false } : u
        )
      );
    }
  };

  const handleRestore = (user) => {
    if (
      window.confirm(
        `Bạn có chắc muốn khôi phục tài khoản "${user.name}"?`
      )
    ) {
      setUsers((current) =>
        current.map((u) =>
          u.id === user.id ? { ...u, isDeleted: false } : u
        )
      );
    }
  };

  const handlePromoteToOwner = (user) => {
    if (
      window.confirm(
        `Bạn có chắc muốn cấp quyền Owner cho "${user.name}"? Người dùng này sẽ có thể đăng ký mở cơ sở.`
      )
    ) {
      setUsers((current) =>
        current.map((u) =>
          u.id === user.id ? { ...u, role: "owner" } : u
        )
      );
    }
  };

  const resetFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý người dùng</h1>
      </div>

      {/* Bộ lọc */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Filter size={18} color="#6b7280" />
          <span style={{ fontWeight: 600, color: "#374151" }}>Bộ lọc</span>
          {(roleFilter !== "all" ||
            statusFilter !== "all" ||
            searchQuery) && (
            <button
              onClick={resetFilters}
              style={{
                marginLeft: "auto",
                padding: "6px 12px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Tìm kiếm
            </label>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Tên, email, số điện thoại..."
                style={{
                  width: "100%",
                  padding: "8px 8px 8px 36px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Vai trò
            </label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              <option value="all">Tất cả</option>
              <option value="customer">Người dùng thường</option>
              <option value="owner">Chủ cơ sở</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Đã khóa</option>
              <option value="deleted">Đã xóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
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
            padding: 12,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <label style={{ marginRight: 8 }}>Show</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: 6,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span style={{ marginLeft: 8 }}>entries</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            Hiển thị {filteredUsers.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Tên",
                  "Email",
                  "Số điện thoại",
                  "Vai trò",
                  "Cơ sở",
                  "Ngày tham gia",
                  "Trạng thái",
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
              {userSlice.map((user) => {
                const getStatusBadge = () => {
                  if (user.isDeleted) {
                    return {
                      label: "Đã xóa",
                      color: "#6b7280",
                      bg: "#f3f4f6",
                    };
                  }
                  if (user.isLocked) {
                    return {
                      label: "Đã khóa",
                      color: "#ef4444",
                      bg: "#fee2e2",
                    };
                  }
                  return {
                    label: "Đang hoạt động",
                    color: "#059669",
                    bg: "#e6f9f0",
                  };
                };

                const status = getStatusBadge();

                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      opacity: user.isDeleted ? 0.6 : 1,
                    }}
                  >
                    <td style={{ padding: 12, fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {user.phone}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background:
                            user.role === "owner"
                              ? "#e6f9f0"
                              : "#e6effe",
                          color:
                            user.role === "owner"
                              ? "#059669"
                              : "#4338ca",
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {user.role === "owner"
                          ? "Chủ cơ sở"
                          : "Người dùng thường"}
                      </span>
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {user.facility || "-"}
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {user.joinDate}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background: status.bg,
                          color: status.color,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleViewDetails(user)}
                          style={{
                            background: "#06b6d4",
                            color: "#fff",
                            border: 0,
                            borderRadius: 8,
                            padding: "6px 10px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          title="Xem chi tiết"
                        >
                          <Eye size={12} />
                        </button>
                        {!user.isDeleted && (
                          <>
                            {user.isLocked ? (
                              <button
                                onClick={() => handleUnlock(user)}
                                style={{
                                  background: "#10b981",
                                  color: "#fff",
                                  border: 0,
                                  borderRadius: 8,
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                                title="Mở khóa"
                              >
                                <Unlock size={12} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLock(user)}
                                style={{
                                  background: "#f59e0b",
                                  color: "#fff",
                                  border: 0,
                                  borderRadius: 8,
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                                title="Khóa tài khoản"
                              >
                                <Lock size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => handleSoftDelete(user)}
                              style={{
                                background: "#ef4444",
                                color: "#fff",
                                border: 0,
                                borderRadius: 8,
                                padding: "6px 10px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={12} />
                            </button>
                            {user.role === "customer" && (
                              <button
                                onClick={() => handlePromoteToOwner(user)}
                                style={{
                                  background: "#8b5cf6",
                                  color: "#fff",
                                  border: 0,
                                  borderRadius: 8,
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                                title="Cấp quyền Owner"
                              >
                                <UserPlus size={12} />
                              </button>
                            )}
                          </>
                        )}
                        {user.isDeleted && (
                          <button
                            onClick={() => handleRestore(user)}
                            style={{
                              background: "#10b981",
                              color: "#fff",
                              border: 0,
                              borderRadius: 8,
                              padding: "6px 10px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                            title="Khôi phục tài khoản"
                          >
                            Khôi phục
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!userSlice.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
          }}
        >
          <div>
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "#10b981",
                color: "#fff",
              }}
            >
              {page}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal chi tiết */}
      {isDetailModalOpen && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Chi tiết tài khoản: {selectedUser.name}
            </h2>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <strong>Tên:</strong> {selectedUser.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {selectedUser.phone}
              </div>
              <div>
                <strong>Vai trò:</strong>{" "}
                <span
                  style={{
                    background:
                      selectedUser.role === "owner"
                        ? "#e6f9f0"
                        : "#e6effe",
                    color:
                      selectedUser.role === "owner"
                        ? "#059669"
                        : "#4338ca",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {selectedUser.role === "owner"
                    ? "Chủ cơ sở"
                    : "Người dùng thường"}
                </span>
              </div>
              {selectedUser.facility && (
                <div>
                  <strong>Cơ sở:</strong> {selectedUser.facility}
                </div>
              )}
              <div>
                <strong>Ngày tham gia:</strong> {selectedUser.joinDate}
              </div>
              <div>
                <strong>Đăng nhập lần cuối:</strong> {selectedUser.lastLogin}
              </div>
              {selectedUser.role === "customer" && (
                <>
                  <div>
                    <strong>Tổng đặt sân:</strong> {selectedUser.totalBookings}
                  </div>
                  <div>
                    <strong>Tổng chi tiêu:</strong>{" "}
                    {formatPrice(selectedUser.totalSpent)} VNĐ
                  </div>
                </>
              )}
              {selectedUser.role === "owner" && (
                <>
                  <div>
                    <strong>Tổng đặt sân:</strong> {selectedUser.totalBookings}
                  </div>
                  <div>
                    <strong>Tổng doanh thu:</strong>{" "}
                    {formatPrice(selectedUser.totalRevenue)} VNĐ
                  </div>
                  <div>
                    <strong>Hoa hồng:</strong>{" "}
                    {formatPrice(selectedUser.commission)} VNĐ
                  </div>
                </>
              )}
              <div>
                <strong>Trạng thái:</strong>{" "}
                {selectedUser.isDeleted
                  ? "Đã xóa"
                  : selectedUser.isLocked
                  ? "Đã khóa"
                  : "Đang hoạt động"}
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

