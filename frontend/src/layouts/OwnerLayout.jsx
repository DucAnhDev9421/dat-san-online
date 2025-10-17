import React from "react";
import { Outlet } from "react-router-dom";
import OwnerPanel from "../pages/private/Owner/OwnerPanel";

export default function OwnerLayout() {
  return <OwnerPanel />;
}
