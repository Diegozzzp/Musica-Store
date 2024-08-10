import React, { useState, useContext } from 'react';
import { FaChild, FaTshirt } from "react-icons/fa";
import { PiVinylRecord } from "react-icons/pi";
import { BiWorld } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { HiOutlineShoppingCart, HiOutlineUserCircle, HiMenu, HiX } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { CartContext } from './carritoContext'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useContext(CartContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-[#547980] text-white p-6 flex justify-between items-center sticky top-0 z-50 md:w-full">
      <div className="flex items-center space-x-2">
        <img src="/path-to-logo.png" alt="Logo" className="h-8 w-8" />
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
        <a href="#cart" className="hover:text-gray-400 flex items-center relative">
          <HiOutlineShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </a>
         <Link to="/perfil" className="hover:text-gray-400 flex items-center">
          <HiOutlineUserCircle className="w-6 h-6" />
        </Link>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="focus:outline-none">
          {isOpen ? <HiX className="w-8 h-8" /> : <HiMenu className="w-8 h-8" />}
        </button>
      </div>      
    </nav>
  );
};

export default NavBar;
