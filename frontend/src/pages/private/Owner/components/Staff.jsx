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
import PasswordResetSuccessModal from "../modals/PasswordResetSuccessModal";
import DeleteStaffModal from "../modals/DeleteStaffModal";
import ToggleStatusStaffModal from "../modals/ToggleStatusStaffModal";
import ResetPasswordStaffModal from "../modals/ResetPasswordStaffModal";
import StaffEditModal from "../modals/StaffEditModal";
import { staffData as initialStaffData } from "../data/mockData";
import StaffDetailModal from "../modals/StaffDetailModal";
import AddStaffModal from "../modals/AddStaffModal";

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

  // State cho Modal Chi tiết
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Nhân viên được chọn để xem/chỉnh sửa/đặt lại mật khẩu/xóa/khóa-mở khóa
  const [selectedStaff, setSelectedStaff] = useState(null);

  // State cho Modal Chỉnh sửa
  const [isEditOpen, setIsEditOpen] = useState(false);

  // State cho Modal Đặt lại mật khẩu
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);

  // State cho Modal thông báo thành công
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // State cho Modal Xóa
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // State cho Modal Thêm mới
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // State cho Modal Khóa/Mở khóa
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
  const [toggleActionType, setToggleActionType] = useState("lock"); // 'lock' hoặc 'unlock'

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

  // --- Logic mở/đóng Modal Đặt lại mật khẩu
  const handleOpenResetPass = (staff) => {
    setSelectedStaff(staff);
    setIsResetPassOpen(true);
  };
  const handleCloseResetPass = () => {
    setIsResetPassOpen(false);
    setSelectedStaff(null);
  };

  // Hàm đóng cuối cùng sau khi hoàn thành hành động
  const handleFinalActionClose = () => {
    setIsSuccessModalOpen(false);
    setSelectedStaff(null); // Xóa selectedStaff
  };

  /// --- Logic Đặt lại mật khẩu (CHỈNH SỬA)
  const handleResetPassword = (staffId, newPassword) => {
    const staff = staffList.find((s) => s.id === staffId);

    // 1. Đóng Modal Đặt lại mật khẩu
    setIsResetPassOpen(false);

    // 2. Mở Modal thông báo thành công (selectedStaff vẫn giữ dữ liệu)
    setIsSuccessModalOpen(true);

    // (logic gọi API thực tế)
    console.log(`Password for ${staff.name} reset to: ${newPassword}`);
  };

  const handleSaveStaff = (updatedStaff) => {
    setStaffList((prevList) =>
      prevList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
    alert(`Đã lưu thành công thông tin của ${updatedStaff.name}`);
    handleCloseEdit();
  };

  // --- Logic mở/đóng Modal Khóa/Mở khóa
  const handleOpenToggleStatus = (staff, action) => {
    setSelectedStaff(staff);
    setToggleActionType(action); // 'lock' hoặc 'unlock'
    setIsToggleStatusOpen(true);
  };
  const handleCloseToggleStatus = () => {
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

  // --- Logic Xóa nhân viên (SỬA LỖI)
  const handleDeleteStaff = (staffId) => {
    // Nhận staffId từ modal

    // Cập nhật state: Xóa nhân viên khỏi danh sách
    setStaffList((prevList) => prevList.filter((s) => s.id !== staffId));

    handleCloseDelete(); // Đóng modal sau khi xóa thành công
  };

  // --- Logic Xử lý Khóa/Mở khóa (Cập nhật trạng thái)
  const handleToggleStatus = (staffId, action) => {
    const newStatus = action === "lock" ? "inactive" : "active";

    setStaffList((prevList) =>
      prevList.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s))
    );
  };

  // --- Logic mở/đóng Modal Thêm mới
  const handleOpenAddStaff = () => {
    setIsAddStaffOpen(true);
  };
  const handleCloseAddStaff = () => {
    setIsAddStaffOpen(false);
  };

  // --- 🚨 Logic Xử lý Thêm nhân viên (CẬP NHẬT)
  const handleAddStaff = (newStaffData) => {
    // 1. Tạo ID mới
    const currentMaxId = staffList.reduce((max, staff) => {
      const num = parseInt(staff.id.replace("STAFF", ""), 10);
      return num > max ? num : max;
    }, 0);
    const newIdNumber = currentMaxId + 1;
    const newId = `STAFF${String(newIdNumber).padStart(3, "0")}`;

    // 🚨 2. Lấy dữ liệu mật khẩu và hiệu suất từ newStaffData
    const newStaff = {
      ...newStaffData,
      id: newId,
      // Lưu trữ các trường cần thiết
      performance: newStaffData.performance, // ✅ Lấy giá trị đã chọn
      // Lưu mật khẩu ban đầu (chỉ để minh họa, không nên lưu mật khẩu thật trong mock data)
      initialPassword: newStaffData.initialPassword,

      // Thêm các trường mặc định khác
      lastLogin: "Chưa từng đăng nhập",
      totalHours: 0,
    };

    // 3. Cập nhật state
    setStaffList((prevList) => [...prevList, newStaff]);

    // 4. Thông báo và đóng
    alert(
      `Đã thêm thành công nhân viên: ${newStaff.name} (ID: ${newId}). Mật khẩu: ${newStaffData.initialPassword}`
    );
    handleCloseAddStaff();
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredStaff.map((staff) => (
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
      </div>
      {/* Detail Modal */}
      {selectedStaff && (
        <StaffDetailModal
          isOpen={isDetailOpen}
          item={selectedStaff} // ✅ Truyền đối tượng nhân viên vào prop 'item'
          onClose={handleCloseDetail}
        />
      )}

      {/* 🚨 Edit Modal */}
      {selectedStaff && (
        <StaffEditModal
          isOpen={isEditOpen}
          item={selectedStaff}
          onClose={handleCloseEdit}
          onSave={handleSaveStaff} // Truyền hàm lưu vào modal
        />
      )}

      {/* 🚨 Reset Password Modal */}
      {selectedStaff && (
        <ResetPasswordStaffModal
          isOpen={isResetPassOpen}
          item={selectedStaff}
          onClose={handleCloseResetPass}
          onReset={handleResetPassword} // Truyền hàm xử lý reset
        />
      )}

      {/*Toggle Status Modal */}
      {selectedStaff && (
        <ToggleStatusStaffModal
          isOpen={isToggleStatusOpen}
          item={selectedStaff}
          onClose={handleCloseToggleStatus}
          onToggle={handleToggleStatus} // Hàm xử lý Khóa/Mở khóa
          actionType={toggleActionType} // Truyền hành động hiện tại ('lock'/'unlock')
        />
      )}

      {/* Delete modal */}
      {selectedStaff && ( // Chỉ render khi có nhân viên được chọn
        <DeleteStaffModal
          isOpen={isDeleteOpen}
          item={selectedStaff} // ✅ Prop đúng
          onClose={handleCloseDelete} // ✅ Hàm đóng đúng
          onDelete={handleDeleteStaff} // ✅ Prop hàm xử lý đúng
        />
      )}
      {/* Password Reset Success Modal */}
      {selectedStaff && (
        <PasswordResetSuccessModal
          isOpen={isSuccessModalOpen}
          item={selectedStaff}
          onClose={handleFinalActionClose} // Hàm đóng cuối cùng
        />
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={handleCloseAddStaff}
        onAdd={handleAddStaff}
      />
    </div>
  );
};

export default Staff;
