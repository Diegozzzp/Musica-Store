import React, { useState } from 'react';
import AdminUsers from '../components/adminUser';
import AdminProductos from '../components/adminProductos';
import Compras from '../components/adminCompras';
import { FaArrowLeft, FaUsersCog, FaBoxOpen, FaBookmark, FaShoppingCart } from 'react-icons/fa';


const AdminPanelPage = () => {
  const [activeSection, setActiveSection] = useState(null); // Estado para la sección activa

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUsers />;
       case 'productos':
        return <AdminProductos />;
      //   return <AdminProducts />;
      case 'compras':
         return <Compras />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex items-center gap-4 pb-8'>
          <button
            onClick={() => setActiveSection(null)}
            className=""
          >
            <FaArrowLeft className="" />
          </button>
          <h1 className="text-3xl font-bold">Panel de administración</h1>
        </div>
      {activeSection === null ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveSection('users')}
            className="px-4 py-6 bg-[#FAFAF5] text-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-4"
          >
            <FaUsersCog className='text-[#45ADA8] w-16 h-16' />

            <p className="text-black">Gestionar Usuarios</p>
          </button>
          <button
            onClick={() => setActiveSection('productos')}
            className="px-4 py-6 bg-[#FAFAF5] text-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-4"
          >
            <FaBoxOpen className='text-[#45ADA8] w-16 h-16' />

           <p className="text-black">Gestionar Productos</p>
          </button>
          <button
            onClick={() => setActiveSection('categorias')}
            className="px-4 py-6 bg-[#FAFAF5] text-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-4"
          >
            <FaBookmark className='text-[#45ADA8] w-16 h-16' />
            <p className="text-black">Gestionar Categorías</p>
          </button>
          <button
            onClick={() => setActiveSection('compras')}
            className="px-4 py-6 bg-[#FAFAF5] text-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-4"
          >
            <FaShoppingCart className='text-[#45ADA8] w-16 h-16' />
            <p className="text-black">Gestionar Compras</p>
          </button>
        </div>

      ) : (
        renderSection()
      )}
    </div>
  );
};

export default AdminPanelPage;
