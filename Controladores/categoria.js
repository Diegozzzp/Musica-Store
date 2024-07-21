const Categorias = require('../Modelos/categoria');

exports.obtenerCategorias = async (req, res) => {
    try{
        const categorias = await Categorias.paginate({}, { page: req.query.page || 1, limit: 10 });
        res.json(categorias);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener las categorias' });
    }
}

//controlador para buscar una categoria por su nombre o parecido
exports.buscarCategorias = async (req, res) => {
    try{
        const { nombre } = req.query;
        const categorias = await Categorias.find({ $or: [{ nombre: { $regex: new RegExp(nombre, 'i') } }] });
        res.json(categorias);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al buscar las categorias' });
    }
}

exports.crearCategorias = async (req, res) => {
    try{
        const { nombre } = req.body;
        const nuevoCategorias = new Categorias({ nombre });
        await nuevoCategorias.save();
        res.json({ msg: 'Categorias creadas correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al crear las categorias' });
    }
}

exports.editarCategorias = async (req, res) => {
    try{
        const { id } = req.params;
        const { nombre } = req.body;
        const categorias = await Categorias.findByIdAndUpdate(id, { nombre });
        await categorias.save();
        res.json({ msg: 'Categorias actualizadas correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al actualizar las categorias' });
    }
}

exports.eliminarCategorias = async (req, res) => {
    try{
        const { id } = req.params;
        const categorias = await Categorias.findByIdAndUpdate(id, { Eliminado: true });
        await categorias.save();
        res.json({ msg: 'Categorias eliminadas correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al eliminar las categorias' });
    }
}

module.exports = exports