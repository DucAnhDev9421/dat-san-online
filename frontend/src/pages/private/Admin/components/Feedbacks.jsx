import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  X,
} from "lucide-react";
import { feedbacksData } from "../data/mockData";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState(feedbacksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, complaint, feedback
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, resolved
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  // Filter data
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const matchesSearch =
        searchQuery === "" ||
        [
          feedback.senderName,
          feedback.senderEmail,
          feedback.subject,
          feedback.content,
          feedback.relatedFacility || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === "all" || feedback.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || feedback.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [feedbacks, searchQuery, typeFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedbacks.length / pageSize)
  );
  const feedbackSlice = filteredFeedbacks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailModalOpen(true);
  };

  const handleResolve = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.adminResponse || "");
    setIsResponseModalOpen(true);
  };

  const handleSaveResponse = () => {
    if (!responseText.trim()) {
      alert("Vui lòng nhập phản hồi");
      return;
    }

    setFeedbacks((current) =>
      current.map((f) =>
        f.id === selectedFeedback.id
          ? {
              ...f,
              status: "resolved",
              adminResponse: responseText.trim(),
              resolvedAt: new Date().toISOString().split("T")[0],
              resolvedBy: "Admin", // Có thể lấy từ user hiện tại
            }
          : f
      )
    );

    setIsResponseModalOpen(false);
    setSelectedFeedback(null);
    setResponseText("");
  };

  const handleDelete = (feedback) => {
    setSelectedFeedback(feedback);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFeedback) {
      setFeedbacks((current) =>
        current.filter((f) => f.id !== selectedFeedback.id)
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedFeedback(null);
  };

  const resetFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const formatDate = (date, time) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${d.toLocaleDateString("vi-VN")} ${time || ""}`;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const typeMap = {
    complaint: { label: "Khiếu nại", color: "#ef4444", bg: "#fee2e2", icon: AlertCircle },
    feedback: { label: "Góp ý", color: "#3b82f6", bg: "#dbeafe", icon: MessageSquare },
  };

  const statusMap = {
    pending: { label: "Đang xử lý", color: "#f59e0b", bg: "#fef3c7" },
    resolved: { label: "Đã phản hồi", color: "#10b981", bg: "#e6f9f0" },
  };

  const stats = useMemo(() => {
    const total = feedbacks.length;
    const pending = feedbacks.filter((f) => f.status === "pending").length;
    const resolved = feedbacks.filter((f) => f.status === "resolved").length;
    const complaints = feedbacks.filter((f) => f.type === "complaint").length;
    const suggestions = feedbacks.filter((f) => f.type === "feedback").length;

    return { total, pending, resolved, complaints, suggestions };
  }, [feedbacks]);

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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>
          Quản lý phản hồi / khiếu nại
        </h1>
      </div>

      {/* Thống kê */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
            Tổng số phản hồi
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#374151" }}>
            {stats.total}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
            Đang xử lý
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>
            {stats.pending}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
            Đã phản hồi
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>
            {stats.resolved}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
            Khiếu nại
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>
            {stats.complaints}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
            Góp ý
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6" }}>
            {stats.suggestions}
          </div>
        </div>
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
          {(typeFilter !== "all" ||
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
                placeholder="Tên, email, nội dung..."
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
              Loại phản hồi
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
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
              <option value="complaint">Khiếu nại</option>
              <option value="feedback">Góp ý</option>
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
              <option value="pending">Đang xử lý</option>
              <option value="resolved">Đã phản hồi</option>
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
            Hiển thị {filteredFeedbacks.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Người gửi",
                  "Loại phản hồi",
                  "Tiêu đề",
                  "Nội dung",
                  "Sân liên quan",
                  "Ngày gửi",
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
              {feedbackSlice.map((feedback) => {
                const type = typeMap[feedback.type] || typeMap.feedback;
                const status = statusMap[feedback.status] || statusMap.pending;

                return (
                  <tr
                    key={feedback.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      opacity: feedback.status === "resolved" ? 0.8 : 1,
                    }}
                  >
                    <td style={{ padding: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{feedback.senderName}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {feedback.senderEmail}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            marginTop: 2,
                          }}
                        >
                          {feedback.senderRole === "customer" ? "Khách hàng" : "Chủ sân"}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: type.bg,
                          color: type.color,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <type.icon size={12} />
                        {type.label}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600, maxWidth: 200 }}>
                      {feedback.subject}
                    </td>
                    <td style={{ padding: 12, maxWidth: 300 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          lineHeight: 1.5,
                        }}
                      >
                        {truncateText(feedback.content, 150)}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      {feedback.relatedFacility ? (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#059669",
                            fontWeight: 600,
                          }}
                        >
                          {feedback.relatedFacility}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: 12, color: "#6b7280", fontSize: 13 }}>
                      {formatDate(feedback.createdAt, feedback.createdTime)}
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
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => handleViewDetail(feedback)}
                          title="Xem chi tiết"
                          style={{
                            background: "#3b82f6",
                            color: "#fff",
                            border: 0,
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontSize: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Eye size={14} />
                          Xem
                        </button>
                        {feedback.status === "pending" && (
                          <button
                            onClick={() => handleResolve(feedback)}
                            title="Phản hồi"
                            style={{
                              background: "#10b981",
                              color: "#fff",
                              border: 0,
                              borderRadius: 6,
                              padding: "6px 10px",
                              cursor: "pointer",
                              fontSize: 12,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <CheckCircle size={14} />
                            Phản hồi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!feedbackSlice.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy phản hồi nào
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
            {Math.min(page * pageSize, filteredFeedbacks.length)} of{" "}
            {filteredFeedbacks.length} entries
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
      {isDetailModalOpen && selectedFeedback && (
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
          onClick={() => {
            setIsDetailModalOpen(false);
            setSelectedFeedback(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: "700px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>
                Chi tiết phản hồi
              </h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedFeedback(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                  Người gửi
                </label>
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontWeight: 600 }}>{selectedFeedback.senderName}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    {selectedFeedback.senderEmail} | {selectedFeedback.senderPhone}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {selectedFeedback.senderRole === "customer"
                      ? "Khách hàng"
                      : "Chủ sân"}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                  Loại phản hồi
                </label>
                <div style={{ marginTop: 4 }}>
                  {(() => {
                    const type = typeMap[selectedFeedback.type];
                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: type.bg,
                          color: type.color,
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        <type.icon size={14} />
                        {type.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                  Tiêu đề
                </label>
                <div style={{ marginTop: 4, fontWeight: 600, fontSize: 15 }}>
                  {selectedFeedback.subject}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                  Nội dung
                </label>
                <div
                  style={{
                    marginTop: 4,
                    padding: 12,
                    background: "#f9fafb",
                    borderRadius: 8,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#374151",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedFeedback.content}
                </div>
              </div>

              {selectedFeedback.relatedFacility && (
                <div>
                  <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                    Sân liên quan
                  </label>
                  <div style={{ marginTop: 4, fontWeight: 600, color: "#059669" }}>
                    {selectedFeedback.relatedFacility}
                  </div>
                </div>
              )}

              {selectedFeedback.relatedBooking && (
                <div>
                  <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                    Mã đặt sân
                  </label>
                  <div style={{ marginTop: 4, fontWeight: 600 }}>
                    {selectedFeedback.relatedBooking}
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                  Ngày gửi
                </label>
                <div style={{ marginTop: 4 }}>
                  {formatDate(
                    selectedFeedback.createdAt,
                    selectedFeedback.createdTime
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                  Trạng thái
                </label>
                <div style={{ marginTop: 4 }}>
                  {(() => {
                    const status = statusMap[selectedFeedback.status];
                    return (
                      <span
                        style={{
                          background: status.bg,
                          color: status.color,
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {selectedFeedback.adminResponse && (
                <div>
                  <label style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                    Phản hồi của admin
                  </label>
                  <div
                    style={{
                      marginTop: 4,
                      padding: 12,
                      background: "#e6f9f0",
                      borderRadius: 8,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "#059669",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedFeedback.adminResponse}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    Phản hồi bởi: {selectedFeedback.resolvedBy} vào{" "}
                    {formatDate(selectedFeedback.resolvedAt)}
                  </div>
                </div>
              )}

              {selectedFeedback.status === "pending" && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleResolve(selectedFeedback);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Phản hồi phản hồi này
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal phản hồi */}
      {isResponseModalOpen && selectedFeedback && (
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
          onClick={() => {
            setIsResponseModalOpen(false);
            setSelectedFeedback(null);
            setResponseText("");
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: "600px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>Phản hồi phản hồi</h2>
              <button
                onClick={() => {
                  setIsResponseModalOpen(false);
                  setSelectedFeedback(null);
                  setResponseText("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                Phản hồi từ: <strong>{selectedFeedback.senderName}</strong>
              </div>
              <div
                style={{
                  padding: 12,
                  background: "#f9fafb",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 12,
                }}
              >
                {selectedFeedback.subject}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Nội dung phản hồi *
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Nhập nội dung phản hồi cho người dùng..."
                rows={6}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                onClick={() => {
                  setIsResponseModalOpen(false);
                  setSelectedFeedback(null);
                  setResponseText("");
                }}
                style={{
                  padding: "10px 20px",
                  background: "#fff",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveResponse}
                style={{
                  padding: "10px 20px",
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFeedback(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa phản hồi"
        message="Bạn có chắc muốn xóa phản hồi"
        itemName={selectedFeedback?.subject}
        warningMessage="Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default Feedbacks;

