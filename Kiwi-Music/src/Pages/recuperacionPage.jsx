import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.patch('http://localhost:3002/restablecer-contrasena', { token, nuevaContrasena });
        setSuccess('Contraseña actualizada correctamente.');
    } catch (error) {
        setError(error.response.data.msg || 'Error al restablecer la contraseña.');
    }
  };    

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button
            type="submit"
            className="py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md text-white font-semibold"
          >
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
