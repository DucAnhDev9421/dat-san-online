import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Header from "./component/header/header.jsx";
import Footer from "./component/footer/footer.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import OwnerLayout from "./layouts/OwnerLayout.jsx";

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import ProfilePage from "./pages/public/ProfilePage.jsx";
import Booking from "./pages/public/Booking.jsx";
import Partner from "./pages/public/Partner.jsx";
import Facilities from "./pages/public/Facilities.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import NotFound from "./pages/public/NotFoud.jsx"; // ✅ sửa đúng tên file

// Owner pages
import MyBookings from "./pages/private/Owner/MyBookings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes - No Header/Footer */}
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Owner Routes - No Header/Footer */}
        <Route path="/owner" element={<OwnerLayout />} />
        <Route path="/owner/*" element={<OwnerLayout />} />

        {/* Public Routes - With Header/Footer */}
        <Route path="/*" element={
          <div className="layout">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
