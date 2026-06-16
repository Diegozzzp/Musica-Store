app.use(express.json());

const allowedOrigins = [
  'https://musica-store-chqr.vercel.app',
  'https://musica-store-chqr-pygrp5n2v-diegozzzps-projects.vercel.app',
  'https://kiwi-stores.netlify.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error('No permitido por CORS'));
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const usuarios = require('./Rutas/usuarios');
const categoria = require('./Rutas/categoria');
const rol = require('./Rutas/rol');
const compra = require('./Rutas/compra');
const producto = require('./Rutas/producto');
const reportes = require('./Rutas/reportes');

app.use(usuarios, categoria, rol, compra, producto, reportes);

app.get('/', (req, res) => {
  res.json({ msg: 'API Kiwi Music funcionando' });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

module.exports = app;