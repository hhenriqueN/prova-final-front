// src/api.js
// Importa a exportação nomeada 'jwtDecode' e a renomeia para 'jwt_decode'
import { jwtDecode as jwt_decode } from 'jwt-decode';

// O wrapper de compatibilidade não é mais necessário.

// fetch util that gets an access token from Auth0 and calls the API
export async function fetchWithToken(getAccessTokenSilently, url, options = {}) {
// ... existing code ...
  const token = await getAccessTokenSilently({
    audience: import.meta.env.VITE_AUTH0_AUDIENCE
  });
  const headers = {
// ... existing code ...
    Authorization: `Bearer ${token}`
  };
// ... existing code ...
  if (!resp.ok) {
// ... existing code ...
    throw new Error(`${resp.status} ${resp.statusText} - ${text}`);
  }
// ... existing code ...
  if (resp.status === 204) return null;
  return resp.json();
}

// 判断 admin role by decoding the access token
// Restaurando a definição da função que foi escondida
export async function isAdmin(getAccessTokenSilently) {
  try {
    const token = await getAccessTokenSilently({
      audience: import.meta.env.VITE_AUTH0_AUDIENCE
    });
    const payload = jwt_decode(token);
    // Ajuste aqui se você usa um namespace para roles (ex: payload['https://yourapp.com/roles'])
    const roles = payload.roles || payload['roles'] || [];
    return Array.isArray(roles) && roles.includes('admin');
  } catch (e) {
    // Restaurando o conteúdo do catch
    return false;
  }
}