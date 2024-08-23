import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const CartContext = createContext();


export const CartProvider = ({ children }) => {
  //usa el context para el carrito de compras es decir el carrito de compras del usuario guardandolo en el local storage
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item._id === product._id);

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        const existingProduct = updatedCart[existingProductIndex];
        
        const newQuantity = existingProduct.cantidad + quantity;
        if (newQuantity > product.cantidad) {
          return prevCart;
        }

        updatedCart[existingProductIndex] = { ...existingProduct, cantidad: newQuantity };
        return updatedCart;
      } else {
        return [...prevCart, { ...product, cantidad: quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Función para realizar la compra, almacenando el token en el local storage y redireccionando a la página de gracias
  const checkout = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
      const response = await axios.post('http://localhost:3002/comprar', {
        productos: cart,
        total,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        clearCart(); 
        navigate('/gracias'); 
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error.response?.data || error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

