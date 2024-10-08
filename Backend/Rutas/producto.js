const router = require('express').Router();

const { obtenerProductos, randomProductos, obtenerProductosPorCategoria, obtenerProductoPorId ,crearProducto, editarProducto, eliminarProducto } = require('../Controladores/producto');

const { validarProducto } = require('../validaciones/producto');

const upload = require('../middlewares/multerconfig');

router.get('/productos', obtenerProductos);

router.get('/productos/random', randomProductos);

router.get('/productos/categoria/:id', obtenerProductosPorCategoria);

router.get('/productos/:id', obtenerProductoPorId);

router.post('/productos',  upload.array('imagenes', 5), crearProducto);

router.patch('/productos/:id', upload.array('imagenes', 5) ,editarProducto);

router.delete('/productos/:id', eliminarProducto);

module.exports = router;