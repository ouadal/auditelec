import api from './api';

// Fonctions d'authentification
export const auth = {
  // Connexion
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Inscription
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      // Ne pas sauvegarder automatiquement le token après inscription
      // L'utilisateur devra se connecter manuellement
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout() {
    // Déconnexion côté client uniquement pour éviter les erreurs
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Optionnel : essayer de déconnecter côté serveur en arrière-plan
    if (this.getToken()) {
      api.post('/auth/logout').catch(() => {
        // Ignorer silencieusement les erreurs de déconnexion serveur
      });
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtenir le token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Rafraîchir les informations utilisateur
  async refreshUser() {
    try {
      const response = await api.get('/auth/profile');
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};

export default auth;