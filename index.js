const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3002;
const cors = require('cors');

app.use(express.json());

//crear coneccion a la base de datos
mongoose.connect('mongodb://localhost:27017/musica-store')

corsOptions = {
    origin: 'http://localhost:3002',
    optionsSuccessStatus: 200
}

app.use(cors());

const usuarios = require('./Rutas/usuarios');
const categoria = require('./Rutas/categoria');
const rol = require('./Rutas/rol');
const compra = require('./Rutas/compra');
const producto = require('./Rutas/producto');

//usar las rutas
app.use(usuarios, categoria, rol, compra, producto);


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
})