import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { facilityApi } from "../api/facilityApi";
import OwnerPanel from "../pages/private/Owner/OwnerPanel";

export default function OwnerLayout() {
  const { user, loading: authLoading } = useAuth();
  const [hasFacility, setHasFacility] = useState(null); // null = loading, true/false = result
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnerFacility = async () => {
      // Nếu chưa có user hoặc đang loading auth, bỏ qua
      if (!user || user.role !== "owner" || authLoading) {
        setLoading(false);
        return;
      }

      try {
        const ownerId = user._id || user.id;
        const hasAnyFacility = await facilityApi.checkOwnerHasFacility(ownerId);
        setHasFacility(hasAnyFacility);
      } catch (error) {
        console.error("Error checking facilities:", error);
        // Nếu lỗi, mặc định là chưa có facility để redirect về setup
        setHasFacility(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnerFacility();
  }, [user, authLoading]);

  // Loading state - đợi auth hoặc check facility
  if (authLoading || (loading && hasFacility === null)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            Đang kiểm tra thông tin cơ sở...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to setup nếu chưa có facility
  if (hasFacility === false) {
    return <Navigate to="/owner/setup" replace />;
  }

  // Nếu đã có facility, render OwnerPanel bình thường
  return <OwnerPanel />;
}
