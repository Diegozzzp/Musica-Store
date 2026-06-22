import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../index.css';
import { getImageUrl } from '../utils/imageUrl';

const URL_PRODUCTOS = 'https://musica-store.vercel.app/productos/categoria/';

const CarruselProductos = ({ categoriaId, titulo }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(`${URL_PRODUCTOS}${categoriaId}`);
        setProductos(Array.isArray(data.productos) ? data.productos : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        try {
          const fallback = await axios.get('https://musica-store.vercel.app/productos', {
            params: { page: 1, limit: 10 }
          });
          setProductos(Array.isArray(fallback.data.docs) ? fallback.data.docs : []);
        } catch (fallbackError) {
          console.error('Error fetching fallback products:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) {
      fetchProductos();
    }
  }, [categoriaId]);

  const handleScroll = useCallback((direction) => {
    const scrollAmount = direction === 'left' ? -420 : 420;
    carouselRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  const startDrag = useCallback((clientX) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    startX.current = clientX;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.classList.add('cursor-grabbing');
  }, []);

  const moveDrag = useCallback((clientX) => {
    if (!isDragging.current || !carouselRef.current) return;
    const walk = (clientX - startX.current) * 1.4;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const endDrag = useCallback(() => {
    isDragging.current = false;
    carouselRef.current?.classList.remove('cursor-grabbing');
  }, []);

  return (
    <section className="kiwi-section py-8 md:py-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#547980]">Seleccion Kiwi</p>
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
        className="scrollbar-hide flex cursor-grab gap-6 overflow-x-auto scroll-smooth pb-4"
        onMouseDown={(e) => startDrag(e.pageX)}
        onMouseMove={(e) => moveDrag(e.pageX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(e) => startDrag(e.touches[0].pageX)}
        onTouchMove={(e) => moveDrag(e.touches[0].pageX)}
        onTouchEnd={endDrag}
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[24rem] min-w-[21rem] animate-pulse rounded bg-white/70" />
          ))
        ) : (
          productos.map((producto) => (
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
          ))
        )}
      </div>
    </section>
  );
};

export default CarruselProductos;
