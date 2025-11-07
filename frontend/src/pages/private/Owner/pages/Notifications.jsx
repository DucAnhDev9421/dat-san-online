import React, { useState, useMemo } from "react";
import { Send } from "lucide-react";
import { notificationData } from "../data/mockData";
import NotificationDetailModal from "../modals/NotificationDetailModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import NotificationFilters from "../components/Notifications/NotificationFilters";
import NotificationTable from "../components/Notifications/NotificationTable";

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((r) =>
        [r.title, r.message, r.type, r.status].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, notifications]
  );

  const notificationSlice = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);

  const handlers = {
    onView: (notification) => {
      setSelectedNotification(notification);
      setIsDetailOpen(true);
    },
    onDelete: (notification) => {
      setSelectedNotification(notification);
      setIsDeleteOpen(true);
    },
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
              fontWeight: 700,
            }}
          >
            <Send size={16} /> Gửi thông báo
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 16,
        }}
      >
        <NotificationFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          totalCount={filteredNotifications.length}
        />
      </div>

      <NotificationTable
        notifications={notificationSlice}
        page={page}
        pageSize={pageSize}
        total={filteredNotifications.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        handlers={handlers}
      />

      <NotificationDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedNotification(null);
        }}
        onConfirm={() => {
          if (selectedNotification) {
            setNotifications((prev) => prev.filter((n) => n.id !== selectedNotification.id));
            setIsDeleteOpen(false);
            setSelectedNotification(null);
          }
        }}
        title="Xóa thông báo"
        message="Bạn có chắc muốn xóa thông báo"
        itemName={selectedNotification?.title}
      />
    </div>
  );
};

export default Notifications;
