const Usuarios = require('../Modelos/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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
    try{
        const usuarios = await Usuarios.paginate({}, { page: req.query.page || 1, limit: 10 });
        res.json(usuarios);
    } 
    catch(error){
        res.status(500).json({ msg: 'Error al obtener los usuarios' });
    }
}

exports.obtenerUsuario = async (req, res) => {
    const usuario = new Usuarios(req.body);
    try{
        const {id , nombre, apellido, telefono, rol, eliminado} = req.query;
        const filtro = {};
        if(id){
            filtro._id = id;
        }
        if(nombre){
            filtro.nombre = { $regex: new RegExp(nombre, 'i') };
        }
        if(apellido){
            filtro.apellido = apellido;
        }
         if(telefono){
            filtro.telefonos = telefono;
        }
        if(rol){
            filtro.rol = rol;
        } 
        if(eliminado){
            filtro.Eliminado = eliminado;
        }
       
        const usuario = await Usuarios.find(filtro);
        res.json(usuario);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener el usuario' });
    }
}

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, telefono, correo, password, rol } = req.body;
        const avatar = req.file ? req.file.filename : null; // Usa `req.file.filename` para obtener solo el nombre del archivo

        if (!nombre || !apellido || !telefono || !correo || !password) {
            return res.status(400).json({ msg: 'Faltan campos requeridos' });
        }

        const nuevoUsuario = new Usuarios({
            nombre,
            apellido,
            telefono,
            avatar, // Guarda solo el nombre del archivo
            correo,
            password,
            rol
        });

        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(password, salt);

        await nuevoUsuario.save();

        res.json({ msg: 'Usuario creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear el usuario' });
    }
};

exports.editarUsuario = async (req, res) => {
    try {
        // Verificar que req.user y req.params.id están presentes
        if (!req.user || !req.params.id) {
            return res.status(400).json({ msg: 'Faltan datos necesarios para la actualización.' });
        }

        console.log('Request Body:', req.body);
        console.log('User from req.user:', req.user);

        const { id } = req.params;
        const { nombre, apellido, telefono, rol, password } = req.body;
        const avatar = req.file ? req.file.filename : req.body.avatar;

        // Verificar que el ID del usuario en la solicitud coincida con el ID en el token
        if (req.user.userId !== id) {
            return res.status(403).json({ msg: 'No tienes permiso para editar este usuario' });
        }

        // Buscar el usuario en la base de datos
        const usuario = await Usuarios.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Preparar los datos de actualización
        const updateData = { nombre, apellido, telefono, avatar, fechaActualizacion: Date.now() };

        // Si el rol es admin y se proporciona un nuevo rol, actualizarlo
        if (req.user.rol === 'admin' && rol) {
            updateData.rol = rol;
        }

        // Si se proporciona una nueva contraseña, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Actualizar el usuario en la base de datos
        const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, updateData, { new: true });
        if (!usuarioActualizado) {
            return res.status(500).json({ msg: 'Error al actualizar el usuario' });
        }

        // Devolver respuesta exitosa
        res.json({ msg: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
    } catch (error) {
        console.error('Error en editarUsuario:', error);
        res.status(500).json({ msg: 'Error al actualizar el usuario' });
    }
};



exports.eliminarUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const usuario = await Usuarios.findByIdAndUpdate(id, { Eliminado: true, fechaEliminacion: Date.now() }, { new: true });
        await usuario.save();
        res.json({ msg: 'Usuario eliminado correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al eliminar el usuario' });
    }
}

module.exports = exports