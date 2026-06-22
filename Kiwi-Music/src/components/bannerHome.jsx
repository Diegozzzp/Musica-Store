import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import banner1 from '../images/banner1.jpg';
import banner2 from '../images/banner2.webp';
import banner3 from '../images/banner3.jpg';

const images = [
  { src: banner1, alt: 'Kiwi Music banner principal' },
  { src: banner2, alt: 'Coleccion musical destacada' },
  { src: banner3, alt: 'Productos destacados de Kiwi Music' },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <>
      <section className="relative h-[26rem] w-full overflow-hidden bg-[#17252a] md:h-[32rem] lg:h-[40rem]">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={image.src} className="h-full w-full object-cover" alt={image.alt} />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f5f0] to-transparent" />

        <div className="kiwi-section absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#9DE0AD]">Kiwi Music Store</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">Discos, merch y piezas para fans con gusto propio</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/85 md:text-lg">
              Explora lanzamientos, colecciones y productos especiales de tus artistas favoritos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/products" className="kiwi-button rounded px-5 py-3 text-sm">Ver productos</a>
              <a href="/merch" className="rounded border border-white/40 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10">Merch</a>
            </div>
          </div>
        </div>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur hover:bg-white/25"
          onClick={prevSlide}
          aria-label="Banner anterior"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur hover:bg-white/25"
          onClick={nextSlide}
          aria-label="Banner siguiente"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </section>

      <div className="kiwi-section pt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#547980]">Lo mas reciente</p>
        <h2 className="mt-2 text-3xl font-black text-[#17252a]">Novedades para escuchar, vestir y coleccionar</h2>
      </div>
    </>
  );
};

export default Banner;
