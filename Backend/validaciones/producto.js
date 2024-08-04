const { check, validationResult } = require('express-validator');

exports.validarProducto = [
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('precio').isNumeric().withMessage('El precio debe ser un número'),
    check('cantidad').isNumeric().withMessage('La cantidad debe ser un número'),
    check('categoria').not().isEmpty().withMessage('La categoría es obligatoria'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('descuento').isNumeric().withMessage('El descuento debe ser un número'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
