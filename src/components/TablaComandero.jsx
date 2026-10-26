import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';

export const TablaComandero = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, [page, limit, search]);

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

  const totalPages = Math.ceil(total / limit);

  // Lista simulada de meseros para mapear en la tabla estilo Figma
  const meseros = ['David H.', 'Gael O.', 'Santi M.', 'Sarai L.', 'Melissa H.', 'Ana P.'];
  const estados = ['OCUPADA', 'PIDIENDO CUENTA', 'OCUPADA', 'LIBRE', 'OCUPADA'];

  return (
    <div style={{ background: '#fdfbf7', padding: '24px', borderRadius: '16px', color: '#4a3b32' }}>
      {/* FILTROS Y BÚSQUEDA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por platillo, bebida o número de mesa..."
          value={search}
          onChange={handleSearchChange}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #e0d6cc',
            width: '320px',
            fontSize: '14px',
            outline: 'none',
            background: '#ffffff'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b584c' }}>
          <span>Filas por página:</span>
          <select
            value={limit}
            onChange={handleLimitChange}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e0d6cc',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            <option value="6">6</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#d97706', fontWeight: 'bold' }}>⏳ Cargando comandas de la cafetería...</div>}
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
                  <th style={{ padding: '12px' }}>MESERO ASIGNADO</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>COMANDA ACTUAL</th>
                </tr>
              </thead>
              <tbody>
                {recipes.length > 0 ? (
                  recipes.map((item, index) => {
                    const mesaNum = String((index % 8) + 1).padStart(2, '0');
                    const estado = estados[index % estados.length];
                    const mesero = meseros[index % meseros.length];
                    const precioSimulado = (item.caloriesPerServing * 1.5).toFixed(2);

                    return (
                      <tr key={item.id} style={{ background: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '14px', fontWeight: 'bold', color: '#d97706' }}>
                          Mesa {mesaNum}
                        </td>
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
                        <td style={{ padding: '14px', fontWeight: '600', color: '#374151' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '14px', color: '#4b5563' }}>
                          👤 {mesero}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right', fontWeight: 'bold', color: '#111827' }}>
                          #{1000 + item.id} <br />
                          <small style={{ color: '#059669', fontSize: '13px' }}>${precioSimulado} MXN</small>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                      No se encontraron comandas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* CONTROLES DE PAGINACIÓN */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px' }}>
            <span style={{ fontSize: '13px', color: '#7c6a5d' }}>
              Mostrando página <strong>{page}</strong> de <strong>{totalPages || 1}</strong> ({total} registros registrados)
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e0d6cc',
                  background: page <= 1 ? '#f5f0eb' : '#ffffff',
                  color: page <= 1 ? '#b0a296' : '#4a3b32',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e0d6cc',
                  background: page >= totalPages ? '#f5f0eb' : '#ffffff',
                  color: page >= totalPages ? '#b0a296' : '#4a3b32',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};