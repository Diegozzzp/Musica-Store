const Compra = require('../Modelos/compra');
const Producto = require('../Modelos/producto');  
const Usuarios = require('../Modelos/usuarios');

// Controlador para obtener una lista paginada de compras
exports.obtenerCompras = async function (req, res) {
    try {
        // Obtener parámetros de paginación de la consulta (query)
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page, 10), // Número de página
            limit: parseInt(limit, 10), // Cantidad de resultados por página
            sort: { createdAt: -1 }, // Ordenar por fecha de creación (más recientes primero)
            populate: 'usuario' // Incluir información del usuario asociado
        };
        // Obtener las compras con paginación y opciones especificadas
        const compras = await Compra.paginate({}, options);
        res.json(compras); // Enviar las compras como respuesta
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ msg: 'Error en el servidor.' }); // Enviar error en caso de fallo
    }
}

// Controlador para buscar una compra específica por ID
exports.buscarCompraEspecifica = async (req, res) => {
    try {
        const { id } = req.query; // Obtener el id de los parámetros de consulta

        // Verificar si se ha proporcionado un id
        if (!id) {
            return res.status(400).json({ msg: 'El parámetro id es requerido.' });
        }

        // Buscar la compra por id
        const compra = await Compra.findById(id);

        // Verificar si se encontró la compra
        if (!compra) {
            return res.status(404).json({ msg: 'Compra no encontrada.' });
        }

        // Enviar la respuesta con la compra encontrada
        res.json(compra);
    } catch (error) {
        console.error('Error al buscar la compra:', error);
        res.status(500).json({ msg: 'Error al buscar la compra' });
    }
};




// Controlador para realizar una nueva compra
exports.realizarCompra = async function (req, res) {
    try {
        const { productos, total } = req.body; // Obtener productos y total desde el cuerpo de la solicitud
        const userId = req.user.userId; // Obtener el ID del usuario desde el token

        // Validar que los productos y el total sean correctos
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ msg: 'No se proporcionaron productos.' });
        }

        if (typeof total !== 'number' || total <= 0) {
            return res.status(400).json({ msg: 'Total inválido.' });
        }

        // Buscar al usuario en la base de datos
        const usuario = await Usuarios.findById(userId);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Obtener los productos de la base de datos
        const productoIds = productos.map(item => item.producto);
        const productosEncontrados = await Producto.find({ _id: { $in: productoIds } });

        // Crear un mapa de productos para acceso rápido
        const productosMap = productosEncontrados.reduce((map, producto) => {
            map[producto._id] = producto;
            return map;
        }, {});

        const productosNoDisponibles = [];

        // Validar y procesar cada producto
        for (const item of productos) {
            const producto = productosMap[item.producto];
            if (!producto) {
                return res.status(404).json({ msg: `Producto con ID ${item.producto} no encontrado.` });
            }

            // Verificar si la cantidad solicitada excede el stock disponible
            if (item.cantidad > producto.cantidad) {
                productosNoDisponibles.push({
                    producto: producto._id,
                    nombre: producto.nombre,
                    cantidadDisponible: producto.cantidad
                });
                continue;
            }

            // Reducir el stock del producto
            producto.cantidad -= item.cantidad;
            await producto.save();
        }

        // Si hay productos no disponibles, devolver error con detalles
        if (productosNoDisponibles.length > 0) {
            return res.status(400).json({
                msg: 'Algunos productos no están disponibles en la cantidad solicitada.',
                productosNoDisponibles
            });
        }

        // Crear una nueva compra
        const nuevaCompra = new Compra({
            usuario: userId,
            productos: productos.map(item => ({
                producto: item.producto,
                cantidad: item.cantidad
            })),
            total
        });

        await nuevaCompra.save();

        // Actualizar el usuario con la nueva compra
        usuario.compras.push(nuevaCompra._id);
        await usuario.save();

        res.status(201).json({ msg: 'Compra realizada con éxito.', compra: nuevaCompra });
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        res.status(500).json({ msg: 'Error en el servidor.', error: error.message });
    }
};

// Controlador para obtener el historial de compras de un usuario
exports.obtenerHistorialCompras = async function (req, res) {
    try {
        const userId = req.user.userId; // Obtener el ID del usuario desde el token

        // Buscar las compras del usuario y poblar los detalles del producto
        const compras = await Compra.find({ usuario: userId }).populate('productos.producto');
        
        res.status(200).json(compras); // Enviar las compras como respuesta
    } catch (error) {
        console.error('Error al obtener el historial de compras:', error);
        res.status(500).json({ msg: 'Error en el servidor.' }); // Enviar error en caso de fallo
    }
}

// Controlador para editar una compra existente
exports.editarCompra = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la compra desde los parámetros
        const { usuario, carrito, total, fecha } = req.body; // Obtener los datos desde el cuerpo de la solicitud

        // Buscar y validar los productos en el carrito
        const productos = await Promise.all(carrito.map(async item => {
            const producto = await Producto.findById(item.product);
            if (!producto) {
                throw new Error(`Producto con ID ${item.product} no encontrado`);
            }
            return {
                product: item.product,
                cantidad: item.cantidad
            };
        }));

        // Actualizar la compra con los nuevos datos
        const compra = await Compra.findByIdAndUpdate(id, { usuario, productos, total, fecha }, { new: true });

        await compra.save();
        res.json({ msg: 'Compra actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la compra', error: error.message }); // Enviar error en caso de fallo
    }
}

// Controlador para eliminar una compra (marcarla como eliminada)
exports.eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la compra desde los parámetros
        // Marcar la compra como eliminada y registrar la fecha de eliminación
        const compra = await Compra.findByIdAndUpdate(id, { Eliminado: true, fechaEliminacion: Date.now() }, { new: true });
        await compra.save();
        res.json({ msg: 'Compra eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la compra', error: error.message }); // Enviar error en caso de fallo
    }
}
