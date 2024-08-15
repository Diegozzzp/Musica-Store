const {check} = require('express-validator');
const { validacionesCheck } = require('./validacion');

exports.validarUsuario = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().isString().isLength({min: 3, max: 20}),
    check('apellido', 'El apellido es obligatorio').not().isEmpty().isString().isLength({min: 3, max: 20}),
    check('correo', 'El email es obligatorio').isEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validacionesCheck
]

module.exports = exports