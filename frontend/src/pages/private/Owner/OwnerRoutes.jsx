import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import các component pages
import Dashboard from "./pages/Dashboard";
import Courts from "./pages/Courts";
import Bookings from "./pages/Bookings";
import Reports from "./pages/Reports";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Staff from "./pages/Staff";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courts" element={<Courts />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="reports" element={<Reports />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="staff" element={<Staff />} />
      <Route path="activity" element={<ActivityLog />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default OwnerRoutes;

