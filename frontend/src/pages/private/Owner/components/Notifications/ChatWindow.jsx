import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

const ChatWindow = ({ notification }) => {
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // --- HÀM TÍNH TOÁN THỜI GIAN HIỂN THỊ ---
  const getDisplayTime = (timestamp) => {
    if (!timestamp) return "";
    const now = Date.now();
    const diff = now - timestamp; // Khoảng cách thời gian (ms)
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;

    // Nếu quá 1 tiếng thì hiện giờ cụ thể (VD: 14:30)
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Khởi tạo tin nhắn từ notification
  useEffect(() => {
    if (notification) {
      setMessages([
        {
          id: "init",
          text: notification.message,
          sender: "sys",
          // Giả lập timestamp cho tin nhắn hệ thống (lấy giờ hiện tại trừ đi chút xíu hoặc parse từ notification.time nếu cần)
          timestamp: Date.now() - 100000,
          showTime: true, // Tin nhắn hệ thống mặc định hiện giờ
        },
      ]);
    }
  }, [notification]);

  // Cuộn xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- XỬ LÝ GỬI TIN NHẮN ---
  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const newId = Date.now();

    const newMessage = {
      id: newId,
      text: replyText,
      sender: "me",
      timestamp: Date.now(),
      showTime: true, // Ban đầu cho hiện chữ "Vừa xong"
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyText("");

    // --- LOGIC TỰ ĐỘNG ẨN SAU 3 GIÂY ---
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newId ? { ...msg, showTime: false } : msg
        )
      );
    }, 3000); // 3000ms = 3 giây
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // --- XỬ LÝ CLICK VÀO TIN NHẮN ĐỂ HIỆN/ẨN GIỜ ---
  const toggleTimeVisibility = (msgId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId ? { ...msg, showTime: !msg.showTime } : msg
      )
    );
  };

  if (!notification) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          color: "#9ca3af",
        }}
      >
        <p>Chọn một thông báo để xem chi tiết</p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "info":
        return "#3b82f6";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#10b981";
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 18, color: "#1f2937" }}>
            {notification.title}
          </h3>
          <span
            style={{
              fontSize: 13,
              color: getTypeColor(notification.type),
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: getTypeColor(notification.type),
              }}
            ></span>
            {notification.type === "info" ? "Thông tin" : notification.type}
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          background: "#f9fafb",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: 12,
                maxWidth: "70%",
                alignSelf: isMe ? "flex-end" : "flex-start",
                flexDirection: isMe ? "row-reverse" : "row",
                cursor: "pointer", // Thêm icon bàn tay để biết là bấm được
              }}
              // Sự kiện click vào toàn bộ khối tin nhắn
              onClick={() => toggleTimeVisibility(msg.id)}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isMe ? "#10b981" : "#4e42ae",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {isMe ? "ME" : "SYS"}
              </div>

              {/* Message Bubble + Time */}
              <div>
                <div
                  style={{
                    background: isMe ? "#4e42ae" : "#fff",
                    padding: "12px 16px",
                    borderRadius: isMe
                      ? "12px 0 12px 12px"
                      : "0 12px 12px 12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    border: isMe ? "none" : "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.5,
                      color: isMe ? "#fff" : "#374151",
                      fontSize: 15,
                    }}
                  >
                    {msg.text}
                  </p>
                </div>

                {/* --- CHỈ HIỆN THỜI GIAN KHI showTime = TRUE --- */}
                {msg.showTime && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      marginTop: 4,
                      display: "block",
                      textAlign: isMe ? "right" : "left",
                      animation: "fadeIn 0.3s ease-in-out", // Hiệu ứng hiện ra nhẹ nhàng
                    }}
                  >
                    {getDisplayTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: 16,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 12,
        }}
      >
        <input
          type="text"
          placeholder="Viết phản hồi..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: "#f3f4f6",
            border: "none",
            borderRadius: 24,
            padding: "12px 20px",
            outline: "none",
            fontSize: 15,
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#4e42ae",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
