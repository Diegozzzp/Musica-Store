import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './components/carritoContext'
import NavBar from './components/navBar';
import HomePage from './componentsPages/homePage';
import Merch from './componentsPages/merchPage';
import ProductsPage from './componentsPages/productsPage';
import ProductPage from './componentsPages/productoPage';
import UserDashboard from './componentsPages/perfilPage';
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
};

export default App;
