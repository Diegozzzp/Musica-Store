import React from 'react';

import product1 from '../images/producto1.png';

const products = [
  { src: product1, alt: 'Product 1', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo'  ,price: '$10.00' },
  { src: product1, alt: 'Product 2', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo' ,price: '$20.00' },
  { src: product1, alt: 'Product 3', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo' ,price: '$30.00' },
  { src: product1, alt: 'Product 4', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo' ,price: '$40.00' },
  { src: product1, alt: 'Product 5', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo' ,price: '$50.00' },
  { src: product1, alt: 'Product 6', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo' ,price: '$60.00' },
  { src: product1, alt: 'Product 7', artist: 'Billie Eilish',  productName: 'Album Happier Than Ever - Version Vinilo' ,price: '$70.00' },
];

const ProductCarousel = () => {
  const scrollLeft = () => {
    document.getElementById('product-carousel').scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    document.getElementById('product-carousel').scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  };

  return (
  <>
    <section className="relative w-full pt-24 md:pt-36 lg:pt-48">
    <p className='text-2xl font-semibold text-center pb-8'>Lo Mas Reciente</p>
    <p className='text-2xl font-light text-center pb-8' >Albums</p>
      <div id="product-carousel" className="flex overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex flex-col  items-center h-96 px-12 pr-8 min-w-[500px] sm:min-w-[250px] md:px-2 md:min-w-[300px] lg:min-w-[400px]  "
          >
            <div className="w-full h-72 ">
              <img src={product.src} alt={product.alt} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="mt-2 ">
              <h3 className="text-lg font-semibold">{product.artist}</h3>
              <p className="text-gray-600">{product.productName}</p>
              <p className="text-gray-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
        onClick={scrollLeft}
      >
        &lt;
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
        onClick={scrollRight}
      >
        &gt;
      </button>
    </section>
    </>
  );
};

export default ProductCarousel;
