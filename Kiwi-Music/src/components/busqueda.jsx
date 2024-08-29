// UserSearchResults.js
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const UserSearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('nombre');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:3002/productos/campos', {
          params: { nombre: searchTerm }
        });

        if (response.data && Array.isArray(response.data)) {
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
  }, [searchTerm]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Resultados de Búsqueda para "{searchTerm}"</h1>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 ? (
        <ul>
          {results.map((producto) => (
            <li key={producto._id} className="border-b border-gray-200 py-2 flex items-center">
              <Link to={`/producto/${producto._id}`}>
                <img
                  src={`http://localhost:3002/uploads/${producto.imagenes[0]}`}
                  alt={producto.nombre}
                  className="w-12 h-12 object-cover mr-4"
                />
              </Link>
              <div>
                <p className="text-sm text-gray-600">{producto.descripcion}</p>
                <p className="font-semibold">${producto.precio}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default UserSearchResults;
