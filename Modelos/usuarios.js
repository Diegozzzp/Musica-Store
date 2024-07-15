const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UsuariosSchema = new mongoose.Schema({
    nombre : { type: String, required: true, min : 3, max : 30 },
    apellido : { type: String, required: true, min : 3, max : 30 },
    telefono : { type: String, required: true, min : 3, max : 30 },
    avatar : { type: String,  min : 3, max : 30 },
    correo : { type: String, required: true, min : 3, max : 30 },
    password : { type: String, required: true, min : 3, max : 30 },
    rol : { type: String,min : 3, max : 30, default: 'usuario' },
    carrito : { type: Array, default: [] },
    compras : { type: Array, default: [] },
    fecha : { type: Date, default: Date.now },
    fechaActualizacion : { type: Date },
    fechaEliminacion : { type: Date },
    Eliminado : { type: Boolean, default: false }
});

UsuariosSchema.plugin(mongoosePaginate);

const Usuarios = mongoose.model('usuarios', UsuariosSchema);
//paginacion

Usuarios.paginate().then({});

module.exports = Usuarios;
