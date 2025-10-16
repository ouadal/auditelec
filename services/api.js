import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true, // si tu utilises cookies / Sanctum
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs globales
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      // Rediriger vers la page de connexion si nécessaire
      // window.location.href = '/login';
    }
    
    // Log des erreurs pour le debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
    
    return Promise.reject(error);
  }
);

export default api;
