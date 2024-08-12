import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContexto';
import { FiPlayCircle } from "react-icons/fi";

const URL_albums = 'http://localhost:3002/productos/categoria/';

const AlbumsPage = ({ categoriaId, titulo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProductos, setTotalProductos] = useState(0);
  const [filtro, setFiltro] = useState('mas-recientes');
  const { addToCart } = useContext(CartContext); 

  const fixImagePath = (path) => {
    return `http://localhost:3002/uploads/${path.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get(`${URL_albums}${categoriaId}?sort=${filtro}`);
        if (response.data && Array.isArray(response.data.productos)) {
          setData(response.data.productos);
          setTotalProductos(response.data.totalProductos);
        } else {
          console.error("Unexpected response data format");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) {
      obtenerProductos();
    }
  }, [categoriaId, filtro]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleAddToCart = (producto) => {
    // Aquí puedes ajustar la cantidad si es necesario
    const cantidad = 1;
    addToCart(producto, cantidad);
  };

  return (
    <>
      <div className="w-full h-full mb-44">
        <h1 className="text-3xl font-semibold pt-16 text-center">{titulo}</h1>
        <div className="text-center flex justify-between items-center px-8">
          <select value={filtro} onChange={handleFiltroChange} className="p-2 rounded border-none focus:outline-none">
            <option value="mas-recientes">Más recientes</option>
            <option value="mas-antiguos">Más antiguos</option>
            <option value="mas-vendidos">Más vendidos</option>
            <option value="orden-alfabetico">Orden alfabético</option>
            <option value="mas-populares">Más populares</option>
          </select>
          <p className="text-gray-700 text-center">Total de productos: {totalProductos}</p>
        </div>
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-32">
          {data.map(producto => (
            <div key={producto._id} className="p-4 w-full h-[400px] sm:h-[300px] lg:h-[360px]">
              <Link to={`/producto/${producto._id}`}>
                <img
                  src={fixImagePath(producto.imagenes[0])}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
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
      </div>
    </>
  );
};

export default AlbumsPage;
