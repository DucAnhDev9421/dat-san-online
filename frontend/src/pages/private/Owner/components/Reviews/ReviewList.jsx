import React from "react";
import { Star } from "lucide-react";
import ReviewCard from "./ReviewCard";
import Pagination from "../shared/Pagination";

const ReviewList = ({
  reviews = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  onReply,
  onReport,
}) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} fill={i < rating ? "#fbbf24" : "#e5e7eb"} color={i < rating ? "#fbbf24" : "#e5e7eb"} />
    ));
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ padding: 16 }}>
        {reviews.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>⭐</div>
            Không có dữ liệu đánh giá
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onReply={onReply} onReport={onReport} renderStars={renderStars} />
          ))
        )}
      </div>

      {reviews.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemsLabel="đánh giá"
        />
      )}
    </div>
  );
};

export default ReviewList;

