import React, { useContext, useMemo, useState } from 'react';
import { CartContext } from '../components/carritoContexto';
import { MdDelete } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import axios from 'axios';

const CompraRealizar = () => {
    // Obtener el contexto del carrito de compras
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [loading, setLoading] = useState(false); // Estado para gestionar la carga de la compra

    // Memoriza el cálculo del total para evitar recalculaciones innecesarias
    const total = useMemo(() => {
        return cart.reduce((acc, product) => acc + (product.precio || 0) * (product.cantidad || 0), 0);
    }, [cart]);

    // Función para manejar la realización de la compra
    const handleCompra = async () => {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
        
        if (!token) {
            // Si no hay token, redirigir al usuario a la página de inicio de sesión
            navigate('/login');
            return;
        }
    
        try {
            setLoading(true); // Activar el estado de carga
            const response = await axios.post('http://localhost:3002/comprar', {
                productos: cart.map(item => ({
                    producto: item._id,
                    cantidad: item.cantidad,
                })),
                total: total,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 201) {
                // Mostrar un mensaje de éxito si la compra fue realizada correctamente
                toast.success('¡Compra realizada con éxito!', {
                    position: "top-right",
                    autoClose: 5000,
                });

                clearCart(); // Limpiar el carrito después de la compra
            }
        } catch (error) {
            // Mensaje de error según el estado de la respuesta
            const errorMsg = error.response?.status === 401
                ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
                : 'Hubo un problema al realizar la compra. Por favor, inténtalo de nuevo.';

            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 5000,
            });

            if (error.response?.status === 401) {
                navigate('/login'); // Redirigir a la página de inicio de sesión en caso de sesión expirada
            }
        } finally {
            setLoading(false); // Desactivar el estado de carga
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Resumen de la Compra</h1>
            {cart.length > 0 ? (
                <>
                    {/* Lista de productos en el carrito */}
                    <ul className="mb-4">
                        {cart.map((product, index) => (
                            <li key={index} className="border-b border-gray-200 py-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    <Link to={`/producto/${product._id}`}>
                                        {/* Imagen del producto con enlace a la página del producto */}
                                        <img
                                            src={`http://localhost:3002/uploads/${product.imagenes[0]}`}
                                            alt={product.nombre}
                                            className="w-20 h-20 object-cover mr-4"
                                        />
                                    </Link>
                                    <div>
                                        <p className="text-lg font-semibold">{product.nombre}</p>
                                        <p className="text-gray-600">{product.descripcion}</p>
                                        <p>Cantidad: {product.cantidad}</p>
                                        <p>Precio unitario: ${product.precio}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {/* Precio total por producto */}
                                    <p className="text-lg font-semibold mr-4">${(product.precio || 0) * (product.cantidad || 0)}</p>
                                    {/* Botón para eliminar un producto del carrito */}
                                    <button onClick={() => removeFromCart(product._id)} className="text-red-500 hover:text-red-700">
                                        <MdDelete className="w-6 h-6" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right">
                        {/* Monto total de la compra */}
                        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
                        {/* Botón para realizar la compra */}
                        <button 
                            onClick={handleCompra} 
                            className={`bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700 ${loading ? 'cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Realizar Compra'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center mt-20">
                    <p>No hay productos en el carrito.</p>
                    <Link to="/products" className="text-blue-500 hover:underline">
                        Ir a productos
                    </Link>
                    <p className="mt-2">
                        O regresa al <Link to="/" className="text-blue-500 hover:underline">inicio</Link>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CompraRealizar;
