import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './components/carritoContexto';
import NavBar from './components/navBar';
import HomePage from './Pages/homePage';
import Merch from './Pages/merchPage';
import ProductsPage from './Pages/productosPage';
import ProductPage from './Pages/productoPage';
import UserDashboard from './Pages/perfilPage';
import CompraRealizar from './Pages/carritoPage';
import Auth from './components/login&register';  
import ResetPasswordRequest from './components/olvidePassword';
import ResetPassword from './Pages/recuperacionPage';
import Footer from './components/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow h-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/perfil" element={<UserDashboard />} />
              <Route path="/carritoPage" element={<CompraRealizar />} />
              <Route path="/login" element={<Auth isLogin={true} />} /> 
              <Route path="/register" element={<Auth isLogin={false} />} /> 
              <Route path="/olvide-password" element={<ResetPasswordRequest />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </CartProvider>
    </Router>
  );
};

export default App;
