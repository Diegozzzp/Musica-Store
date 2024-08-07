import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import '../index.css';

const URL_productos = 'http://localhost:3002/productos/categoria/';

const CarruselProductos = ({ categoriaId, titulo }) => {
    const [data, setData] = useState([]);
    const carouselRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await axios.get(`${URL_productos}${categoriaId}`);
                if (response.data && Array.isArray(response.data.docs)) {
                    setData(response.data.docs);
                } else {
                    console.error("Unexpected response data format");
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        if (categoriaId) {
            obtenerProductos();
        }
    }, [categoriaId]);

    const fixImagePath = (path) => {
        return `http://localhost:3002/uploads/${path.replace(/\\/g, '/')}`;
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        carouselRef.current.classList.add('cursor-grabbing');
    };

    const handleMouseLeaveOrUp = () => {
        isDragging.current = false;
        carouselRef.current.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        carouselRef.current.classList.add('cursor-grabbing');
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; 
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        carouselRef.current.classList.remove('cursor-grabbing');
    };

    const scrollLeftCarousel = () => {
        carouselRef.current.scrollBy({
            left: -200,
            behavior: 'smooth'
        });
    };

    const scrollRightCarousel = () => {
        carouselRef.current.scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <section className="relative w-full pt-20 md:pt-30 lg:pt-36 mb-4 h-[630px]">
                <div className='flex items-center justify-around pb-8 '>
                    <button onClick={scrollLeftCarousel} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
                        <FaArrowLeft size={24} />
                    </button>
                    <p className='text-2xl font-light text-center'>{titulo}</p>
                    <button onClick={scrollRightCarousel} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
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
                    {data.map((producto) => (
                        <div
                            key={producto._id}
                            className="flex flex-col h-full px-12 pr-8 min-w-[500px] sm:min-w-[500px] md:px-2 md:min-w-[400px] lg:min-w-[400px] px-8 h-full hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="w-full h-72">
                                {producto.imagenes && producto.imagenes.length > 0 ? (
                                    <img src={fixImagePath(producto.imagenes[0])} alt={producto.nombre} className="w-full h-full object-cover" />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>
                            <div className="pt-4 h-full">
                                <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                                <p className="text-gray-500 text-sm text-pretty w-64 h-8">{producto.descripcion}</p>
                                <p className="text-gray-600 pt-4">${producto.precio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default CarruselProductos;
