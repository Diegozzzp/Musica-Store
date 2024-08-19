import React, { useState } from 'react';
import AdminUsers from '../components/adminUser';
// Importa otros componentes de administración
// import AdminProducts from '../components/AdminProducts';
// import AdminCategories from '../components/AdminCategories';

const AdminPanelPage = () => {
  const [activeSection, setActiveSection] = useState(null); // Estado para la sección activa

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUsers />;
      // case 'products':
      //   return <AdminProducts />;
      // case 'categories':
      //   return <AdminCategories />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      {activeSection === null ? (
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setActiveSection('users')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Gestionar Usuarios
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Gestionar Productos
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Gestionar Categorías
          </button>
          {/* Agrega más botones según sea necesario */}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveSection(null)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Atrás
          </button>
          {renderSection()}
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
