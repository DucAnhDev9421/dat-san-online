import React, { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import { promotionsData } from "../data/mockData";
import { facilityData } from "../data/mockData";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

const ActionButton = ({ bg, Icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: bg,
      color: "#fff",
      border: 0,
      borderRadius: 8,
      padding: 8,
      marginRight: 6,
      cursor: "pointer",
    }}
  >
    <Icon size={16} />
  </button>
);

const Promotions = () => {
  const [promotions, setPromotions] = useState(promotionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, expired
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState(["Tất cả sân"]);

  // Get unique facilities
  const uniqueFacilities = useMemo(() => {
    return ["Tất cả sân", ...facilityData.map((f) => f.name)].sort();
  }, []);

  // Check status based on dates
  const getStatus = (promotion) => {
    const today = new Date().toISOString().split("T")[0];
    if (promotion.status === "expired") return "expired";
    if (promotion.endDate < today) return "expired";
    if (promotion.startDate > today) return "pending";
    return "active";
  };

  // Filter data
  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const matchesSearch =
        searchQuery === "" ||
        [
          promotion.code,
          promotion.name,
          promotion.applicableFacilities.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const currentStatus = getStatus(promotion);
      const matchesStatus =
        statusFilter === "all" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [promotions, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPromotions.length / pageSize)
  );
  const promotionSlice = filteredPromotions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatDiscount = (promotion) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountValue}%`;
    }
    return `${formatPrice(promotion.discountValue)} VNĐ`;
  };

  const handleAdd = () => {
    setSelectedPromotion(null);
    setSelectedFacilities(["Tất cả sân"]);
    setIsAddModalOpen(true);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setSelectedFacilities(promotion.applicableFacilities || ["Tất cả sân"]);
    setIsEditModalOpen(true);
  };

  const handleDelete = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPromotion) {
      setPromotions((current) =>
        current.filter((p) => p.id !== selectedPromotion.id)
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedPromotion(null);
  };

  const handleSave = (promotionData) => {
    if (selectedPromotion) {
      // Edit
      setPromotions((current) =>
        current.map((p) =>
          p.id === selectedPromotion.id
            ? { ...promotionData, id: selectedPromotion.id }
            : p
        )
      );
      setIsEditModalOpen(false);
    } else {
      // Add
      const newPromotion = {
        ...promotionData,
        id: `PR${String(promotions.length + 1).padStart(3, "0")}`,
        usageCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setPromotions((current) => [newPromotion, ...current]);
      setIsAddModalOpen(false);
    }
    setSelectedPromotion(null);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const statusMap = {
    active: { label: "Còn hạn", color: "#059669", bg: "#e6f9f0" },
    expired: { label: "Hết hạn", color: "#6b7280", bg: "#f3f4f6" },
    pending: { label: "Sắp diễn ra", color: "#d97706", bg: "#fef3c7" },
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
          Quản lý khuyến mãi
        </h1>
        <button
          onClick={handleAdd}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#10b981",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          <Plus size={16} /> Tạo khuyến mãi
        </button>
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
          {(statusFilter !== "all" || searchQuery) && (
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
                placeholder="Mã, tên chương trình, sân..."
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
              <option value="active">Còn hạn</option>
              <option value="expired">Hết hạn</option>
              <option value="pending">Sắp diễn ra</option>
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
            Hiển thị {filteredPromotions.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã khuyến mãi",
                  "Tên chương trình",
                  "Mức giảm",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Áp dụng cho",
                  "Sử dụng",
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
              {promotionSlice.map((promotion) => {
                const currentStatus = getStatus(promotion);
                const status = statusMap[currentStatus] || statusMap.active;

                return (
                  <tr
                    key={promotion.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      opacity: currentStatus === "expired" ? 0.6 : 1,
                    }}
                  >
                    <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>
                      {promotion.code}
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>
                      {promotion.name}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontWeight: 700,
                          color: "#059669",
                        }}
                      >
                        {promotion.discountType === "percentage" ? (
                          <Percent size={16} />
                        ) : (
                          <DollarSign size={16} />
                        )}
                        {formatDiscount(promotion)}
                      </div>
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {promotion.startDate}
                    </td>
                    <td style={{ padding: 12, color: "#6b7280" }}>
                      {promotion.endDate}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ maxWidth: "200px" }}>
                        {promotion.applicableFacilities[0] === "Tất cả sân" ? (
                          <span
                            style={{
                              background: "#e6f9f0",
                              color: "#059669",
                              padding: "4px 8px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            Tất cả sân
                          </span>
                        ) : (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                            title={promotion.applicableFacilities.join(", ")}
                          >
                            {promotion.applicableFacilities.length > 1
                              ? `${promotion.applicableFacilities[0]} (+${promotion.applicableFacilities.length - 1})`
                              : promotion.applicableFacilities[0]}
                          </div>
                        )}
                        {promotion.applicableAreas.length > 0 && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#9ca3af",
                              marginTop: 4,
                            }}
                          >
                            {promotion.applicableAreas.join(", ")}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {promotion.usageCount} lượt
                        </div>
                        {promotion.maxUsage && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                          >
                            / {promotion.maxUsage} tối đa
                          </div>
                        )}
                      </div>
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
                      <ActionButton
                        bg="#22c55e"
                        Icon={Pencil}
                        onClick={() => handleEdit(promotion)}
                        title="Sửa"
                      />
                      <ActionButton
                        bg="#ef4444"
                        Icon={Trash2}
                        onClick={() => handleDelete(promotion)}
                        title="Xóa"
                      />
                    </td>
                  </tr>
                );
              })}
              {!promotionSlice.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy khuyến mãi nào
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
            {Math.min(page * pageSize, filteredPromotions.length)} of{" "}
            {filteredPromotions.length} entries
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

      {/* Modal thêm/sửa */}
      {(isAddModalOpen || isEditModalOpen) && (
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
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedPromotion(null);
          }}
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
              {selectedPromotion
                ? "Sửa chương trình khuyến mãi"
                : "Tạo chương trình khuyến mãi mới"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                const promotionData = {
                  code: formData.get("code").toUpperCase(),
                  name: formData.get("name"),
                  discountType: formData.get("discountType"),
                  discountValue: Number(formData.get("discountValue")),
                  startDate: formData.get("startDate"),
                  endDate: formData.get("endDate"),
                  applicableFacilities: selectedFacilities.length > 0 
                    ? selectedFacilities
                    : ["Tất cả sân"],
                  applicableAreas: formData
                    .get("applicableAreas")
                    ?.split(",")
                    .map((a) => a.trim())
                    .filter((a) => a) || [],
                  maxUsage: formData.get("maxUsage")
                    ? Number(formData.get("maxUsage"))
                    : null,
                  usageCount: selectedPromotion?.usageCount || 0,
                };
                handleSave(promotionData);
                setSelectedFacilities(["Tất cả sân"]);
              }}
            >
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Mã khuyến mãi *
                  </label>
                  <input
                    name="code"
                    defaultValue={selectedPromotion?.code || ""}
                    required
                    placeholder="VD: HELLO2025"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                      textTransform: "uppercase",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Tên chương trình *
                  </label>
                  <input
                    name="name"
                    defaultValue={selectedPromotion?.name || ""}
                    required
                    placeholder="VD: Khuyến mãi chào năm mới"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      Loại giảm giá *
                    </label>
                    <select
                      name="discountType"
                      defaultValue={selectedPromotion?.discountType || "percentage"}
                      required
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 14,
                      }}
                    >
                      <option value="percentage">Theo phần trăm (%)</option>
                      <option value="fixed">Theo số tiền (VNĐ)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      Mức giảm *
                    </label>
                    <input
                      name="discountValue"
                      type="number"
                      defaultValue={selectedPromotion?.discountValue || ""}
                      required
                      min="1"
                      placeholder="20 hoặc 50000"
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      Ngày bắt đầu *
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      defaultValue={selectedPromotion?.startDate || ""}
                      required
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        color: "#374151",
                        fontWeight: 600,
                      }}
                    >
                      Ngày kết thúc *
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      defaultValue={selectedPromotion?.endDate || ""}
                      required
                      style={{
                        width: "100%",
                        padding: 10,
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
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Áp dụng cho sân *
                  </label>
                  <select
                    name="applicableFacilities"
                    multiple
                    size={5}
                    value={selectedFacilities}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedFacilities(values);
                    }}
                    required
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    {uniqueFacilities.map((facility) => (
                      <option key={facility} value={facility}>
                        {facility}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    Giữ Ctrl/Cmd để chọn nhiều sân, hoặc chọn "Tất cả sân"
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Áp dụng cho khu vực (tùy chọn)
                  </label>
                  <input
                    name="applicableAreas"
                    defaultValue={selectedPromotion?.applicableAreas?.join(", ") || ""}
                    placeholder="VD: Quận 1, Quận 2 (phân cách bằng dấu phẩy)"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    Số lượt sử dụng tối đa (tùy chọn)
                  </label>
                  <input
                    name="maxUsage"
                    type="number"
                    defaultValue={selectedPromotion?.maxUsage || ""}
                    min="1"
                    placeholder="Để trống nếu không giới hạn"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedPromotion(null);
                    setSelectedFacilities(["Tất cả sân"]);
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
                  type="submit"
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
                  {selectedPromotion ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPromotion(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa chương trình khuyến mãi"
        message="Bạn có chắc muốn xóa chương trình khuyến mãi"
        itemName={selectedPromotion?.name}
        warningMessage="Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default Promotions;

