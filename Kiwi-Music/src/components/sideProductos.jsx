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
        <section className="relative w-full pt-20 md:pt-30 lg:pt-36 mb-4 h-[630px]">
            <div className='flex items-center justify-around pb-8'>
                <button onClick={() => handleScroll('left')} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
                    <FaArrowLeft size={24} />
                </button>
                <p className='text-2xl font-light text-center'>{titulo}</p>
                <button onClick={() => handleScroll('right')} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
                    <FaArrowRight size={24} />
                </button>
            </div>
            <div
                ref={carouselRef}
                className="flex overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide w-full cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {productos.map(producto => (
                    <Link to={`/producto/${producto._id}`} key={producto._id} className="flex flex-col h-full px-12 pr-8 min-w-[500px] sm:min-w-[500px] md:px-2 md:min-w-[400px] lg:min-w-[400px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-full h-72">
                            {producto.imagenes?.length ? (
                                <img src={fixImagePath(producto.imagenes[0])} alt={producto.nombre} className="w-full h-full object-cover lazyload" />
                            ) : (
                                <p className="text-center">No image available</p>
                            )}
                        </div>
                        <div className="pt-4 h-full">
                            <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                            <p className="text-gray-500 text-sm w-64 h-8 overflow-hidden">{producto.descripcion}</p>
                            <p className="text-gray-600 pt-4">${producto.precio}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CarruselProductos;
