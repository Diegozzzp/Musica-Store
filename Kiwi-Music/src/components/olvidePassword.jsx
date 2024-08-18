import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/solicitar', { email });
      setSuccess('Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.');
      setTimeout(() => navigate('/login'), 5000); // Redirige después de 5 segundos
    } catch (error) {
      setError('Error al solicitar el restablecimiento de la contraseña.');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Solicitar Restablecimiento
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
