import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Header from "./component/header/header.jsx";
import Footer from "./component/footer/footer.jsx";

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import ProfilePage from "./pages/public/ProfilePage.jsx";
import Booking from "./pages/public/Booking.jsx";
import Partner from "./pages/public/Partner.jsx";
import Facilities from "./pages/public/Facilities.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import NotFound from "./pages/public/NotFoud.jsx"; // ✅ sửa đúng tên file

// Admin pages
import Dashboard from "./pages/private/Admin/Dashboard.jsx";
import BookingManagement from "./pages/private/Admin/BookingManagement.jsx";
import CustomerManagement from "./pages/private/Admin/CustomerManagement.jsx";
import FacilityManagement from "./pages/private/Admin/FacilityManagement.jsx";
import Reports from "./pages/private/Admin/Reports.jsx";

// Owner pages
import MyBookings from "./pages/private/Owner/MyBookings.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Header />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/bookings" element={<BookingManagement />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/facilities" element={<FacilityManagement />} />
          <Route path="/admin/reports" element={<Reports />} />

          {/* Owner */}
          <Route path="/owner/my-bookings" element={<MyBookings />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
