import React, { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaMailchimp, FaPhone } from 'react-icons/fa';
import Logout from '../components/cerrar-sesion';
import CompraHistorial from './historial';
import EditarUsuario from './editarUsuario'; 

const UserProfile = ({ id, nombre, apellido, correo, telefono, avatar }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({ id, nombre, apellido, correo, telefono, avatar });

  const avatarUrl = avatar ? `http://localhost:3002/uploads/${avatar}` : '';

  const handleSave = async (userId, formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se proporcionó token.');
      }
  
      const response = await axios.patch(
        `http://localhost:3002/editarUsuario/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      console.log('Perfil actualizado:', response.data);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };
  
  return (
    <div className='flex flex-col px-4 lg:flex-row'>
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
      <div className="flex flex-col w-[40%] max-md:ml-0 max-lg:w-full rounded-2xl lg:pl-4 pt-6">
        <CompraHistorial /> 
      </div>
        <EditarUsuario 
          isOpen={isEditModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          userData={userData}
          onSave={handleSave}
          userId={id} // Asegúrate de pasar `userId` aquí
        />
    </div>
  );
};

export default UserProfile;
