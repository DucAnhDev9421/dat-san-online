import React, { useState, useMemo } from "react";
import { facilityData } from "../data/mockData";
import ApproveFacilityModal from "../modals/ApproveFacilityModal";
import RejectFacilityModal from "../modals/RejectFacilityModal";
import FacilityTabs from "../components/Facilities/FacilityTabs";
import FacilityFilters from "../components/Facilities/FacilityFilters";
import FacilityTable from "../components/Facilities/FacilityTable";
import FacilityDetailModal from "../components/Facilities/FacilityDetailModal";

const Facilities = () => {
  const [facilities, setFacilities] = useState(facilityData);
  const [activeTab, setActiveTab] = useState("all");
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

  // Handlers
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
    console.log("Navigate to owner:", ownerId);
  };

  const approvedCount = facilities.filter((f) => f.approvalStatus === "approved").length;
  const pendingCount = facilities.filter((f) => f.approvalStatus === "pending").length;

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

      <FacilityTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
        }}
        approvedCount={approvedCount}
        pendingCount={pendingCount}
      />

      <FacilityFilters
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        totalResults={filteredFacilities.length}
      />

      <FacilityTable
        facilities={facilitySlice}
        page={page}
        pageSize={pageSize}
        totalItems={filteredFacilities.length}
        activeTab={activeTab}
        statusMap={statusMap}
        formatPrice={formatPrice}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onNavigateToOwner={handleNavigateToOwner}
      />

      <FacilityDetailModal
        isOpen={isDetailModalOpen}
        facility={selectedFacility}
        statusMap={statusMap}
        formatPrice={formatPrice}
        onClose={handleCloseModal}
      />

      <ApproveFacilityModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedFacility(null);
        }}
        onConfirm={handleConfirmApprove}
        facility={selectedFacility}
      />

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

