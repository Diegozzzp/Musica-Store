const Productos = require('../Modelos/producto');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

exports.obtenerProductos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: 'categoria', 
            select: 'nombre precio cantidad categoria imagenes descripcion descuento'
        };

        const productos = await Productos.paginate({}, options);

        if (!productos.docs.length) {
            return res.status(404).json({ msg: 'No se encontraron productos' });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener productos', error: error.message });
    }
};
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

exports.obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: 'ID de categoría es requerido' });
        }

        const { page = 1, limit = 10, sort } = req.query;

        let sortOption = {};
        switch (sort) {
            case 'mas-antiguos':
                sortOption = { createdAt: 1 };
                break;
            case 'mas-recientes':
                sortOption = { createdAt: -1 };
                break;
            case 'mas-vendidos':
                sortOption = { ventas: -1 };
                break;
            case 'orden-alfabetico':
                sortOption = { nombre: 1 };
                break;
            case 'mas-populares':
                sortOption = { popularidad: -1 };
                break;
            default:
                sortOption = { createdAt: -1 }; 
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sortOption,
            populate: 'categoria',
            select: 'nombre precio cantidad categoria imagenes descripcion descuento ventas popularidad createdAt',
        };

        const productos = await Productos.paginate({ categoria: id }, options);

        if (!productos.docs.length) {
            return res.status(404).json({ msg: 'No se encontraron productos para la categoría especificada' });
        }

        const totalProductos = await Productos.countDocuments({ categoria: id });

        res.json({ 
            productos: productos.docs,
            totalProductos,
            totalPages: productos.totalPages,
            currentPage: productos.page
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener productos', error: error.message });
    }
};


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
        const imagenes = req.files.map(file => file.filename); 
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
        const { nombre, precio, cantidad, categoria, descripcion, descuento } = req.body;

        const producto = await Productos.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        let imagenes = producto.imagenes;
        if (req.files && req.files.length > 0) {
            imagenes.forEach(imagen => {
                const filePath = path.join(__dirname, '..', 'uploads', imagen);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            imagenes = req.files.map(file => file.filename);
        }

        const updateData = { nombre, precio, cantidad, categoria, descripcion, descuento, imagenes };

        const productoActualizado = await Productos.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        res.json({ msg: 'Producto actualizado correctamente', producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el producto', error: error.message });
    }
};

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