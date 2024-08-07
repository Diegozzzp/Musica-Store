import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const URL_albums = 'http://localhost:3002/productos/categoria/';

const AlbumsPage = ({ categoriaId, titulo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProductos, setTotalProductos] = useState(0);
  const [filtro, setFiltro] = useState('mas-recientes');

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

  return (
    <>
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold pt-16 text-center">{titulo}</h1>
      <div className=" text-center flex justify-between items-center">
        <select value={filtro} onChange={handleFiltroChange} className="p-2 rounded border-none focus:outline-none">
          <option value="mas-recientes">Más recientes</option>
          <option value="mas-antiguos">Más antiguos</option>
          <option value="mas-vendidos">Más vendidos</option>
          <option value="orden-alfabetico">Orden alfabético</option>
          <option value="mas-populares">Más populares</option>
        </select>
        <p className="text-gray-700  text-center">Total de productos: {totalProductos}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-32">
        {data.map(producto => (
          <div key={producto._id} className="p-4 w-[400px] h-[400px]">
            <img
              src={fixImagePath(producto.imagenes[0])}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
            <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
            <p className="text-gray-700 mb-2">{producto.descripcion}</p>
            <p className="text-black font-light">${producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AlbumsPage;
