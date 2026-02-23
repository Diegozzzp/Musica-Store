// src/components/HomePage.jsx
import React from 'react';
import Banner from '../components/bannerHome';
import Component from '../components/sideProductos';
import MusicPlayer from '../components/produccMusic';

const HomePage = () => {
  return (
    <div >
      <Banner />
      <Component categoriaId={'699c698b238857741c6297ea'} titulo={'Albums'}/>
      <Component categoriaId={'699c6b1f238857741c629819'} titulo={'Merch'}/>
      <Component categoriaId={'699c6b9a238857741c62981d'} titulo={'Proximamente'}/>
      <MusicPlayer />
    </div>
  );
};

export default HomePage;
