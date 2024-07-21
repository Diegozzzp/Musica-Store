const router = require('express').Router();
const { obtenerCompras, crearCompras, editarCompras, eliminarCompras } = require('../Controladores/compra');

router.get('/compras', obtenerCompras);

router.post('/compras', crearCompras);

router.patch('/compras/:id', editarCompras);

router.delete('/compras/:id', eliminarCompras);

module.exports = router;