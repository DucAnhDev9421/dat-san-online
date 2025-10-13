

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './component/header/header.jsx'
import Footer from './component/footer/footer.jsx'
import HomePage from './pages/public/HomePage.jsx'
import ProfilePage from './pages/public/ProfilePage.jsx'
import Booking from './pages/public/Booking.jsx'
import NotFound from './pages/public/NotFoud.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Partner from './pages/public/Partner.jsx' 
import Facilities from './pages/public/Facilities.jsx'
import Payment from './pages/public/Payment.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="layout">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/facilities" element={<Facilities />} />
            
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
