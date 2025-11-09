import React from "react";
import { Eye, Check, X, ExternalLink } from "lucide-react";

const FacilityRow = ({
  facility,
  statusMap,
  formatPrice,
  activeTab,
  onView,
  onApprove,
  onReject,
  onNavigateToOwner,
}) => {
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
          onClick={() => onNavigateToOwner(facility.ownerId)}
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
      <td style={{ padding: 12, color: "#6b7280" }}>{facility.createdAt}</td>
      <td style={{ padding: 12, whiteSpace: "nowrap" }}>
        {activeTab === "pending" ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onApprove(facility)}
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
              onClick={() => onReject(facility)}
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
            onClick={() => onView(facility)}
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
};

export default FacilityRow;

