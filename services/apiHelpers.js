import api from './api';

// Fonctions d'aide pour les appels API
export const apiHelpers = {
  // Pièces
  pieces: {
    getAll: () => api.get('/pieces'),
    getById: (id) => api.get(`/pieces/${id}`),
    create: (data) => api.post('/pieces', data),
    update: (id, data) => api.put(`/pieces/${id}`, data),
    delete: (id) => api.delete(`/pieces/${id}`),
    getByBatiment: (batiment_id) => api.get(`/pieces?batiment_id=${batiment_id}`),
  },

  // Clients
  clients: {
    getAll: () => api.get('/clients'),
    getById: (id) => api.get(`/clients/${id}`),
    create: (data) => api.post('/clients', data),
    update: (id, data) => api.put(`/clients/${id}`, data),
    delete: (id) => api.delete(`/clients/${id}`),
  },

  // Audits
  audits: {
    getAll: () => api.get('/audits'),
    getById: (id) => api.get(`/audits/${id}`),
    create: (data) => api.post('/audits', data),
    update: (id, data) => api.put(`/audits/${id}`, data),
    delete: (id) => api.delete(`/audits/${id}`),
    getOrCreateForBatiment: (data) => api.post('/audits/get-or-create', data),
  },

  // Bâtiments
  batiments: {
    getAll: () => api.get('/batiments'),
    getById: (id) => api.get(`/batiments/${id}`),
    create: (data) => api.post('/batiments', data),
    update: (id, data) => api.put(`/batiments/${id}`, data),
    delete: (id) => api.delete(`/batiments/${id}`),
  },

  // Équipements
  equipements: {
    getAll: () => api.get('/equipements'),
    getById: (id) => api.get(`/equipements/${id}`),
    create: (data) => api.post('/equipements', data),
    update: (id, data) => api.put(`/equipements/${id}`, data),
    delete: (id) => api.delete(`/equipements/${id}`),
  },

  // Installations
  installations: {
    getAll: () => api.get('/installations'),
    getById: (id) => api.get(`/installations/${id}`),
    create: (data) => api.post('/installations', data),
    update: (id, data) => api.put(`/installations/${id}`, data),
    delete: (id) => api.delete(`/installations/${id}`),
  },

  // Calculs
  calculs: {
    getAll: () => api.get('/calculs'),
    getById: (id) => api.get(`/calculs/${id}`),
    create: (data) => api.post('/calculs', data),
    update: (id, data) => api.put(`/calculs/${id}`, data),
    delete: (id) => api.delete(`/calculs/${id}`),
  },

  // Utilisateurs
  utilisateurs: {
    getAll: () => api.get('/utilisateurs'),
    getById: (id) => api.get(`/utilisateurs/${id}`),
    create: (data) => api.post('/utilisateurs', data),
    update: (id, data) => api.put(`/utilisateurs/${id}`, data),
    delete: (id) => api.delete(`/utilisateurs/${id}`),
  },

  // Test de connexion
  test: () => api.get('/test'),
};

export default apiHelpers;