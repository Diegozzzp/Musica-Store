import React, { useContext } from 'react';
import { CartContext } from '../components/carritoContexto';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const CompraRealizar = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);

    const calcularTotal = () => {
        return cart.reduce((acc, product) => acc + (product.precio || 0) * (product.cantidad || 0), 0);
    };

    const handleCompra = () => {
        console.log("Compra realizada:", cart);
        clearCart(); 
        alert("Compra realizada con éxito!");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Resumen de la Compra</h1>
            {cart.length > 0 ? (
                <>
                    <ul className="mb-4">
                        {cart.map((product, index) => (
                            <li key={index} className="border-b border-gray-200 py-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    <Link to={`/producto/${product._id}`}>
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
                                    <p className="text-lg font-semibold mr-4">${(product.precio || 0) * (product.cantidad || 0)}</p>
                                    <button onClick={() => removeFromCart(product._id)} className="text-red-500 hover:text-red-700">
                                        <MdDelete className="w-6 h-6" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right">
                        <p className="text-xl font-bold">Total: ${calcularTotal().toFixed(2)}</p>
                        <button 
                            onClick={handleCompra} 
                            className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700"
                        >
                            Realizar Compra
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center">No hay productos en el carrito</p>
            )}
            <div className="text-center mt-6">
                <Link to="/products" className="text-blue-500 hover:underline">
                    Seguir comprando
                </Link>
            </div>
        </div>
    );
};

export default CompraRealizar;
