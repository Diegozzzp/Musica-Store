import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import fondologin from '../images/fondologin.png';

const Auth = ({ isLogin }) => {
  // Estado para almacenar los datos del formulario y los errores
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    avatar: null,
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // Efecto para redirigir al usuario autenticado a la página de perfil
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/perfil');
    }
  }, [navigate]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === 'avatar' ? files[0] : value,
    }));
  };

  // Valida el formulario y devuelve un objeto de errores
  const validateForm = () => {
    const newError = {};

    if (!form.correo || !form.password) {
      newError.correo = 'Correo y contraseña son obligatorios';
    }

    // Validación de correo electrónico
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      newError.correo = 'Correo electrónico no válido';
    }

    // Validación de contraseña
    if (form.password.length < 8) {
      newError.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validaciones adicionales para el registro
    if (!isLogin) {
      if (!form.nombre || !form.apellido || !form.telefono) {
        newError.nombre = 'Todos los campos son obligatorios';
      }

      // Validación del nombre y apellido
      if (!/^[a-zA-Z]+$/.test(form.nombre)) {
        newError.nombre = 'El nombre solo debe contener letras';
      }
      if (!/^[a-zA-Z]+$/.test(form.apellido)) {
        newError.apellido = 'El apellido solo debe contener letras';
      }

      // Validación del teléfono
      if (!/^\+?\d+$/.test(form.telefono)) {
        newError.telefono = 'El teléfono debe contener solo números y puede comenzar con el símbolo +';
      }
    }

    return newError;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      if (isLogin) {
        // Enviar datos de inicio de sesión
        const response = await axios.post('http://localhost:3002/login', {
          correo: form.correo,
          password: form.password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/perfil');
      } else {
        // Preparar datos para el registro
        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));

        // Enviar datos de registro
        await axios.post('http://localhost:3002/usuario', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        navigate('/login');
      }
    } catch (error) {
      setError({ general: 'Error en la autenticación' });
      console.error('Error en la autenticación:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sección de fondo para pantallas grandes */}
      <div className="hidden md:flex md:w-2/3 bg-cover bg-center relative">
        <img src={fondologin} alt="Fondo Login" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-40 z-20">
          <p className="text-white text-4xl font-bold">Kiwi Music</p>
          <p className="text-white text-lg">Cada nota, un kiwi</p>
        </div>
      </div>
      {/* Sección de formulario de inicio de sesión/registro */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 space-y-6">
        <h2 className="text-center text-4xl font-semibold pt-10 text-[#9DE0AD]">
          {isLogin ? 'Bienvenido de vuelta' : 'Crea una cuenta'}
        </h2>
        <p className="text-center text-black">
          {isLogin ? 'Inicia sesión con tu cuenta' : 'Regístrate con una cuenta nueva'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
          {/* Campos adicionales para registro */}
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
              <InputField
                id="avatar"
                label="Avatar"
                type="file"
                onChange={handleChange}
                accept="image/*"
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
            className="w-full py-2 px-4 bg-green-300 text-[#547980] rounded-md shadow-lg font-semibold"
            type="submit"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
        <div className="text-center text-black">
          {isLogin ? (
            <>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-purple-300 hover:underline">
                Crea una cuenta
              </Link>
              <br />
              <Link to="/olvide-password" className="text-blue-300 hover:underline">
                Olvidé mi contraseña
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Inicia sesión
              </Link>
            </>
          )}
        </div>
        {error.general && <p className="text-red-500 text-center">{error.general}</p>}
      </div>
    </div>
  );
};

// Componente reutilizable para campos de entrada
const InputField = ({ id, label, type = "text", value, onChange, required, error, accept }) => (
  <div className="relative">
    <input
      placeholder={label}
      className={`h-10 w-full border-b-2 ${error ? 'border-red-500' : 'border-black-300'} text-black bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500`}
      required={required}
      id={id}
      name={id}
      type={type}
      value={type === 'file' ? undefined : value}
      onChange={onChange}
      accept={accept}
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
