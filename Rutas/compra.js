const router = require('express').Router();

const { obtenerCompras, crearCompra, editarCompra, eliminarCompra } = require('../Controladores/compra');

const { validarCompra } = require('../validaciones/compra');


router.get('/compras',obtenerCompras);

router.post('/compras', validarCompra, crearCompra);

router.patch('/compras/:id', editarCompra);

router.patch('/compras/:id', eliminarCompra);

module.exports = router;