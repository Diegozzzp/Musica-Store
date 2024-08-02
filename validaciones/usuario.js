const {check} = require('express-validator');
const { validacionesCheck } = require('./validacion');

exports.validarUsuario = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().isString().isLength({min: 3, max: 20}),
    check('apellido', 'El apellido es obligatorio').not().isEmpty().isString().isLength({min: 3, max: 20}),
    check('email', 'El email es obligatorio').isEmail() .exists(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    check(' telefono ', 'El telefono es obligatorio').not().isEmpty().isString(),
    validacionesCheck
]

module.exports = exports