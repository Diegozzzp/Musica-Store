const router = require('express').Router();

const {loginUsuarios, obtenerPerfil ,obtenerUsuarios, obtenerUsuario, crearUsuario, editarUsuario, eliminarUsuario } = require('../Controladores/usuarios');

const { validarUsuario } = require('../validaciones/usuario');

const upload = require('../middlewares/multerconfig');

const { verificarToken, refreshAccessToken } = require('../middlewares/jwt');

router.post('/login', loginUsuarios);

router.get('/perfil', verificarToken ,obtenerPerfil);

router.get('/usuarios', obtenerUsuarios);

router.get('/usuario/:id',obtenerUsuario);

router.post('/usuario', upload.single('avatar') ,validarUsuario, crearUsuario);

router.patch('/refresh', refreshAccessToken);

router.patch('/editarUsuario/:id',validarUsuario, editarUsuario);

router.patch('/eliminarUsuario/:id',eliminarUsuario);

module.exports = router;

