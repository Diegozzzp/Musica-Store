import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { FaMailchimp } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';
import Logout from '../components/cerrar-sesion';
import CompraHistorial from './historial';


const UserProfile = ({ nombre, apellido, correo, telefono }) => {
  return (
    <div className='flex flex-col px-4 lg:flex-row'>
      <div className="flex flex-col w-[30%] max-md:ml-0 max-lg:w-full rounded-2xl pt-6">
        <div className="flex flex-col w-full text-xl text-black bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-8 items-center">
          <div className="flex flex-col items-center pt-4">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/59ec1edcab8c0d87f36db99b24e29aade77ef232536d70d75a6bf8880dbef112?placeholderIfAbsent=true&apiKey=1bfca2b26d534310b141227ff3cfcb19" alt="User Profile" className="object-contain max-w-full aspect-square w-[140px] flex" />
          </div>
          <div className="self-center mt-4 text-3xl leading-10 text-center pb-8">
            {nombre} <br />
          </div>
          <Logout />
          <div className="flex flex-col items-start h-32 pl-6 w-full text-sm font-extralight bg-red-50 max-md:px-5 rounded-2xl">
            <div className="flex gap-4 whitespace-nowrap pt-8">
              <FaMailchimp className="text-2xl" />
              <div className="basis-auto">{correo}</div>
            </div>
            <div className="flex gap-4 mt-7">
              <FaPhone className="text-2xl" />
              <div className="">{telefono}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col pt-6 pb-6 w-[30%] max-md:ml-0 max-lg:w-full rounded-2xl lg:pl-4">
        <div className="flex flex-col w-full text-xl text-black bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:mt-8 items-start">
          <p className='font-semibold text-xl p-8'>Tus datos:</p>
            <div className="flex flex row items-center justify-between w-full px-4 pb-6">
              <p className='text-lg font-light'>Nombre:</p>
              <p className='text-lg font-light'>{nombre}</p>
            </div>
            <div className="flex flex row items-center justify-between w-full px-4 pb-6">
              <p className='text-lg font-light'>Apellido:</p>
              <p className='text-lg font-light'>{apellido}</p>
            </div>
            <div className="flex flex row items-center justify-between w-full px-4 pb-6">
              <p className='text-lg font-light'>Email:</p>
              <p className='text-lg font-light'>{correo}</p>
            </div>
            <div className="flex flex row items-center justify-between w-full px-4 pb-6">
              <p className='text-lg font-light'>Telefono:</p>
              <p className='text-lg font-light'>{telefono}</p>
            </div>
            <div className="flex flex row items-center justify-between w-full px-4 pb-6">
              <p className='text-lg font-light'>Password:</p>
              <p className='text-lg font-light'>********</p>
            </div>
            <button className="self-center mb-8 py-2 text-xl font-light text-black whitespace-nowrap bg-green-300 rounded-3xl w-32">
              Modificar
            </button>
        </div>
      </div>
      <div className="flex flex-col w-[40%] max-md:ml-0 max-lg:w-full rounded-2xl lg:pl-4 pt-6">
        <CompraHistorial /> 
      </div>
    </div>
  );
};

export default UserProfile;


