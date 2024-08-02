const router = require('express').Router();

const { obtenerCategorias, buscarCategorias, crearCategorias, editarCategorias, eliminarCategorias } = require('../Controladores/categoria');


const {validarCategoria} = require('../validaciones/categoria');

router.get('/categorias', obtenerCategorias);

router.get('/categorias/:id', buscarCategorias);

router.post('/categorias', validarCategoria, crearCategorias);

router.patch('/categorias/:id', editarCategorias);

router.delete('/categorias/:id', eliminarCategorias);


module.exports = router