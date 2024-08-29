import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import '../index.css';

// URL de la API para obtener productos aleatorios
const URL_PRODUCTOS = 'http://localhost:3002/productos/random';

const RandomsIntereses = ({ titulo }) => {
    const [productos, setProductos] = useState([]); // Estado para almacenar los productos
    const carouselRef = useRef(null); // Referencia al contenedor del carrusel
    const isDragging = useRef(false); // Indica si el usuario está arrastrando el carrusel
    const startX = useRef(0); // Posición inicial del mouse/tacto
    const scrollLeft = useRef(0); // Posición actual del scroll

    // Función para obtener productos aleatorios al cargar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Llamada a la API para obtener productos aleatorios
                const { data } = await axios.get(URL_PRODUCTOS);
                
                // Mezclar los productos aleatoriamente y mostrar los primeros 10
                const shuffled = data.sort(() => 0.5 - Math.random());
                setProductos(shuffled.slice(0, 10)); // Muestra 10 productos aleatorios
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchProductos();
    }, []);

    // Función para arreglar la ruta de la imagen
    const fixImagePath = path => `http://localhost:3002/uploads/${path.replace(/\\/g, '/')}`;

    // Manejar el inicio del arrastre con el mouse
    const handleMouseDown = useCallback(e => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        carouselRef.current.classList.add('cursor-grabbing');
    }, []);

    // Manejar el fin del arrastre con el mouse
    const handleMouseLeaveOrUp = useCallback(() => {
        isDragging.current = false;
        carouselRef.current.classList.remove('cursor-grabbing');
    }, []);

    // Manejar el movimiento del mouse mientras se arrastra
    const handleMouseMove = useCallback(e => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // Velocidad de desplazamiento
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    // Manejar el inicio del arrastre con el tacto
    const handleTouchStart = useCallback(e => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        carouselRef.current.classList.add('cursor-grabbing');
    }, []);

    // Manejar el movimiento del tacto mientras se arrastra
    const handleTouchMove = useCallback(e => {
        if (!isDragging.current) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    // Manejar el fin del arrastre con el tacto
    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
        carouselRef.current.classList.remove('cursor-grabbing');
    }, []);

    // Función para desplazar el carrusel a la izquierda o derecha
    const handleScroll = useCallback(direction => {
        const scrollAmount = direction === 'left' ? -200 : 200;
        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, []);

    return (
        <section className="relative w-full pt-10 mb-4">
            <div className='flex items-center justify-between pb-8'>
                {/* Botón para desplazar a la izquierda */}
                <button onClick={() => handleScroll('left')} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
                    <FaArrowLeft size={24} />
                </button>
                {/* Título del carrusel */}
                <p className='text-2xl font-light text-center'>{titulo}</p>
                {/* Botón para desplazar a la derecha */}
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
                    <Link to={`/producto/${producto._id}`} key={producto._id} className="flex flex-col px-4 min-w-[300px] hover:shadow-xl transition-shadow duration-300">
                        <div className="w-full h-72 overflow-hidden">
                            {producto.imagenes?.length ? (
                                <img src={fixImagePath(producto.imagenes[0])} alt={producto.nombre} className="object-cover w-full h-full" />
                            ) : (
                                <p className="text-center">No hay imagen disponible</p>
                            )}
                        </div>
                        <div className="pt-4">
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

export default RandomsIntereses;
