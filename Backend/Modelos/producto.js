const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductosSchema = new mongoose.Schema({
    nombre : { type: String, required: true, min : 3, max : 30, unique: true },
    precio : { type: Number, required: true, min : 3, max : 1000000 },
    cantidad : { type: Number, required: true, min : 3, max : 1000000 },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'categorias', required: true, default: null },
    imagenes : [{ type: String}],
    descripcion : { type: String, required: true, min : 3, max : 300},
    descuento : { type: Number, required: true, min : 0, max : 1000, default : 0 },
    fecha : { type: Date, default: Date.now },
    fechaActualizacion : { type: Date },
    fechaEliminacion : { type: Date },
    Eliminado : { type: Boolean, default: false }
});


ProductosSchema.plugin(mongoosePaginate);

const Productos = mongoose.model('productos', ProductosSchema);

Productos.paginate().then({});

module.exports = Productos;