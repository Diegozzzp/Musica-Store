const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategoriasSchema = new mongoose.Schema({
    nombre : { type: String, required: true, min : 3, max : 30, unique: true },
    fecha : { type: Date, default: Date.now },
    fechaActualizacion : { type: Date },
    fechaEliminacion : { type: Date },
    Eliminado : { type: Boolean, default: false }
});

CategoriasSchema.plugin(mongoosePaginate);

const Categorias = mongoose.model('categorias', CategoriasSchema);

Categorias.paginate().then({});

module.exports = Categorias;