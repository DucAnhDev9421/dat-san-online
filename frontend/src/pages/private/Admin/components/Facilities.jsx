import React, { useState, useMemo } from "react";
import { Eye, Check, X, ExternalLink } from "lucide-react";
import { facilityData } from "../data/mockData";
import ApproveFacilityModal from "../modals/ApproveFacilityModal";
import RejectFacilityModal from "../modals/RejectFacilityModal";

const Facilities = () => {
  const [facilities, setFacilities] = useState(facilityData);
  const [activeTab, setActiveTab] = useState("all"); // "all" hoặc "pending"
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Status map
  const statusMap = {
    active: { label: "Đang hoạt động", color: "#059669", bg: "#e6f9f0" },
    paused: { label: "Tạm dừng", color: "#d97706", bg: "#fef3c7" },
    hidden: { label: "Đã ẩn", color: "#6b7280", bg: "#f3f4f6" },
    pending: { label: "Chờ duyệt", color: "#dc2626", bg: "#fee2e2" },
  };

  // Lọc dữ liệu theo tab
  const filteredByTab = useMemo(() => {
    if (activeTab === "pending") {
      return facilities.filter((f) => f.approvalStatus === "pending");
    }
    return facilities.filter((f) => f.approvalStatus === "approved");
  }, [facilities, activeTab]);

  // Lọc theo search
  const filteredFacilities = useMemo(
    () =>
      filteredByTab.filter((f) =>
        [f.name, f.address, f.owner, ...(f.sports || [])]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [filteredByTab, searchQuery]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFacilities.length / pageSize)
  );
  const facilitySlice = filteredFacilities.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedFacility(null);
  };

  const handleApprove = (facility) => {
    setSelectedFacility(facility);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (selectedFacility) {
      setFacilities((current) =>
        current.map((f) =>
          f.id === selectedFacility.id
            ? {
                ...f,
                approvalStatus: "approved",
                status: "active",
              }
            : f
        )
      );
    }
    setIsApproveModalOpen(false);
    setSelectedFacility(null);
  };

  const handleReject = (facility) => {
    setSelectedFacility(facility);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedFacility) {
      setFacilities((current) =>
        current.filter((f) => f.id !== selectedFacility.id)
      );
    }
    setIsRejectModalOpen(false);
    setSelectedFacility(null);
  };

  const handleNavigateToOwner = (ownerId) => {
    // TODO: Navigate to owner detail page
    console.log("Navigate to owner:", ownerId);
    // Có thể dùng React Router: navigate(`/admin/owners/${ownerId}`)
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý cơ sở</h1>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: "#fff",
          padding: 8,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <button
          onClick={() => {
            setActiveTab("all");
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: activeTab === "all" ? "#10b981" : "transparent",
            color: activeTab === "all" ? "#fff" : "#6b7280",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s",
          }}
        >
          Tất cả ({facilities.filter((f) => f.approvalStatus === "approved").length})
        </button>
        <button
          onClick={() => {
            setActiveTab("pending");
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: activeTab === "pending" ? "#10b981" : "transparent",
            color: activeTab === "pending" ? "#fff" : "#6b7280",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s",
            position: "relative",
          }}
        >
          Chờ duyệt ({facilities.filter((f) => f.approvalStatus === "pending").length})
          {facilities.filter((f) => f.approvalStatus === "pending").length > 0 && (
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                background: "#ef4444",
                borderRadius: "50%",
              }}
            />
          )}
        </button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1, maxWidth: "400px" }}>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm tên cơ sở, địa chỉ, chủ sân, môn thể thao..."
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            Hiển thị {filteredFacilities.length} kết quả
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
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Tên cơ sở",
                  "Địa chỉ",
                  "Môn thể thao",
                  "Chủ sân",
                  "Giá / giờ",
                  "Tình trạng",
                  "Ngày tạo",
                  activeTab === "pending" ? "Duyệt" : "Hành động",
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
              {facilitySlice.map((facility) => {
                const status = statusMap[facility.status] || statusMap.pending;

                return (
                  <tr key={facility.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{facility.name}</td>
                  <td
                    style={{
                      padding: 12,
                        maxWidth: "250px",
                        color: "#6b7280",
                      }}
                      title={facility.address}
                    >
                      {facility.address}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {facility.sports?.map((sport, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "#e6f9f0",
                              color: "#059669",
                              padding: "4px 8px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => handleNavigateToOwner(facility.ownerId)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "none",
                          border: "none",
                          color: "#3b82f6",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: 14,
                          padding: 0,
                        }}
                      >
                        {facility.owner}
                        <ExternalLink size={14} />
                      </button>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600, color: "#059669" }}>
                      {formatPrice(facility.pricePerHour)} VNĐ/giờ
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
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {facility.createdAt}
                  </td>
                  <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      {activeTab === "pending" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => handleApprove(facility)}
                            style={{
                              background: "#10b981",
                              color: "#fff",
                              border: 0,
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                            title="Duyệt cơ sở"
                          >
                            <Check size={14} />
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(facility)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: 0,
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                            title="Từ chối cơ sở"
                          >
                            <X size={14} />
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleViewDetails(facility)}
                          style={{
                            background: "#06b6d4",
                            color: "#fff",
                            border: 0,
                            borderRadius: 8,
                            padding: "8px 12px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                          Xem chi tiết
                        </button>
                      )}
                  </td>
                </tr>
                );
              })}
              {!facilitySlice.length && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    {activeTab === "pending"
                      ? "Không có cơ sở nào chờ duyệt"
                      : "Không tìm thấy cơ sở nào"}
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
            {Math.min(page * pageSize, filteredFacilities.length)} of{" "}
            {filteredFacilities.length} entries
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

      {/* Modal chi tiết - giữ nguyên nếu cần */}
      {isDetailModalOpen && selectedFacility && (
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
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Chi tiết cơ sở: {selectedFacility.name}
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <strong>Địa chỉ:</strong> {selectedFacility.address}
              </div>
              <div>
                <strong>Chủ sân:</strong> {selectedFacility.owner}
              </div>
              <div>
                <strong>Môn thể thao:</strong> {selectedFacility.sports?.join(", ")}
              </div>
              <div>
                <strong>Giá/giờ:</strong> {formatPrice(selectedFacility.pricePerHour)} VNĐ
              </div>
              <div>
                <strong>Tình trạng:</strong>{" "}
                <span
                  style={{
                    background: statusMap[selectedFacility.status]?.bg,
                    color: statusMap[selectedFacility.status]?.color,
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {statusMap[selectedFacility.status]?.label}
                </span>
              </div>
              <div>
                <strong>Ngày tạo:</strong> {selectedFacility.createdAt}
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <ApproveFacilityModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedFacility(null);
        }}
        onConfirm={handleConfirmApprove}
        facility={selectedFacility}
      />

      {/* Reject Modal */}
      <RejectFacilityModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedFacility(null);
        }}
        onConfirm={handleConfirmReject}
        facility={selectedFacility}
      />
    </div>
  );
};

export default Facilities;
