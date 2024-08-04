import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const URL_productos = 'http://localhost:3002/productos';

const Productos = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await axios.get(URL_productos);
                console.log(response.data); // Para verificar la estructura de la respuesta
                if (response.data && Array.isArray(response.data.docs)) {
                    setData(response.data.docs);
                } else {
                    console.error("Unexpected response data format");
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        obtenerProductos();
    }, []);

    const scrollLeft = () => {
        document.getElementById('product-carousel').scrollBy({
            left: -200,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        document.getElementById('product-carousel').scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    };

    const fixImagePath = (path) => {
        return `http://localhost:3002/${path.replace(/\\/g, '/')}`;
    };

    return (
        <>
            <section className="relative w-full pt-24 md:pt-36 lg:pt-48 mb-20">
                <p className='text-2xl font-semibold text-center pb-8'>Lo Más Reciente</p>
                <div className='flex items-center justify-around pb-8'>
                    <button onClick={scrollLeft} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <p className='text-2xl font-light text-center'>Albums</p>
                    <button onClick={scrollRight} className="bg-white rounded-full p-2 text-gray-600 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
                <div id="product-carousel" className="flex overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
                    {data.map((producto) => (
                        <div
                            key={producto._id}
                            className="flex flex-col items-center h-96 px-12 pr-8 min-w-[500px] sm:min-w-[400px] md:px-2 md:min-w-[400px] lg:min-w-[500px]"
                        >
                            <div className="w-full h-72">
                                {producto.imagenes && producto.imagenes.length > 0 ? (
                                    <img src={fixImagePath(producto.imagenes[0])} alt={producto.nombre} className="w-96 h-full object-cover rounded-lg" />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>
                            <div className="mt-2">
                                <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                                <p className="text-gray-600">{producto.descripcion}</p>
                                <p className="text-gray-600">${producto.precio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Productos;
