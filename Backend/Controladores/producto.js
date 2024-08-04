const Productos = require('../Modelos/producto');
const { validationResult } = require('express-validator');

exports.obtenerProductos = async (req, res) => {
    try{
        const productos = await Productos.paginate({}, { page: req.query.page || 1, limit: 10 });
        res.json(productos);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener los productos' });
    }
}

exports.ObtenerProductoCampo = async (req, res) => {
    try{
        const {id , nombre, categoria, descripcion} = req.query;
        const filtro = {};
        if(id){
            filtro._id = id;
        }
        if(nombre){
            filtro.nombre = { $regex: new RegExp(nombre, 'i') };
        }
        if(categoria){
            filtro.categoria = categoria;
        }
        if(descripcion){
            filtro.descripcion = { $regex: new RegExp(descripcion, 'i') };
        }
        const producto = await Productos.find(filtro);
        res.json(producto);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener el producto' });
    }
}

exports.crearProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: 'La imagen es obligatoria' });
        }
        const { nombre, precio, cantidad, categoria, descripcion, descuento } = req.body;
    
        const imagenes = req.files.map(file => file.path);

        const nuevoProducto = new Productos({
            nombre,
            precio,
            cantidad,
            categoria,
            imagenes,
            descripcion,
            descuento
        });
        await nuevoProducto.save();

        res.json({ msg: 'Producto creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear el producto' });
    }
};



exports.editarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, cantidad, categoria, imagenes, descripcion, descuento } = req.body;
        const producto = await Productos.findByIdAndUpdate(id, { nombre,precio, cantidad, categoria, imagenes, descripcion, descuento });
        res.json({ msg: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
}

exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Productos.findByIdAndDelete(id);
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
}

module.exports = exports