const Usuarios = require('../Modelos/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../middlewares/nodemailer'); // Importa el transportador de correo
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');



exports.solicitarRestablecimiento = async (req, res) => {
    const { email } = req.body;
  
    try {
        const usuario = await Usuarios.findOne({ correo: email });
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
  
        // Genera un token de restablecimiento
        const token = crypto.randomBytes(20).toString('hex');
  
        // Establece el token y su fecha de expiración en el usuario
        usuario.resetToken = token;
        usuario.resetTokenExpira = Date.now() + 3600000; // 1 hora desde la creación
  
        await usuario.save();

        const resetURL = `http://localhost:5173/reset-password/${token}`;
  
        // Envía el correo con el enlace para restablecer la contraseña
        await transporter.sendMail({
            to: email,
            from: 'diegoadan.mejias@gmail.com',
            subject: 'Restablecimiento de Contraseña',
            html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
                   <a href="${resetURL}">Restablecer Contraseña</a>`
        });
  
        res.status(200).json({ msg: 'Enlace de restablecimiento de contraseña enviado al correo electrónico.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al enviar el enlace de restablecimiento' });
    }
};


// Controladores/usuarios.js
exports.restablecerContrasena = async (req, res) => {
    const { token, nuevaContrasena } = req.body;

    try {
        // Encuentra al usuario con el token válido y que no haya expirado
        const usuario = await Usuarios.findOne({
            resetToken: token,
            resetTokenExpira: { $gt: Date.now() }  // Verifica que el token no haya expirado
        });
        if (!usuario) {
            return res.status(400).json({ msg: 'Token inválido o expirado' });
        }

        // Encripta la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nuevaContrasena, salt);

        // Elimina el token y su fecha de expiración
        usuario.resetToken = undefined;
        usuario.resetTokenExpira = undefined;
        await usuario.save();

        res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al restablecer la contraseña' });
    }
};




exports.loginUsuarios = async (req, res) => {
    const { correo, password } = req.body;
    
    try {
        const usuario = await Usuarios.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const payload = { userId: usuario._id };
        const token = jwt.sign(payload, 'secretKey', { expiresIn: '1h' });

        res.json({ token, usuario: { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'secretKey');
        const usuario = await Usuarios.findById(decoded.userId);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el perfil del usuario' });
    }
};

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuarios.paginate({}, { page: req.query.page || 1, limit: 10 });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los usuarios' });
    }
};

exports.obtenerUsuario = async (req, res) => {
    const { id, nombre, apellido, telefono, rol, eliminado } = req.query;
    try {
        const filtro = {};
        if (id) filtro._id = id;
        if (nombre) filtro.nombre = { $regex: new RegExp(nombre, 'i') };
        if (apellido) filtro.apellido = apellido;
        if (telefono) filtro.telefono = telefono;
        if (rol) filtro.rol = rol;
        if (eliminado) filtro.eliminado = eliminado;
       
        const usuario = await Usuarios.find(filtro);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el usuario' });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, telefono, correo, password, rol } = req.body;
        const avatar = req.file ? req.file.filename : null;

        if (!nombre || !apellido || !telefono || !correo || !password) {
            return res.status(400).json({ msg: 'Faltan campos requeridos' });
        }

        const nuevoUsuario = new Usuarios({
            nombre,
            apellido,
            telefono,
            avatar,
            correo,
            password,
            rol
        });

        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(password, salt);

        await nuevoUsuario.save();

        const mailOptions = {
            to: correo,
            from: 'diegoadan.mejias@gmail.com',
            subject: 'Registro Exitoso',
            text: `Hola ${nombre},\n\nTe has registrado exitosamente en nuestra aplicación. ¡Bienvenido!`
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Usuario creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear el usuario' });
    }
};

exports.editarUsuario = async (req, res) => {
    try {
        if (!req.user || !req.params.id) {
            return res.status(400).json({ msg: 'Faltan datos necesarios para la actualización.' });
        }

        const { id } = req.params;
        const { nombre, apellido, telefono, rol, password } = req.body;
        const avatar = req.file ? req.file.filename : req.body.avatar;

        if (req.user.userId !== id) {
            return res.status(403).json({ msg: 'No tienes permiso para editar este usuario' });
        }

        const usuario = await Usuarios.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const updateData = { nombre, apellido, telefono, avatar, fechaActualizacion: Date.now() };

        if (req.user.rol === 'admin' && rol) {
            updateData.rol = rol;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, updateData, { new: true });
        if (!usuarioActualizado) {
            return res.status(500).json({ msg: 'Error al actualizar el usuario' });
        }

        res.json({ msg: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
    } catch (error) {
        console.error('Error en editarUsuario:', error);
        res.status(500).json({ msg: 'Error al actualizar el usuario' });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuarios.findByIdAndUpdate(id, { Eliminado: true, fechaEliminacion: Date.now() }, { new: true });
        await usuario.save();
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el usuario' });
    }
};

module.exports = exports;
