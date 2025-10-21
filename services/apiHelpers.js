import api from "./api";
import axios from "axios";

// Fonctions d'aide pour les appels API
export const apiHelpers = {
  // Pièces
  pieces: {
    getAll: () =>
      axios.get("http://127.0.0.1:8000/api-web/pieces", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    getById: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/pieces/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getResumeEnergetique: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/pieces/${id}/resume-energetique`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getResumesEnergetiques: (batiment_id = null) =>
      axios.get(`http://127.0.0.1:8000/api-web/pieces-resumes-energetiques${batiment_id ? `?batiment_id=${batiment_id}` : ''}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    create: (data) =>
      axios.post("http://127.0.0.1:8000/api-web/pieces", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    update: (id, data) =>
      axios.put(`http://127.0.0.1:8000/api-web/pieces/${id}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    delete: (id) =>
      axios.delete(`http://127.0.0.1:8000/api-web/pieces/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getByBatiment: (batiment_id) =>
      axios.get(
        `http://127.0.0.1:8000/api-web/pieces?batiment_id=${batiment_id}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      ),
  },

  // Clients
  clients: {
    getAll: () =>
      axios.get("http://127.0.0.1:8000/api-web/clients", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    getById: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/clients/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    create: (data) =>
      axios.post("http://127.0.0.1:8000/api-web/clients", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    update: (id, data) =>
      axios.put(`http://127.0.0.1:8000/api-web/clients/${id}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    delete: (id) =>
      axios.delete(`http://127.0.0.1:8000/api-web/clients/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
  },

  // Audits
  audits: {
    getAll: () => api.get("/audits"),
    getById: (id) => api.get(`/audits/${id}`),
    create: (data) => api.post("/audits", data),
    update: (id, data) => api.put(`/audits/${id}`, data),
    delete: (id) => api.delete(`/audits/${id}`),
    getOrCreateForBatiment: (data) => api.post("/audits/get-or-create", data),
  },

  // Bâtiments
  batiments: {
    getAll: () => api.get("/batiments"),
    getAllAvecEnergie: () =>
      axios.get("http://127.0.0.1:8000/api-web/batiments-avec-energie", {
        headers: {
          Accept: "application/json",
        },
      }),
    getById: (id) => api.get(`/batiments/${id}`),
    getResumeEnergetique: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/batiments/${id}/resume-energetique`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getStatistiquesParType: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/batiments/${id}/statistiques-par-type`, {
        headers: {
          Accept: "application/json",
        },
      }),
    create: (data) => api.post("/batiments", data),
    update: (id, data) => api.put(`/batiments/${id}`, data),
    delete: (id) => api.delete(`/batiments/${id}`),
  },

  // Pièces
  pieces: {
    getAll: () =>
      axios.get("http://127.0.0.1:8000/api-web/pieces", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    getById: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/pieces/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getResumeEnergetique: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/pieces/${id}/resume-energetique`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getResumesEnergetiques: (batiment_id = null) =>
      axios.get(`http://127.0.0.1:8000/api-web/pieces-resumes-energetiques${batiment_id ? `?batiment_id=${batiment_id}` : ''}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    create: (data) =>
      axios.post("http://127.0.0.1:8000/api-web/pieces", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    update: (id, data) =>
      axios.put(`http://127.0.0.1:8000/api-web/pieces/${id}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    delete: (id) =>
      axios.delete(`http://127.0.0.1:8000/api-web/pieces/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getByBatiment: (batiment_id) =>
      axios.get(
        `http://127.0.0.1:8000/api-web/pieces?batiment_id=${batiment_id}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      ),
  },

  // Installations
  installations: {
    getAll: () => api.get("/installations"),
    getById: (id) => api.get(`/installations/${id}`),
    create: (data) => api.post("/installations", data),
    update: (id, data) => api.put(`/installations/${id}`, data),
    delete: (id) => api.delete(`/installations/${id}`),
  },

  // Équipements (remplace calculs)
  equipements: {
    getAll: () =>
      axios.get("http://127.0.0.1:8000/api-web/equipements", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    getById: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/equipements/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getDetailsEnergetiques: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/equipements/${id}/details-energetiques`, {
        headers: {
          Accept: "application/json",
        },
      }),
    create: (data) =>
      axios.post("http://127.0.0.1:8000/api-web/equipements", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    update: (id, data) =>
      axios.put(`http://127.0.0.1:8000/api-web/equipements/${id}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    delete: (id) =>
      axios.delete(`http://127.0.0.1:8000/api-web/equipements/${id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    calculerEnergie: (id, data) =>
      axios.post(
        `http://127.0.0.1:8000/api-web/equipements/${id}/calculer-energie`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      ),
  },

  // Types d'équipements
  typesEquipement: {
    getAll: () =>
      axios.get("http://127.0.0.1:8000/api-web/types-equipement", {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      }),
    getById: (id) =>
      axios.get(`http://127.0.0.1:8000/api-web/types-equipement/${id}`, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      }),
    create: async (data) => {
      await apiHelpers.getCsrfToken();
      return axios.post("http://127.0.0.1:8000/api-web/types-equipement", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    update: async (id, data) => {
      await apiHelpers.getCsrfToken();
      return axios.put(`http://127.0.0.1:8000/api-web/types-equipement/${id}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    delete: async (id) => {
      await apiHelpers.getCsrfToken();
      return axios.delete(`http://127.0.0.1:8000/api-web/types-equipement/${id}`, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      });
    },
  },

  // Utilisateurs
  utilisateurs: {
    getAll: () => api.get("/utilisateurs"),
    getById: (id) => api.get(`/utilisateurs/${id}`),
    create: (data) => api.post("/utilisateurs", data),
    update: (id, data) => api.put(`/utilisateurs/${id}`, data),
    delete: (id) => api.delete(`/utilisateurs/${id}`),
  },

  // Statistiques énergétiques
  statistiques: {
    getAll: () =>
      axios.get("http://127.0.0.1:8000/api-web/statistiques", {
        headers: {
          Accept: "application/json",
        },
      }),
    getParType: () =>
      axios.get("http://127.0.0.1:8000/api-web/statistiques/par-type", {
        headers: {
          Accept: "application/json",
        },
      }),
    getParPiece: () =>
      axios.get("http://127.0.0.1:8000/api-web/statistiques/par-piece", {
        headers: {
          Accept: "application/json",
        },
      }),
    getTopConsommateurs: (limite = 10) =>
      axios.get(`http://127.0.0.1:8000/api-web/statistiques/top-consommateurs?limite=${limite}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    getRapportBatiment: (batiment_id) =>
      axios.get(`http://127.0.0.1:8000/api-web/statistiques/rapport-batiment/${batiment_id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
  },

  // Calculs énergétiques avancés
  calculsEnergie: {
    calculerEquipement: (equipement_id, params = {}) =>
      axios.get(`http://127.0.0.1:8000/api-web/calculs-energie/equipement/${equipement_id}`, {
        params,
        headers: {
          Accept: "application/json",
        },
      }),
    simulerScenarios: (equipement_id, scenarios) =>
      axios.post(`http://127.0.0.1:8000/api-web/calculs-energie/equipement/${equipement_id}/scenarios`, 
        { scenarios }, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    calculerPiece: (piece_id) =>
      axios.get(`http://127.0.0.1:8000/api-web/calculs-energie/piece/${piece_id}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    comparerEquipements: (equipements_ids) =>
      axios.post("http://127.0.0.1:8000/api-web/calculs-energie/comparer-equipements", 
        { equipements_ids }, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
  },

  // Rapports énergétiques
  rapports: {
    getRapportComplet: (params = {}) =>
      axios.get("http://127.0.0.1:8000/api-web/rapports/complet", {
        params,
        headers: {
          Accept: "application/json",
        },
      }),
    getRapportPerformance: () =>
      axios.get("http://127.0.0.1:8000/api-web/rapports/performance", {
        headers: {
          Accept: "application/json",
        },
      }),
  },

  // Test de connexion
  test: () => api.get("/test"),
};

export default apiHelpers;
