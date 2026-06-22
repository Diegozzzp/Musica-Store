import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const ProductCard = ({ item }) => (
  <li className="kiwi-card mb-3 flex items-center gap-4 rounded p-3">
    <Link to={`/producto/${item._id}`}>
      <img
        src={getImageUrl(item.imagenes, '/default.jpg')}
        alt={item.nombre}
        className="h-16 w-16 rounded object-cover"
      />
    </Link>
    <div className="min-w-0">
      <h2 className="font-black text-[#17252a]">{item.nombre}</h2>
      <p className="line-clamp-1 text-sm text-gray-600">{item.descripcion}</p>
      <p className="font-semibold">${item.precio}</p>
      <p className="break-all text-xs text-gray-500">ID: {item._id}</p>
    </div>
  </li>
);

const UserCard = ({ item }) => (
  <li className="kiwi-card mb-3 flex items-center gap-4 rounded p-3">
    <img
      src={getImageUrl(item.avatar, '/default.jpg')}
      alt={item.nombre}
      className="h-16 w-16 rounded-full object-cover"
    />
    <div className="min-w-0">
      <h2 className="font-black text-[#17252a]">{item.nombre}</h2>
      <p className="text-sm text-gray-600">Email: {item.correo || item.email}</p>
      <p className="text-sm text-gray-600">Rol: {item.rol}</p>
      <p className="break-all text-xs text-gray-500">ID: {item._id}</p>
    </div>
  </li>
);

const CategoryCard = ({ item }) => (
  <li className="kiwi-card mb-3 rounded p-4">
    <h2 className="font-black text-[#17252a]">{item.nombre}</h2>
    <p className="break-all text-xs text-gray-500">ID: {item._id}</p>
  </li>
);

export { ProductCard, UserCard, CategoryCard };
