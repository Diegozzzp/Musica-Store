const Productos = require('../Modelos/producto');

exports.ObtenerProductos = async (req, res) => {
    try{
        const productos = await Productos.find();
        res.json(productos);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener los productos' });
    }
}


exports.ObtenerProductoCampo = async (req, res) => {
    try{
        const {id , nombre, categoria} = req.query;
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
        const producto = await Productos.find(filtro);
        res.json(producto);
    }
    catch(error){
        res.status(500).json({ msg: 'Error al obtener el producto' });
    }
}

exports.crearProducto = async (req, res) => {
    try{
        const nuevoProducto = new Productos(req.body);
        await nuevoProducto.save();
        res.json({ msg: 'Producto creado correctamente' });
    }
    catch(error){
        res.status(500).json({ msg: 'Error al crear el producto' });
    }

}
exports.editarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, cantidad, categoria, imagenes, descripcion, descuento } = req.body;
        const producto = await Productos.findByIdAndUpdate(id, { nombre, precio, cantidad, categoria, imagenes, descripcion, descuento }, { new: true });
        await producto.save();
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