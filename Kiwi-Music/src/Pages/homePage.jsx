// src/components/HomePage.jsx
import React from 'react';
import Banner from '../components/bannerHome';
import Component from '../components/sideProductos';
import MusicPlayer from '../components/produccMusic';

const ALBUM_CATEGORY_IDS = ['6a317d004023a329c9a8b7ca', '6a317d594023a329c9a8b7d6'];
const MERCH_CATEGORY_ID = '6a317d0f4023a329c9a8b7d2';
const PROXIMAMENTE_CATEGORY_ID = '6a397890901b012d781e9b46';

const HomePage = () => {
  return (
    <div className="bg-[#f7f5f0]">
      <Banner />
      <Component categoriaIds={ALBUM_CATEGORY_IDS} titulo="Albums" />
      <Component categoriaId={MERCH_CATEGORY_ID} titulo="Merch" random />
      <Component categoriaId={PROXIMAMENTE_CATEGORY_ID} titulo="Proximamente" random />
      <MusicPlayer />
    </div>
  );
};

export default HomePage;
