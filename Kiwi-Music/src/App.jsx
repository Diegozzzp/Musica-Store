import React from 'react';

import Banner from './components/bannerHome';

import Component from './components/sideProductos';

import NavBar from './components/navBar';


const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Component />
    </div>
  );
};

export default App;
