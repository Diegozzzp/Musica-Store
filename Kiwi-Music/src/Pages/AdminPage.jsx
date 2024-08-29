import React, { useState, lazy, Suspense, useMemo } from 'react';
import { FaArrowLeft, FaUsersCog, FaBoxOpen, FaBookmark, FaShoppingCart, FaChartLine, FaSearch } from 'react-icons/fa';

// Importación diferida de componentes: Cargar componentes solo cuando se necesiten para optimizar el rendimiento
const AdminUsers = lazy(() => import('../components/adminUsuarios'));
const AdminProductos = lazy(() => import('../components/adminProductos'));
const Compras = lazy(() => import('../components/adminCompras'));
const CategoriasComponent = lazy(() => import('../components/adminCategorias'));
const Reportes = lazy(() => import('../components/reporteVentas'));
const AdminSearchResults = lazy(() => import('../components/adminSearch'));

// Componente de botón reutilizable
// Este componente renderiza un botón con un ícono y una etiqueta
const AdminButton = ({ onClick, Icon, label }) => (
  <button
    onClick={onClick}
    className="px-4 py-6 bg-[#FAFAF5] text-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-4"
  >
    {/* Ícono mostrado en el botón */}
    <Icon className='text-[#45ADA8] w-16 h-16' />
    {/* Texto de la etiqueta mostrado en el botón */}
    <p className="text-black">{label}</p>
  </button>
);

const AdminPanelPage = () => {
  // Estado para rastrear la sección activa del panel de administración
  const [activeSection, setActiveSection] = useState(null);

  // Memoizar la función renderSection para evitar re-renderizados innecesarios
  // Esta función determina qué sección renderizar según el estado activeSection
  const renderSection = useMemo(() => {
    switch (activeSection) {
      case 'users':
        return <AdminUsers />;
      case 'productos':
        return <AdminProductos />;
      case 'categorias':
        return <CategoriasComponent />;
      case 'compras':
        return <Compras />;
      case 'reportes':
        return <Reportes />;
      case 'search':
        return <AdminSearchResults />; // Añadido para la sección de búsqueda
      default:
        return null;
    }
  }, [activeSection]);

  return (
    <div className="container mx-auto p-4">
      {/* Sección de encabezado con un botón de regreso y el título de la página */}
      <div className='flex items-center gap-4 pb-8'>
        {activeSection && (
          <button onClick={() => setActiveSection(null)}>
            {/* Botón de regreso para volver al menú principal */}
            <FaArrowLeft className="" />
          </button>
        )}
        <h1 className="text-3xl font-bold">Panel de administración</h1>
      </div>
      
      {/* Mostrar los botones de navegación si no hay una sección activa */}
      {activeSection === null ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Botones para navegar a diferentes secciones del panel de administración */}
          <AdminButton onClick={() => setActiveSection('users')} Icon={FaUsersCog} label="Gestionar Usuarios" />
          <AdminButton onClick={() => setActiveSection('productos')} Icon={FaBoxOpen} label="Gestionar Productos" />
          <AdminButton onClick={() => setActiveSection('categorias')} Icon={FaBookmark} label="Gestionar Categorías" />
          <AdminButton onClick={() => setActiveSection('compras')} Icon={FaShoppingCart} label="Gestionar Compras" />
          <AdminButton onClick={() => setActiveSection('reportes')} Icon={FaChartLine} label="Reportes" />
          <AdminButton onClick={() => setActiveSection('search')} Icon={FaSearch} label="Buscar" /> {/* Añadido botón de búsqueda */}
        </div>
      ) : (
        // Mostrar el componente correspondiente a la sección activa
        <Suspense fallback={<div>Cargando...</div>}>
          {renderSection}
        </Suspense>
      )}
    </div>
  );
};

export default AdminPanelPage;
