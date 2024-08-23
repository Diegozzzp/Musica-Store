import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { CartContext } from './carritoContexto';
import Component from './sideProductos';

// Componente de carrusel de imágenes
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para ir a la imagen anterior
  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Función para ir a la imagen siguiente
  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Botón de imagen anterior */}
      <FaArrowLeft
        className="absolute top-1/2 left-0 transform -translate-y-1/2 text-3xl text-gray-500 cursor-pointer"
        onClick={handlePrev}
      />
      {/* Imagen actual */}
      <img
        src={`http://localhost:3002/uploads/${images[currentIndex]}`}
        alt={`Imagen ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
      {/* Botón de imagen siguiente */}
      <FaArrowRight
        className="absolute top-1/2 right-0 transform -translate-y-1/2 text-3xl text-gray-500 cursor-pointer"
        onClick={handleNext}
      />
    </div>
  );
};

// Componente de página de detalle del producto
const ProductDetailPage = () => {
  const { id } = useParams(); // Obtiene el id del producto desde los parámetros de la ruta
  const [producto, setProducto] = useState(null); // Estado para el producto
  const [loading, setLoading] = useState(true); // Estado para el estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const [message, setMessage] = useState(''); // Mensaje para mostrar información al usuario
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad de producto
  const { addToCart } = useContext(CartContext); // Contexto para agregar al carrito

  // Efecto para cargar el producto desde la API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/productos/${id}`);
        if (response.data) {
          setProducto(response.data);
        } else {
          setError('No se encontró el producto');
        }
      } catch (error) {
        setError('Error al obtener el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  // Muestra un mensaje de carga o error mientras se obtienen los datos
  if (loading) return <p className="text-center py-4">Cargando...</p>;
  if (error) return <p className="text-center py-4">{error}</p>;
  if (!producto) return <p className="text-center py-4">Producto no encontrado</p>;

  // Función para aumentar la cantidad del producto
  const increaseQuantity = () => {
    if (quantity < producto.cantidad) {
      setQuantity(quantity + 1);
      setMessage('');
    } else {
      setMessage('No puedes agregar más de la cantidad disponible.');
    }
  };

  // Función para disminuir la cantidad del producto
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setMessage('');
    }
  };

  // Función para manejar el agregado al carrito
  const handleAddToCart = () => {
    if (quantity > producto.cantidad) {
      setMessage('No puedes agregar más de la cantidad disponible.');
      return;
    }
    addToCart(producto, quantity);
    setMessage('Producto añadido al carrito.');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-full items-start justify-around pb-6">
        {/* Sección de imagen del producto */}
        <div className="h-[30rem] pl-4">
          {producto.imagenes && producto.imagenes.length > 0 && (
            <Carousel images={producto.imagenes} />
          )}
        </div>

        {/* Sección de detalles del producto */}
        <div className="flex flex-col pl-4 pb-8 md:mt-20">
          <h1 className="text-3xl font-semibold mb-2">{producto.nombre}</h1>
          <p className="text-lg mb-4 w-2/3">{producto.descripcion}</p>
          {producto.precio && (
            <p className="text-lg font-semibold mb-4">Precio: ${producto.precio}</p>
          )}
          {producto.descuento && (
            <p className="text-sm font-light mb-4">Descuento: {producto.descuento}%</p>
          )}
          {producto.tipo === 'ropa' && producto.tallas && producto.tallas.length > 0 && (
            <div className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Tallas Disponibles:</h2>
              <div className="flex gap-8 items-center justify-center">
                {producto.tallas.map((talla, index) => (
                  <p key={index} className="text-md bg-gray-200 p-6 rounded-lg h-10 flex items-center">{talla}</p>
                ))}
              </div>
            </div>
          )}
          {/* Control de cantidad y botón de agregar al carrito */}
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
          {producto.cantidad === 0 && (
            <p className="text-lg font-semibold mt-4 text-red-500">No hay más stock disponible</p>
          )}
        </div>
      </div>
      {/* Componente de productos recomendados */}
      <Component categoriaId={'66aba85f829468324fa4ed52'} titulo={'Recomendados'} />
    </>
  );
};

export default ProductDetailPage;
