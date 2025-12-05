import React, { useState, useMemo } from "react";
import { notificationData } from "../data/mockData";
import ChatSidebar from "./../components/Notifications/ChatSidebar";
import ChatWindow from "./../components/Notifications/ChatWindow";

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  // Lọc tin nhắn theo tìm kiếm
  const filteredNotifications = useMemo(
    () =>
      notifications.filter((r) =>
        [r.title, r.message]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery, notifications]
  );

  // Lấy nội dung tin nhắn đang chọn để hiển thị bên phải
  const selectedNotification = useMemo(
    () => notifications.find((n) => n.id === selectedNotificationId),
    [notifications, selectedNotificationId]
  );

  // --- HÀM QUAN TRỌNG: XỬ LÝ KHI CLICK VÀO TIN NHẮN ---
  const handleSelect = (notification) => {
    // 1. Đặt ID tin nhắn này là tin nhắn đang xem
    setSelectedNotificationId(notification.id);

    // 2. CẬP NHẬT TRẠNG THÁI "ĐÃ ĐỌC":
    // Duyệt qua danh sách, tìm đúng tin nhắn vừa bấm và set unreadCount = 0
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id
          ? { ...n, unreadCount: 0, status: "read" } // Xóa số badge và đổi trạng thái
          : n
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotificationId === id) setSelectedNotificationId(null);
  };

  return (
    <div
      style={{
        // Các style để căn chỉnh full màn hình (như đã làm ở các bước trước)
        height: "calc(100vh - 60px)",
        margin: "-24px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <ChatSidebar
          notifications={filteredNotifications}
          selectedId={selectedNotificationId}
          onSelect={handleSelect} // Truyền hàm xử lý đã sửa vào đây
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ChatWindow
          notification={selectedNotification}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Notifications;
