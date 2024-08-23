const Categorias = require('../Modelos/categoria');

// Obtener todas las categorias 
exports.obtenerCategorias = async (req, res) => {
    try{
        const categorias = await Categorias.paginate({}, { page: req.query.page || 1, limit: 10 });
        res.json(categorias);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener las categorias' });
    }
}

// Buscar categorias por nombre 
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

// Crear categorias 
exports.crearCategorias = async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevaCategoria = new Categorias({ nombre });
        await nuevaCategoria.save();
        res.json({ msg: 'Categoría creada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la categoría' });
    }
};

// se puede eliminar o actualizar categorias en las siguientes controlladores
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