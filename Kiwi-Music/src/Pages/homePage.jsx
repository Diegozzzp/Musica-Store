// src/components/HomePage.jsx
import React from 'react';
import Banner from '../components/bannerHome';
import Component from '../components/sideProductos';
import MusicPlayer from '../components/produccMusic';

const HomePage = () => {
  return (
    <div className="bg-[#f7f5f0]">
      <Banner />
      <Component categoriaId={'6a317d004023a329c9a8b7ca'} titulo={'Albums'}/>
      <Component categoriaId={'6a317d0f4023a329c9a8b7d2'} titulo={'Merch'}/>
      <Component categoriaId={'6a397890901b012d781e9b46'} titulo={'Proximamente'}/>
      <MusicPlayer />
    </div>
  );
};

export default HomePage;
