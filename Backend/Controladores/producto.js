const Productos = require('../Modelos/producto');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Función para manejar errores y enviar respuestas adecuadas
const handleError = (res, message, error) => {
    console.error(message, error);
    res.status(500).json({ msg: message, error: error.message });
};

// Controlador para obtener una lista paginada de productos
exports.obtenerProductos = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoria, ordenarPor } = req.query; // Obtener parámetros de paginación, categoría y orden

        // Validación de parámetros
        const validSortOptions = ['masVendidos', 'ordenAlfabetico', 'masAntiguos', 'masReciente'];
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ msg: 'Parámetros de paginación inválidos' });
        }

        if (ordenarPor && !validSortOptions.includes(ordenarPor)) {
            return res.status(400).json({ msg: 'Parámetro de ordenamiento inválido' });
        }

        const options = {
            page: pageNumber, // Número de página
           limit: limitNumber, // Cantidad de resultados por página
            populate: 'categoria', // Incluir información de la categoría
            select: 'nombre precio cantidad categoria imagenes descripcion descuento cantidadVendida fecha', // Campos a seleccionar
            sort: {} // Opciones de ordenamiento
        }; 

        // Crear el filtro para la búsqueda
        const query = {};

        if (categoria) {
            query.categoria = categoria; // Filtrar por ID de categoría si se proporciona
        }

        // Aplicar ordenamiento según el criterio especificado
        const sortOptions = {
            masVendidos: { cantidadVendida: -1 }, // Ordenar por más vendidos
            ordenAlfabetico: { nombre: 1 }, // Ordenar alfabéticamente
            masAntiguos: { fecha: 1 }, // Ordenar por más antiguos
            masReciente: { fecha: -1 } // Ordenar por más recientes
        };

        options.sort = sortOptions[ordenarPor] || { fecha: -1 }; // Valor por defecto: más recientes

        // Obtener productos con paginación y opciones especificadas
        const productos = await Productos.paginate(query, options);

        if (!productos.docs.length) {
            return res.status(404).json({ msg: 'No se encontraron productos' });
        }

        res.json(productos); // Enviar los productos como respuesta
    } catch (error) {
        handleError(res, 'Error al obtener productos', error); // Manejar errores
    }
};

// Controlador para obtener productos basados en varios campos de filtro
exports.randomProductos = async (req, res) => {
    try {
        // Puedes ajustar el número de productos aleatorios a devolver
        const numProducts = parseInt(req.query.limit) || 10; // Por defecto devolver 10 productos aleatorios

        // Buscar productos aleatorios usando el operador $sample
        const productos = await Productos.aggregate([
            { $sample: { size: numProducts } } // Cambia 'numProducts' por el número de productos aleatorios deseado
        ]);

        res.json(productos); // Enviar los productos aleatorios como respuesta
    } catch (error) {
        console.error('Error al obtener productos aleatorios:', error);
        res.status(500).json({ msg: 'Error al obtener productos aleatorios' });
    }
};


// Controlador para obtener productos por categoría
exports.obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { id } = req.params; // Obtener ID de categoría desde parámetros
        if (!id) {
            return res.status(400).json({ msg: 'ID de categoría es requerido' });
        }
        const { page = 1, limit = 12, sort } = req.query; // Obtener parámetros de paginación y ordenamiento
        const sortOptions = {
            'mas-antiguos': { createdAt: 1 },
            'mas-recientes': { createdAt: -1 },
            'mas-vendidos': { ventas: -1 },
            'orden-alfabetico': { nombre: 1 },
            'mas-populares': { popularidad: -1 },
            default: { createdAt: -1 }
        };
        const sortOption = sortOptions[sort] || sortOptions.default;
        const options = {
            page: parseInt(page, 10), // Número de página
            limit: parseInt(limit, 10), // Cantidad de resultados por página
            sort: sortOption, // Ordenar según opción seleccionada
            populate: 'categoria', // Incluir información de la categoría
            select: 'nombre precio cantidad categoria imagenes descripcion descuento ventas popularidad createdAt' // Campos a seleccionar
        };
        // Obtener productos por categoría con paginación y opciones especificadas
        const productos = await Productos.paginate({ categoria: id }, options);
        if (!productos.docs.length) {
            return res.status(404).json({ msg: 'No se encontraron productos para la categoría especificada' });
        }
        const totalProductos = await Productos.countDocuments({ categoria: id }); // Contar el total de productos en la categoría
        res.json({
            productos: productos.docs,
            totalProductos,
            totalPages: productos.totalPages,
            currentPage: productos.page
        }); // Enviar respuesta con detalles de los productos
    } catch (error) {
        handleError(res, 'Error al obtener productos', error); // Manejar errores
    }
};

// Controlador para obtener un producto por su ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params; // Obtener ID del producto desde parámetros
        // Buscar el producto por ID e incluir la información de la categoría
        const producto = await Productos.findById(id).populate('categoria');
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json(producto); // Enviar el producto como respuesta
    } catch (error) {
        handleError(res, 'Error al obtener el producto', error); // Manejar errores
    }
};

// Controlador para crear un nuevo producto
exports.crearProducto = async (req, res) => {
    const errors = validationResult(req); // Validar datos del formulario
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Devolver errores de validación
    }

    try {
        const { nombre, precio, cantidad, categoria, descripcion, descuento, tipo, tallas } = req.body;
        const imagenes = req.files ? req.files.map(file => file.filename) : []; // Obtener nombres de los archivos subidos

        let precioFinal = parseFloat(precio);
        if (descuento) {
            const descuentoPorcentaje = parseFloat(descuento);
            if (descuentoPorcentaje > -1 && descuentoPorcentaje <= 100) {
                precioFinal = precioFinal - (precioFinal * (descuentoPorcentaje / 100)); // Aplicar descuento
            } else {
                return res.status(400).json({ msg: 'El descuento debe ser un porcentaje válido entre 0 y 100' });
            }
        }

        // Si 'tallas' es una cadena, convertirla en un array
        const tallasArray = Array.isArray(tallas) ? tallas : tallas.split(',').map(talla => talla.trim());

        // Log para depuración
        console.log('Creando producto con los siguientes datos:', {
            nombre,
            precio: precioFinal,
            cantidad,
            categoria,
            imagenes,
            descripcion,
            descuento: descuento || 0,
            tipo,
            tallas: tipo === 'ropa' ? tallasArray : []  // Solo asignar tallas si el tipo es 'ropa'
        });

        // Crear el nuevo producto con los datos proporcionados
        const nuevoProducto = new Productos({
            nombre,
            precio: precioFinal, // Aplicar el precio con descuento si aplica
            cantidad,
            categoria,
            imagenes,
            descripcion,
            descuento: descuento || 0, // Guardar el descuento como porcentaje
            tipo,
            tallas: tipo === 'ropa' ? tallasArray : []  // Solo asignar tallas si el tipo es 'ropa'
        });

        await nuevoProducto.save(); // Guardar el nuevo producto en la base de datos
        res.json({ msg: 'Producto creado correctamente' }); // Responder con éxito
    } catch (error) {
        console.error('Error al crear producto:', error.message, error.stack);
        res.status(500).json({ msg: 'Error al crear el producto', error: error.message }); // Manejar errores
    }
};

// Controlador para actualizar un producto existente
exports.editarProducto = async (req, res) => {
    try {
        const { id } = req.params; // Obtener ID del producto desde parámetros
        const producto = await Productos.findById(id); // Buscar el producto por ID

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' }); // Manejar caso de producto no encontrado
        }

        let imagenes = producto.imagenes; // Obtener imágenes actuales del producto

        if (req.files && req.files.length > 0) {
            // Si se subieron nuevas imágenes, eliminar las antiguas
            imagenes.forEach(imagen => {
                const filePath = path.join(__dirname, '..', 'uploads', imagen);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            // Asignar nuevas imágenes
            imagenes = req.files.map(file => file.filename);
        }

        const updateData = { ...req.body, imagenes }; // Preparar datos de actualización

        // Aplicar descuento si está presente en la solicitud
        if (updateData.descuento) {
            const descuentoPorcentaje = parseFloat(updateData.descuento);
            const precioOriginal = producto.precio;

            if (!isNaN(descuentoPorcentaje) && descuentoPorcentaje >= 0 && descuentoPorcentaje <= 100) {
                updateData.precio = precioOriginal - (precioOriginal * (descuentoPorcentaje / 100)); // Calcular precio con descuento
            } else {
                return res.status(400).json({ msg: 'El descuento debe ser un porcentaje válido entre 0 y 100' });
            }
        }

        // Ajustar tallas si el tipo es 'ropa'
        if (updateData.tipo === 'ropa') {
            updateData.tallas = Array.isArray(updateData.tallas) ? updateData.tallas : [];
        } else {
            updateData.tallas = [];
        }

        // Actualizar el producto en la base de datos
        const productoActualizado = await Productos.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        res.json({ msg: 'Producto actualizado correctamente', producto: productoActualizado }); // Responder con éxito
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el producto', error: error.message }); // Manejar errores
    }
};

// Controlador para eliminar un producto
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params; // Obtener ID del producto desde parámetros
        await Productos.findByIdAndDelete(id); // Eliminar el producto de la base de datos
        res.json({ msg: 'Producto eliminado correctamente' }); // Responder con éxito
    } catch (error) {
        handleError(res, 'Error al eliminar el producto', error); // Manejar errores
    }
};
