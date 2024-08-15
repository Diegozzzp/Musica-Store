import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { CartContext } from './carritoContexto';
import Component from './sideProductos'

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
  const [message, setMessage] = useState('');  
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

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

  const increaseQuantity = () => {
    if (quantity < product.cantidad) {
      setQuantity(quantity + 1);
      setMessage(''); 
    } else {
      setMessage('No puedes agregar más de la cantidad disponible.');
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setMessage(''); 
    }
  };

  const handleAddToCart = () => {
    if (quantity > product.cantidad) {
      setMessage('No puedes agregar más de la cantidad disponible.');
      return;
    }
    addToCart(product, quantity);
    setMessage('Producto añadido al carrito.');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-full items-start justify-around pb-6">
        <div className="h-[30rem] pl-4 ">
          {product.imagenes && product.imagenes.length > 0 && (
            <Carousel images={product.imagenes} />
          )}
        </div>
        <div className="flex flex-col pl-4 pb-8 md:mt-20 ">
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
              <input
                type="text"
                value={quantity}
                readOnly
                className="text-lg w-14 font-semibold text-center px-4 py-2 border-none border-gray-300"
              />
              <button 
                onClick={increaseQuantity} 
                className="text-lg font-semibold bg-gray-300 px-4 py-2 rounded-r-lg">
                +
              </button>
            </div>
            {message && (
              <p className={`text-lg font-semibold mt-2 ${message.includes('No') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </div>
          <button 
            onClick={handleAddToCart} 
            className="bg-[#9DE0AD] text-white w-32 h-10 py-2 px-4 rounded-lg mt-6">
            <p className="text-sm text-black font-light w-24 text-center">Añadir al carrito</p>
          </button>
        </div>
      </div>
      <Component categoriaId={'66aba85f829468324fa4ed52'} titulo={'Recomendados'} />
    </>
  );
};

export default ProductDetailPage;
