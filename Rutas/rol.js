const router = require('express').Router();
const { obtenerRol, crearRol, editarRol, eliminarRol } = require('../Controladores/rol');

router.get('/roles/:id', obtenerRol);

router.post('/roles', crearRol);

router.patch('/roles/:id', editarRol);

router.delete('/roles/:id', eliminarRol);

module.exports = router;