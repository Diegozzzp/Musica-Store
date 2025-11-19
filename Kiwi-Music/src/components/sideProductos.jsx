import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import '../index.css';

const URL_PRODUCTOS = 'http://localhost:3002/productos/categoria/';

const CarruselProductos = ({ categoriaId, titulo }) => {
    const [productos, setProductos] = useState([]);
    const carouselRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const { data } = await axios.get(`${URL_PRODUCTOS}${categoriaId}`);
                if (Array.isArray(data.productos)) {
                    setProductos(data.productos);
                } else {
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (categoriaId) {
            fetchProductos();
        }
    }, [categoriaId]);

    const fixImagePath = path => `http://localhost:3002/uploads/${path.replace(/\\/g, '/')}`;

    const handleMouseDown = useCallback(e => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        carouselRef.current.classList.add('cursor-grabbing');
    }, []);

    const handleMouseLeaveOrUp = useCallback(() => {
        isDragging.current = false;
        carouselRef.current.classList.remove('cursor-grabbing');
    }, []);

    const handleMouseMove = useCallback(e => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    const handleTouchStart = useCallback(e => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        carouselRef.current.classList.add('cursor-grabbing');
    }, []);

    const handleTouchMove = useCallback(e => {
        if (!isDragging.current) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
        carouselRef.current.classList.remove('cursor-grabbing');
    }, []);

    const handleScroll = useCallback(direction => {
        const scrollAmount = direction === 'left' ? -200 : 200;
        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, []);

    return (
        <section className="relative w-full pt-8 md:pt-10 mb-4">
            <div className='flex items-center justify-between px-3 sm:px-4 pb-4 sm:pb-6'>
                <button onClick={() => handleScroll('left')} className="bg-white/90 rounded-full p-2 text-gray-700 hover:text-gray-900 shadow">
                    <FaArrowLeft size={20} className="sm:hidden" />
                    <FaArrowLeft size={24} className="hidden sm:block" />
                </button>
                <p className='text-xl sm:text-2xl font-light text-center flex-1 mx-3'>{titulo}</p>
                <button onClick={() => handleScroll('right')} className="bg-white/90 rounded-full p-2 text-gray-700 hover:text-gray-900 shadow">
                    <FaArrowRight size={20} className="sm:hidden" />
                    <FaArrowRight size={24} className="hidden sm:block" />
                </button>
            </div>
            <div
                ref={carouselRef}
                className="flex overflow-x-auto whitespace-nowrap scroll-smooth w-full cursor-grab gap-4 px-3 sm:px-4"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {productos.map(producto => (
                    <Link
                        to={`/producto/${producto._id}`}
                        key={producto._id}
                        className="flex-shrink-0 flex flex-col px-3 sm:px-4 py-2 min-w-[75%] sm:min-w-[55%] md:min-w-[380px] lg:min-w-[300px] bg-white rounded shadow hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="w-full h-56 sm:h-64">
                            {producto.imagenes?.length ? (
                                <img src={fixImagePath(producto.imagenes[0])} alt={producto.nombre} className="object-cover w-full h-full rounded" />
                            ) : (
                                <p className="text-center">No image available</p>
                            )}
                        </div>
                        <div className="pt-3">
                            <h3 className="text-base sm:text-lg font-semibold truncate">{producto.nombre}</h3>
                            <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">{producto.descripcion}</p>
                            <p className="text-gray-700 pt-2">${producto.precio}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CarruselProductos;
