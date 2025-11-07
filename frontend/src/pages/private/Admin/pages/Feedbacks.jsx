import React, { useState, useMemo } from "react";
import { AlertCircle, MessageSquare } from "lucide-react";
import { feedbacksData } from "../data/mockData";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import FeedbackStats from "../components/Feedbacks/FeedbackStats";
import FeedbackFilters from "../components/Feedbacks/FeedbackFilters";
import FeedbackTable from "../components/Feedbacks/FeedbackTable";
import FeedbackDetailModal from "../components/Feedbacks/FeedbackDetailModal";
import FeedbackResponseModal from "../components/Feedbacks/FeedbackResponseModal";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState(feedbacksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

  // Maps
  const typeMap = {
    complaint: {
      label: "Khiếu nại",
      color: "#ef4444",
      bg: "#fee2e2",
      icon: AlertCircle,
    },
    feedback: {
      label: "Góp ý",
      color: "#3b82f6",
      bg: "#dbeafe",
      icon: MessageSquare,
    },
  };

  const statusMap = {
    pending: { label: "Đang xử lý", color: "#f59e0b", bg: "#fef3c7" },
    resolved: { label: "Đã phản hồi", color: "#10b981", bg: "#e6f9f0" },
  };

  // Stats
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const pending = feedbacks.filter((f) => f.status === "pending").length;
    const resolved = feedbacks.filter((f) => f.status === "resolved").length;
    const complaints = feedbacks.filter((f) => f.type === "complaint").length;
    const suggestions = feedbacks.filter((f) => f.type === "feedback").length;

    return { total, pending, resolved, complaints, suggestions };
  }, [feedbacks]);

  // Handlers
  const handleViewDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedFeedback(null);
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
              resolvedBy: "Admin",
            }
          : f
      )
    );

    setIsResponseModalOpen(false);
    setSelectedFeedback(null);
    setResponseText("");
  };

  const handleCloseResponseModal = () => {
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

      <FeedbackStats stats={stats} />

      <FeedbackFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onTypeChange={(value) => {
          setTypeFilter(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <FeedbackTable
        feedbacks={feedbackSlice}
        page={page}
        pageSize={pageSize}
        totalItems={filteredFeedbacks.length}
        typeMap={typeMap}
        statusMap={statusMap}
        formatDate={formatDate}
        truncateText={truncateText}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleViewDetail}
        onResolve={handleResolve}
      />

      <FeedbackDetailModal
        isOpen={isDetailModalOpen}
        feedback={selectedFeedback}
        typeMap={typeMap}
        statusMap={statusMap}
        formatDate={formatDate}
        onClose={handleCloseDetailModal}
        onResolve={handleResolve}
      />

      <FeedbackResponseModal
        isOpen={isResponseModalOpen}
        feedback={selectedFeedback}
        responseText={responseText}
        onResponseChange={setResponseText}
        onSave={handleSaveResponse}
        onClose={handleCloseResponseModal}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFeedback(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa phản hồi"
        message="Bạn có chắc muốn xóa phản hồi này"
        itemName={selectedFeedback?.subject}
      />
    </div>
  );
};

export default Feedbacks;

