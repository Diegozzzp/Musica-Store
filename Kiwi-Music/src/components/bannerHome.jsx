import React, { useState, useEffect } from 'react';

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
    }, 7000); // Cambia cada 7 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  return (
    <div className="relative w-full h-[18rem] md:h-[24rem] lg:h-[38rem] overflow-hidden rounded-lg">
      <div className="relative w-full h-full md:h-full lg:h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={image.src} className="block w-full h-full object-cover lg:object-fill lg:h-[36rem] " alt={image.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default Banner;



//    <div className="w-full h-[600px] bg-cover bg-center" style={{ backgroundImage: `url(${images[currentIndex].src})` }}></div>