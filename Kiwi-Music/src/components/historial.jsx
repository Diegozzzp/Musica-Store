import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompraCard = ({ compra }) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
 
  // Verifica si `compra.productos` está definido y es un array
  if (!compra || !Array.isArray(compra.productos)) {
      return <div>No hay productos disponibles</div>;
  }


  return (
    <div className="border p-4 mb-4 rounded-md shadow-sm">
      <h3 className="text-sm font-semibold">Compra ID: {compra._id}</h3>
      <p className="text-sm">Total: ${compra.total}</p>
      <p className="text-sm">Fecha: {new Date(compra.fecha).toLocaleDateString()}</p>
      <button
        onClick={toggleExpand}
        className="text-blue-500 text-sm mt-2 mb-2"
      >
        {isExpanded ? 'Ver menos' : 'Ver más'}
      </button>
      {isExpanded && (
        <div className="transition-all duration-300 ease-in-out">
          <h4 className="text-sm font-semibold mt-2">Productos:</h4>
          <ul>
            {compra.productos.map(item => (
              <li key={item.producto._id} className="flex items-center space-x-2 mb-2">
                <img
                  src={`http://localhost:3002/uploads/${item.producto.imagenes[0]}`} // Ruta a la primera imagen del array
                  alt={item.producto.nombre}
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm">{item.producto.nombre}</span>
                <span className="text-sm">x {item.cantidad}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CompraHistorial = () => {
  const [compra, setCompras] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3002/perfil/compras', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompras(response.data);
      } catch (error) {
        setError('Error al obtener el historial de compras');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  if (loading) return <div>Cargando compras...</div>;
  if (error) return <div>{error}</div>;
  if (compra.length === 0) return <div>No has realizado ninguna compra.</div>;

  return (
    <div className="w-full h-96 overflow-y-auto bg-white p-4 rounded-md ">
      {compra.map(compra => (
        <CompraCard key={compra._id} compra={compra} />
      ))}
    </div>
  );
};

export default CompraHistorial;
