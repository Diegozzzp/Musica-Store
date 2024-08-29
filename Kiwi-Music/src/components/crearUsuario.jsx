import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const CrearUsuario = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    rol: '',
    avatar: null,
  });
  const [error, setError] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setForm((prevForm) => ({ ...prevForm, avatar: files[0] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const validateForm = () => {
    const newError = {};

    if (!form.nombre || !form.apellido || !form.telefono || !form.correo || !form.password || !form.rol) {
      newError.general = 'Todos los campos son obligatorios';
    }

    if (!/^[a-zA-Z]+$/.test(form.nombre)) {
      newError.nombre = 'El nombre solo debe contener letras';
    }

    if (!/^[a-zA-Z]+$/.test(form.apellido)) {
      newError.apellido = 'El apellido solo debe contener letras';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      newError.correo = 'Correo electrónico no válido';
    }

    if (!/^\d+$/.test(form.telefono)) {
      newError.telefono = 'El teléfono debe contener solo números';
    }

    if (form.password.length < 6) {
      newError.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('apellido', form.apellido);
    formData.append('telefono', form.telefono);
    formData.append('correo', form.correo);
    formData.append('password', form.password);
    formData.append('rol', form.rol);
    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Crear Usuario</h2>
        <form onSubmit={handleSubmit}>
          {error.general && <p className="text-red-500 text-sm mb-4">{error.general}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.nombre ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.nombre && <p className="text-red-500 text-sm mt-1">{error.nombre}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.apellido ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.apellido && <p className="text-red-500 text-sm mt-1">{error.apellido}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.telefono ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.telefono && <p className="text-red-500 text-sm mt-1">{error.telefono}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.correo ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.correo && <p className="text-red-500 text-sm mt-1">{error.correo}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange} className={`w-full p-3 border rounded ${error.rol ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Seleccionar</option>
              <option value="admin">Administrador</option>
              <option value="usuario">Usuario</option>
            </select>
            {error.rol && <p className="text-red-500 text-sm mt-1">{error.rol}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="w-full border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
