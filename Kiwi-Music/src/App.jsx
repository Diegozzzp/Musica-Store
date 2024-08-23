import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './components/carritoContexto';
import NavBar from './components/navBar';
import HomePage from './Pages/homePage';
import Merch from './Pages/merchPage';
import Cassetes from './Pages/cassetesPages';
import Cd from './Pages/vinil&CD';
import Boxes from './Pages/boxesPage';
import Packs from './Pages/packsPage';
import Tours from './Pages/toursPage';
import ProductsPage from './Pages/productosPage';
import ProductPage from './Pages/productoPage';
import UserDashboard from './Pages/perfilPage';
import CompraRealizar from './Pages/carritoPage';
import Auth from './components/login&register';  
import ResetPasswordRequest from './components/olvidePassword';
import ResetPassword from './Pages/recuperacionPage';
import AdminPanel from './Pages/AdminPage';
import SearchResults from './components/busqueda';
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
              <Route path="/cassetes" element={<Cassetes />} />
              <Route path="/discos" element={<Cd />} />
              <Route path="/boxes" element={<Boxes />} />
              <Route path="/packs" element={<Packs />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/perfil" element={<UserDashboard />} />
              <Route path="/carritoPage" element={<CompraRealizar />} />
              <Route path="/login" element={<Auth isLogin={true} />} /> 
              <Route path="/register" element={<Auth isLogin={false} />} /> 
              <Route path="/olvide-password" element={<ResetPasswordRequest />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/productos/campos" element={<SearchResults />} />
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
