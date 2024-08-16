import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from '../components/usuarioPerfil';
import { useNavigate } from 'react-router-dom';

const PerfilPage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); 
                return;
            }

            const response = await axios.get('http://localhost:3002/perfil', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                await handleTokenRefresh();
            } else {
                setError('Error al obtener los datos del usuario');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTokenRefresh = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No se proporcionó refresh token.');

            const response = await axios.post('http://localhost:3002/refresh-token', {
                refreshToken
            });

            localStorage.setItem('token', response.data.accessToken);
            fetchUserData();
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            navigate('/login'); 
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No se encontraron datos del usuario</div>;

    return (
        <div>
            <UserProfile
                id={userData._id} // Asegúrate de pasar el ID aquí
                nombre={userData.nombre}
                apellido={userData.apellido}
                correo={userData.correo}
                telefono={userData.telefono}
                avatar={userData.avatar}
            />
        </div>
    );
};

export default PerfilPage;
