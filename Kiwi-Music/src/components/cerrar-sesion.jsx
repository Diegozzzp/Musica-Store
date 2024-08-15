import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white rounded-md w-36 mb-8">
            Cerrar Sesión
        </button>
    );
};

export default Logout;
