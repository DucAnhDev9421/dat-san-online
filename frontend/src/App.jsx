

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './component/header/header.jsx'
import Footer from './component/footer/footer.jsx'
import HomePage from './pages/public/HomePage.jsx'
import NotFound from './pages/public/NotFoud.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="layout">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
