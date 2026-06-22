import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContexto';
import { FiPlus } from 'react-icons/fi';
import { getImageUrl } from '../utils/imageUrl';

const URL_ALBUMS = 'https://musica-store.vercel.app/productos';

const VinylAddButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#17252a] text-[#9DE0AD] shadow transition hover:scale-105 hover:bg-[#22363b]"
    aria-label={label}
  >
    <span className="absolute h-7 w-7 rounded-full border border-white/25" />
    <span className="absolute h-2 w-2 rounded-full bg-[#f7f5f0]" />
    <FiPlus className="relative z-10 ml-7 mt-7 rounded-full bg-[#9DE0AD] p-0.5 text-lg text-[#17252a]" />
  </button>
);

const AlbumsPage = ({ categoriaId = null, titulo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProductos, setTotalProductos] = useState(0);
  const [filtro, setFiltro] = useState('masReciente');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);

      try {
        const params = {
          ordenarPor: filtro,
          page: paginaActual,
          limit: 12
        };

        if (categoriaId) {
          params.categoria = categoriaId;
        }

        const response = await axios.get(URL_ALBUMS, { params });

        if (response.data && Array.isArray(response.data.docs)) {
          setData(response.data.docs);
          setTotalProductos(response.data.totalDocs);
          setTotalPaginas(response.data.totalPages);
          setPaginaActual(response.data.page);
          setHasPrevPage(response.data.page > 1);
          setHasNextPage(response.data.page < response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, [categoriaId, filtro, paginaActual]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setPaginaActual(1);
  };

  const handleAddToCart = (producto) => {
    addToCart(producto, 1);
  };

  return (
    <section className="kiwi-section py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#547980]">Catalogo</p>
          <h1 className="mt-2 text-3xl font-black text-[#17252a] md:text-5xl">{titulo}</h1>
          <p className="mt-2 text-sm text-gray-600">{totalProductos} productos disponibles</p>
        </div>

        <select
          value={filtro}
          onChange={handleFiltroChange}
          className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-[#547980] md:w-64"
        >
          <option value="masReciente">Mas recientes</option>
          <option value="masAntiguos">Mas antiguos</option>
          <option value="masVendidos">Mas vendidos</option>
          <option value="ordenAlfabetico">Orden alfabetico</option>
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[24rem] items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-[#547980]" />
        </div>
      ) : data.length === 0 ? (
        <div className="kiwi-card rounded p-10 text-center">
          <p className="text-lg font-semibold text-[#17252a]">No hay productos para mostrar.</p>
          <p className="mt-2 text-sm text-gray-500">Prueba con otra categoria u orden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {data.map((producto) => (
            <article key={producto._id} className="kiwi-card group overflow-hidden rounded">
              <Link to={`/producto/${producto._id}`} className="block">
                <div className="aspect-[5/4] overflow-hidden bg-[#f2efe8]">
                  <img
                    src={getImageUrl(producto.imagenes)}
                    alt={producto.nombre}
                    className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>

              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-black text-[#17252a]">{producto.nombre}</h2>
                    <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">{producto.descripcion}</p>
                  </div>
                  {producto.descuento > 0 && (
                    <span className="rounded bg-[#9DE0AD] px-2 py-1 text-xs font-bold text-[#17252a]">
                      -{producto.descuento}%
                    </span>
                  )}
                  {producto.esProximamente && (
                    <span className="rounded bg-[#17252a] px-2 py-1 text-xs font-bold text-white">
                      Preorden
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-[#17252a]">${producto.precio}</p>
                  <VinylAddButton label={`Agregar ${producto.nombre} al carrito`} onClick={() => handleAddToCart(producto)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-12 flex items-center justify-between gap-4">
        <button
          onClick={() => hasPrevPage && setPaginaActual(paginaActual - 1)}
          disabled={!hasPrevPage}
          className={`rounded px-5 py-3 text-sm font-semibold transition ${hasPrevPage ? 'bg-white text-[#17252a] shadow hover:bg-gray-50' : 'bg-gray-200 text-gray-400'}`}
        >
          Anterior
        </button>
        <span className="text-sm font-semibold text-gray-600">Pagina {paginaActual} de {totalPaginas}</span>
        <button
          onClick={() => hasNextPage && setPaginaActual(paginaActual + 1)}
          disabled={!hasNextPage}
          className={`rounded px-5 py-3 text-sm font-semibold transition ${hasNextPage ? 'bg-white text-[#17252a] shadow hover:bg-gray-50' : 'bg-gray-200 text-gray-400'}`}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default AlbumsPage;
