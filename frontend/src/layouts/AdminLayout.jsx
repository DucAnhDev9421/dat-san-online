import React from "react";
import { Outlet } from "react-router-dom";
import AdminPanel from "../pages/private/Admin/AdminPanel";

export default function AdminLayout() {
  return <AdminPanel />;
}
