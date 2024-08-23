const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const compraSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
    productos: [{
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
        cantidad: { type: Number, required: true, min: 1}
    }],
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date },
    fechaEliminacion: { type: Date },
    Eliminado: { type: Boolean, default: false }
});

compraSchema.plugin(mongoosePaginate);

const Compra = mongoose.model('compra', compraSchema);

Compra.paginate().then({});

module.exports = Compra;
