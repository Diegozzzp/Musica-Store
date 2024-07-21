const Compra = require('../Modelos/compra');

exports.obtenerCompras = async (req, res) => {
    try {
        const compras = await Compra.find();
        res.json(compras);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las compras' });
    }
}

exports.crearCompra = async (req, res) => {
    try {
        const { usuario, carrito, total, fecha } = req.body;
        const nuevaCompra = new Compra({ usuario, carrito, total, fecha });
        await nuevaCompra.save();
        res.json({ msg: 'Compra creada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la compra' });
    }
}


exports.editarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, carrito, total, fecha } = req.body;
        const compra = await Compra.findByIdAndUpdate(id, { usuario, carrito, total, fecha });
        await compra.save();
        res.json({ msg: 'Compra actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la compra' });
    }
}

exports.eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Compra.findByIdAndUpdate(id, { Eliminado: true });
        await compra.save();
        res.json({ msg: 'Compra eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la compra' });
    }
}

