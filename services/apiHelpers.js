import api from "./api";
import axios from "axios";

// Helpers centralisés pour accéder aux API Laravel sous /api
// Uniformisation: suppression complète des appels vers /api-web

const getCsrfCookie = async () => {
  // Sanctum CSRF cookie (hors /api)
  try {
    await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", { withCredentials: true });
  } catch (e) {
    // Ignorer en dev si déjà présent
  }
};

const apiHelpers = {
  // Test simple
  test: {
    ping: () => api.get("/test"),
  },

  // Clients CRUD
  clients: {
    getAll: () => api.get("/clients"),
    getById: (id) => api.get(`/clients/${id}`),
    create: async (data) => {
      await getCsrfCookie();
      return api.post("/clients", data);
    },
    update: async (id, data) => {
      await getCsrfCookie();
      return api.put(`/clients/${id}`, data);
    },
    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/clients/${id}`);
    },
  },

  // Bâtiments
  batiments: {
    getAll: () => api.get("/batiments"),
    getAllAvecEnergie: () => api.get("/batiments-avec-energie"),
    getById: (id) => api.get(`/batiments/${id}`),
    getResumeEnergetique: (id) => api.get(`/batiments/${id}/resume-energetique`),
    getStatistiquesParType: (id) => api.get(`/batiments/${id}/statistiques-par-type`),
    create: (data) => api.post("/batiments", data),
    update: (id, data) => api.put(`/batiments/${id}`, data),
    delete: (id) => api.delete(`/batiments/${id}`),
  },

  // Pièces
  pieces: {
    getAll: () => api.get("/pieces"),
    getById: (id) => api.get(`/pieces/${id}`),
    getResumeEnergetique: (id) => api.get(`/pieces/${id}/resume-energetique`),
    getResumesEnergetiques: (batiment_id) =>
      api.get("/pieces-resumes-energetiques", { params: batiment_id ? { batiment_id } : {} }),
    create: async (data) => {
      await getCsrfCookie();
      return api.post("/pieces", data);
    },
    update: async (id, data) => {
      await getCsrfCookie();
      return api.put(`/pieces/${id}`, data);
    },
    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/pieces/${id}`);
    },
    getByBatiment: (batiment_id) => api.get("/pieces", { params: { batiment_id } }),
    getAllByBatiment: (batiment_id) => api.get("/pieces", { params: { batiment_id } }),
  },

  // Installations
  installations: {
    getAll: () => api.get("/installations"),
    getById: (id) => api.get(`/installations/${id}`),
    create: async (data) => {
      await getCsrfCookie();
      return api.post("/installations", data);
    },
    update: async (id, data) => {
      await getCsrfCookie();
      return api.put(`/installations/${id}`, data);
    },
    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/installations/${id}`);
    },
  },

  // Équipements
  equipements: {
    getAll: (params = {}) => api.get("/equipements", { params }),
    getById: (id) => api.get(`/equipements/${id}`),
    getDetailsEnergetiques: (id) => api.get(`/equipements/${id}/details-energetiques`),

    create: async (data) => {
      await getCsrfCookie();
      // Si des photos sont présentes (fichiers), utiliser FormData
      const hasRealPhotos = [data.photo1, data.photo2, data.photo3].some(photo => 
        photo && typeof photo === 'object' && 'type' in photo && photo.type?.startsWith('image/')
      );
      
      if (hasRealPhotos) {
        const formData = new FormData();
        // Ajouter les données de base
        Object.keys(data).forEach(key => {
          if (!key.startsWith('photo')) {
            formData.append(key, data[key]);
          }
        });
        // Ajouter uniquement les vraies photos (fichiers) comme tableau
        if (data.photo1 && typeof data.photo1 === 'object' && 'type' in data.photo1) formData.append('photo[]', data.photo1);
        if (data.photo2 && typeof data.photo2 === 'object' && 'type' in data.photo2) formData.append('photo[]', data.photo2);
        if (data.photo3 && typeof data.photo3 === 'object' && 'type' in data.photo3) formData.append('photo[]', data.photo3);
        
        return api.post("/equipements", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return api.post("/equipements", data);
    },

    update: async (id, data) => {
      await getCsrfCookie();
      // Si des photos sont présentes (fichiers), utiliser FormData
      const hasRealPhotos = [data.photo1, data.photo2, data.photo3].some(photo => 
        photo && typeof photo === 'object' && 'type' in photo && photo.type?.startsWith('image/')
      );
      
      if (hasRealPhotos) {
        const formData = new FormData();
        // Ajouter les données de base
        Object.keys(data).forEach(key => {
          if (!key.startsWith('photo')) {
            formData.append(key, data[key]);
          }
        });
        // Ajouter uniquement les vraies photos (fichiers) comme tableau
        if (data.photo1 && typeof data.photo1 === 'object' && 'type' in data.photo1) formData.append('photo[]', data.photo1);
        if (data.photo2 && typeof data.photo2 === 'object' && 'type' in data.photo2) formData.append('photo[]', data.photo2);
        if (data.photo3 && typeof data.photo3 === 'object' && 'type' in data.photo3) formData.append('photo[]', data.photo3);
        
        return api.put(`/equipements/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return api.put(`/equipements/${id}`, data);
    },

    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/equipements/${id}`);
    },

    // Upload de photos (fichiers)
    uploadPhotos: async (id, photos) => {
      await getCsrfCookie();
      const formData = new FormData();
      photos.forEach(photo => {
        if (photo) formData.append('photo[]', photo);
      });
      return api.post(`/equipements/${id}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    // Upload de photos capturées par caméra (base64)
    uploadCameraPhotos: async (id, photos) => {
      await getCsrfCookie();
      return api.post(`/equipements/${id}/photos-camera`, { photos });
    },

    calculerEnergie: (id) => api.post(`/equipements/${id}/calculer-energie`),
    getTypesValeurs: () => api.get("/equipements/types-valeurs"),
  },

  // Types d’équipement
  typesEquipement: {
    getAll: () => api.get("/types-equipements"),
    getById: (id) => api.get(`/types-equipements/${id}`),
    create: async (data) => {
      await getCsrfCookie();
      return api.post("/types-equipements", data);
    },
    update: async (id, data) => {
      await getCsrfCookie();
      return api.put(`/types-equipements/${id}`, data);
    },
    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/types-equipements/${id}`);
    },
  },

  // Utilisateurs
  utilisateurs: {
    getAll: () => api.get("/utilisateurs"),
    getById: (id) => api.get(`/utilisateurs/${id}`),
    create: async (data) => {
      await getCsrfCookie();
      return api.post("/utilisateurs", data);
    },
    update: async (id, data) => {
      await getCsrfCookie();
      return api.put(`/utilisateurs/${id}`, data);
    },
    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/utilisateurs/${id}`);
    },
  },

  // Statistiques énergétiques
  statistiques: {
    getAll: () => api.get("/statistiques"),
    getOverview: () => api.get("/statistiques"),
    getParType: () => api.get("/statistiques/par-type"),
    getParPiece: () => api.get("/statistiques/par-piece"),
    getTopConsommateurs: (limite = 10) =>
      api.get("/statistiques/top-consommateurs", { params: { limite } }),
    getRapportBatiment: (batiment_id) => api.get(`/statistiques/rapport-batiment/${batiment_id}`),
  },

  // Calculs d’énergie avancés
  calculsEnergie: {
    equipement: (equipement_id) => api.get(`/calculs-energie/equipement/${equipement_id}`),
    scenariosEquipement: (equipement_id, payload) =>
      api.post(`/calculs-energie/equipement/${equipement_id}/scenarios`, payload),
    piece: (piece_id) => api.get(`/calculs-energie/piece/${piece_id}`),
    comparerEquipements: (payload) => api.post("/calculs-energie/comparer-equipements", payload),
  },

  // Rapports
  rapports: {
    getRapportComplet: () => api.get("/rapports/complet"),
    getRapportPerformance: () => api.get("/rapports/performance"),
  },

  // Techniciens (si présent côté backend)
  techniciens: {
    getAll: () => api.get("/techniciens"),
    getById: (id) => api.get(`/techniciens/${id}`),
    create: async (data) => {
      await getCsrfCookie();
      return api.post("/techniciens", data);
    },
    update: async (id, data) => {
      await getCsrfCookie();
      return api.put(`/techniciens/${id}`, data);
    },
    delete: async (id) => {
      await getCsrfCookie();
      return api.delete(`/techniciens/${id}`);
    },
    getStatistics: (id) => api.get(`/techniciens/${id}/statistics`),
  },

  // Journaux d’activité
  activityLogs: {
    getAll: (params = {}) => api.get("/activity-logs", { params }),
    getStats: () => api.get("/activity-logs/stats"),
    getById: (id) => api.get(`/activity-logs/${id}`),
  },
};

export default apiHelpers;
export { apiHelpers };







