const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const compraSchema = new mongoose.Schema({ 
    usuario : { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
    productos: [ {
        product : { type: mongoose.Schema.Types.ObjectId, ref: 'productos', required: true },
        cantidad : { type: Number, required: true, min : 1, max : 100}
    }],
    total : { type: Number, },
    fecha : { type: Date, default: Date.now },
    fechaActualizacion : { type: Date },
    fechaEliminacion : { type: Date },
    Eliminado : { type: Boolean, default: false }
});

compraSchema.plugin(mongoosePaginate);

const Compra = mongoose.model('compra', compraSchema);

Compra.paginate().then({});

module.exports = Compra;