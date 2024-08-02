const {check } = require('express-validator');
const {validacionesCheck} = require('./validacion');

exports.validarCategoria = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validacionesCheck
]

module.exports = exports