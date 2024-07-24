const router = require('express').Router();
const { obtenerCompras, crearCompra, editarCompra, eliminarCompra } = require('../Controladores/compra');

router.get('/compras', obtenerCompras);

router.post('/compras', crearCompra);

router.patch('/compras/:id', editarCompra);

router.delete('/compras/:id', eliminarCompra);

module.exports = router;