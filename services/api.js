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

// Util pour obtenir l'origine de l'API à partir de NEXT_PUBLIC_API_URL
const getApiOrigin = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}${u.port ? ':' + u.port : ''}`;
  } catch {
    return 'http://localhost:8000';
  }
};

// Fonction pour initialiser le CSRF token
const initializeCsrf = async () => {
  if (!csrfInitialized) {
    try {
      const origin = getApiOrigin();
      await axios.get(`${origin}/sanctum/csrf-cookie`, {
        withCredentials: true
      });
      csrfInitialized = true;
    } catch (error) {
      console.warn("Impossible d'initialiser le CSRF token:", error);
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
  async (error) => {
    // Gestion des erreurs globales
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }

    // Retry doux sur 429 (Too Many Requests)
    if (error.response?.status === 429 && error.config) {
      const cfg = error.config;
      cfg._retryCount = (cfg._retryCount || 0) + 1;
      if (cfg._retryCount <= MAX_429_RETRIES) {
        const waitMs = INITIAL_429_DELAY_MS * Math.pow(2, cfg._retryCount - 1);
        console.warn(`429 reçu sur ${cfg.url}. Retry #${cfg._retryCount} dans ${waitMs}ms`);
        await delay(waitMs);
        return api.request(cfg);
      }
    }

    // Log des erreurs pour le debugging (warning pour éviter l'overlay Next.js)
    console.warn('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default api;

const MAX_429_RETRIES = 2;
const INITIAL_429_DELAY_MS = 750;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
