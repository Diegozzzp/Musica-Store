import { useState, useContext, useEffect } from 'react'; // Added useEffect here
import { useNavigate } from 'react-router-dom';  // Importa useNavigate para redirección
import { FaEarthAmericas, FaXmark, FaBars } from "react-icons/fa6";
import { FaRegUserCircle, FaSearch, FaTshirt } from 'react-icons/fa';
import { TbVinyl } from "react-icons/tb";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContexto'; 
import { MdDelete } from 'react-icons/md'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAlbumsOpen, setIsAlbumsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);  // Estado para controlar la visibilidad del div de búsqueda
  const [searchTerm, setSearchTerm] = useState('');  // Agrega un estado para el término de búsqueda
  const [isScrolled, setIsScrolled] = useState(false);  // Estado para controlar si se ha hecho scroll
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();  // Hook para redirección

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleAlbums = () => {
    setIsAlbumsOpen(!isAlbumsOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Enviar una consulta con el término de búsqueda como nombre
      navigate(`/productos/campos?nombre=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false); // Cierra el div de búsqueda después de realizar la búsqueda
    }
  };

  // Use useEffect to add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`w-full p-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#547980] text-white' : 'bg-transparent text-white'}`}>
      <div className="flex items-center pl-8">
        <Link to="/"><span className="text-xl font-semibold ">Kiwi <br/> Music</span></Link>
      </div>
      <div className="hidden lg:flex space-x-24 text-lg">
        <Link to="/tours" className="hover:text-gray-400 flex items-center gap-2 hover:border-b border-[#9DE0AD] hover:transition hover:ease-in hover:duration-300 hover:transform hover:scale-105">
          <FaEarthAmericas className='text-[#9DE0AD]' />
          Tours
        </Link>
        <div className="relative">
          <button
            onClick={toggleAlbums}
            className="flex items-center hover:text-gray-400 gap-2 hover:border-b border-[#9DE0AD] hover:transition hover:ease-in hover:duration-300 hover:transform hover:scale-105"
          >
            <TbVinyl className='text-[#9DE0AD]' />
              Albums
          </button>
          {isAlbumsOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#547980] text-white rounded-lg shadow-lg w-48">
              <Link to="/products" className="block px-4 py-2 hover:bg-gray-600">Todos los Productos</Link>
              <Link to="/cassetes" className="block px-4 py-2 hover:bg-gray-600">Cassetes</Link>
              <Link to="/discos" className="block px-4 py-2 hover:bg-gray-600">Vinilos & CDs</Link>
              <Link to="/boxes" className="block px-4 py-2 hover:bg-gray-600">Boxs</Link>
              <Link to="/packs" className="block px-4 py-2 hover:bg-gray-600">Packs</Link>
            </div>
          )}
        </div>
        <Link to="/merch" className="hover:text-gray-400 flex items-center gap-2 hover:border-b border-[#9DE0AD] hover:transition hover:ease-in hover:duration-300 hover:transform hover:scale-105">
          <FaTshirt className='text-[#9DE0AD] ' />
          Merch
        </Link>
      </div>
      <div className="flex md:flex space-x-8 items-center">
        <div className="lg:block flex items-center">
          <button onClick={toggleSearch} className="relative cursor-pointer">
            <FaSearch className="w-4 h-4 text-white hover:text-gray-400" />
          </button>
          {isSearchOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-48">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // Actualiza el estado del término de búsqueda
                className="border border-gray-300 rounded-lg py-1 px-2 w-full"
              />
              <button onClick={handleSearch} className="mt-2 bg-[#547980] text-white w-full py-1 px-2 rounded-lg">
                Buscar
              </button>
            </div>
          )}
          
          
        </div>
        <div className="relative">
          <button onClick={toggleCart} aria-label="Shopping Cart" className="hover:text-gray-400 flex items-center relative cursor-pointer ">
            <HiOutlineShoppingCart className="w-6 h-6 " />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
              {cart.length > 0 ? (
                <>
                  <ul>
                    {cart.map((product, index) => (
                      <li key={index} className="border-b border-gray-200 py-2 flex items-start justify-between pt-4">
                        <div className="flex"> 
                          <img
                            src={`http://localhost:3002/uploads/${product.imagenes[0]}`}
                            alt={product.nombre}
                            className="w-12 h-12 object-cover mr-4"
                          />
                          <div>
                            <p className="text-sm text-gray-600">{product.descripcion}</p>
                            <p className="font-semibold">${product.precio}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(product._id)} className="text-red-500 hover:text-red-700">
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <Link to="/carritoPage" className="block text-center hover:text-[#9DE0AD] mt-2">
                    Ver carrito completo
                  </Link>
                </>
              ) : (
                <p className="text-center">El carrito está vacío</p>
              )}
              
            </div>
          )} 
        </div>
        <Link to="/login" className=" hidden lg:block hover:text-gray-400 flex items-center">
          <FaRegUserCircle className="w-6 h-6" aria-label="User Login" />
        </Link>
        <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} aria-label="Menu" className="focus:outline-none">
          {isOpen ? <FaXmark className="w-8 h-8" /> : <FaBars className="w-8 h-8" />}
        </button>
      </div>     
      </div>

      {/* Menú lateral móvil */}
      <div className={`fixed top-0 right-0 h-full bg-[#547980] text-white w-64 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} aria-label="Close Menu">
            <FaXmark className="w-8 h-8" />
          </button>
        </div>
        <nav className="flex flex-col space-y-8 p-4">
          <p className="text-2xl font-bold">Menu</p>
          <Link to="/tours" className="hover:text-gray-400 flex items-center gap-2" onClick={toggleMenu}>
            <FaEarthAmericas className='text-[#9DE0AD]' />
            Tours
          </Link>
          <div className="relative">
            <button
              onClick={toggleAlbums}
              className="flex items-center hover:text-gray-400 gap-2"
            >
              <TbVinyl className='text-[#9DE0AD]' />
              Albums
            </button>
            {isAlbumsOpen && (
              <div className="bg-[#547980] text-white rounded-lg shadow-lg mt-2">
                <Link to="/products" className="block px-4 py-2 hover:bg-gray-600" onClick={toggleMenu}>
                  Todos los Productos
                </Link>
                <Link to="/cassetes" className="block px-4 py-2 hover:bg-gray-600" onClick={toggleMenu}>
                  Cassetes
                </Link>
                <Link to="/discos" className="block px-4 py-2 hover:bg-gray-600" onClick={toggleMenu}>
                  Vinilos & CDs
                </Link>
                <Link to="/boxes" className="block px-4 py-2 hover:bg-gray-600" onClick={toggleMenu}>
                  Boxs
                </Link>
                <Link to="/packs" className="block px-4 py-2 hover:bg-gray-600" onClick={toggleMenu}>
                  Packs
                </Link>
              </div>
            )}
          </div>
          <Link to="/merch" className="hover:text-gray-400 flex items-center  gap-2" onClick={toggleMenu}>
            <FaTshirt className='text-[#9DE0AD]' />
            Merch
          </Link>
          <Link to="/login" className="block gap-2 py-2 hover:text-gray-600 flex" onClick={toggleMenu}>
            <FaRegUserCircle className="w-6 h-6 text-[#9DE0AD]" aria-label="User Login" />    Perfil
          </Link>
        </nav>
      </div>
    </nav>
  );
};

export default NavBar;
