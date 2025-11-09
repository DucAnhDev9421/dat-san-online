import React, { useState, useEffect } from "react";
import { Lock, Unlock, Trash2, UserPlus } from "lucide-react";
import { userApi } from "../../../../api/userApi";
import ActionConfirmationModal from "../modals/ActionConfirmationModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import UserFilters from "../components/Users/UserFilters";
import UserTable from "../components/Users/UserTable";
import UserDetailModal from "../components/Users/UserDetailModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          limit: pageSize,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        if (roleFilter !== "all") {
          params.role = roleFilter;
        }

        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        const result = await userApi.getAllUsers(params);

        if (result.success) {
          setUsers(result.data.users || []);
          setTotalUsers(result.data.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Không thể tải danh sách người dùng");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize, debouncedSearch, roleFilter, statusFilter]);

  // Handlers
  const handleViewDetails = async (user) => {
    try {
      setSelectedUser(user);
      setIsDetailModalOpen(true);

      const result = await userApi.getUserById(user._id || user.id);
      if (result.success) {
        setSelectedUser(result.data.user);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleLock = (user) => {
    setSelectedUser(user);
    setIsLockModalOpen(true);
  };

  const handleConfirmLock = async () => {
    if (!selectedUser) return;

    try {
      const result = await userApi.lockUser(selectedUser._id || selectedUser.id);
      if (result.success) {
        setUsers((current) =>
          current.map((u) =>
            (u._id || u.id) === (selectedUser._id || selectedUser.id)
              ? { ...u, isLocked: true }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error locking user:", err);
      alert(err.message || "Không thể khóa tài khoản");
    } finally {
      setIsLockModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUnlock = (user) => {
    setSelectedUser(user);
    setIsUnlockModalOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (!selectedUser) return;

    try {
      const result = await userApi.unlockUser(selectedUser._id || selectedUser.id);
      if (result.success) {
        setUsers((current) =>
          current.map((u) =>
            (u._id || u.id) === (selectedUser._id || selectedUser.id)
              ? { ...u, isLocked: false }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error unlocking user:", err);
      alert(err.message || "Không thể mở khóa tài khoản");
    } finally {
      setIsUnlockModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSoftDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const result = await userApi.deleteUser(selectedUser._id || selectedUser.id);
      if (result.success) {
        setUsers((current) =>
          current.map((u) =>
            (u._id || u.id) === (selectedUser._id || selectedUser.id)
              ? { ...u, isDeleted: true, isLocked: false }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message || "Không thể xóa tài khoản");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleRestore = (user) => {
    setSelectedUser(user);
    setIsRestoreModalOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!selectedUser) return;

    try {
      const result = await userApi.restoreUser(selectedUser._id || selectedUser.id);
      if (result.success) {
        setUsers((current) =>
          current.map((u) =>
            (u._id || u.id) === (selectedUser._id || selectedUser.id)
              ? { ...u, isDeleted: false }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error restoring user:", err);
      alert(err.message || "Không thể khôi phục tài khoản");
    } finally {
      setIsRestoreModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handlePromoteToOwner = (user) => {
    setSelectedUser(user);
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = async () => {
    if (!selectedUser) return;

    try {
      const result = await userApi.changeUserRole(selectedUser._id || selectedUser.id, "owner");
      if (result.success) {
        setUsers((current) =>
          current.map((u) =>
            (u._id || u.id) === (selectedUser._id || selectedUser.id)
              ? { ...u, role: "owner" }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error promoting user:", err);
      alert(err.message || "Không thể cấp quyền Owner");
    } finally {
      setIsPromoteModalOpen(false);
      setSelectedUser(null);
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

      <UserFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onRoleChange={(value) => {
          setRoleFilter(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <UserTable
        users={users}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        totalUsers={totalUsers}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleViewDetails}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onDelete={handleSoftDelete}
        onRestore={handleRestore}
        onPromote={handlePromoteToOwner}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
      />

      {/* Lock Modal */}
      <ActionConfirmationModal
        isOpen={isLockModalOpen}
        onClose={() => {
          setIsLockModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmLock}
        title="Khóa tài khoản"
        message={`Bạn có chắc muốn khóa tài khoản "${selectedUser?.name}"?`}
        confirmText="Khóa"
        confirmColor="#ef4444"
        icon={Lock}
        iconBg="#fee2e2"
        iconColor="#ef4444"
        warningMessage="Người dùng sẽ không thể đăng nhập cho đến khi mở khóa."
      />

      {/* Unlock Modal */}
      <ActionConfirmationModal
        isOpen={isUnlockModalOpen}
        onClose={() => {
          setIsUnlockModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmUnlock}
        title="Mở khóa tài khoản"
        message={`Bạn có chắc muốn mở khóa tài khoản "${selectedUser?.name}"?`}
        confirmText="Mở khóa"
        confirmColor="#10b981"
        icon={Unlock}
        iconBg="#e6f9f0"
        iconColor="#10b981"
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa tài khoản"
        message="Bạn có chắc muốn xóa tài khoản"
        itemName={selectedUser?.name}
        warningMessage="Tài khoản sẽ bị ẩn khỏi hệ thống nhưng có thể khôi phục."
      />

      {/* Restore Modal */}
      <ActionConfirmationModal
        isOpen={isRestoreModalOpen}
        onClose={() => {
          setIsRestoreModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmRestore}
        title="Khôi phục tài khoản"
        message={`Bạn có chắc muốn khôi phục tài khoản "${selectedUser?.name}"?`}
        confirmText="Khôi phục"
        confirmColor="#10b981"
        icon={UserPlus}
        iconBg="#e6f9f0"
        iconColor="#10b981"
      />

      {/* Promote Modal */}
      <ActionConfirmationModal
        isOpen={isPromoteModalOpen}
        onClose={() => {
          setIsPromoteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmPromote}
        title="Cấp quyền Owner"
        message={`Bạn có chắc muốn cấp quyền Owner cho "${selectedUser?.name}"?`}
        confirmText="Cấp quyền"
        confirmColor="#3b82f6"
        icon={UserPlus}
        iconBg="#dbeafe"
        iconColor="#3b82f6"
        warningMessage="Người dùng này sẽ có thể đăng ký mở cơ sở."
      />
    </div>
  );
};

export default Users;

