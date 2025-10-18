import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import Header from "./component/header/header.jsx";
import Footer from "./component/footer/footer.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import OwnerLayout from "./layouts/OwnerLayout.jsx";

// Components
import ProtectedRoute, { AdminRoute, OwnerRoute } from "./component/ProtectedRoute.jsx";

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import ProfilePage from "./pages/public/ProfilePage.jsx";
import Booking from "./pages/public/Booking.jsx";
import Partner from "./pages/public/Partner.jsx";
import Facilities from "./pages/public/Facilities.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AuthCallback from "./pages/auth/AuthCallback.jsx";
import AuthError from "./pages/auth/AuthError.jsx";
import NotFound from "./pages/public/NotFoud.jsx";

// Owner pages
import MyBookings from "./pages/private/Owner/MyBookings.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth callback routes - No layout */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/error" element={<AuthError />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          } />

          {/* Owner Routes - Protected */}
          <Route path="/owner" element={
            <OwnerRoute>
              <OwnerLayout />
            </OwnerRoute>
          } />
          <Route path="/owner/*" element={
            <OwnerRoute>
              <OwnerLayout />
            </OwnerRoute>
          } />

          {/* Public Routes - With Header/Footer */}
          <Route path="/*" element={
            <div className="layout">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
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
    </AuthProvider>
  );
}

export default App;
