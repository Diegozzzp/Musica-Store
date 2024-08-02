const Rol = require('../Modelos/rol');

exports.obtenerRol = async (req, res) => {
    const rol = new Rol(req.body);
    try {
        const { id, nombre, fecha, fechaActualizacion, fechaEliminacion, Eliminado } = req.query;
        const filtro = {};
        if (id) {
            filtro._id = id;
        }   
        if (nombre) {
            filtro.nombre = { $regex: new RegExp(nombre, 'i') };
        }
        if (fecha) {
            filtro.fecha = fecha;
        }
        if (fechaActualizacion) {
            filtro.fechaActualizacion = fechaActualizacion;
        }
        if (fechaEliminacion) {
            filtro.fechaEliminacion = fechaEliminacion;
        }
        if (Eliminado) {
            filtro.Eliminado = Eliminado;
        }
        const rol = await Rol.find(filtro);
        res.json(rol);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el rol' });
    }
}


exports.crearRol = async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevoRol = new Rol({ nombre });
        await nuevoRol.save();
        res.json({ msg: 'Rol creado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el rol' });
    }
}


exports.editarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const rol = await Rol.findByIdAndUpdate(id, { nombre });
        await rol.save();
        res.json({ msg: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el rol' });
    }
}


exports.eliminarRol = async (req, res) => {
    try {   
        const { id } = req.params;
        const rol = await Rol.findByIdAndUpdate(id, { Eliminado: true });
        await rol.save();
        res.json({ msg: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el rol' });
    }
}

module.exports = exports


