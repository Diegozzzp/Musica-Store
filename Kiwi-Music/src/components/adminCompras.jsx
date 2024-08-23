import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Compras = () => {
    // Variables de estado para la paginación y la lista de compras y sus detalles de productos 
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedCompraId, setExpandedCompraId] = useState(null); // Para controlar la expansión
    const [productDetails, setProductDetails] = useState({}); // Guardar detalles de productos

    useEffect(() => {
        // Función para obtener las compras
        const fetchCompras = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3002/compras?page=${page}&limit=10`);

                // Log para ver la estructura completa de las compras
                console.log('Estructura de compras:', response.data.docs);

                setCompras(response.data.docs);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompras();
    }, [page]);

    useEffect(() => {
        // Función para obtener los detalles de los productos
        const fetchProductDetails = async () => {
            try {
                const allProductDetails = await Promise.all(
                    compras.flatMap(compra =>
                        compra.productos.map(async (item) => {
                            try {
                                const response = await axios.get(`http://localhost:3002/productos/${item.producto}`);
                                return { productoId: item.producto, details: response.data };
                            } catch (error) {
                                console.error(`Error al obtener el producto ${item.producto}:`, error);
                                return null;
                            }
                        })
                    )
                );

                // Filtramos nulls y organizamos los detalles por ID de producto
                const detailsByProductId = allProductDetails
                    .filter(detail => detail !== null)
                    .reduce((acc, { productoId, details }) => {
                        acc[productoId] = details;
                        return acc;
                    }, {});

                setProductDetails(detailsByProductId);
            } catch (err) {
                setError('Error al obtener los detalles de los productos');
            }
        };

        if (compras.length > 0) {
            fetchProductDetails();
        }
    }, [compras]);

    // Función para cambiar la paginación
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    // Función para controlar la expansión de las compras 
    const toggleExpand = (compraId) => {
        setExpandedCompraId(expandedCompraId === compraId ? null : compraId);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Historial de Compras</h2>
            {compras.length === 0 ? (
                <div>No tienes compras</div>
            ) : (
                <div className="space-y-4">
                    {compras.map((compra) => (
                        <div
                            key={compra._id}
                            className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
                            onClick={() => toggleExpand(compra._id)}
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={`http://localhost:3002/uploads/${compra.usuario.avatar?.[0] || 'default-avatar.png'}`}
                                    alt={`${compra.usuario.nombre} ${compra.usuario.apellido}`}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{compra.usuario.nombre} {compra.usuario.apellido}</h3>
                                    <p className="text-gray-600">Compra ID: {compra._id}</p>
                                    <p className="text-gray-600">Fecha: {new Date(compra.fecha).toLocaleDateString()}</p>
                                    <p className="text-gray-800 font-medium">Total: ${compra.total}</p>
                                </div>
                            </div>
                            {expandedCompraId === compra._id && (
                                <div className="mt-4">
                                    <h4 className="text-md font-semibold mt-2">Productos:</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                        {compra.productos.map((item, index) => {
                                            const product = productDetails[item.producto] || {};
                                            return (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <img
                                                        src={`http://localhost:3002/uploads/${product.imagenes?.[0] || 'default-product.png'}`}
                                                        alt={product.nombre}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                    <span className="text-sm font-medium">{product.nombre || 'Nombre no disponible'}</span>
                                                    <span className="text-sm">Cantidad: {item.cantidad}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                        >
                            Anterior
                        </button>
                        <span>Página {page} de {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compras;
