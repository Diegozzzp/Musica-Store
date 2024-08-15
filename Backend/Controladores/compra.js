const Compra = require('../Modelos/compra');
const Producto = require('../Modelos/producto');  
const Usuarios = require('../Modelos/usuarios');

exports.obtenerCompras = async function (req, res) {
    try {
        const {page = 1, limit = 10} = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 },
            populate: 'usuario'
        };
        const compras = await Compra.paginate({}, options);
        res.json(compras);
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
}

exports.realizarCompra = async function (req, res) {
    try {
        const { productos, total } = req.body;
        const userId = req.user.userId; 

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ msg: 'No se proporcionaron productos.' });
        }
        if (typeof total !== 'number' || total <= 0) {
            return res.status(400).json({ msg: 'Total inválido.' });
        }

        const usuario = await Usuarios.findById(userId);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        const nuevaCompra = new Compra({
            usuario: userId,
            productos,
            total
        });

        await nuevaCompra.save();

        usuario.compras.push(nuevaCompra._id);
        await usuario.save();

        // Enviar la respuesta
        res.status(201).json({ msg: 'Compra realizada con éxito.', compra: nuevaCompra });
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
}

exports.obtenerHistorialCompras = async function (req, res) {
    try {
        const userId = req.user.userId; 

        const compras = await Compra.find({ usuario: userId }).populate('productos.product');
        
        res.status(200).json(compras);
    } catch (error) {
        console.error('Error al obtener el historial de compras:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
}

exports.editarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, carrito, total, fecha } = req.body;

        const productos = await Promise.all(carrito.map(async item => {
            const producto = await Producto.findById(item.product);
            if (!producto) {
                throw new Error(`Producto con ID ${item.product} no encontrado`);
            }
            return {
                product: item.product,
                cantidad: item.cantidad
            };
        }));

        const compra = await Compra.findByIdAndUpdate(id, { usuario, productos, total, fecha }, { new: true });

        await compra.save();
        res.json({ msg: 'Compra actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la compra', error: error.message });
    }
}

exports.eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Compra.findByIdAndUpdate(id, { Eliminado: true, fechaEliminacion: Date.now() }, { new: true });
        await compra.save();
        res.json({ msg: 'Compra eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la compra', error: error.message });
    }
}
