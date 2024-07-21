const router = require('express').Router();
const { obtenerProductos, ObtenerProductoCampo, crearProductos, editarProductos, eliminarProductos } = require('../Controladores/producto');

router.get('/productos', obtenerProductos);

router.get('/productos/:id', ObtenerProductoCampo);

router.post('/productos', crearProductos);

router.patch('/productos/:id', editarProductos);

router.delete('/productos/:id', eliminarProductos);

module.exports = router;