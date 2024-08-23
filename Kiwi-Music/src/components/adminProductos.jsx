import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import EditarProducto from './editarProducto';
import CrearProducto from './crearProductos';

const AdminProductos = () => {
    // Variables de estado para la paginación y la lista de productos y sus detalles de productos 
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProductos();
    }, [currentPage]);
    // Función para obtener los productos y sus detalles
    const fetchProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se proporcionó token.');

            const response = await axios.get(`http://localhost:3002/productos?page=${currentPage}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && Array.isArray(response.data.docs)) {
                setProductos(response.data.docs);
                setTotalPages(response.data.totalPages);
            } else {
                throw new Error('La respuesta de la API no es un array');
            }
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            setError('Hubo un problema al cargar los productos.');
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    // Función para editar un producto (requiere autenticación)
    const handleSave = async (productId, formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se proporcionó token.');
    
            const response = await axios.patch(
                `http://localhost:3002/productos/${productId}`,
                formData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );
            fetchProductos(); // Recargar la lista de productos actualizados
            setEditModalOpen(false);
            setSelectedProduct(null);
    
            console.log('Producto actualizado:');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };


    // Función para crear un nuevo producto
    const handleCreateProduct = async (formData) => {
        try {
            await axios.post('http://localhost:3002/productos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Lógica para manejar la respuesta después de la creación del producto
            // Ejemplo: recargar productos, mostrar mensaje, etc.
            fetchProductos(); // Recargar la lista de productos
            setCreateModalOpen(false);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            setError('Hubo un problema al crear el producto.');
        }
    };

    // Función para eliminar un producto (requiere autenticación)
    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se proporcionó token.');

            await axios.patch(`http://localhost:3002/eliminarProducto/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchProductos(); // Recargar la lista de productos para reflejar la eliminación
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setError('Hubo un problema al eliminar el producto.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
                <button onClick={() => setCreateModalOpen(true)} className='bg-blue-500 hover:bg-blue-700 text-white font-light py-2 px-2 rounded flex items-center gap-2 '> <FaPlus className="text-xl" /> Crear Producto</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {productos.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden pt-6">
                        <img
                            className="h-48 w-full object-cover"
                            src={product.imagenes ? `http://localhost:3002/uploads/${product.imagenes[0]}` : '/default-image.png'}
                            alt={product.nombre}
                        />
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-indigo-600 flex items-center justify-between">
                                {product.nombre}
                            </h3>
                            <p className="mt-2 text-gray-600">Precio: ${product.precio}</p>
                            <p className="mt-2 text-gray-600 text-sm">Descripción: {product.descripcion}</p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={() => handleEditClick(product)}
                                    className="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
                                >
                                    <FaEdit className="inline-block mr-2 hidden sm:block" /> Editar Producto
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    <FaTrash className="inline-block" /> 
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Modal de edición */}
            <EditarProducto 
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                productData={selectedProduct}
                onSave={handleSave}
            />

            {/* Modal de creación */}
            <CrearProducto 
                 isOpen={isCreateModalOpen}
                 onClose={() => setCreateModalOpen(false)}
                 onSave={handleCreateProduct}
            />
             <div className="flex justify-between items-center flex-end mt-8">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Anterior
                </button>
                <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Siguiente
                </button>
            </div>

        </div>
    );
};

export default AdminProductos;
