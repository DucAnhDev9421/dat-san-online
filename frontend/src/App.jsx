import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import OwnerLayout from "./layouts/OwnerLayout.jsx";

// Components
import ProtectedRoute, { AdminRoute, OwnerRoute } from "./components/ProtectedRoute.jsx";
import ChatButton from "./components/chat/ChatButton.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import ProfilePage from "./pages/public/ProfilePage";
import Booking from "./pages/public/Booking";
import Payment from "./pages/public/Payment.jsx";
import Partner from "./pages/public/Partner.jsx";
import Facilities from "./pages/public/Facilities.jsx";
import Promotion from "./pages/public/Promotion.jsx";
import NotificationsPage from "./pages/public/Notifications.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import AuthCallback from "./pages/auth/AuthCallback.jsx";
import AuthError from "./pages/auth/AuthError.jsx";
import NotFound from "./pages/public/NotFoud.jsx";

// Owner pages
import OwnerSetup from "./pages/private/Owner/OwnerSetup.jsx";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <ChatButton />
        <Routes>
          {/* Auth callback routes-No layout */}
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

          {/* Owner Setup Route - Protected, separate page */}
          <Route path="/owner/setup" element={
            <OwnerRoute>
              <OwnerSetup />
            </OwnerRoute>
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

          {/* Booking Route - With Footer */}
          <Route path="/booking" element={
            <div className="layout">
              <Header />
              <Booking />
              <Footer />
            </div>
          } />

          {/* Payment Route - With Footer */}
          <Route path="/payment" element={
            <div className="layout">
              <Header />
              <Payment />
              <Footer />
            </div>
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

                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                <Route path="/partner" element={<Partner />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/promotion" element={<Promotion />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
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
