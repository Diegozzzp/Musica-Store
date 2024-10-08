import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContexto';
import { FiPlayCircle } from "react-icons/fi";

const URL_albums = 'http://localhost:3002/productos';

const AlbumsPage = ({ categoriaId = null, titulo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProductos, setTotalProductos] = useState(0);
  const [filtro, setFiltro] = useState('masReciente'); // Cambiar a coincidencia exacta con backend
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { addToCart } = useContext(CartContext);

  const fixImagePath = (path) => {
    if (!path) return 'ruta-a-imagen-por-defecto'; // Ruta a una imagen por defecto si no hay imágenes disponibles
    return `http://localhost:3002/uploads/${path.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true); // Iniciar con carga activa al hacer nueva petición
      try {
        const params = {
          ordenarPor: filtro, // Cambiar a ordenarPor para coincidir con el controlador
          page: paginaActual,
          limit: 10
        };

        // Solo agrega la categoría si el ID de la categoría se ha proporcionado
        if (categoriaId) {
          params.categoria = categoriaId;
        }

        const response = await axios.get(URL_albums, { params });

        if (response.data && Array.isArray(response.data.docs)) {
          setData(response.data.docs);
          setTotalProductos(response.data.totalDocs);
          setTotalPaginas(response.data.totalPages);
          setPaginaActual(response.data.page);
          setHasPrevPage(response.data.page > 1);
          setHasNextPage(response.data.page < response.data.totalPages);
        } else {
          console.error("Unexpected response data format", response.data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, [categoriaId, filtro, paginaActual]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setPaginaActual(1); // Resetear a la primera página cuando se cambia el filtro
  };

  const handleAddToCart = (producto) => {
    const cantidad = 1;
    addToCart(producto, cantidad);
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPaginaActual(paginaActual + 1);
    }
  };

  return (
    <>
      <div className="w-full h-full mb-44">
        <h1 className="text-3xl font-semibold pt-16 text-center">{titulo}</h1>
        <div className="text-center flex justify-between items-center px-8">
          <select value={filtro} onChange={handleFiltroChange} className="p-2 rounded border-none focus:outline-none">
            <option value="masReciente">Más recientes</option>
            <option value="masAntiguos">Más antiguos</option>
            <option value="masVendidos">Más vendidos</option>
            <option value="ordenAlfabetico">Orden alfabético</option>
            <option value="masPopulares">Más populares</option>
          </select>
          <p className="text-gray-700 text-center">Total de productos: {totalProductos}</p>
        </div>
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-32">
          {data.map(producto => (
            <div key={producto._id} className="p-4 w-full h-[400px] sm:h-[300px] lg:h-[330px]">
              <Link to={`/producto/${producto._id}`}>
                <img
                  src={fixImagePath(producto.imagenes[0])}
                  alt={producto.nombre}
                  className="object-cover w-full h-full"
                />
              </Link>
              <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
              <p className="text-gray-700 text-sm mb-2">{producto.descripcion}</p>
              <div className="text-black font-light flex items-center justify-between w-52">
                ${producto.precio}
                <button 
                  onClick={() => handleAddToCart(producto)}
                  className="text-lg">
                  <FiPlayCircle />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-40 justify-between">
          <button
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Anterior
          </button>
          <span className="text-gray-700">Página {paginaActual} de {totalPaginas}</span>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default AlbumsPage;
