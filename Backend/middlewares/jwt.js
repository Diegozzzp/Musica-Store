const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = 'secretKey'; // Clave secreta para el token de acceso
const refreshSecretKey = 'refreshSecretKey'; 

function signToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Otros métodos...

function signRefreshToken(payload) {
    return jwt.sign(payload, refreshSecretKey, { expiresIn: '7d' });
}

function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Aquí debería incluir el `userId` y `rol`
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expirado. Por favor, inicia sesión nuevamente.' });
        }
        console.error('Error al verificar token:', error);
        return res.status(401).json({ msg: 'Token no válido.' });
    }
}



function verificarRefreshToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, refreshSecretKey);
        return decoded;
    } catch (error) {
        console.error('Error al verificar refresh token:', error); // Registro detallado
        return null;
    }
}


async function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ msg: 'No se proporcionó refresh token.' });
    }

    const decoded = verificarRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(401).json({ msg: 'Refresh token no válido o expirado.' });
    }

    const newAccessToken = signToken({ userId: decoded.userId });
    res.json({ accessToken: newAccessToken });
}

const verificarAdminOPropietario = (req, res, next) => {
    console.log('Verificando permisos para el usuario:', req.user);
    console.log('ID del usuario a editar:', req.params.id);
    
    if (req.user.rol === 'admin' || req.user.userId === req.params.id) {
        next();
    } else {
        return res.status(403).json({ msg: 'No tienes permiso para realizar esta acción' });
    }
};



module.exports = {
    signToken,
    signRefreshToken,
    verificarToken,
    verificarRefreshToken,
    refreshAccessToken,
    verificarAdminOPropietario
};