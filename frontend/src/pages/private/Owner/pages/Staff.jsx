import React, { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { staffData as initialStaffData } from "../data/mockData";
import StaffDetailModal from "../modals/StaffDetailModal";
import StaffEditModal from "../modals/StaffEditModal";
import StaffAddModal from "../modals/StaffAddModal";
import ResetPasswordStaffModal from "../modals/ResetPasswordStaffModal";
import ToggleStatusStaffModal from "../modals/ToggleStatusStaffModal";
import PasswordResetSuccessModal from "../modals/PasswordResetSuccessModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import StaffStats from "../components/Staff/StaffStats";
import StaffFilters from "../components/Staff/StaffFilters";
import StaffTable from "../components/Staff/StaffTable";

const Staff = () => {
  const [staffList, setStaffList] = useState(initialStaffData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredStaff = useMemo(
    () =>
      staffList.filter((s) => {
        if (statusFilter !== "all" && s.status !== statusFilter) {
          return false;
        }
        if (searchQuery) {
          return [s.name, s.email, s.phone, s.position, s.status]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return true;
      }),
    [searchQuery, statusFilter, staffList]
  );

  const staffSlice = filteredStaff.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const handlers = {
    onView: (staff) => {
      setSelectedStaff(staff);
      setIsDetailOpen(true);
    },
    onEdit: (staff) => {
      setSelectedStaff(staff);
      setIsEditOpen(true);
    },
    onResetPass: (staff) => {
      setSelectedStaff(staff);
      setIsResetPassOpen(true);
    },
    onLock: (staff) => {
      setSelectedStaff(staff);
      setToggleActionType("lock");
      setIsToggleStatusOpen(true);
    },
    onUnlock: (staff) => {
      setSelectedStaff(staff);
      setToggleActionType("unlock");
      setIsToggleStatusOpen(true);
    },
    onDelete: (staff) => {
      setSelectedStaff(staff);
      setIsDeleteOpen(true);
    },
  };

  const handleResetPassword = (staffId, password) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (staff) {
      setNewPassword(password);
      setIsResetPassOpen(false);
      setIsSuccessOpen(true);
    }
  };

  const handleToggleStatus = (staffId, action) => {
    const newStatus = action === "lock" ? "inactive" : "active";
    setStaffList((prevList) => prevList.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s)));
    setIsToggleStatusOpen(false);
    setSelectedStaff(null);
  };

  const handleSaveStaff = (updatedStaff) => {
    setStaffList((prevList) => prevList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    setIsEditOpen(false);
    setSelectedStaff(null);
  };

  const handleAddStaff = (newStaffData) => {
    const currentMaxId = staffList.reduce((max, staff) => {
      const num = parseInt(staff.id.replace("STAFF", ""), 10);
      return num > max ? num : max;
    }, 0);
    const newId = `STAFF${String(currentMaxId + 1).padStart(3, "0")}`;

    const newStaff = {
      ...newStaffData,
      id: newId,
      status: "active",
      lastLogin: "Chưa từng đăng nhập",
      totalHours: 0,
      permissions: [],
      initialPassword: newStaffData.initialPassword,
    };

    setStaffList((prevList) => [...prevList, newStaff]);
    setNewPassword(newStaffData.initialPassword);
    setSelectedStaff(newStaff);
    setIsAddOpen(false);
    setIsSuccessOpen(true);
  };

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
            onClick={() => setIsAddOpen(true)}
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

      <StaffStats staff={filteredStaff} />

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 16,
        }}
      >
        <StaffFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          totalCount={filteredStaff.length}
        />
      </div>

      <StaffTable
        staff={staffSlice}
        page={page}
        pageSize={pageSize}
        total={filteredStaff.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        handlers={handlers}
      />

      {/* Modals */}
      <StaffDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} item={selectedStaff} />
      <StaffEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={selectedStaff}
        onSave={handleSaveStaff}
      />
      <StaffAddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAddStaff} />
      <ResetPasswordStaffModal
        isOpen={isResetPassOpen}
        onClose={() => setIsResetPassOpen(false)}
        item={selectedStaff}
        onReset={handleResetPassword}
      />
      <ToggleStatusStaffModal
        isOpen={isToggleStatusOpen}
        onClose={() => setIsToggleStatusOpen(false)}
        item={selectedStaff}
        actionType={toggleActionType}
        onToggle={handleToggleStatus}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (selectedStaff) {
            setStaffList((prevList) => prevList.filter((s) => s.id !== selectedStaff.id));
            setIsDeleteOpen(false);
            setSelectedStaff(null);
          }
        }}
        title="Xóa nhân viên"
        message="Bạn có chắc muốn xóa nhân viên"
        itemName={selectedStaff?.name}
        warningMessage="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa."
      />
      <PasswordResetSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          setSelectedStaff(null);
          setNewPassword("");
        }}
        item={{
          ...selectedStaff,
          initialPassword: newPassword,
        }}
      />
    </div>
  );
};

export default Staff;
