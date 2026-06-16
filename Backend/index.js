const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3002;
const cors = require('cors');
const path = require('path');

app.use(express.json());


mongoose.connect('mongodb+srv://kiwi-music-DB:kiwi-music-DB@kiwi-music.dhnkl.mongodb.net/musica_store?retryWrites=true&w=majority&appName=Kiwi-Music')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

corsOptions = {
    origin: 'https://kiwi-stores.netlify.app',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

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