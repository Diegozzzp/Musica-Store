const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3002;
const cors = require('cors');
const path = require('path');

app.use(express.json());


mongoose.connect('mongodb://mongo:xKIkoivTsGDxgAOldkVjUIRUpgeyfQdK@mongodb.railway.internal:27017')

corsOptions = {
    origin: 'https://kiwi-stores.netlify.app',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const usuarios = require('./Rutas/usuarios');
const categoria = require('./Rutas/categoria');
const rol = require('./Rutas/rol');
const compra = require('./Rutas/compra');
const producto = require('./Rutas/producto');
const reportes = require('./Rutas/reportes');
//usar las rutas
app.use(usuarios, categoria, rol, compra, producto, reportes);


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
})