const Usuarios = require('../Modelos/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const avatar = req.file ? req.file.path : null;

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

    res.json({ msg: 'Usuario creado correctamente' });
} catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el usuario' });
}
}
exports.editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, avatar, rol, password } = req.body;

        const usuario = await Usuarios.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const updateData = { nombre, apellido, telefono, avatar, rol, fechaActualizacion: Date.now() };

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
        console.error(error);
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