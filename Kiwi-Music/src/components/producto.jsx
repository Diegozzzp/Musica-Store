import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { CartContext } from './carritoContexto';
import RandomsIntereses from './interesesRandom';
import { getImageUrl } from '../utils/imageUrl';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded bg-[#f2efe8] shadow-xl">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`Imagen ${currentIndex + 1}`}
          className="h-full w-full object-contain p-4"
        />
        {images.length > 1 && (
          <>
            <button className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-[#17252a] shadow hover:bg-white" onClick={handlePrev} aria-label="Imagen anterior">
              <FaArrowLeft />
            </button>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-[#17252a] shadow hover:bg-white" onClick={handleNext} aria-label="Imagen siguiente">
              <FaArrowRight />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square overflow-hidden rounded border-2 bg-gray-100 ${index === currentIndex ? 'border-[#547980]' : 'border-transparent'}`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img src={getImageUrl(image)} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`https://musica-store.vercel.app/productos/${id}`);
        setProducto(response.data || null);
      } catch (error) {
        setError('Error al obtener el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return <div className="kiwi-section py-20 text-center text-gray-600">Cargando producto...</div>;
  }

  if (error || !producto) {
    return <div className="kiwi-section py-20 text-center text-gray-600">{error || 'Producto no encontrado'}</div>;
  }

  const stock = Number(producto.cantidad || 0);
  const soldOut = stock === 0;
  const isPreorder = Boolean(producto.esProximamente);

  const increaseQuantity = () => {
    if (isPreorder) {
      setQuantity(quantity + 1);
      setMessage('');
      return;
    }

    if (quantity < stock) {
      setQuantity(quantity + 1);
      setMessage('');
    } else {
      setMessage('No puedes agregar mas de la cantidad disponible.');
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setMessage('');
    }
  };

  const handleAddToCart = () => {
    if (soldOut && !isPreorder) {
      setMessage('Producto sin stock disponible.');
      return;
    }

    addToCart(producto, quantity);
    setMessage('Producto agregado al carrito.');
  };

  return (
    <>
      <section className="kiwi-section py-8 md:py-12">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 rounded bg-white px-4 py-3 text-sm font-semibold text-[#17252a] shadow hover:bg-gray-50">
          <FaArrowLeft /> Volver
        </button>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(20rem,27rem)]">
        <div>
          {producto.imagenes && producto.imagenes.length > 0 ? (
            <Carousel images={producto.imagenes} />
          ) : (
            <div className="aspect-[4/3] rounded bg-[#f2efe8]" />
          )}
        </div>

        <aside className="kiwi-card rounded p-6 md:sticky md:top-28 md:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#547980]">{producto.tipo || 'Producto'}</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-[#17252a] md:text-4xl">{producto.nombre}</h1>
          <p className="mt-5 text-base leading-7 text-gray-600">{producto.descripcion}</p>
          {isPreorder && (
            <div className="mt-5 rounded bg-[#17252a] p-4 text-white">
              <p className="text-sm font-black">Disponible para preorden</p>
              {producto.fechaLlegada && (
                <p className="mt-1 text-sm text-white/80">Llegada estimada: {new Date(producto.fechaLlegada).toLocaleDateString()}</p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-end justify-between border-y border-gray-200 py-5">
            <div>
              <p className="text-sm text-gray-500">Precio</p>
              <p className="text-3xl font-black text-[#17252a]">${producto.precio}</p>
            </div>
            {producto.descuento > 0 && (
              <span className="rounded bg-[#9DE0AD] px-3 py-2 text-sm font-black text-[#17252a]">
                -{producto.descuento}%
              </span>
            )}
          </div>

          {producto.tipo === 'ropa' && producto.tallas && producto.tallas.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-gray-700">Tallas disponibles</p>
              <div className="flex flex-wrap gap-2">
                {producto.tallas.map((talla) => (
                  <span key={talla} className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#17252a]">
                    {talla}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Cantidad</p>
              <p className={`text-sm font-semibold ${soldOut ? 'text-red-500' : 'text-gray-500'}`}>
                {isPreorder ? 'Preorden' : soldOut ? 'Sin stock' : `${stock} disponibles`}
              </p>
            </div>
            <div className="flex w-36 overflow-hidden rounded border border-gray-200 bg-white">
              <button onClick={decreaseQuantity} className="w-12 py-3 text-lg font-black hover:bg-gray-50" disabled={quantity <= 1}>-</button>
              <input value={quantity} readOnly className="w-12 border-x border-gray-200 bg-white text-center font-bold outline-none" />
              <button onClick={increaseQuantity} className="w-12 py-3 text-lg font-black hover:bg-gray-50" disabled={soldOut && !isPreorder}>+</button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={soldOut && !isPreorder}
            className={`mt-7 w-full rounded py-4 text-sm font-black ${soldOut && !isPreorder ? 'bg-gray-200 text-gray-400' : 'kiwi-button'}`}
          >
            {isPreorder ? 'Preordenar' : soldOut ? 'No disponible' : 'Agregar al carrito'}
          </button>

          {message && (
            <p className={`mt-4 text-sm font-semibold ${message.includes('agregado') ? 'text-[#547980]' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </aside>
        </div>
      </section>

      <RandomsIntereses titulo="Productos recomendados" />
    </>
  );
};

export default ProductDetailPage;
