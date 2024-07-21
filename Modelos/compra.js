const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CompraSchema = new mongoose.Schema({
    usuario : { objectId: true, ref: 'usuarios', required: true, default : null },
    prductos : { type: Array, default: [] , required: true },
    total : { type: Number, required: true },
    fecha : { type: Date, default: Date.now },
    fechaActualizacion : { type: Date },
    fechaEliminacion : { type: Date },
    Eliminado : { type: Boolean, default: false }
});

CompraSchema.plugin(mongoosePaginate);

const Compra = mongoose.model('compra', CompraSchema);

Compra.paginate().then({});

module.exports = Compra;