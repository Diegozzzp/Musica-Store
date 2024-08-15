const jwt = require('jsonwebtoken');

const secretKey = 'secretKey'; // Clave secreta para el token de acceso
const refreshSecretKey = 'refreshSecretKey'; 

function signToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
}

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
        console.log('Token decodificado:', decoded); // Depura aquí
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expirado. Por favor, inicia sesión nuevamente.' });
        }
        return res.status(401).json({ msg: 'Token no válido.' });
    }
}


function verificarRefreshToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, refreshSecretKey);
        return decoded; 
    } catch (error) {
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

module.exports = {
    signToken,
    signRefreshToken,
    verificarToken,
    verificarRefreshToken,
    refreshAccessToken
};
