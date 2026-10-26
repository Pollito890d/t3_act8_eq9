const API_BASE_URL = 'https://dummyjson.com';

// -----------------------------------------------------------
// FASE 1: Autenticación
// -----------------------------------------------------------
export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30, // Opcional: duración de la sesión
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Credenciales inválidas o error en el servidor.');
    }

    return data; // Retorna token, id, username, email, firstName, lastName, image, etc.
  } catch (error) {
    throw new Error(error.message || 'Error de conexión con el servidor de autenticación.');
  }
}

// -----------------------------------------------------------
// FASE 3: Gestión de Productos / Tabla de Datos
// -----------------------------------------------------------

// 1. Obtener productos con paginación y búsqueda
export const getProducts = async (limit = 10, skip = 0, search = '') => {
  let url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;
  
  if (search.trim() !== '') {
    url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Error al obtener los datos de la API');
  }
  return await res.json();
};

// 2. Agregar un nuevo registro (POST)
export const createProduct = async (productData) => {
  const res = await fetch(`${API_BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('Error al crear el registro');
  return await res.json();
};

// 3. Editar un registro (PUT)
export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('Error al actualizar el registro');
  return await res.json();
};

// 4. Eliminar un registro (DELETE)
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar el registro');
  return await res.json();
};