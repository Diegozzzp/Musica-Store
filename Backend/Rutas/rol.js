const router = require('express').Router();

const {obtenerCategorias, buscarCategorias, crearCategorias, editarCategorias, eliminarCategorias } = require('../Controladores/categoria');

const { validarRol } = require('../validaciones/rol');

router.get('/roles', obtenerCategorias);

router.get('/roles/:id', buscarCategorias);

router.post('/roles', validarRol, crearCategorias);

router.patch('/roles/:id', editarCategorias);

router.delete('/roles/:id', eliminarCategorias);


module.exports = router