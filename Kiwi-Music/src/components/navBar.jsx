import { useState, useContext, useEffect, useRef } from 'react'; // Added useEffect here
import { useNavigate } from 'react-router-dom';  // Importa useNavigate para redirección
import { FaEarthAmericas, FaXmark, FaBars } from "react-icons/fa6";
import { FaRegUserCircle, FaSearch, FaTshirt } from 'react-icons/fa';
import { TbVinyl } from "react-icons/tb";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContexto'; 
import { MdDelete } from 'react-icons/md'; 
import { getImageUrl } from '../utils/imageUrl';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAlbumsOpen, setIsAlbumsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);  // Estado para controlar la visibilidad del div de búsqueda
  const [searchTerm, setSearchTerm] = useState('');  // Agrega un estado para el término de búsqueda
  const [isScrolled, setIsScrolled] = useState(false);  // Estado para controlar si se ha hecho scroll
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();  // Hook para redirección
  const albumsRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (albumsRef.current && !albumsRef.current.contains(event.target)) {
        setIsAlbumsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`w-full border-b border-white/10 px-4 py-3 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#547980]/95 text-white shadow-md backdrop-blur' : 'bg-[#5a8a99] text-white'}`}>
      <div className="flex items-center pl-2 md:pl-6">
        <Link to="/" className="leading-none"><span className="text-xl font-black tracking-tight">Kiwi</span><span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[#9DE0AD]">Music</span></Link>
      </div>
      <div className="hidden lg:flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.08em]">
        <Link to="/tours" className="flex items-center gap-2 rounded px-2 py-2 hover:bg-white/10">
          <FaEarthAmericas className='text-[#9DE0AD]' />
          Tours
        </Link>
        <div className="relative" ref={albumsRef}>
          <button
            onClick={toggleAlbums}
            className="flex items-center gap-2 rounded px-2 py-2 hover:bg-white/10"
          >
            <TbVinyl className='text-[#9DE0AD]' />
              Albums
          </button>
          {isAlbumsOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 overflow-hidden rounded border border-white/10 bg-[#17252a] text-sm normal-case tracking-normal text-white shadow-xl">
              <Link to="/products" className="block px-4 py-3 hover:bg-white/10">Todos los Productos</Link>
              <Link to="/cassetes" className="block px-4 py-3 hover:bg-white/10">Cassetes</Link>
              <Link to="/discos" className="block px-4 py-3 hover:bg-white/10">Vinilos & CDs</Link>
              <Link to="/boxes" className="block px-4 py-3 hover:bg-white/10">Boxs</Link>
              <Link to="/packs" className="block px-4 py-3 hover:bg-white/10">Packs</Link>
            </div>
          )}
        </div>
        <Link to="/merch" className="flex items-center gap-2 rounded px-2 py-2 hover:bg-white/10">
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
            <div className="absolute right-0 top-full mt-3 w-[22rem] rounded border border-gray-100 bg-white p-5 text-black shadow-xl">
              <p className="mb-3 text-sm font-black text-[#17252a]">Buscar en Kiwi Music</p>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // Actualiza el estado del término de búsqueda
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded border border-gray-200 bg-[#f7f5f0] px-3 py-3 text-sm outline-none focus:border-[#547980]"
              />
              <button onClick={handleSearch} className="kiwi-button mt-3 w-full rounded px-3 py-3 text-sm">
                Buscar
              </button>
              <p className="mt-3 text-xs text-gray-500">Busca por artista, album o producto.</p>
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
            <div className="absolute right-0 mt-3 max-h-[24rem] w-80 overflow-y-auto rounded border border-gray-100 bg-white p-4 text-black shadow-xl">
              {cart.length > 0 ? (
                <>
                  <ul>
                    {cart.map((product, index) => (
                      <li key={index} className="border-b border-gray-100 py-3 flex items-start justify-between">
                        <div className="flex"> 
                          <img
                            src={getImageUrl(product.imagenes)}
                            alt={product.nombre}
                            className="w-14 h-14 rounded object-cover mr-4"
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
                  <Link to="/carritoPage" className="kiwi-button mt-4 block rounded px-4 py-3 text-center text-sm">
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
