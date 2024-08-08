import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/navBar';
import HomePage from './componentsPages/homePage';
import ProductsPage from './componentsPages/productsPage'; 
import Merch from './componentsPages/merchPage.jsx';
import Footer from './components/footer.jsx';

const App = () => {
  return (
    <Router >
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />}  />
        <Route path="/merch" element={<Merch />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

