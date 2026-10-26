const API_BASE_URL = 'https://dummyjson.com';

// Autenticación 
export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Credenciales inválidas.');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Error de conexión.');
  }
}

// Comandero / Órdenes
export const getProducts = async (limit = 10, skip = 0, search = '') => {
  let url = `${API_BASE_URL}/recipes?limit=${limit}&skip=${skip}`;
  
  if (search.trim() !== '') {
    url = `${API_BASE_URL}/recipes/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener los pedidos.');
  return await res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(`${API_BASE_URL}/recipes/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, { method: 'DELETE' });
  return await res.json();
};