
const API_BASE_URL = 'https://dummyjson.com';

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