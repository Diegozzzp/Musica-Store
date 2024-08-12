// src/components/HomePage.jsx
import React from 'react';
import Banner from '../components/bannerHome';
import Component from '../components/sideProductos';
import MusicPlayer from '../components/produccMusic';

const HomePage = () => {
  return (
    <div >
      <Banner />
      <Component categoriaId={'66aba85f829468324fa4ed52'} titulo={'Albums'}/>
      <Component categoriaId={'669d83c3cfe2fec066e2031e'} titulo={'Merch'}/>
      <Component categoriaId={'66b105bc00b2c3e2941151b8'} titulo={'Proximamente'}/>
      <MusicPlayer />
    </div>
  );
};

export default HomePage;
