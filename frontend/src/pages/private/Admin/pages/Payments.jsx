import React, { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { paymentData } from "../data/mockData";
import PaymentDetailModal from "../modals/PaymentDetailModal";
import PaymentStats from "../components/Payments/PaymentStats";
import PaymentFilters from "../components/Payments/PaymentFilters";
import PaymentTable from "../components/Payments/PaymentTable";

const Payments = () => {
  const [payments, setPayments] = useState(paymentData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Tính toán phí nền tảng tổng
  const totalPlatformFee = useMemo(() => {
    return payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + (p.platformFee || 0), 0);
  }, [payments]);

  const totalAmount = useMemo(() => {
    return payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  // Payment method map (statusMap không còn cần vì đã dùng StatusBadge từ shared)

  const paymentMethodMap = {
    VNPay: { label: "VNPay", color: "#0052d9", bg: "#e6f0ff" },
    Momo: { label: "Momo", color: "#ea4c89", bg: "#fce7f3" },
    "Tiền mặt": { label: "Tiền mặt", color: "#059669", bg: "#e6f9f0" },
  };

  // Lọc dữ liệu
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        searchQuery === "" ||
        [
          payment.transactionId,
          payment.performer,
          payment.facility,
          payment.paymentMethod,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        payment.paymentMethod === paymentMethodFilter;

      return matchesSearch && matchesStatus && matchesPaymentMethod;
    });
  }, [payments, searchQuery, statusFilter, paymentMethodFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paymentSlice = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayment(null);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPaymentMethodFilter("all");
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
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>
          Quản lý thanh toán & giao dịch
        </h1>
        <button
          onClick={() => alert("TODO: Xuất báo cáo")}
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
          <Download size={16} /> Xuất báo cáo
        </button>
      </div>

      <PaymentStats
        totalPlatformFee={totalPlatformFee}
        totalAmount={totalAmount}
        formatPrice={formatPrice}
      />

      <PaymentFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        paymentMethodFilter={paymentMethodFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onPaymentMethodChange={(value) => {
          setPaymentMethodFilter(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <PaymentTable
        payments={paymentSlice}
        page={page}
        pageSize={pageSize}
        totalItems={filteredPayments.length}
        paymentMethodMap={paymentMethodMap}
        formatPrice={formatPrice}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onView={handleViewDetails}
      />

      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        payment={selectedPayment}
      />
    </div>
  );
};

export default Payments;

