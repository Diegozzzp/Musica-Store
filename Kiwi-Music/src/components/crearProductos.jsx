import React, { useEffect, useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'https://musica-store.vercel.app';

const CrearProducto = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: '',
    descripcion: '',
    descuento: '',
    tipo: 'otros',
    tallas: '',
    esProximamente: false,
    fechaLlegada: '',
    imagenes: []
  });
  const [error, setError] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  const categoriaSeleccionada = useMemo(
    () => categorias.find((categoria) => categoria._id === form.categoria),
    [categorias, form.categoria]
  );

  const categoriaEsProximamente = categoriaSeleccionada?.nombre?.toLowerCase().includes('proximamente');
  const esPreorden = form.esProximamente || categoriaEsProximamente;

  useEffect(() => {
    if (!isOpen) return;

    const obtenerCategorias = async () => {
      setLoadingCategorias(true);

      try {
        const response = await axios.get(`${API_URL}/categorias`, {
          params: { page: 1, limit: 100 }
        });

        setCategorias(response.data.docs || response.data || []);
      } catch (error) {
        console.error('Error al obtener categorias:', error);
        setError((prevError) => ({
          ...prevError,
          categoria: 'No se pudieron cargar las categorias'
        }));
      } finally {
        setLoadingCategorias(false);
      }
    };

    obtenerCategorias();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;

    if (name === 'imagenes') {
      const nextFiles = Array.from(files || []);
      setSelectedFiles(nextFiles);
      setForm((prevForm) => ({ ...prevForm, imagenes: nextFiles }));
      return;
    }

    if (name === 'esProximamente') {
      setForm((prevForm) => ({ ...prevForm, esProximamente: checked }));
      return;
    }

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    const newError = {};

    if (!form.nombre || !form.precio || form.cantidad === '' || !form.categoria || !form.descripcion || form.descuento === '') {
      newError.general = 'Completa los campos obligatorios.';
    }

    if (isNaN(form.precio) || Number(form.precio) <= 0) {
      newError.precio = 'El precio debe ser un numero positivo';
    }

    if (isNaN(form.cantidad) || Number(form.cantidad) < 0 || (!esPreorden && Number(form.cantidad) <= 0)) {
      newError.cantidad = 'La cantidad debe ser mayor a 0, excepto en productos proximamente';
    }

    if (form.tipo === 'ropa' && !form.tallas) {
      newError.tallas = 'Las tallas son obligatorias para productos de tipo ropa';
    }

    if (esPreorden && !form.fechaLlegada) {
      newError.fechaLlegada = 'La fecha de llegada es obligatoria para productos proximamente';
    }

    if (form.tipo === 'ropa' && form.tallas) {
      const tallasArray = form.tallas.split(',').map((talla) => talla.trim());
      if (!tallasArray.every((talla) => ['S', 'M', 'L', 'XL'].includes(talla))) {
        newError.tallas = 'Las tallas deben ser S, M, L, XL y separadas por comas';
      }
    }

    return newError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const data = new FormData();
    data.append('nombre', form.nombre);
    data.append('precio', form.precio);
    data.append('cantidad', form.cantidad);
    data.append('categoria', form.categoria);
    data.append('descripcion', form.descripcion);
    data.append('descuento', form.descuento);
    data.append('tipo', form.tipo);
    data.append('esProximamente', String(esPreorden));
    data.append('fechaLlegada', form.fechaLlegada);

    if (form.tipo === 'ropa') {
      form.tallas.split(',').map((talla) => talla.trim()).forEach((talla) => data.append('tallas[]', talla));
    }

    selectedFiles.forEach((file) => {
      data.append('imagenes', file);
    });

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#547980]">Administracion</p>
            <h2 className="mt-1 text-2xl font-black text-[#17252a]">Crear producto</h2>
          </div>
          <button onClick={onClose} className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label="Cerrar">
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error.general && <p className="rounded bg-red-50 p-3 text-sm font-semibold text-red-600">{error.general}</p>}

          <section className="rounded border border-gray-100 bg-[#f7f5f0] p-5">
            <h3 className="mb-4 text-lg font-black text-[#17252a]">Informacion principal</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nombre" error={error.nombre}>
                <input name="nombre" value={form.nombre} placeholder="Nombre del cantante completo" onChange={handleChange} className="product-input" />
              </Field>
              <Field label="Categoria" error={error.categoria}>
                <select name="categoria" value={form.categoria} onChange={handleChange} disabled={loadingCategorias} className="product-input bg-white">
                  <option value="">{loadingCategorias ? 'Cargando categorias...' : 'Selecciona una categoria'}</option>
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.nombre} - {categoria._id}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Descripcion" error={error.descripcion} className="md:col-span-2">
                <textarea name="descripcion" placeholder="Ejem: Shawn - CASSETTES, X's - CASSETTES, etc..." value={form.descripcion} onChange={handleChange} rows="4" className="product-input resize-none" />
              </Field>
            </div>
            {categoriaSeleccionada && (
              <div className="mt-4 rounded border border-gray-200 bg-white p-3 text-sm text-gray-700">
                <p className="font-black text-[#17252a]">{categoriaSeleccionada.nombre}</p>
                <p className="break-all text-gray-500">ID: {categoriaSeleccionada._id}</p>
              </div>
            )}
          </section>

          <section className="rounded border border-gray-100 p-5">
            <h3 className="mb-4 text-lg font-black text-[#17252a]">Precio e inventario</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Precio" error={error.precio}>
                <input type="number" name="precio" value={form.precio} onChange={handleChange} className="product-input" />
              </Field>
              <Field label="Cantidad" error={error.cantidad}>
                <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} className="product-input" />
              </Field>
              <Field label="Descuento (%)" error={error.descuento}>
                <input type="number" name="descuento" value={form.descuento} onChange={handleChange} className="product-input" />
              </Field>
            </div>
          </section>

          <section className="rounded border border-gray-100 p-5">
            <h3 className="mb-4 text-lg font-black text-[#17252a]">Tipo y disponibilidad</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tipo" error={error.tipo}>
                <select name="tipo" value={form.tipo} onChange={handleChange} className="product-input bg-white">
                  <option value="otros">Otros</option>
                  <option value="ropa">Ropa</option>
                </select>
              </Field>
              {form.tipo === 'ropa' && (
                <Field label="Tallas" error={error.tallas}>
                  <input name="tallas" value={form.tallas} onChange={handleChange} placeholder="S, M, L, XL" className="product-input" />
                </Field>
              )}
            </div>

            <div className="mt-5 rounded border border-gray-200 bg-gray-50 p-4">
              <label className="flex items-center gap-3 font-black text-[#17252a]">
                <input type="checkbox" name="esProximamente" checked={form.esProximamente} onChange={handleChange} className="h-4 w-4" />
                Producto proximamente / preorden
              </label>
              <p className="mt-2 text-xs text-gray-500">Tambien se activa si eliges una categoria llamada Proximamente.</p>
              {esPreorden && (
                <Field label="Fecha estimada de llegada" error={error.fechaLlegada} className="mt-4">
                  <input type="date" name="fechaLlegada" value={form.fechaLlegada} onChange={handleChange} className="product-input" />
                </Field>
              )}
            </div>
          </section>

          <section className="rounded border border-gray-100 p-5">
            <h3 className="mb-4 text-lg font-black text-[#17252a]">Imagenes</h3>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-[#f7f5f0] px-4 py-8 text-center hover:border-[#547980]">
              <span className="font-black text-[#17252a]">Seleccionar imagenes</span>
              <span className="mt-1 text-sm text-gray-500">{selectedFiles.length ? `${selectedFiles.length} archivo(s) seleccionado(s)` : 'Puedes subir hasta 5 imagenes'}</span>
              <input type="file" name="imagenes" multiple onChange={handleChange} className="hidden" />
            </label>
          </section>

          <div className="sticky bottom-0 -mx-6 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
            <button type="button" onClick={onClose} className="rounded border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="kiwi-button rounded px-5 py-3 text-sm">
              Crear producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, error, className = '', children }) => (
  <div className={className}>
    <label className="mb-1 block text-sm font-black text-[#17252a]">{label}</label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default CrearProducto;
