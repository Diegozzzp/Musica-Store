import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/navBar.jsx';
import HomePage from './componentsPages/HomePage';
import ProductsPage from './componentsPages/ProductsPage'; 
import Merch from './componentsPages/merchPage.jsx';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />}  />
        <Route path="/merch" element={<Merch />} />
      </Routes>
    </Router>
  );
};

export default App;

