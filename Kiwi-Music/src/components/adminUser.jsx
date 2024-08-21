import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaEdit, FaPlus, FaRecordVinyl, FaTrash } from 'react-icons/fa';
import EditarUsuario from './editarUsuario';
import CrearUsuario from './crearUsuario'; // Importa el nuevo componente

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Estado para el modal de creación
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');

        const response = await axios.get(`http://localhost:3002/usuarios?page=${currentPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.docs)) {
          setUsuarios(response.data.docs);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setError('Hubo un problema al cargar los usuarios.');
      }
    };

    fetchUsuarios();
  }, [currentPage]);

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

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSave = async (userId, formData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');

        await axios.patch(
            `http://localhost:3002/editarUsuario/${userId}`,
            formData,
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
        );

        // Re-fetch usuarios to ensure the updated data is displayed
        await fetchUsuarios(); // Utiliza la función de fetch de usuarios

        setEditModalOpen(false);
        setSelectedUser(null);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        setError('Hubo un problema al actualizar el usuario.');
    }
  };

  const handleCreate = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');

        await axios.post('http://localhost:3002/usuario', formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        });

        // Re-fetch usuarios to ensure the new data is displayed
        await fetchUsuarios(); // Utiliza la función de fetch de usuarios

        setCreateModalOpen(false);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        setError('Hubo un problema al crear el usuario.');
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');

        await axios.patch(`http://localhost:3002/eliminarUsuario/${userId}`, {}, {
            headers: { 
                Authorization: `Bearer ${token}`,
            },
        });

        // Re-fetch usuarios to ensure the deleted data is no longer displayed
        await fetchUsuarios(); // Utiliza la función de fetch de usuarios
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        setError('Hubo un problema al eliminar el usuario.');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se proporcionó token.');

      const response = await axios.get(`http://localhost:3002/usuarios?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.docs)) {
        setUsuarios(response.data.docs);
        setTotalPages(response.data.totalPages);
      } else {
        throw new Error('La respuesta de la API no es un array');
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setError('Hubo un problema al cargar los usuarios.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>
        <button
          onClick={() => setCreateModalOpen(true)} // Abre el modal de creación
          className="px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition duration-300 mb-4 flex items-center"
        >
          <FaPlus className="inline-block mr-2" /> Crear Usuario
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {usuarios.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              className="h-48 w-full object-cover"
              src={user.avatar ? `http://localhost:3002/uploads/${user.avatar[0]}` : '/default-avatar.png'}
              alt={`${user.nombre} ${user.apellido}`}
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-indigo-600 flex items-center justify-between">
                {user.nombre} {user.apellido}
                {user.Eliminado ? (
                <p className="mt-2 text-gray-600">
                  <FaRecordVinyl className="inline-block mr-2 text-red-500" />
                </p>
              ) : (
                <p className="text-gray-600">
                  <FaRecordVinyl className="inline-block mr-2 text-green-500" />
                </p>
              )}
              </h3>
              <p className="mt-2 text-gray-600">
                <FaEnvelope className="inline-block mr-2" /> {user.correo}
              </p>
              <p className="mt-2 text-gray-600">
                <FaPhone className="inline-block mr-2" /> {user.telefono}
              </p>
              <p className="mt-2 text-gray-600">
                <FaEdit className="inline-block mr-2" /> {user.rol}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditClick(user)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  <FaEdit className="inline-block mr-2" /> Editar Perfil
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  <FaTrash className="inline-block" /> 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Página Anterior
        </button>
        <p>Página {currentPage} de {totalPages}</p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Página Siguiente
        </button>
      </div>

      {/* Modal de edición del usuario */}
      {selectedUser && (
        <EditarUsuario
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          userData={selectedUser}
          onSave={handleSave}
          userId={selectedUser._id}
          isAdmin={selectedUser.rol === 'usuario'}
        />
      )}

      {/* Modal de creación de usuario */}
      {isCreateModalOpen && (
        <CrearUsuario
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
};

export default AdminUsers;
