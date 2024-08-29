// ProductCard.js
import { Link } from 'react-router-dom';
const ProductCard = ({ item }) => (
    <li className="border-b border-gray-200 py-2 flex items-center">
      <Link to={`/producto/${item._id}`}>
        <img
          src={`http://localhost:3002/uploads/${item.imagenes ? item.imagenes[0] : 'default.jpg'}`}
          alt={item.nombre}
          className="w-12 h-12 object-cover mr-4"
        />
      </Link>
      <div>
        <h2 className="font-bold">{item.nombre}</h2>
        <p className="text-sm text-gray-600">{item.descripcion}</p>
        <p className="font-semibold">${item.precio}</p>
        <p className="text-sm text-gray-600">ID: {item._id}</p>
      </div>
    </li>
  );
  
  // UserCard.js
  const UserCard = ({ item }) => (
    <li className="border-b border-gray-200 py-2 flex items-center">
      <Link to={`/usuarios/${item._id}`}>
        <img
          src={`http://localhost:3002/uploads/${item.avatar || 'default.jpg'}`}
          alt={item.nombre}
          className="w-12 h-12 object-cover mr-4"
        />
      </Link>
      <div>
        <h2 className="font-bold">{item.nombre}</h2>
        <p className="text-sm text-gray-600">Email: {item.email}</p>
        <p className="text-sm text-gray-600">Rol: {item.rol}</p>
        <p className="text-sm text-gray-600">ID: {item._id}</p>
      </div>
    </li>
  );
  
  // CategoryCard.js
  const CategoryCard = ({ item }) => (
    <li className="border-b border-gray-200 py-2 flex items-center">
      <div>
        <h2 className="font-bold">{item.nombre}</h2>
        <p className="text-sm text-gray-600">ID: {item._id}</p>
      </div>
    </li>
  );

  export { ProductCard, UserCard, CategoryCard };