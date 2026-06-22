import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';

const UserSearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('nombre');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://musica-store.vercel.app/productos/campos', {
          params: { nombre: searchTerm }
        });

        setResults(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('No pudimos cargar los resultados.');
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  return (
    <section className="kiwi-section py-12 md:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#547980]">Busqueda</p>
        <h1 className="mt-2 text-3xl font-black text-[#17252a] md:text-5xl">Resultados para "{searchTerm}"</h1>
      </div>

      {error && <p className="mb-6 rounded bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[24rem] animate-pulse rounded bg-white/70" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((producto) => (
            <Link key={producto._id} to={`/producto/${producto._id}`} className="kiwi-card group overflow-hidden rounded">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img src={getImageUrl(producto.imagenes)} alt={producto.nombre} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h2 className="line-clamp-1 text-lg font-black text-[#17252a]">{producto.nombre}</h2>
                <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">{producto.descripcion}</p>
                <p className="mt-4 text-xl font-black text-[#17252a]">${producto.precio}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="kiwi-card rounded p-10 text-center">
          <p className="text-lg font-semibold text-[#17252a]">No se encontraron resultados.</p>
          <p className="mt-2 text-sm text-gray-500">Prueba con otro artista, album o producto.</p>
        </div>
      )}
    </section>
  );
};

export default UserSearchResults;
