import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true, // si tu utilises cookies / Sanctum
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Variable pour tracker si le CSRF token a été initialisé
let csrfInitialized = false;

// Fonction pour initialiser le CSRF token
const initializeCsrf = async () => {
  if (!csrfInitialized) {
    try {
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
      csrfInitialized = true;
    } catch (error) {
      console.warn('Impossible d\'initialiser le CSRF token:', error);
    }
  }
};

// Intercepteur pour les requêtes
api.interceptors.request.use(
  async (config) => {
    // Initialiser le CSRF token pour les requêtes POST/PUT/DELETE
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      await initializeCsrf();
    }
    
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
