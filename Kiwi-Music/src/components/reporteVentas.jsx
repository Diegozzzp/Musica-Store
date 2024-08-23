import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Reportes = () => {
    const [reporteDiario, setReporteDiario] = useState(null);
    const [reporteSemanal, setReporteSemanal] = useState(null);
    const [reporteAnual, setReporteAnual] = useState(null);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [productosMenosVendidos, setProductosMenosVendidos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const today = new Date();
                const todayString = today.toISOString().split('T')[0];
                const year = today.getFullYear();

                const urls = {
                    diario: `http://localhost:3002/ventas-diarias?fecha=${todayString}`,
                    semanal: `http://localhost:3002/ventas-semanales?fecha=${todayString}`,
                    anual: `http://localhost:3002/ventas-anuales?año=${year}`,
                    masVendidos: `http://localhost:3002/productos-mas-vendidos`,
                    menosVendidos: `http://localhost:3002/productos-menos-vendidos`
                };

                const responses = await Promise.all(Object.values(urls).map(url => axios.get(url)));

                setReporteDiario(responses[0].data);
                setReporteSemanal(responses[1].data);
                setReporteAnual(responses[2].data);
                setProductosMasVendidos(responses[3].data);
                setProductosMenosVendidos(responses[4].data);

            } catch (error) {
                setError('Error al obtener los reportes.');
                console.error('Error al obtener los reportes:', error);
            }
        };

        fetchReportes();
    }, []);

    const handleDownload = () => {
        const wb = XLSX.utils.book_new();

        const addSheet = (title, data) => {
            const sheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, sheet, title);
        };

        // Reporte Diario
        const dailyData = reporteDiario ? [
            { 'Descripción': 'Total Ventas', 'Valor': reporteDiario[0]?.totalVentas || 0 },
            { 'Descripción': 'Cantidad de Ventas', 'Valor': reporteDiario[0]?.cantidadVentas || 0 }
        ] : [];
        addSheet('Reporte Diario', dailyData);

        // Reporte Semanal
        const weeklyData = reporteSemanal ? [
            { 'Descripción': 'Total Ventas', 'Valor': reporteSemanal[0]?.totalVentas || 0 },
            { 'Descripción': 'Cantidad de Ventas', 'Valor': reporteSemanal[0]?.cantidadVentas || 0 }
        ] : [];
        addSheet('Reporte Semanal', weeklyData);

        // Reporte Anual
        const annualData = reporteAnual ? [
            { 'Descripción': 'Total Ventas', 'Valor': reporteAnual[0]?.totalVentas || 0 },
            { 'Descripción': 'Cantidad de Ventas', 'Valor': reporteAnual[0]?.cantidadVentas || 0 }
        ] : [];
        addSheet('Reporte Anual', annualData);

        // Productos Más Vendidos
        const topProductsData = productosMasVendidos.map(p => ({
            'Nombre del Producto': p.producto?.nombre || 'Nombre no disponible',
            'Cantidad Vendida': p.cantidadVendida || 0
        }));
        addSheet('Productos Más Vendidos', topProductsData);

        // Productos Menos Vendidos
        const leastProductsData = productosMenosVendidos.map(p => ({
            'Nombre del Producto': p.producto?.nombre || 'Nombre no disponible',
            'Cantidad Vendida': p.cantidadVendida || 0
        }));
        addSheet('Productos Menos Vendidos', leastProductsData);

        // Añadir título y año a la hoja de reporte anual
        if (reporteAnual && reporteAnual.length) {
            const sheet = wb.Sheets['Reporte Anual'];
            const titleCell = { v: `Reporte Anual ${reporteAnual[0]?.año || 'Año no disponible'}`, s: { font: { sz: 16, bold: true } } };
            sheet['A1'] = titleCell;
        }

        // Guardar el archivo Excel
        XLSX.writeFile(wb, 'Reportes_Ventas.xlsx');
    };

    const renderProductosTable = (productos, title) => {
        if (!Array.isArray(productos)) {
            return <p>Datos no disponibles</p>;
        }

        return (
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#4CAF50]">{title}</h2>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-[#4CAF50] text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Nombre del Producto</th>
                            <th className="py-3 px-4 text-left">Cantidad Vendida</th>
                            <th className="py-3 px-4 text-left">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map((producto) => {
                                const prod = producto.producto || {};
                                return (
                                    <tr key={prod._id} className="border-b border-gray-200">
                                        <td className="py-3 px-4">{prod.nombre || 'Nombre no disponible'}</td>
                                        <td className="py-3 px-4">{producto.cantidadVendida || 'Cantidad no disponible'}</td>
                                        <td className="py-3 px-4">{prod.descripcion || 'Descripción no disponible'}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-3 px-4 text-center">Cargando...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Reportes de Ventas</h1>

            {error && <p className="text-red-600 text-center mb-6">{error}</p>}

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#4CAF50]">Ventas Diarias</h2>
                {reporteDiario ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-lg text-gray-700">Total Ventas: <span className="font-semibold">{reporteDiario[0]?.totalVentas || 0}</span></p>
                        <p className="text-lg text-gray-700">Cantidad de Ventas: <span className="font-semibold">{reporteDiario[0]?.cantidadVentas || 0}</span></p>
                    </div>
                ) : <p className="text-gray-500">Cargando...</p>}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#4CAF50]">Ventas Semanales</h2>
                {reporteSemanal ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-lg text-gray-700">Total De Ventas: <span className="font-semibold">{reporteSemanal[0]?.totalVentas || 0}</span></p>
                        <p className="text-lg text-gray-700">Cantidad de Ventas: <span className="font-semibold">{reporteSemanal[0]?.cantidadVentas || 0}</span></p>
                    </div>
                ) : <p className="text-gray-500">Cargando...</p>}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#4CAF50]">Ventas Anuales</h2>
                {reporteAnual ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-lg text-gray-700">Total Ventas: <span className="font-semibold">{reporteAnual[0]?.totalVentas || 0}</span></p>
                        <p className="text-lg text-gray-700">Cantidad de Ventas: <span className="font-semibold">{reporteAnual[0]?.cantidadVentas || 0}</span></p>
                    </div>
                ) : <p className="text-gray-500">Cargando...</p>}
            </div>

            {renderProductosTable(productosMasVendidos, "Productos Más Vendidos")}
            {renderProductosTable(productosMenosVendidos, "Productos Menos Vendidos")}

            <button 
                onClick={handleDownload} 
                className="mt-6 bg-[#4CAF50] text-white py-2 px-4 rounded-lg"
            >
                Descargar Reporte
            </button>
        </div>
    );
};

export default Reportes;
