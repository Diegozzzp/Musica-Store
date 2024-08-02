const {check} = require('express-validator');
const {validacionesCheck} = require('./validacion');

exports.validarCompra = [
    check('total', 'El total es obligatorio').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    validacionesCheck
]

module.exports = exports