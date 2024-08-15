import { useState, useContext } from 'react';
import { FaChild, FaTshirt } from "react-icons/fa";
import { PiVinylRecord } from "react-icons/pi";
import { BiWorld } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { HiOutlineShoppingCart, HiOutlineUserCircle, HiMenu, HiX } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContexto'; 
import { MdDelete } from 'react-icons/md'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart } = useContext(CartContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <nav className="w-full bg-[#547980] text-white p-6 flex justify-between items-center sticky top-0 z-50 md:w-full">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <Link to="/"><span className="text-xl font-semibold">Kiwi Music</span></Link>
      </div>
      <div className="hidden lg:flex space-x-24 text-lg">
        <Link to="/tours" className="hover:text-gray-400 flex items-center">
          <BiWorld className='text-[#9DE0AD]' />
          Tours
        </Link>
        <Link to="/artists" className="hover:text-gray-400 flex items-center">
          <FaChild className='text-[#9DE0AD]' />
          Artistas
        </Link>
        <Link to="/products" className="hover:text-gray-400 flex items-center">
          <PiVinylRecord className='text-[#9DE0AD]' />
          Albums
        </Link>
        <Link to="/merch" className="hover:text-gray-400 flex items-center">
          <FaTshirt className='text-[#9DE0AD]' />
          Merch
        </Link>
      </div>
      <div className="hidden md:flex space-x-8">
        <a href="#search" className="hover:text-gray-400 flex items-center">
          <CiSearch className="w-6 h-6" />
        </a>
        <div className="relative">
          <button onClick={toggleCart} aria-label="Shopping Cart" className="hover:text-gray-400 flex items-center relative">
            <HiOutlineShoppingCart className="w-6 h-6" />
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
        <Link to="/login" className="hover:text-gray-400 flex items-center">
          <HiOutlineUserCircle className="w-6 h-6" aria-label="User Login" />
        </Link>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} aria-label="Menu" className="focus:outline-none">
          {isOpen ? <HiX className="w-8 h-8" /> : <HiMenu className="w-8 h-8" />}
        </button>
      </div>      
    </nav>
  );
};

export default NavBar;
