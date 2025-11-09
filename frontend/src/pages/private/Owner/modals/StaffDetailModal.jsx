import React from "react";
import { X, User, Mail, Phone, Briefcase, DollarSign, Calendar, Clock, TrendingUp, Shield } from "lucide-react";
import useClickOutside from "../../../../hook/use-click-outside";
import useBodyScrollLock from "../../../../hook/use-body-scroll-lock";
import useEscapeKey from "../../../../hook/use-escape-key";

const StaffDetailModal = ({ isOpen, onClose, item: staff = {} }) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const modalRef = useClickOutside(onClose, isOpen);

  if (!isOpen || !staff) return null;

  const statusMap = {
    active: { bg: "#dcfce7", color: "#059669", text: "Hoạt động" },
    inactive: { bg: "#fee2e2", color: "#ef4444", text: "Tạm ngưng" },
  };

  const performanceMap = {
    "Tốt": { bg: "#dcfce7", color: "#059669" },
    "Trung bình": { bg: "#fef3c7", color: "#d97706" },
    "Yếu": { bg: "#fee2e2", color: "#ef4444" },
  };

  const statusConfig = statusMap[staff.status] || statusMap.inactive;
  const performanceConfig = performanceMap[staff.performance] || performanceMap["Trung bình"];

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Chưa có thông tin";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" }}>
              Chi tiết nhân viên
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0 0" }}>
              {staff.id} • {staff.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              padding: "4px",
            }}
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "24px",
            background: "#f9fafb",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Basic Info */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <User size={20} color="#3b82f6" />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#374151" }}>
                Thông tin cơ bản
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <User size={14} />
                  Họ tên
                </label>
                <div style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>
                  {staff.name || "Chưa có thông tin"}
                </div>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <Phone size={14} />
                  Số điện thoại
                </label>
                <div style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>
                  {staff.phone || "Chưa có thông tin"}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <Mail size={14} />
                  Email
                </label>
                <div style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>
                  {staff.email || "Chưa có thông tin"}
                </div>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Briefcase size={20} color="#10b981" />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#374151" }}>
                Thông tin công việc
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  Chức vụ
                </label>
                <div style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>
                  {staff.position || "Chưa có thông tin"}
                </div>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <DollarSign size={14} />
                  Lương
                </label>
                <div style={{ fontSize: 15, color: "#059669", fontWeight: 600 }}>
                  {formatCurrency(staff.salary)}
                </div>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <Calendar size={14} />
                  Ngày vào làm
                </label>
                <div style={{ fontSize: 14, color: "#111827" }}>
                  {staff.joinDate || "Chưa có thông tin"}
                </div>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <TrendingUp size={14} />
                  Hiệu suất
                </label>
                <span
                  style={{
                    display: "inline-block",
                    background: performanceConfig.bg,
                    color: performanceConfig.color,
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {staff.performance || "Chưa có thông tin"}
                </span>
              </div>
            </div>
          </div>

          {/* Status & Activity */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Shield size={20} color="#f59e0b" />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#374151" }}>
                Trạng thái & Hoạt động
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  Trạng thái
                </label>
                <span
                  style={{
                    display: "inline-block",
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {statusConfig.text}
                </span>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  <Clock size={14} />
                  Đăng nhập cuối
                </label>
                <div style={{ fontSize: 14, color: "#111827" }}>
                  {staff.lastLogin || "Chưa có thông tin"}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>
                  Tổng giờ làm việc
                </label>
                <div style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>
                  {staff.totalHours ? `${staff.totalHours} giờ` : "Chưa có thông tin"}
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          {staff.permissions && staff.permissions.length > 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#374151" }}>
                Quyền hạn
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {staff.permissions.map((perm, idx) => {
                  const permLabels = {
                    manage_courts: "Quản lý sân",
                    manage_bookings: "Quản lý đặt sân",
                    view_reports: "Xem báo cáo",
                  };
                  return (
                    <span
                      key={idx}
                      style={{
                        background: "#e6f3ff",
                        color: "#1d4ed8",
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {permLabels[perm] || perm}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: "20px 24px",
            borderTop: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e5e7eb";
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailModal;

