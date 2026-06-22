import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMailchimp, FaPhone } from 'react-icons/fa';
import Logout from '../components/cerrar-sesion';
import CompraHistorial from './historial';
import EditarUsuario from './editarUsuario';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const UserProfile = ({ id, nombre, apellido, correo, telefono, avatar }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({ id, nombre, apellido, correo, telefono, avatar });
  const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para el rol del usuario
  const navigate = useNavigate();

  const avatarUrl = getImageUrl(avatar, '');

  useEffect(() => {
    // Obtener el rol del usuario desde el backend
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se proporcionó token.');
  
        const response = await axios.get(`https://musica-store.vercel.app/usuario/${id}`, {
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
        `https://musica-store.vercel.app/editarUsuario/${userId}`,
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
    <div className='kiwi-section grid gap-6 py-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(16rem,22rem)_1fr]'>
      {/* Información del usuario */}
      <div className="flex flex-col rounded pt-0">
        <div className="kiwi-card flex flex-col w-full text-xl text-black rounded items-center overflow-hidden">
          <div className="flex flex-col items-center pt-4">
            <img src={avatarUrl} alt={`${userData.nombre} ${userData.apellido}`} className="rounded-full w-32 h-32 object-cover mt-4 ring-4 ring-[#9DE0AD]/50" />
          </div>
          <div className="self-center mt-4 text-3xl font-black leading-10 text-center pb-6 text-[#17252a]">
            {userData.nombre} <br />
          </div>
          <Logout />
          <div className="mt-6 flex flex-col items-start min-h-32 px-6 w-full text-sm bg-[#f7f5f0]">
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
      <div className="flex flex-col pb-6 rounded">
        <div className="kiwi-card flex flex-col w-full text-xl text-black rounded items-start">
          <p className='font-black text-xl p-8 text-[#17252a]'>Tus datos</p>
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
            className="kiwi-button self-center mb-8 py-3 text-sm whitespace-nowrap rounded w-36"
            onClick={() => setEditModalOpen(true)}
          >
            Modificar
          </button>
        </div>
      </div>

      {/* Historial de compras */}
      <div className="flex flex-col rounded pt-0">
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
