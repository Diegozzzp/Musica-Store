const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const usuarios = require('./Rutas/usuarios');
const categoria = require('./Rutas/categoria');
const rol = require('./Rutas/rol');
const compra = require('./Rutas/compra');
const producto = require('./Rutas/producto');
const reportes = require('./Rutas/reportes');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

const allowedOrigins = [
  'https://musica-store-chqr.vercel.app',
  'https://kiwi-stores.netlify.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error(`No permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

mongoose.connect('mongodb+srv://kiwi-music-DB:kiwi-music-DB@kiwi-music.dhnkl.mongodb.net/musica_store?retryWrites=true&w=majority&appName=Kiwi-Music')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Evita que las consultas queden en el buffer mientras MongoDB todavía conecta.
const ensureMongoConnection = async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    await mongoose.connection.asPromise();
    return next();
  } catch (error) {
    console.error('MongoDB no está disponible para atender la solicitud:', error);
    return res.status(503).json({
      msg: 'Base de datos no disponible',
      error: 'No fue posible conectar con la base de datos'
    });
  }
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ msg: 'API Kiwi Music funcionando' });
});

app.use(ensureMongoConnection, usuarios, categoria, rol, compra, producto, reportes);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

module.exports = app;