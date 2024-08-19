import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaEdit } from 'react-icons/fa';
import EditarUsuario from './editarUsuario';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');

        const response = await axios.get(`http://localhost:3002/usuarios?page=${currentPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.docs)) {
          setUsers(response.data.docs);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setError('Hubo un problema al cargar los usuarios.');
      }
    };

    fetchUsers();
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

        const response = await axios.patch(
            `http://localhost:3002/editarUsuario/${userId}`,
            formData,
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Asegúrate de que el encabezado de contenido es correcto
                },
            }
        );

        console.log('Usuario actualizado:', response.data);

        // Re-fetch users to ensure the updated data is displayed
        const newResponse = await axios.get(`http://localhost:3002/usuarios?page=${currentPage}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (newResponse.data && Array.isArray(newResponse.data.docs)) {
            setUsers(newResponse.data.docs);
            setTotalPages(newResponse.data.totalPages);
        } else {
            throw new Error('La respuesta de la API no es un array');
        }

        setEditModalOpen(false);
        setSelectedUser(null);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        setError('Hubo un problema al actualizar el usuario.');
    }
};



  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              className="h-48 w-full object-cover"
              src={user.avatar ? `http://localhost:3002/uploads/${user.avatar[0]}` : '/default-avatar.png'}
              alt={`${user.nombre} ${user.apellido}`}
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-indigo-600">
                {user.nombre} {user.apellido}
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
              <div className="mt-4">
                <button
                  onClick={() => handleEditClick(user)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  <FaEdit className="inline-block mr-2" /> Editar Perfil
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
        />
      )}
    </div>
  );
};

export default AdminUsers;
