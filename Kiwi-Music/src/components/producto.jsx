import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full">
      <FaArrowLeft
        className="absolute top-1/2 left-0 transform -translate-y-1/2 text-3xl text-gray-500 cursor-pointer"
        onClick={handlePrev}
      />
      <img
        src={`http://localhost:3002/uploads/${images[currentIndex]}`}
        alt={`Imagen ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
      <FaArrowRight
        className="absolute top-1/2 right-0 transform -translate-y-1/2 text-3xl text-gray-500 cursor-pointer"
        onClick={handleNext}
      />
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/productos/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError('No se encontró el producto');
        }
      } catch (error) {
        setError('Error al obtener el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-4">Cargando...</p>;
  if (error) return <p className="text-center py-4">{error}</p>;

  if (!product) {
    return <p className="text-center py-4">Producto no encontrado</p>;
  }

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-full items-start justify-around">
        <div className="h-[35rem] pl-4">
          {product.imagenes && product.imagenes.length > 0 && (
            <Carousel images={product.imagenes} />
          )}
        </div>
        <div className="flex flex-col pt-20">
          <h1 className="text-3xl font-semibold mb-2">{product.nombre}</h1>
          <p className="text-lg mb-4">{product.descripcion}</p>
          <p className="text-xl font-light mb-2">Precio: ${product.precio}</p>
          {product.tipo === 'ropa' && product.tallas && product.tallas.length > 0 && (
            <div className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Tallas Disponibles:</h2>
              <div className="flex gap-8 items-center justify-center ">
                {product.tallas.map((talla, index) => (
                  <p key={index} className="text-md bg-gray-200 p-6 rounded-lg h-10 flex items-center">{talla}</p>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col mt-4 mb-">
            <p className="text-lg font-semibold mb-4">Cantidad:</p>
            <div className='flex items-center'>
            <button 
              onClick={decreaseQuantity} 
              className="text-lg font-semibold bg-gray-300 px-4 py-2 rounded-l-lg">
              -
            </button>
            <span className="text-lg font-semibold px-4">{quantity}</span>
            <button 
              onClick={increaseQuantity} 
              className="text-lg font-semibold bg-gray-300 px-4 py-2 rounded-r-lg">
              +
            </button>
            </div>
          </div>
          <button className="bg-[#9DE0AD] text-white w-32 h-10 py-2 px-4 rounded-lg mt-6">
            <p className="text-sm text-black font-light w-24 text-center">Enviar al carrito</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
