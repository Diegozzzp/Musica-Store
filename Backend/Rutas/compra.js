const router = require('express').Router();

const { obtenerCompras, realizarCompra, obtenerHistorialCompras ,editarCompra, eliminarCompra } = require('../Controladores/compra');

const { validarCompra } = require('../validaciones/compra');

const { verificarToken } = require('../middlewares/jwt')

router.get('/compras',obtenerCompras);

router.post('/comprar', verificarToken, realizarCompra);

router.get('/perfil/compras', verificarToken ,obtenerHistorialCompras);

router.patch('/compras/:id', editarCompra);

router.patch('/compras/:id', eliminarCompra);

module.exports = router;