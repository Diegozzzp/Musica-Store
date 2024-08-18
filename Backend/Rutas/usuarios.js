const router = require('express').Router();

const {
    solicitarRestablecimiento,
    restablecerContrasena,
    loginUsuarios,
    obtenerPerfil,
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
} = require('../Controladores/usuarios');

const { validarUsuario } = require('../validaciones/usuario');

const upload = require('../middlewares/multerconfig');

const { verificarToken, refreshAccessToken } = require('../middlewares/jwt');

// Ruta para iniciar sesión
router.post('/login', loginUsuarios);

// Ruta para solicitar restablecimiento de contraseña
router.post('/solicitar', solicitarRestablecimiento);

// Ruta para restablecer la contraseña
router.patch('/restablecer-contrasena', restablecerContrasena);

// Ruta para obtener el perfil del usuario (requiere autenticación)
router.get('/perfil', verificarToken, obtenerPerfil);

// Ruta para obtener todos los usuarios
router.get('/usuarios', obtenerUsuarios);

// Ruta para obtener un usuario específico por ID
router.get('/usuario/:id', obtenerUsuario);

// Ruta para crear un nuevo usuario
router.post('/usuario', upload.single('avatar'), validarUsuario, crearUsuario);

// Ruta para refrescar el token de acceso
router.patch('/refresh', refreshAccessToken);

// Ruta para editar un usuario (requiere autenticación)
router.patch('/editarUsuario/:id', verificarToken, upload.single('avatar'), editarUsuario);

// Ruta para eliminar un usuario (requiere autenticación)
router.patch('/eliminarUsuario/:id', eliminarUsuario);

module.exports = router;
