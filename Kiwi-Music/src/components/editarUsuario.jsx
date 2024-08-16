import React, { useState, useEffect } from 'react';

const EditarUsuario = ({ isOpen, onClose, userData, onSave, userId }) => {
    const [formData, setFormData] = useState({ 
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      telefono: userData.telefono || '',
      avatar: userData.avatar || '',
    });

    const [file, setFile] = useState(null);

    useEffect(() => {
      setFormData({ 
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        avatar: userData.avatar || '',
      });
    }, [userData]);

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
          formDataToSend.append('avatar', formData.avatar);
        }
      
        // Verifica el contenido de formDataToSend en la consola
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }
      
        onSave(userId, formDataToSend);
        onClose(); // Cerrar el modal después de guardar
      };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-1/3">
          <h2 className="text-2xl mb-4">Editar Usuario</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Avatar</label>
              <input
                id='avatar'
                type="file"
                name="avatar"
                onChange={handleChange}
                accept='image/*'
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

export default EditarUsuario;
