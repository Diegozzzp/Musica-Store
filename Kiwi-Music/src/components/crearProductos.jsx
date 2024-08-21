import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const CrearProducto = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: '',
    descripcion: '',
    descuento: '',
    tipo: 'otros',
    tallas: '',
    imagenes: []
  });
  const [error, setError] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagenes') {
      setSelectedFiles([...files]);
      setForm((prevForm) => ({ ...prevForm, imagenes: [...files] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const validateForm = () => {
    const newError = {};

    if (!form.nombre || !form.precio || !form.cantidad || !form.categoria || !form.descripcion || !form.descuento) {
      newError.general = 'Todos los campos son obligatorios';
    }

    if (isNaN(form.precio) || form.precio <= 0) {
      newError.precio = 'El precio debe ser un número positivo';
    }

    if (isNaN(form.cantidad) || form.cantidad <= 0) {
      newError.cantidad = 'La cantidad debe ser un número positivo';
    }

    if (form.tipo === 'ropa' && !form.tallas) {
      newError.tallas = 'Las tallas son obligatorias para productos de tipo ropa';
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

    const data = new FormData();
    data.append('nombre', form.nombre);
    data.append('precio', form.precio);
    data.append('cantidad', form.cantidad);
    data.append('categoria', form.categoria);
    data.append('descripcion', form.descripcion);
    data.append('descuento', form.descuento);
    data.append('tipo', form.tipo);
    if (form.tipo === 'ropa') {
      data.append('tallas', form.tallas);
    }
    selectedFiles.forEach(file => {
      data.append('imagenes', file);
    });

    onSave(data);
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
        <h2 className="text-2xl font-bold mb-6">Crear Producto</h2>
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
            <label className="block text-gray-700 font-semibold mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.precio ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.precio && <p className="text-red-500 text-sm mt-1">{error.precio}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.cantidad ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.cantidad && <p className="text-red-500 text-sm mt-1">{error.cantidad}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.categoria ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.categoria && <p className="text-red-500 text-sm mt-1">{error.categoria}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.descripcion ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.descripcion && <p className="text-red-500 text-sm mt-1">{error.descripcion}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Descuento</label>
            <input
              type="number"
              name="descuento"
              value={form.descuento}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.descuento ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error.descuento && <p className="text-red-500 text-sm mt-1">{error.descuento}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${error.tipo ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="otros">Otros</option>
              <option value="ropa">Ropa</option>
            </select>
            {error.tipo && <p className="text-red-500 text-sm mt-1">{error.tipo}</p>}
          </div>

          {form.tipo === 'ropa' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Tallas</label>
              <input
                type="text"
                name="tallas"
                value={form.tallas}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className={`w-full p-3 border rounded ${error.tallas ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.tallas && <p className="text-red-500 text-sm mt-1">{error.tallas}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Imágenes</label>
            <input
              type="file"
              name="imagenes"
              multiple
              onChange={handleChange}
              className="w-full border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearProducto;
