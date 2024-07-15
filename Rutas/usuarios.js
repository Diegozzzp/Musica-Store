const router = require('express').Router();
const { obtenerUsuarios, obtenerUsuario, crearUsuario, editarUsuario, eliminarUsuario } = require('../Controladores/usuarios');

router.get('/usuarios', obtenerUsuarios);

router.get('/usuarios/:id', obtenerUsuario);

router.post('/usuarios', crearUsuario);

router.patch('/usuarios/:id', editarUsuario);

router.delete('/usuarios/:id', eliminarUsuario);

module.exports = router;