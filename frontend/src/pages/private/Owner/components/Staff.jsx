import React, { useState, useMemo } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Key,
  Lock,
  Unlock,
} from "lucide-react";
import { staffData as initialStaffData } from "../data/mockData";
import StaffDetailModal from "../modals/StaffDetailModal";
import StaffEditModal from "../modals/StaffEditModal";
import StaffAddModal from "../modals/StaffAddModal";
import ResetPasswordStaffModal from "../modals/ResetPasswordStaffModal";
import ToggleStatusStaffModal from "../modals/ToggleStatusStaffModal";
import PasswordResetSuccessModal from "../modals/PasswordResetSuccessModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

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
      transition: "background 0.2s",
      ":hover": { opacity: 0.9 },
    }}
  >
    <Icon size={16} />
  </button>
);

const Staff = () => {
  // State quản lý danh sách nhân viên thực tế
  const [staffList, setStaffList] = useState(initialStaffData);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [toggleActionType, setToggleActionType] = useState("lock");
  const [newPassword, setNewPassword] = useState("");

  const handleOpenDetail = (staff) => {
    setSelectedStaff(staff);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedStaff(null);
  };

  const handleOpenEdit = (staff) => {
    setSelectedStaff(staff);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedStaff(null);
  };

  const handleOpenResetPass = (staff) => {
    setSelectedStaff(staff);
    setIsResetPassOpen(true);
  };

  const handleCloseResetPass = () => {
    setIsResetPassOpen(false);
    setSelectedStaff(null);
  };

  const handleResetPassword = (staffId, password) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (staff) {
      setNewPassword(password);
      setIsResetPassOpen(false);
      setIsSuccessOpen(true);
      // (logic gọi API thực tế)
      console.log(`Password for ${staff.name} reset to: ${password}`);
    }
  };

  const handleOpenToggleStatus = (staff, action) => {
    setSelectedStaff(staff);
    setToggleActionType(action);
    setIsToggleStatusOpen(true);
  };

  const handleCloseToggleStatus = () => {
    setIsToggleStatusOpen(false);
    setSelectedStaff(null);
  };

  const handleToggleStatus = (staffId, action) => {
    const newStatus = action === "lock" ? "inactive" : "active";
    setStaffList((prevList) =>
      prevList.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s))
    );
    setIsToggleStatusOpen(false);
    setSelectedStaff(null);
  };

  const handleOpenDelete = (staff) => {
    setSelectedStaff(staff);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (staffId) => {
    setStaffList((prevList) => prevList.filter((s) => s.id !== staffId));
    setIsDeleteOpen(false);
    setSelectedStaff(null);
  };

  const handleSaveStaff = (updatedStaff) => {
    setStaffList((prevList) =>
      prevList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
    setIsEditOpen(false);
    setSelectedStaff(null);
  };

  const handleOpenAddStaff = () => {
    setIsAddOpen(true);
  };

  const handleCloseAddStaff = () => {
    setIsAddOpen(false);
  };

  const handleAddStaff = (newStaffData) => {
    const currentMaxId = staffList.reduce((max, staff) => {
      const num = parseInt(staff.id.replace("STAFF", ""), 10);
      return num > max ? num : max;
    }, 0);
    const newIdNumber = currentMaxId + 1;
    const newId = `STAFF${String(newIdNumber).padStart(3, "0")}`;

    const newStaff = {
      ...newStaffData,
      id: newId,
      status: "active",
      lastLogin: "Chưa từng đăng nhập",
      totalHours: 0,
      permissions: [],
      // Lưu mật khẩu ban đầu (chỉ để hiển thị trong modal success, không lưu vào mock data thực tế)
      initialPassword: newStaffData.initialPassword,
    };

    setStaffList((prevList) => [...prevList, newStaff]);
    
    // Hiển thị modal success với mật khẩu
    setNewPassword(newStaffData.initialPassword);
    setSelectedStaff(newStaff);
    setIsAddOpen(false);
    setIsSuccessOpen(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    setSelectedStaff(null);
    setNewPassword("");
  };

  const filteredStaff = useMemo(
    () =>
      staffList.filter((s) =>
        [s.name, s.email, s.phone, s.position, s.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery, staffList]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStaff.length / pageSize)
  );
  const staffSlice = filteredStaff.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalStaff = filteredStaff.length;
  const activeStaff = filteredStaff.filter((s) => s.status === "active").length;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý nhân sự</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            // 🚨 SỬ DỤNG HÀM MỞ MODAL
            onClick={handleOpenAddStaff}
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
              fontWeight: 700,
            }}
          >
            <UserPlus size={16} /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Tổng nhân viên
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
            {totalStaff}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Đang hoạt động
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
            {activeStaff}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Tạm ngưng
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
            {totalStaff - activeStaff}
          </div>
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
            <div>
              <label style={{ marginRight: 8 }}>Hiển thị</label>
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
              <span style={{ marginLeft: 8 }}>bản ghi</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                }}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14,
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
              {staffSlice.map((staff) => (
                <tr
                  key={staff.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td
                    style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}
                  >
                    {staff.id}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{staff.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 14 }}>{staff.phone}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {staff.phone}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>{staff.position}</td>
                  <td
                    style={{ padding: 12, fontWeight: 600, color: "#059669" }}
                  >
                    {(staff.salary / 1e6).toFixed(1)} VNĐ
                  </td>
                  <td style={{ padding: 12 }}>{staff.joinDate}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          staff.status === "active"
                            ? "rgb(230, 249, 240)"
                            : "#fee2e2",
                        color:
                          staff.status === "active" ? "#059669" : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {staff.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          staff.performance === "Tốt"
                            ? "#e6f9f0"
                            : staff.performance === "Trung bình"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          staff.performance === "Tốt"
                            ? "#059669"
                            : staff.performance === "Trung bình"
                            ? "#d97706"
                            : "#ef4444",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
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
                      onClick={() => handleOpenDetail(staff)}
                      title="Xem chi tiết"
                      style={{
                        border: 0,
                        borderRadius: 8,
                        padding: 8,
                        cursor: "pointer",
                      }}
                    />
                    <ActionButton
                      bg="#22c55e"
                      Icon={Pencil}
                      onClick={() => handleOpenEdit(staff)}
                      title="Sửa"
                    />
                    <ActionButton
                      bg="#6b7280"
                      Icon={Key}
                      onClick={() => handleOpenResetPass(staff)}
                      title="Đặt lại mật khẩu"
                    />
                    {staff.status === "active" ? (
                      <ActionButton
                        bg="#f59e0b"
                        Icon={Lock}
                        onClick={() => handleOpenToggleStatus(staff, "lock")} // Khóa tài khoản
                        title="Khóa tài khoản"
                      />
                    ) : (
                      <ActionButton
                        bg="#10b981"
                        Icon={Unlock}
                        onClick={() => handleOpenToggleStatus(staff, "unlock")} // Mở khóa tài khoản
                        title="Mở khóa tài khoản"
                      />
                    )}
                    <ActionButton
                      bg="#ef4444"
                      Icon={Trash2}
                      onClick={() => handleOpenDelete(staff)}
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
          }}
        >
          <div>
            Hiển thị {(page - 1) * pageSize + 1} đến{" "}
            {Math.min(page * pageSize, filteredStaff.length)} trong tổng số{" "}
            {filteredStaff.length} bản ghi
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
              Trước
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
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <StaffDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedStaff}
      />

      {/* Edit Modal */}
      <StaffEditModal
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        item={selectedStaff}
        onSave={handleSaveStaff}
      />

      {/* Add Modal */}
      <StaffAddModal
        isOpen={isAddOpen}
        onClose={handleCloseAddStaff}
        onAdd={handleAddStaff}
      />

      {/* Reset Password Modal */}
      <ResetPasswordStaffModal
        isOpen={isResetPassOpen}
        onClose={handleCloseResetPass}
        item={selectedStaff}
        onReset={handleResetPassword}
      />

      {/* Toggle Status Modal */}
      <ToggleStatusStaffModal
        isOpen={isToggleStatusOpen}
        onClose={handleCloseToggleStatus}
        item={selectedStaff}
        actionType={toggleActionType}
        onToggle={handleToggleStatus}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={() => {
          if (selectedStaff) {
            handleDeleteStaff(selectedStaff.id);
          }
        }}
        title="Xóa nhân viên"
        message="Bạn có chắc muốn xóa nhân viên"
        itemName={`${selectedStaff?.name}`}
        warningMessage="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa."
      />

      {/* Password Reset Success Modal */}
      <PasswordResetSuccessModal
        isOpen={isSuccessOpen}
        onClose={handleCloseSuccess}
        item={{
          ...selectedStaff,
          initialPassword: newPassword,
        }}
      />
    </div>
  );
};

export default Staff;
