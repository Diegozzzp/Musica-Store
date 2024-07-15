const Usuarios = require('../Modelos/usuarios');
const bcrypt = require('bcrypt');

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
        //crear filtro de busqueda
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
    try{
        const { nombre, apellido, telefono, avatar, correo, password, rol } = req.body;
        const nuevoUsuario = new Usuarios({ nombre, apellido, telefono, avatar, correo, password, rol });
        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(password, salt);
        await nuevoUsuario.save();
        res.json({ msg: 'Usuario creado correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al crear el usuario' });
}
}

//controlador para editar los campos de usuario menos correo
exports.editarUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        const { nombre, apellido, telefono, avatar, rol, password } = req.body;
        const usuario = await Usuarios.findByIdAndUpdate(id, { nombre, apellido, telefono, avatar, rol, password, fechaActualizacion: Date.now() }, { new: true });
        await usuario.save();
        res.json({ msg: 'Usuario actualizado correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al actualizar el usuario' });
    }
}

//controlador para eliminar un usuario soft delete

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