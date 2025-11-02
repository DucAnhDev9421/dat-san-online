import React, { useState, useMemo } from "react";
import { Star, Check, X, Filter, Eye } from "lucide-react";
import { courtReviewsData } from "../data/mockData";

const CourtReviews = () => {
  const [reviews, setReviews] = useState(courtReviewsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all"); // all, 5, 4, 3, 2, 1

  // Lấy danh sách cơ sở duy nhất
  const uniqueFacilities = useMemo(() => {
    return [...new Set(reviews.map((r) => r.facility))].sort();
  }, [reviews]);

  // Tính toán thống kê
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter((r) => r.status === "approved").length;
    const pending = reviews.filter((r) => r.status === "pending").length;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / total || 0;
    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return { total, approved, pending, avgRating, ratingDistribution };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch = [r.facility, r.customer, r.comment]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;

      const matchesFacility =
        facilityFilter === "all" || r.facility === facilityFilter;

      const matchesRating =
        ratingFilter === "all" || r.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesFacility && matchesRating;
    });
  }, [reviews, searchQuery, statusFilter, facilityFilter, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const reviewSlice = filteredReviews.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#fbbf24" : "#e5e7eb"}
        color={i < rating ? "#fbbf24" : "#e5e7eb"}
        style={{ marginRight: 2 }}
      />
    ));
  };

  const handleApprove = (review) => {
    setReviews((current) =>
      current.map((r) =>
        r.id === review.id ? { ...r, status: "approved" } : r
      )
    );
  };

  const handleReject = (review) => {
    if (
      window.confirm(
        `Bạn có chắc muốn từ chối đánh giá này? Đánh giá sẽ bị xóa khỏi hệ thống.`
      )
    ) {
      setReviews((current) => current.filter((r) => r.id !== review.id));
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setFacilityFilter("all");
    setRatingFilter("all");
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Đánh giá cơ sở</h1>
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
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
            Tổng đánh giá
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
            {stats.total}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
            Điểm trung bình
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>
            {stats.avgRating.toFixed(1)}/5
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
            Đã duyệt
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#059669" }}>
            {stats.approved}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
            Chờ duyệt
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#d97706" }}>
            {stats.pending}
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
          {(statusFilter !== "all" ||
            facilityFilter !== "all" ||
            ratingFilter !== "all" ||
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
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#6b7280" }}>
              Tìm kiếm
            </label>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cơ sở, khách hàng, bình luận..."
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#6b7280" }}>
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
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#6b7280" }}>
              Cơ sở
            </label>
            <select
              value={facilityFilter}
              onChange={(e) => {
                setFacilityFilter(e.target.value);
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
              <option value="all">Tất cả cơ sở</option>
              {uniqueFacilities.map((facility) => (
                <option key={facility} value={facility}>
                  {facility}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#6b7280" }}>
              Đánh giá
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
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
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng đánh giá */}
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
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span style={{ marginLeft: 8 }}>entries</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            Hiển thị {filteredReviews.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã",
                  "Cơ sở",
                  "Khách hàng",
                  "Đánh giá",
                  "Bình luận",
                  "Ngày đánh giá",
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
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviewSlice.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 12 }}>
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>
                    {r.facility}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{r.customer}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {r.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {renderStars(r.rating)}
                      <span style={{ marginLeft: 4, fontSize: 12, color: "#6b7280" }}>
                        ({r.rating}/5)
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 12,
                      maxWidth: "350px",
                      color: "#374151",
                      lineHeight: 1.5,
                    }}
                    title={r.comment}
                  >
                    {r.comment.length > 80
                      ? r.comment.substring(0, 80) + "..."
                      : r.comment}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div>
                      <div>{r.date}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{r.time}</div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        background:
                          r.status === "approved" ? "#e6f9f0" : "#fef3c7",
                        color:
                          r.status === "approved" ? "#059669" : "#d97706",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {r.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(r)}
                          style={{
                            background: "#10b981",
                            color: "#fff",
                            border: 0,
                            borderRadius: 8,
                            padding: 8,
                            marginRight: 6,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          title="Duyệt đánh giá"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleReject(r)}
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: 0,
                            borderRadius: 8,
                            padding: 8,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          title="Từ chối đánh giá"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <span style={{ color: "#6b7280", fontSize: 12 }}>
                        Đã duyệt
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!reviewSlice.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy đánh giá nào
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
            {Math.min(page * pageSize, filteredReviews.length)} of{" "}
            {filteredReviews.length} entries
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
    </div>
  );
};

export default CourtReviews;
