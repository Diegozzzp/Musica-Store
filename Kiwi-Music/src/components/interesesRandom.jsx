import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../index.css';
import { getImageUrl } from '../utils/imageUrl';

const URL_PRODUCTOS = 'https://musica-store.vercel.app/productos/random';

const RandomsIntereses = ({ titulo }) => {
  const [productos, setProductos] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get(URL_PRODUCTOS);
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProductos(shuffled.slice(0, 10));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleScroll = useCallback((direction) => {
    const scrollAmount = direction === 'left' ? -420 : 420;
    carouselRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  if (productos.length === 0) return null;

  return (
    <section className="kiwi-section py-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#547980]">Tambien te puede gustar</p>
          <h2 className="mt-1 text-2xl font-black text-[#17252a] md:text-3xl">{titulo}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleScroll('left')} className="rounded border border-gray-200 bg-white p-3 text-[#17252a] shadow-sm hover:bg-gray-50" aria-label="Ver anteriores">
            <FaArrowLeft size={16} />
          </button>
          <button onClick={() => handleScroll('right')} className="rounded border border-gray-200 bg-white p-3 text-[#17252a] shadow-sm hover:bg-gray-50" aria-label="Ver siguientes">
            <FaArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {productos.map((producto) => (
          <Link to={`/producto/${producto._id}`} key={producto._id} className="kiwi-card group min-w-[21rem] overflow-hidden rounded">
            <div className="aspect-[5/4] overflow-hidden bg-[#f2efe8]">
              <img src={getImageUrl(producto.imagenes)} alt={producto.nombre} className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.03]" />
            </div>
            <div className="p-4">
              <h3 className="line-clamp-1 text-lg font-black text-[#17252a]">{producto.nombre}</h3>
              <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">{producto.descripcion}</p>
              <p className="mt-4 text-lg font-black text-[#17252a]">${producto.precio}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RandomsIntereses;
