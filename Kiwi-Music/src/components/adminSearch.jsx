import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ProductCard, UserCard, CategoryCard } from './cardsSearch';

const AdminSearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('productos'); // Por defecto busca productos

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const type = queryParams.get('type') || 'productos'; // Tipo de búsqueda por defecto

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
    setSearchType(type);
  }, [query, type]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let url;
        let params = {};

        switch (searchType) {
          case 'categorias':
            url = `http://localhost:3002/categorias/${searchTerm}`;
            params.id = searchTerm; // Usar 'nombre' para buscar categorías
            break;
          case 'productos':
            url = `http://localhost:3002/productos/campos`;
            params.id = searchTerm; // Usar 'nombre' para buscar productos
            break;
          case 'usuarios':
            url = `http://localhost:3002/usuario/${searchTerm}`;
            params.id = searchTerm; // Puedes añadir más parámetros según sea necesario
            break;
          default:
            url = `http://localhost:3002/productos/campos`;
        }

        const response = await axios.get(url, { params });

        if (response.data) {
          setResults(response.data);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (error) {
        setError('Error fetching search results');
        console.error('Error fetching search results:', error);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm, searchType]);

  // Función para renderizar resultados utilizando los componentes de tarjeta personalizados
  const renderResults = () => {
    return results.map((item) => {
      switch (searchType) {
        case 'productos':
          return <ProductCard key={item._id} item={item} />;
        case 'usuarios':
          return <UserCard key={item._id} item={item} />;
        case 'categorias':
          return <CategoryCard key={item._id} item={item} />;
        case 'compras':
          return <PurchaseCard key={item._id} item={item} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Resultados de Búsqueda para "{searchTerm}"</h1>
      <form className="mb-6">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="ml-2 p-2 border border-gray-300 rounded"
        >
          <option value="productos">Productos</option>
          <option value="categorias">Categorías</option>
          <option value="usuarios">Usuarios</option>
        </select>
        <button
          type="button"
          onClick={() => {
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('query', searchTerm);
            newUrl.searchParams.set('type', searchType);
            window.history.pushState({}, '', newUrl);
          }}
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Buscar
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 ? (
        <ul>
          {renderResults()}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default AdminSearchResults;
