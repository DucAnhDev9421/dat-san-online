import React, { useState, useMemo } from "react";
import { Star, Reply, Flag, ThumbsUp, ThumbsDown } from "lucide-react";
import { reviewData } from "../data/mockData";

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = useMemo(
    () =>
      reviewData.filter((r) =>
        [r.customer, r.court, r.comment, r.status]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const averageRating = reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length;
  const totalReviews = reviewData.length;
  const repliedReviews = reviewData.filter(r => r.isOwnerReplied).length;
  const reportedReviews = reviewData.filter(r => r.status === 'reported').length;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#fbbf24" : "#e5e7eb"}
        color={i < rating ? "#fbbf24" : "#e5e7eb"}
      />
    ));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý đánh giá và phản hồi</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đánh giá trung bình</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>
            {averageRating.toFixed(1)} ⭐
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Tổng đánh giá</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937" }}>{totalReviews}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Đã phản hồi</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{repliedReviews}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Báo cáo</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>{reportedReviews}</div>
        </div>
      </div>

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
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <strong>Tổng:</strong> {filteredReviews.length} đánh giá
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="approved">Đã duyệt</option>
                <option value="reported">Báo cáo</option>
              </select>
            </div>
          </div>
          <input
            placeholder="Tìm theo khách hàng, sân, nội dung…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #e5e7eb",
              minWidth: "300px",
              fontSize: 14
            }}
          />
        </div>

        <div style={{ padding: 16 }}>
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                background: review.status === "reported" ? "#fef2f2" : "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{review.customer}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
                    {review.court} • {review.date}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => alert("Phản hồi đánh giá " + review.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background: "#3b82f6",
                      color: "#fff",
                      border: 0,
                      borderRadius: 8,
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <Reply size={14} />
                    Phản hồi
                  </button>
                  <button
                    onClick={() => alert("Báo cáo đánh giá " + review.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background: "#ef4444",
                      color: "#fff",
                      border: 0,
                      borderRadius: 8,
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <Flag size={14} />
                    Báo cáo
                  </button>
                </div>
              </div>
              
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 12, lineHeight: 1.5 }}>
                {review.comment}
              </div>

              {review.isOwnerReplied && (
                <div style={{
                  background: "#f0f9ff",
                  border: "1px solid #3b82f6",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#1e40af" }}>Phản hồi của bạn:</span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{review.replyDate}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#1e40af" }}>
                    {review.ownerReply}
                  </div>
                </div>
              )}

              {review.status === "reported" && (
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #ef4444",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 12,
                }}>
                  <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
                    ⚠️ Đánh giá này đã được báo cáo
                  </span>
                </div>
              )}
            </div>
          ))}

          {!filteredReviews.length && (
            <div style={{
              padding: 32,
              textAlign: "center",
              color: "#6b7280",
            }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>⭐</div>
              Không có dữ liệu đánh giá
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
