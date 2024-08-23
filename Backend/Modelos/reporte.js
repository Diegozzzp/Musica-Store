const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
    cantidad: { type: Number, required: true, min: 1 },
    totalPrecio: { type: Number, required: true }
});

const Venta = mongoose.model('ventas', VentaSchema);

module.exports = Venta;
