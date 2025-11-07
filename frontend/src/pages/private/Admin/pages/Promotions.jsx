import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { promotionsData } from "../data/mockData";
import { facilityData } from "../data/mockData";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import PromotionFilters from "../components/Promotions/PromotionFilters";
import PromotionTable from "../components/Promotions/PromotionTable";
import PromotionAddEditModal from "../components/Promotions/PromotionAddEditModal";

const Promotions = () => {
  const [promotions, setPromotions] = useState(promotionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const statusMap = {
    active: { label: "Còn hạn", color: "#059669", bg: "#e6f9f0" },
    expired: { label: "Hết hạn", color: "#6b7280", bg: "#f3f4f6" },
    pending: { label: "Sắp diễn ra", color: "#d97706", bg: "#fef3c7" },
  };

  // Handlers
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
    setSelectedFacilities(["Tất cả sân"]);
  };

  const resetFilters = () => {
    setStatusFilter("all");
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Quản lý khuyến mãi</h1>
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

      <PromotionFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <PromotionTable
        promotions={promotionSlice}
        page={page}
        pageSize={pageSize}
        totalItems={filteredPromotions.length}
        statusMap={statusMap}
        getStatus={getStatus}
        formatDiscount={formatDiscount}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PromotionAddEditModal
        isOpen={isAddModalOpen}
        isEdit={false}
        promotion={null}
        selectedFacilities={selectedFacilities}
        uniqueFacilities={uniqueFacilities}
        onFacilitiesChange={setSelectedFacilities}
        onSave={handleSave}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedPromotion(null);
          setSelectedFacilities(["Tất cả sân"]);
        }}
      />

      <PromotionAddEditModal
        isOpen={isEditModalOpen}
        isEdit={true}
        promotion={selectedPromotion}
        selectedFacilities={selectedFacilities}
        uniqueFacilities={uniqueFacilities}
        onFacilitiesChange={setSelectedFacilities}
        onSave={handleSave}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPromotion(null);
          setSelectedFacilities(["Tất cả sân"]);
        }}
      />

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

