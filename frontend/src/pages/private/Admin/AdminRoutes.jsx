import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import các component pages
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";
import Bookings from "./pages/Bookings";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Categories from "./pages/Categories";
import Promotions from "./pages/Promotions";
import Feedbacks from "./pages/Feedbacks";
import Notifications from "./pages/Notifications";
import ActivityLog from "./pages/ActivityLog";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="facilities" element={<Facilities />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="users" element={<Users />} />
      <Route path="payments" element={<Payments />} />
      <Route path="categories" element={<Categories />} />
      <Route path="promotions" element={<Promotions />} />
      <Route path="feedbacks" element={<Feedbacks />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="activity_log" element={<ActivityLog />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;

