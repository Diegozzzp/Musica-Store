import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../index.css';
import { getImageUrl } from '../utils/imageUrl';

const URL_PRODUCTOS = 'https://musica-store.vercel.app/productos';

const shuffleProducts = (items) => [...items].sort(() => Math.random() - 0.5);

const normalizeProducts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.docs)) return data.docs;
  if (Array.isArray(data?.productos)) return data.productos;
  return [];
};

const CarruselProductos = ({ categoriaId, categoriaIds = [], esProximamente = false, random = false, titulo }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);

      try {
        let docs = [];

        if (categoriaIds.length > 0) {
          const responses = await Promise.all(
            categoriaIds.map((id) => axios.get(`${URL_PRODUCTOS}/categoria/${id}`, {
              params: { page: 1, limit: 12, sort: 'mas-recientes' }
            }))
          );

          docs = responses.flatMap((response) => normalizeProducts(response.data));
        } else if (categoriaId) {
          const { data } = await axios.get(`${URL_PRODUCTOS}/categoria/${categoriaId}`, {
            params: { page: 1, limit: 24, sort: 'mas-recientes' }
          });

          docs = normalizeProducts(data);
        } else {
          const params = {
            page: 1,
            limit: 24,
            ordenarPor: 'masReciente'
          };

          if (esProximamente) {
            params.esProximamente = 'true';
          }

          const { data } = await axios.get(URL_PRODUCTOS, { params });
          docs = normalizeProducts(data);
        }

        setProductos(random ? shuffleProducts(docs) : docs);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoriaId, categoriaIds, esProximamente, random]);

  const handleScroll = useCallback((direction) => {
    const scrollAmount = direction === 'left' ? -420 : 420;
    carouselRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  if (!loading && productos.length === 0) {
    return null;
  }

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

      <div ref={carouselRef} className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-4">
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
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-lg font-black text-[#17252a]">{producto.nombre}</h3>
                  {producto.esProximamente && <span className="rounded bg-[#17252a] px-2 py-1 text-xs font-bold text-white">Preorden</span>}
                </div>
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