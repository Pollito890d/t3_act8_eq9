import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

export const TablaComandero = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', mesa: '01', mesero: 'David H.', price: '' });
  const [submitting, setSubmitting] = useState(false);

  const meserosList = ['David H.', 'Gael O.', 'Santi M.', 'Sarai L.', 'Melissa H.', 'Ana P.'];
  const estados = ['OCUPADA', 'PIDIENDO CUENTA', 'OCUPADA', 'LIBRE', 'OCUPADA'];

  useEffect(() => {
    fetchData();
  }, [page, limit, search]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * limit;
      const data = await getProducts(limit, skip, search);
      setRecipes(data.recipes || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleLimitChange = (e) => {
    setSearchParams({ page: '1', limit: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams({ page: '1', limit: limit.toString() });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', mesa: '01', mesero: 'David H.', price: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item, index) => {
    setEditingItem(item);
    const mesaNum = String((index % 9) + 1).padStart(2, '0');
    const precioSimulado = (item.caloriesPerServing ? item.caloriesPerServing * 1.5 : 85).toFixed(2);
    
    setFormData({
      name: item.name,
      mesa: mesaNum,
      mesero: meserosList[index % meserosList.length],
      price: precioSimulado,
    });
    setIsModalOpen(true);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Por favor llena los campos obligatorios.');
      return;
    }

    // Mensaje de confirmación obligatorio
    if (editingItem) {
      const confirmar = window.confirm('¿Confirmas que deseas actualizar los datos de esta comanda?');
      if (!confirmar) return;
    }

    setSubmitting(true);
    try {
      const caloriesValue = parseFloat(formData.price) / 1.5;

      if (editingItem) {
        // 1. Petición a la API
        await updateProduct(editingItem.id, {
          name: formData.name,
          caloriesPerServing: caloriesValue,
        });

        // 2. Reflejo en el estado local
        setRecipes((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? { ...item, name: formData.name, caloriesPerServing: caloriesValue }
              : item
          )
        );
      } else {
        // 1. Petición a la API
        await createProduct({
          name: formData.name,
          caloriesPerServing: caloriesValue,
        });

        // 2. Reflejo en el estado local
        const createdItem = {
          id: Date.now(),
          name: formData.name,
          caloriesPerServing: caloriesValue,
        };

        setRecipes((prev) => [createdItem, ...prev]);
        setTotal((prevTotal) => prevTotal + 1);
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error al procesar la comanda');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta comanda?')) return;
    try {
      await deleteProduct(id);
      setRecipes(recipes.filter((item) => item.id !== id));
      setTotal(total - 1);
    } catch (err) {
      alert('Error al eliminar el registro');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ background: '#fdfbf7', padding: '24px', borderRadius: '16px', color: '#4a3b32', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Buscar platillo o bebida..."
          value={search}
          onChange={handleSearchChange}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #e0d6cc',
            width: '280px',
            fontSize: '14px',
            outline: 'none',
            background: '#ffffff'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleOpenCreate}
            style={{
              background: '#d97706',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
            }}
          >
            + Nueva Comanda
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b584c' }}>
            <span>Mostrar:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e0d6cc', background: '#fff', fontWeight: 'bold' }}
            >
              <option value="6">6</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#d97706', fontWeight: 'bold' }}>⏳ Cargando comandas...</div>}
      {error && <div style={{ padding: '20px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '10px', marginBottom: '20px' }}>⚠️ {error}</div>}

      {!loading && !error && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: '#8c7667', textAlign: 'left', fontSize: '12px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px' }}>MESA</th>
                  <th style={{ padding: '12px' }}>ESTADO</th>
                  <th style={{ padding: '12px' }}>PLATILLO / BEBIDA</th>
                  <th style={{ padding: '12px' }}>MESERO</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>PRECIO / ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {recipes.length > 0 ? (
                  recipes.map((item, index) => {
                    const mesaNum = String((index % 9) + 1).padStart(2, '0');
                    const estado = estados[index % estados.length];
                    const mesero = meserosList[index % meserosList.length];
                    const precioSimulado = (item.caloriesPerServing ? item.caloriesPerServing * 1.5 : 85).toFixed(2);

                    return (
                      <tr key={item.id} style={{ background: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '14px', fontWeight: 'bold', color: '#d97706' }}>Mesa {mesaNum}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            background: estado === 'LIBRE' ? '#e6f4ea' : estado === 'OCUPADA' ? '#fef3c7' : '#fce8e6',
                            color: estado === 'LIBRE' ? '#137333' : estado === 'OCUPADA' ? '#b45309' : '#c5221f'
                          }}>
                            {estado}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontWeight: '600', color: '#374151' }}>{item.name}</td>
                        <td style={{ padding: '14px', color: '#4b5563' }}> {mesero}</td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold', color: '#059669', marginRight: '12px' }}>${precioSimulado} MXN</span>
                          <button
                            onClick={() => handleOpenEdit(item, index)}
                            style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginRight: '6px' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No hay comandas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px' }}>
            <span style={{ fontSize: '13px', color: '#7c6a5d' }}>
              Mostrando página <strong>{page}</strong> de <strong>{totalPages || 1}</strong> ({total} totales)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0d6cc', background: page <= 1 ? '#f5f0eb' : '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0d6cc', background: page >= totalPages ? '#f5f0eb' : '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL PARA CREAR/EDITAR */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#4a3b32', marginBottom: '16px' }}>
              {editingItem ? 'Editar Comanda' : 'Nueva Comanda'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b584c' }}>Platillo o Bebida:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Café Americano y Panini"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0d6cc', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b584c' }}>Número de Mesa:</label>
                <select
                  value={formData.mesa}
                  disabled={editingItem !== null} 
                  onChange={(e) => setFormData({ ...formData, mesa: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #e0d6cc', 
                    marginTop: '4px', 
                    background: editingItem !== null ? '#f5f0eb' : '#fff',
                    cursor: editingItem !== null ? 'not-allowed' : 'pointer'
                  }}
                >
                  {['01', '02', '03', '04', '05', '06', '07', '08', '09'].map((m) => (
                    <option key={m} value={m}>Mesa {m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b584c' }}>Mesero Asignado:</label>
                <select
                  value={formData.mesero}
                  disabled={editingItem !== null} // Bloqueado al editar
                  onChange={(e) => setFormData({ ...formData, mesero: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #e0d6cc', 
                    marginTop: '4px', 
                    background: editingItem !== null ? '#f5f0eb' : '#fff',
                    cursor: editingItem !== null ? 'not-allowed' : 'pointer'
                  }}
                >
                  {meserosList.map((mesero) => (
                    <option key={mesero} value={mesero}>{mesero}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b584c' }}>Precio ($ MXN):</label>
                <input
                  type="number"
                  required
                  placeholder="Ej. 95"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0d6cc', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e0d6cc', background: '#f5f0eb', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#d97706', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {submitting ? 'Guardando...' : (editingItem ? 'Actualizar Comanda' : 'Guardar Comanda')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};