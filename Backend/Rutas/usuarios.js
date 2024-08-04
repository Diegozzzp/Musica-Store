const router = require('express').Router();

const {obtenerUsuarios, obtenerUsuario, crearUsuario, editarUsuario, eliminarUsuario } = require('../Controladores/usuarios');

const { validarUsuario } = require('../validaciones/usuario');

const upload = require('../middlewares/multerconfig');


router.get('/usuarios', obtenerUsuarios);

router.get('/buscar/:id',obtenerUsuario);

router.post('/usuarios', upload.single('avatar') ,validarUsuario, crearUsuario);

router.patch('/editarUsuario/:id',validarUsuario, editarUsuario);

router.patch('/eliminarUsuario/:id',eliminarUsuario);

module.exports = router;

