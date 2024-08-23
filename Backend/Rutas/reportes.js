const express = require('express');
const router = express.Router();


const  {reporteDiario, reporteSemanal, reporteAnual, productosMasVendidos, productosMenosVendidos} = require('../Controladores/reporte');

router.get('/ventas-diarias', reporteDiario);
router.get('/ventas-semanales', reporteSemanal);
router.get('/ventas-anuales', reporteAnual);
router.get('/productos-mas-vendidos', productosMasVendidos);
router.get('/productos-menos-vendidos', productosMenosVendidos);

module.exports = router;
