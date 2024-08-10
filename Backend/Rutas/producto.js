const router = require('express').Router();

const { obtenerProductos, ObtenerProductoCampo, obtenerProductosPorCategoria, obtenerProductoPorId ,crearProducto, editarProducto, eliminarProducto } = require('../Controladores/producto');

const { validarProducto } = require('../validaciones/producto');

const upload = require('../middlewares/multerconfig');

router.get('/productos', obtenerProductos);

router.get('/productos/campos/:id', ObtenerProductoCampo);

router.get('/productos/categoria/:id', obtenerProductosPorCategoria);

router.get('/productos/:id', obtenerProductoPorId);

router.post('/productos', upload.array('imagenes', 5) ,validarProducto, crearProducto);

router.patch('/productos/:id', upload.array('imagenes', 5) ,editarProducto);

router.delete('/productos/:id', eliminarProducto);

module.exports = router;