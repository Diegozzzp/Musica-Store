import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EditarUsuario = ({ isOpen, onClose, userData, onSave, userId, isAdmin }) => {
    const [formData, setFormData] = useState({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        avatar: userData.avatar || '',
        rol: userData.rol || '' // Añadido para permitir la edición del rol
    });

    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({}); // Para guardar los errores de validación

    useEffect(() => {
        if (userData) {
            setFormData({
                nombre: userData.nombre || '',
                apellido: userData.apellido || '',
                telefono: userData.telefono || '',
                avatar: userData.avatar || '',
                rol: userData.rol || '' // Asegurarse de que el rol se actualice
            });
        }
    }, [userData]);

    const validateForm = () => {
        const newErrors = {};

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        else if (!nameRegex.test(formData.nombre)) newErrors.nombre = 'El nombre no debe contener caracteres especiales';

        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
        else if (!nameRegex.test(formData.apellido)) newErrors.apellido = 'El apellido no debe contener caracteres especiales';

        const phoneRegex = /^\+\d+$/;
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
        else if (!phoneRegex.test(formData.telefono)) newErrors.telefono = 'El teléfono debe comenzar con + seguido de números';

        if (isAdmin && !formData.rol.trim()) newErrors.rol = 'El rol es obligatorio';

        // Puedes agregar más validaciones aquí, por ejemplo, formato del teléfono
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        if (e.target.name === 'avatar') {
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
        if (!validateForm()) return; // Solo guarda si el formulario es válido

        if (!userId) {
            console.error("User ID is missing in handleSubmit");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('apellido', formData.apellido);
        formDataToSend.append('telefono', formData.telefono);
        if (file) {
            formDataToSend.append('avatar', file);
        } else {
            formDataToSend.append('avatar', formData.avatar || ''); 
        }
        if (isAdmin) {
            formDataToSend.append('rol', formData.rol);
        }

        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        onSave(userId, formDataToSend);
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10 pt-10">
            <div className="bg-white p-8 rounded-lg w-full max-w-md overflow-y-auto">
                <h2 className="text-2xl mb-4">Editar Usuario</h2>
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
                        <label className="block text-gray-700">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.apellido ? 'border-red-500' : ''}`}
                        />
                        {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.telefono ? 'border-red-500' : ''}`}
                        />
                        {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
                    </div>
                    {isAdmin && (
                        <div className="mb-4">
                            <label className="block text-gray-700">Rol</label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.rol ? 'border-red-500' : ''}`}
                            >
                                <option value="">Seleccionar</option>
                                <option value="admin">Administrador</option>
                                <option value="user">Usuario</option>
                            </select>
                            {errors.rol && <p className="text-red-500 text-sm">{errors.rol}</p>}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700">Avatar</label>
                        <input
                            id='avatar'
                            type="file"
                            name="avatar"
                            onChange={handleChange}
                            accept='image/*'
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="flex items-center justify-center pb-8">
                        <Link to="/olvide-password">
                            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                                Solicitar cambio de contraseña
                            </button>
                        </Link>
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
                            <p>Guardar</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarUsuario;
