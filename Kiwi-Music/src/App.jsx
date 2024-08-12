import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './components/carritoContexto'
import NavBar from './components/navBar';
import HomePage from './Pages/homePage';
import Merch from './Pages/merchPage';
import ProductsPage from './Pages/productosPage';
import ProductPage from './Pages/productoPage';
import UserDashboard from './Pages/perfilPage';
import CompraRealizar from './Pages/carritoPage';
import Footer from './components/footer';


const App = () => {
  return (
    <CartProvider>
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/producto/:id" element={<ProductPage />} />
            <Route path="/perfil" element={<UserDashboard />} />
            <Route path="/carritoPage" element={<CompraRealizar />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
};

export default App;
