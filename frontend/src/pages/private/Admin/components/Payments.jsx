import React, { useState, useMemo } from "react";
import { Download, Eye, Filter, Search } from "lucide-react";
import { paymentData } from "../data/mockData";
import PaymentDetailModal from "../modals/PaymentDetailModal";

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

  // Status map
  const statusMap = {
    success: { label: "Thành công", color: "#059669", bg: "#e6f9f0" },
    failed: { label: "Lỗi", color: "#ef4444", bg: "#fee2e2" },
    pending: { label: "Chờ xử lý", color: "#d97706", bg: "#fef3c7" },
  };

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

      {/* Thống kê phí nền tảng */}
      <div
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
          Phí nền tảng thu được
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          {formatPrice(totalPlatformFee)} VNĐ
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Từ {payments.filter((p) => p.status === "success").length} giao dịch
          thành công
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
          Tỷ lệ phí: {payments[0]?.platformFeePercent || 10}% trên mỗi đơn đặt
          sân
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
            paymentMethodFilter !== "all" ||
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
                placeholder="Mã giao dịch, người thực hiện, sân..."
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
              <option value="success">Thành công</option>
              <option value="pending">Chờ xử lý</option>
              <option value="failed">Lỗi</option>
            </select>
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
              Hình thức thanh toán
            </label>
            <select
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
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
              <option value="VNPay">VNPay</option>
              <option value="Momo">Momo</option>
              <option value="Tiền mặt">Tiền mặt</option>
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
            Hiển thị {filteredPayments.length} kết quả
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {[
                  "Mã giao dịch",
                  "Người thực hiện",
                  "Sân liên quan",
                  "Số tiền",
                  "Hình thức thanh toán",
                  "Ngày thanh toán",
                  "Trạng thái",
                  "Phí nền tảng",
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
              {paymentSlice.map((payment) => {
                const status = statusMap[payment.status] || {
                  label: payment.status,
                  color: "#6b7280",
                  bg: "#f3f4f6",
                };
                const paymentMethod = paymentMethodMap[payment.paymentMethod] || {
                  label: payment.paymentMethod,
                  color: "#6b7280",
                  bg: "#f3f4f6",
                };

                return (
                  <tr
                    key={payment.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: 12, fontWeight: 700, color: "#1f2937" }}>
                      {payment.transactionId}
                    </td>
                    <td style={{ padding: 12 }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{payment.performer}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {payment.performerRole === "owner" ? "Chủ sân" : "Khách hàng"}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>
                      {payment.facility}
                    </td>
                    <td style={{ padding: 12, fontWeight: 700, color: "#059669" }}>
                      {formatPrice(payment.amount)} VNĐ
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background: paymentMethod.bg,
                          color: paymentMethod.color,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {paymentMethod.label}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{payment.paymentDate}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {payment.paymentTime}
                        </div>
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
                    <td style={{ padding: 12 }}>
                      {payment.platformFee > 0 ? (
                        <div>
                          <div style={{ fontWeight: 600, color: "#059669" }}>
                            {formatPrice(payment.platformFee)} VNĐ
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            ({payment.platformFeePercent}%)
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleViewDetails(payment)}
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
                    </td>
                  </tr>
                );
              })}
              {!paymentSlice.length && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Không tìm thấy giao dịch nào
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
            {Math.min(page * pageSize, filteredPayments.length)} of{" "}
            {filteredPayments.length} entries
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

      {/* Modal chi tiết */}
      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        payment={selectedPayment}
      />
    </div>
  );
};

export default Payments;
