import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMailchimp, FaPhone } from 'react-icons/fa';
import Logout from '../components/cerrar-sesion';
import CompraHistorial from './historial';
import EditarUsuario from './editarUsuario';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ id, nombre, apellido, correo, telefono, avatar }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({ id, nombre, apellido, correo, telefono, avatar });
  const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para el rol del usuario
  const navigate = useNavigate();

  const avatarUrl = avatar ? `http://localhost:3002/uploads/${avatar}` : '';

  useEffect(() => {
    // Obtener el rol del usuario desde el backend
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');
  
        const response = await axios.get(`http://localhost:3002/usuario/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Verificar si el usuario existe
        const usuario = response.data.find(u => u._id === id);
        if (usuario) {
          setIsAdmin(usuario.rol === 'admin');
        } else {
          console.error('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      }
    };
  
    fetchUserRole();
  }, [id]);
  
 // Función para actualizar el perfil del usuario
  const handleSave = async (userId, formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se proporcionó token.');

      const response = await axios.patch(
        `http://localhost:3002/editarUsuario/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Perfil actualizado:', response.data);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  return (
    <div className='flex flex-col px-4 lg:flex-row'>
      {/* Información del usuario */}
      <div className="flex flex-col w-[30%] max-md:ml-0 max-lg:w-full rounded-2xl pt-6">
        <div className="flex flex-col w-full text-xl text-black bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-8 items-center">
          <div className="flex flex-col items-center pt-4">
            <img src={avatarUrl} alt={`${userData.nombre} ${userData.apellido}`} className="rounded-full w-32 h-32 object-cover mt-4" />
          </div>
          <div className="self-center mt-4 text-3xl leading-10 text-center pb-8">
            {userData.nombre} <br />
          </div>
          <Logout />
          <div className="flex flex-col items-start h-32 pl-6 w-full text-sm font-extralight bg-red-50 max-md:px-5 rounded-2xl">
            <div className="flex gap-4 whitespace-nowrap pt-8">
              <FaMailchimp className="text-2xl" />
              <div className="basis-auto">{userData.correo}</div>
            </div>
            <div className="flex gap-4 mt-7">
              <FaPhone className="text-2xl" />
              <div className=''>{userData.telefono}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Datos del usuario */}
      <div className="flex flex-col pt-6 pb-6 w-[30%] max-md:ml-0 max-lg:w-full rounded-2xl lg:pl-4">
        <div className="flex flex-col w-full text-xl text-black bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-8 items-start">
          <p className='font-semibold text-xl p-8'>Tus datos:</p>
          <div className="flex flex row items-center justify-between w-full px-4 pb-6">
            <p className='text-lg font-light'>Nombre:</p>
            <p className='text-lg font-light'>{userData.nombre}</p>
          </div>
          <div className="flex flex row items-center justify-between w-full px-4 pb-6">
            <p className='text-lg font-light'>Apellido:</p>
            <p className='text-lg font-light'>{userData.apellido}</p>
          </div>
          <div className="flex flex row items-center justify-between w-full px-4 pb-6">
            <p className='text-lg font-light'>Email:</p>
            <p className='text-lg font-light'>{userData.correo}</p>
          </div>
          <div className="flex flex row items-center justify-between w-full px-4 pb-6">
            <p className='text-lg font-light'>Telefono:</p>
            <p className='text-lg font-light'>{userData.telefono}</p>
          </div>
          <div className="flex flex row items-center justify-between w-full px-4 pb-6">
            <p className='text-lg font-light'>Password:</p>
            <p className='text-lg font-light'>********</p>
          </div>
          <button 
            className="self-center mb-8 py-2 text-xl font-light text-black whitespace-nowrap bg-green-300 rounded-3xl w-32"
            onClick={() => setEditModalOpen(true)}
          >
            Modificar
          </button>
        </div>
      </div>

      {/* Historial de compras */}
      <div className="flex flex-col w-[40%] max-md:ml-0 max-lg:w-full rounded-2xl lg:pl-4 pt-6">
        <CompraHistorial />
        {isAdmin && (
        <div className="flex flex-col mt-6 lg:pl-4">
          <button
            className="py-2  bg-blue-500 hover:bg-blue-700 text-white rounded-md mb-8"
            onClick={() => navigate('/admin')}
          >
            Ir al Panel de Administración
          </button>
        </div>
      )}
      </div>
      {/* Modal de edición del usuario */}
      <EditarUsuario 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        userData={userData}
        onSave={handleSave}
        userId={id} 
      />
    </div>
  );
};

export default UserProfile;
