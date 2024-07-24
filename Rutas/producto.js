const router = require('express').Router();
const { obtenerProductos, ObtenerProductoCampo, crearProducto, editarProducto, eliminarProducto } = require('../Controladores/producto');

router.get('/productos', obtenerProductos);

router.get('/productos/:id', ObtenerProductoCampo);

router.post('/productos', crearProducto);

router.patch('/productos/:id', editarProducto);

router.delete('/productos/:id', eliminarProducto);

module.exports = router;