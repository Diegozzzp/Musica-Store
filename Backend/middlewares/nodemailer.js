// emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'diegoadan.mejias@gmail.com',
        pass: 'csnz tddo ntfp twej' // Reemplaza esto con la contraseña de tu cuenta o un token de aplicación si usas autenticación en dos pasos
    }
});

module.exports = transporter;
