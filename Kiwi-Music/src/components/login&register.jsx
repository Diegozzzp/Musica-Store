import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import fondologin from '../images/fondologin.png';

const Auth = ({ isLogin }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/perfil');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    const newError = {};

    if (!form.correo || !form.password) {
      newError.correo = 'Correo y contraseña son obligatorios';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      newError.correo = 'Correo electrónico no válido';
    }

    if (form.password.length < 6) {
      newError.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!form.nombre || !form.apellido || !form.telefono) {
        newError.nombre = 'Todos los campos son obligatorios';
      }

      if (!/^[a-zA-Z]+$/.test(form.nombre)) {
        newError.nombre = 'El nombre solo debe contener letras';
      }
      if (!/^[a-zA-Z]+$/.test(form.apellido)) {
        newError.apellido = 'El apellido solo debe contener letras';
      }

      if (!/^\+?\d+$/.test(form.telefono)) {
        newError.telefono = 'El teléfono debe contener solo números y puede comenzar con el símbolo +';
      }
    }

    return newError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:3002/login', {
          correo: form.correo,
          password: form.password,
        });
        localStorage.setItem('token', response.data.token);
        navigate('/perfil');
      } else {
        await axios.post('http://localhost:3002/usuario', form);
        navigate('/login');
      }
    } catch (error) {
      setError({ general: 'Error en la autenticación' });
      console.error('Error en la autenticación:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div
        style={{ animation: 'slideInFromLeft 1s ease-out' }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gradient-to-r from-[#547980] to-[#45ADA8] shadow-2xl p-8 space-y-8"
      >
        <h2
          style={{ animation: 'appear 2s ease-out' }}
          className="text-center text-4xl font-extrabold text-white"
        >
          {isLogin ? 'Bienvenido de vuelta' : 'Crea una Cuenta'}
        </h2>
        <p
          style={{ animation: 'appear 3s ease-out' }}
          className="text-center text-gray-200"
        >
          {isLogin ? 'Inicia sesión con tu cuenta' : 'Regístrate con una cuenta nueva'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
          {!isLogin && (
            <>
              <InputField
                id="nombre"
                label="Nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                required
                error={error.nombre}
              />
              <InputField
                id="apellido"
                label="Apellido"
                type="text"
                value={form.apellido}
                onChange={handleChange}
                required
                error={error.apellido}
              />
              <InputField
                id="telefono"
                label="Teléfono"
                type="text"
                value={form.telefono}
                onChange={handleChange}
                required
                error={error.telefono}
              />
            </>
          )}
          <InputField
            id="correo"
            label="Correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            required
            error={error.correo}
          />
          <InputField
            id="password"
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            error={error.password}
          />
          <button
            className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
            type="submit"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
        <div className="text-center text-gray-300">
          {isLogin ? (
            <>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-purple-300 hover:underline">
                Crea una cuenta
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-purple-300 hover:underline">
                Inicia sesión
              </Link>
            </>
          )}
        </div>
        {error.general && <p className="text-red-500 text-center mt-4">{error.general}</p>}
      </div>
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative">
        <img src={fondologin} alt="Fondo Login" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <p className="text-white text-4xl font-bold">Kiwi Music</p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange, required, error }) => (
  <div className="relative">
    <input
      placeholder={label}
      className={`h-10 w-full border-b-2 ${error ? 'border-red-500' : 'border-gray-300'} text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500`}
      required={required}
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
    />
    <label
      className="absolute left-0 -top-5 text-gray-700 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-sm"
      htmlFor={id}
    >
      {label}
    </label>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default Auth;
