// src/components/NavBar.jsx
import React, { useState } from 'react';
import { FaChild, FaTshirt } from "react-icons/fa";
import { PiVinylRecord } from "react-icons/pi";
import { BiWorld } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { HiOutlineShoppingCart, HiOutlineUserCircle, HiMenu, HiX } from "react-icons/hi";
import { Link } from 'react-router-dom'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-[#594F4F] text-white p-6 flex justify-between items-center sticky top-0 z-50 md:w-full">
      <div className="flex items-center space-x-2">
        <img src="/path-to-logo.png" alt="Logo" className="h-8 w-8" />
          <Link to="/"><span className="text-xl font-semibold">Kiwi Music</span></Link>
      </div>
      <div className="hidden lg:flex space-x-24 text-lg">
        <Link to="/tours" className="hover:text-gray-400 flex items-center">
          <BiWorld />
          Tours
        </Link>
        <Link to="/artists" className="hover:text-gray-400 flex items-center">
          <FaChild />
          Artistas
        </Link>
        <Link to="/products" className="hover:text-gray-400 flex items-center">
          <PiVinylRecord />
          Albums
        </Link>
        <Link to="/merch" className="hover:text-gray-400 flex items-center">
          <FaTshirt />
          Merch
        </Link>
      </div>
      <div className="hidden md:flex space-x-8">
        <a href="#search" className="hover:text-gray-400 flex items-center">
          <CiSearch className="w-6 h-6" />
        </a>
        <a href="#cart" className="hover:text-gray-400 flex items-center">
          <HiOutlineShoppingCart className="w-6 h-6" />
        </a>
        <a href="#login" className="hover:text-gray-400 flex items-center">
          <HiOutlineUserCircle className="w-6 h-6" />
        </a>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="focus:outline-none">
          {isOpen ? <HiX className="w-8 h-8" /> : <HiMenu className="w-8 h-8" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#594F4F] text-white flex flex-col items-center space-y-4 py-4">
          <Link to="/tours" className="hover:text-gray-400 flex items-center">
            <BiWorld />
            Tours
          </Link>
          <Link to="/artists" className="hover:text-gray-400 flex items-center">
            <FaChild />
            Artistas
          </Link>
          <Link to="/products" className="hover:text-gray-400 flex items-center">
            <PiVinylRecord />
            Albums
          </Link>
          <Link to="/merch" className="hover:text-gray-400 flex items-center">
            <FaTshirt />
            Merch
          </Link>
          <a href="#search" className="hover:text-gray-400 flex items-center">
            <CiSearch className="w-6 h-6" />
          </a>
          <a href="#cart" className="hover:text-gray-400 flex items-center">
            <HiOutlineShoppingCart className="w-6 h-6" />
          </a>
          <a href="#login" className="hover:text-gray-400 flex items-center">
            <HiOutlineUserCircle className="w-6 h-6" />
          </a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
