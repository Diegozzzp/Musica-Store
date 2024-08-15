import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; 

import banner1 from '../images/banner1.jpg';
import banner2 from '../images/banner2.webp';
import banner3 from '../images/banner3.jpg';

const images = [
  {
    src: banner1,
    alt: 'Banner 1'
  },
  {
    src: banner2,
    alt: 'Banner 2'
  },
  {
    src: banner3,
    alt: 'Banner 3'
  },
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
    <div className="relative w-full h-[18rem] md:h-[24rem] lg:h-[38rem] overflow-hidden ">
      <div className="relative w-full h-full md:h-full lg:h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={image.src} className="w-full h-full object-cover lg:object-fill lg:h-[36rem]" alt={image.alt} />
          </div>
        ))}
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75"
        onClick={prevSlide}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75"
        onClick={nextSlide}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
    <p className='text-2xl font-semibold text-center pt-24'>Lo más reciente</p>
    </>
  );
};

export default Banner;
