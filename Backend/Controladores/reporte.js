const Compra = require('../Modelos/compra');
const Producto = require('../Modelos/producto');

// Función para validar si una fecha es válida
function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}

// Controlador para obtener el reporte de ventas diarias
exports.reporteDiario = async function (req, res) {
    try {
        const { fecha } = req.query;  // Fecha en formato YYYY-MM-DD
        const startDate = new Date(fecha);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);  // Fin del día (inicio del siguiente día)

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ msg: 'Fecha no válida.' });  // Validar formato de fecha
        }

        console.log(`Consultando entre ${startDate.toISOString()} y ${endDate.toISOString()}`);

        const ventasDiarias = await Compra.aggregate([
            {
                $match: {
                    fecha: { $gte: startDate, $lt: endDate }, // Filtrar por fecha
                    Eliminado: false
                }
            },
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' }, // Sumar el total de ventas
                    cantidadVentas: { $sum: 1 } // Contar el número de ventas
                }
            }
        ]);

        console.log('Ventas Diarias:', ventasDiarias);

        res.json(ventasDiarias); // Responder con el reporte de ventas diarias
    } catch (error) {
        console.error('Error al obtener el reporte diario:', error.message);
        res.status(500).json({ msg: 'Error en el servidor.', error: error.message }); // Manejar errores
    }
};

// Controlador para obtener el reporte de ventas semanales
exports.reporteSemanal = async function (req, res) {
    try {
        const { fecha } = req.query;  // Fecha en formato YYYY-MM-DD
        const startDate = new Date(fecha);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);  // Fin de la semana (7 días después)

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ msg: 'Fecha no válida.' });  // Validar formato de fecha
        }

        console.log(`Consultando entre ${startDate.toISOString()} y ${endDate.toISOString()}`);

        const ventasSemanales = await Compra.aggregate([
            {
                $match: {
                    fecha: { $gte: startDate, $lt: endDate }, // Filtrar por fecha
                    Eliminado: false
                }
            },
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' }, // Sumar el total de ventas
                    cantidadVentas: { $sum: 1 } // Contar el número de ventas
                }
            }
        ]);

        console.log('Ventas Semanales:', ventasSemanales);

        res.json(ventasSemanales); // Responder con el reporte de ventas semanales
    } catch (error) {
        console.error('Error al obtener el reporte semanal:', error.message);
        res.status(500).json({ msg: 'Error en el servidor.', error: error.message }); // Manejar errores
    }
};

// Controlador para obtener el reporte de ventas anuales
exports.reporteAnual = async function (req, res) {
    try {
        const { año } = req.query;  // Año en formato YYYY
        const startDate = new Date(`${año}-01-01`); // Inicio del año
        const endDate = new Date(`${año + 1}-01-01`);  // Fin del año (inicio del siguiente año)

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ msg: 'Año no válido.' });  // Validar formato de año
        }

        console.log(`Consultando entre ${startDate.toISOString()} y ${endDate.toISOString()}`);

        const ventasAnuales = await Compra.aggregate([
            {
                $match: {
                    fecha: { $gte: startDate, $lt: endDate }, // Filtrar por fecha
                    Eliminado: false
                }
            },
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' }, // Sumar el total de ventas
                    cantidadVentas: { $sum: 1 } // Contar el número de ventas
                }
            }
        ]);

        console.log('Ventas Anuales:', ventasAnuales);

        res.json(ventasAnuales); // Responder con el reporte de ventas anuales
    } catch (error) {
        console.error('Error al obtener el reporte anual:', error.message);
        res.status(500).json({ msg: 'Error en el servidor.', error: error.message }); // Manejar errores
    }
};

// Controlador para obtener los productos más vendidos
exports.productosMasVendidos = async function (req, res) {
    try {
        const productosVendidos = await Compra.aggregate([
            { $unwind: '$productos' }, // Descomponer el array de productos
            { $group: {
                _id: '$productos.producto', // Agrupar por ID del producto
                totalVendidos: { $sum: '$productos.cantidad' } // Sumar cantidad vendida
            }},
            { $sort: { totalVendidos: -1 } }, // Ordenar de mayor a menor cantidad vendida
            { $limit: 10 } // Limitar a los 10 productos más vendidos
        ]);

        const productosDetalles = await Producto.find({ _id: { $in: productosVendidos.map(p => p._id) } }); // Obtener detalles de productos
        const productosMap = productosDetalles.reduce((map, producto) => {
            map[producto._id] = producto;
            return map;
        }, {});

        res.json(productosVendidos.map(item => ({
            producto: productosMap[item._id], // Detalles del producto
            cantidadVendida: item.totalVendidos // Cantidad vendida
        })));
    } catch (error) {
        console.error('Error al obtener los productos más vendidos:', error);
        res.status(500).json({ msg: 'Error en el servidor.' }); // Manejar errores
    }
};

// Controlador para obtener los productos menos vendidos
exports.productosMenosVendidos = async function (req, res) {
    try {
        const productosVendidos = await Compra.aggregate([
            { $unwind: '$productos' }, // Descomponer el array de productos
            { $group: {
                _id: '$productos.producto', // Agrupar por ID del producto
                totalVendidos: { $sum: '$productos.cantidad' } // Sumar cantidad vendida
            }},
            { $sort: { totalVendidos: 1 } }, // Ordenar de menor a mayor cantidad vendida
            { $limit: 10 } // Limitar a los 10 productos menos vendidos
        ]);

        const productosDetalles = await Producto.find({ _id: { $in: productosVendidos.map(p => p._id) } }); // Obtener detalles de productos
        const productosMap = productosDetalles.reduce((map, producto) => {
            map[producto._id] = producto;
            return map;
        }, {});

        res.json(productosVendidos.map(item => ({
            producto: productosMap[item._id], // Detalles del producto
            cantidadVendida: item.totalVendidos // Cantidad vendida
        })));
    } catch (error) {
        console.error('Error al obtener los productos menos vendidos:', error);
        res.status(500).json({ msg: 'Error en el servidor.' }); // Manejar errores
    }
};

module.exports = exports; // Exportar todos los controladores
