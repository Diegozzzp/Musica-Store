const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const RolSchema = new mongoose.Schema({
    nombre : { type: String, required: true, min : 3, max : 30, unique: true, match: /^[a-zA-Z\s]+$/, default: 'usuario' },
    fecha : { type: Date, default: Date.now },
    fechaActualizacion : { type: Date },
    fechaEliminacion : { type: Date },
    Eliminado : { type: Boolean, default: false }
});

RolSchema.plugin(mongoosePaginate);

const Rol = mongoose.model('rol', RolSchema);

Rol.paginate().then({});

module.exports = Rol;