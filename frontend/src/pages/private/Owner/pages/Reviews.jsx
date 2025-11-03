import React, { useState, useMemo } from "react";
import { reviewData } from "../data/mockData";
import ReplyReviewModal from "../modals/ReplyReviewModal";
import ReportReviewModal from "../modals/ReportReviewModal";
import ReviewStats from "../components/Reviews/ReviewStats";
import ReviewFilters from "../components/Reviews/ReviewFilters";
import ReviewList from "../components/Reviews/ReviewList";

const Reviews = () => {
  const [reviews, setReviews] = useState(reviewData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [replyingReview, setReplyingReview] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine status filter with search
  const finalSearchQuery = useMemo(() => {
    if (statusFilter !== "all") {
      return statusFilter;
    }
    return searchQuery;
  }, [searchQuery, statusFilter]);

  const filteredReviews = useMemo(
    () =>
      reviews.filter((r) => {
        if (statusFilter !== "all" && r.status !== statusFilter) {
          return false;
        }
        if (statusFilter === "all" && searchQuery) {
          return [r.customer, r.court, r.comment, r.status].join(" ").toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      }),
    [searchQuery, statusFilter, reviews]
  );

  const reviewSlice = filteredReviews.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý đánh giá và phản hồi</h1>
      </div>

      <ReviewStats reviews={reviews} />

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,.06)",
          marginBottom: 16,
        }}
      >
        <ReviewFilters
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
          totalCount={filteredReviews.length}
        />
      </div>

      <ReviewList
        reviews={reviewSlice}
        page={page}
        pageSize={pageSize}
        total={filteredReviews.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onReply={(review) => {
          setReplyingReview(review);
          setIsReplyOpen(true);
        }}
        onReport={(review) => {
          setReplyingReview(review);
          setIsReportOpen(true);
        }}
      />

      <ReplyReviewModal
        isOpen={isReplyOpen}
        onClose={() => {
          setIsReplyOpen(false);
          setReplyingReview(null);
        }}
        review={replyingReview}
        onSubmit={(replyText) => {
          const now = new Date().toISOString().split("T")[0];
          setReviews((prev) =>
            prev.map((r) =>
              r.id === replyingReview.id ? { ...r, isOwnerReplied: true, ownerReply: replyText, replyDate: now } : r
            )
          );
          setIsReplyOpen(false);
          setReplyingReview(null);
        }}
      />

      <ReportReviewModal
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setReplyingReview(null);
        }}
        review={replyingReview}
        onSubmit={({ reason, note }) => {
          setReviews((prev) =>
            prev.map((r) =>
              r.id === replyingReview.id
                ? { ...r, status: "reported", report: { reason, note, date: new Date().toISOString().split("T")[0] } }
                : r
            )
          );
          setIsReportOpen(false);
          setReplyingReview(null);
        }}
      />
    </div>
  );
};

export default Reviews;
