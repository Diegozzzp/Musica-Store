const {check} = require('express-validator');
const { validacionesCheck } = require('./validacion');

exports.validarRol = [
    check('rol', 'El rol es obligatorio').not().isEmpty().isString(),
    validacionesCheck
]

module.exports = exports