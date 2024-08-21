import React, { useState, useEffect } from 'react';

const EditarProducto = ({ isOpen, onClose, productData, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        cantidad: '',
        imagen: null
    });

    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productData) {
            setFormData({
                nombre: productData.nombre || '',
                precio: productData.precio || '',
                descripcion: productData.descripcion || '',
                cantidad: productData.cantidad || '',
                imagen: null
            });
        }
    }, [productData]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!formData.precio || isNaN(formData.precio) || formData.precio <= 0) newErrors.precio = 'El precio debe ser un número positivo';
        if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        if (e.target.name === 'imagen') {
            setFile(e.target.files[0]);
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('precio', formData.precio);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('cantidad', formData.cantidad);
        if (file) {
            formDataToSend.append('imagen', file);
        }

        onSave(productData._id, formDataToSend);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md overflow-y-auto">
                <h2 className="text-2xl mb-4">Editar Producto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.nombre ? 'border-red-500' : ''}`}
                        />
                        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Precio</label>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.precio ? 'border-red-500' : ''}`}
                        />
                        {errors.precio && <p className="text-red-500 text-sm">{errors.precio}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.descripcion ? 'border-red-500' : ''}`}
                        />
                        {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Cantidad</label>
                        <textarea
                            name="descripcion"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.cantidad ? 'border-red-500' : ''}`}
                        />
                        {errors.cantidad && <p className="text-red-500 text-sm">{errors.cantidad}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Imagen</label>
                        <input
                            type="file"
                            name="imagen"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-500 text-white py-2 px-4 rounded"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarProducto;
