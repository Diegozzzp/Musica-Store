import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoriasComponent = () => {
    // Estados para las categorías
    const [categorias, setCategorias] = useState(null);
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // Estado para el modal

    useEffect(() => {
        fetchCategorias();
    }, [page]);
// Función para obtener las categorías
    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/categorias?page=${page}`);
            const { docs, hasPrevPage, hasNextPage, totalPages } = response.data;
            setCategorias(docs || []);
            setTotalPages(totalPages || 1);
            setHasPrevPage(hasPrevPage);
            setHasNextPage(hasNextPage);
        } catch (error) {
            console.error('Error al obtener las categorías', error);
            setCategorias([]);
        }
    };
    // Funciones para crear, editar y eliminar categorías
    const handleCreateCategoria = async () => {
        try {
            await axios.post('http://localhost:3002/categorias', { nombre });
            fetchCategorias();
            setNombre('');
            setModalOpen(false); // Cerrar el modal después de crear
        } catch (error) {
            console.error('Error al crear la categoría', error);
        }
    };

    const handleEditCategoria = async (id) => {
        try {
            await axios.patch(`http://localhost:3002/categorias/${id}`, { nombre });
            fetchCategorias();
            setNombre('');
            setEditingId(null);
            setModalOpen(false); // Cerrar el modal después de editar
        } catch (error) {
            console.error('Error al editar la categoría', error);
        }
    };

    const handleDeleteCategoria = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/categorias/${id}`);
            fetchCategorias();
        } catch (error) {
            console.error('Error al eliminar la categoría', error);
        }
    };

    if (categorias === null) {
        return <div className="text-center">Cargando categorías...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Categorías</h1>

            <div className="mb-4 text-center">
                <button 
                    onClick={() => {
                        setNombre('');
                        setEditingId(null);
                        setModalOpen(true);
                    }}
                    className="bg-[#9DE0AD] text-white py-2 px-4 rounded hover:bg-[#1B4332]"
                >
                    Crear Categoría
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {categorias.length > 0 ? (
                    categorias.map((categoria) => (
                        <div key={categoria._id} className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold">{categoria.nombre}</h2>
                            <p className="text-gray-600">ID: {categoria._id}</p>
                            <div className="mt-4 space-x-2">
                                <button 
                                    onClick={() => {
                                        setEditingId(categoria._id);
                                        setNombre(categoria.nombre);
                                        setModalOpen(true);
                                    }}
                                    className="bg-[#9DE0AD] text-[#1B4332] px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDeleteCategoria(categoria._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                                {categoria.Eliminado ? <p className="text-red-500">Inactivo</p> : null}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay categorías disponibles</p>
                )}
            </div>

            <div className="mt-4 flex justify-center space-x-2">
                <button 
                    onClick={() => setPage(page - 1)} 
                    disabled={!hasPrevPage}
                    className={`px-4 py-2 rounded ${!hasPrevPage ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                    Anterior
                </button>
                <button 
                    onClick={() => setPage(page + 1)} 
                    disabled={!hasNextPage}
                    className={`px-4 py-2 rounded ${!hasNextPage ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                    Siguiente
                </button>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Editar Categoría' : 'Crear Categoría'}</h2>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre de la categoría"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                        />
                        <button 
                            onClick={() => editingId ? handleEditCategoria(editingId) : handleCreateCategoria()}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                        <button 
                            onClick={() => setModalOpen(false)}
                            className="mt-2 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriasComponent;
