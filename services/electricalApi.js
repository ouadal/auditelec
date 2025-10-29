import api from './api';
import axios from 'axios';

// Services pour les Prises Ã‰lectriques
export const priseElectriqueService = {
  // RÃ©cupÃ©rer toutes les prises d'une installation
  getByInstallation: async (installationId) => {
    try {
      const response = await api.get(`/prises-electriques?installation_id=${installationId}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la rÃ©cupÃ©ration des prises:', error);
      throw error;
    }
  },

  // CrÃ©er une nouvelle prise
  create: async (priseData) => {
    try {
      // Si pas de photos, envoyer en JSON
      if (!priseData.photos || priseData.photos.length === 0) {
        const jsonData = { ...priseData };
        delete jsonData.photos;
        const response = await api.post('/prises-electriques', jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les donnÃ©es de base
      Object.keys(priseData).forEach(key => {
        if (key !== 'photos' && priseData[key] !== null && priseData[key] !== undefined) {
          // Convertir les boolÃ©ens en entiers pour Laravel
          if (typeof priseData[key] === 'boolean') {
            formData.append(key, priseData[key] ? '1' : '0');
          } else {
            formData.append(key, priseData[key]);
          }
        }
      });

      // Ajouter les photos si elles existent
      if (priseData.photos && priseData.photos.length > 0) {
        priseData.photos.forEach((photo, index) => {
          formData.append(`photo_prise[${index}]`, photo);
        });
      }

      const response = await api.post('/prises-electriques', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la crÃ©ation de la prise:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre Ã  jour une prise
  update: async (id, priseData) => {
    try {
      // Si pas de nouvelles photos, utiliser JSON avec PUT direct
      if (!priseData.photos || priseData.photos.length === 0) {
        const jsonData = { ...priseData };
        delete jsonData.photos;
        delete jsonData.id;
        
        // Convertir les boolÃ©ens en entiers pour Laravel
        if (typeof jsonData.avec_terre === 'boolean') {
          jsonData.avec_terre = jsonData.avec_terre ? 1 : 0;
        }
        const response = await api.put(`/prises-electriques/${id}`, jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les donnÃ©es de base
      Object.keys(priseData).forEach(key => {
        if (key !== 'photos' && key !== 'id' && priseData[key] !== null && priseData[key] !== undefined) {
          // Convertir les boolÃ©ens en entiers pour Laravel
          if (typeof priseData[key] === 'boolean') {
            formData.append(key, priseData[key] ? '1' : '0');
          } else {
            formData.append(key, priseData[key]);
          }
        }
      });

      // Ajouter les nouvelles photos
      priseData.photos.forEach((photo, index) => {
        formData.append(`photo_prise[${index}]`, photo);
      });

      const response = await api.post(`/prises-electriques/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise Ã  jour de la prise:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer une prise
  delete: async (id) => {
    try {
      const response = await api.delete(`/prises-electriques/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la suppression de la prise:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // RÃ©cupÃ©rer une prise spÃ©cifique
  getById: async (id) => {
    try {
      const response = await api.get(`/prises-electriques/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la rÃ©cupÃ©ration de la prise:', error);
      throw error;
    }
  }
};

// Services pour les Interrupteurs
export const interrupteurService = {
  // RÃ©cupÃ©rer tous les interrupteurs d'une installation
  getByInstallation: async (installationId) => {
    try {
      const response = await api.get(`/interrupteurs?installation_id=${installationId}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la rÃ©cupÃ©ration des interrupteurs:', error);
      throw error;
    }
  },

  // CrÃ©er un nouveau interrupteur
  create: async (interrupteurData) => {
    try {
      // Si pas de photos, envoyer en JSON
      if (!interrupteurData.photos || interrupteurData.photos.length === 0) {
        const jsonData = { ...interrupteurData };
        delete jsonData.photos;
        const response = await api.post('/interrupteurs', jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les donnÃ©es de base
      Object.keys(interrupteurData).forEach(key => {
        if (key !== 'photos' && interrupteurData[key] !== null && interrupteurData[key] !== undefined) {
          // Convertir les boolÃ©ens en entiers pour Laravel
          if (typeof interrupteurData[key] === 'boolean') {
            formData.append(key, interrupteurData[key] ? '1' : '0');
          } else {
            formData.append(key, interrupteurData[key]);
          }
        }
      });

      // Ajouter les photos si elles existent
      if (interrupteurData.photos && interrupteurData.photos.length > 0) {
        interrupteurData.photos.forEach((photo, index) => {
          formData.append(`photo_interrupteur[${index}]`, photo);
        });
      }

      const response = await api.post('/interrupteurs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la crÃ©ation de l\'interrupteur:', error);
      if (error.response) {
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre Ã  jour un interrupteur
  update: async (id, interrupteurData) => {
    try {
      // Si pas de nouvelles photos, utiliser JSON avec PUT direct
      if (!interrupteurData.photos || interrupteurData.photos.length === 0) {
        const jsonData = { ...interrupteurData };
        delete jsonData.photos;
        delete jsonData.id;
        const response = await api.put(`/interrupteurs/${id}`, jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les donnÃ©es de base
      Object.keys(interrupteurData).forEach(key => {
        if (key !== 'photos' && key !== 'id' && interrupteurData[key] !== null && interrupteurData[key] !== undefined) {
          // Convertir les boolÃ©ens en entiers pour Laravel
          if (typeof interrupteurData[key] === 'boolean') {
            formData.append(key, interrupteurData[key] ? '1' : '0');
          } else {
            formData.append(key, interrupteurData[key]);
          }
        }
      });

      // Ajouter les nouvelles photos
      interrupteurData.photos.forEach((photo, index) => {
        formData.append(`photo_interrupteur[${index}]`, photo);
      });

      const response = await api.post(`/interrupteurs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise Ã  jour de l\'interrupteur:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer un interrupteur
  delete: async (id) => {
    try {
      const response = await api.delete(`/interrupteurs/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la suppression de l\'interrupteur:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // RÃ©cupÃ©rer un interrupteur spÃ©cifique
  getById: async (id) => {
    try {
      const response = await api.get(`/interrupteurs/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la rÃ©cupÃ©ration de l\'interrupteur:', error);
      throw error;
    }
  }
};

// Services pour les Clients
export const clientService = {
  // RÃ©cupÃ©rer tous les clients
  getAll: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la rÃ©cupÃ©ration des clients:', error);
      throw error;
    }
  },

  // RÃ©cupÃ©rer un client spÃ©cifique
  getById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la rÃ©cupÃ©ration du client:', error);
      throw error;
    }
  }
};

// Services pour les Installations
export const installationService = {
  // RÃ©cupÃ©rer toutes les installations d'un client
  getByClient: async (clientId) => {
    try {
      const response = await api.get(`/installations?client_id=${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la rÃ©cupÃ©ration des installations:', error);
      throw error;
    }
  },

  // RÃ©cupÃ©rer toutes les installations
  getAll: async () => {
    try {
      const response = await api.get('/installations');
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la rÃ©cupÃ©ration des installations:', error);
      throw error;
    }
  },

  // CrÃ©er une nouvelle installation
  create: async (installationData) => {
    try {
      // Si pas de photos, envoyer en JSON
      if (!installationData.photo_coffret?.length && 
          !installationData.photo_cable_electrique?.length &&
          !installationData.photo_type_cable?.length &&
          !installationData.photo_barette_coupure?.length &&
          !installationData.photo_terre_pc?.length) {
        
        const jsonData = { ...installationData };
        
        // Supprimer les champs photos vides
        const photoFields = [
          'photo_coffret',
          'photo_cable_electrique', 
          'photo_type_cable',
          'photo_barette_coupure',
          'photo_terre_pc'
        ];
        
        photoFields.forEach(field => {
          delete jsonData[field];
        });

        const response = await api.post('/installations', jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les donnÃ©es de base
      Object.keys(installationData).forEach(key => {
        if (!key.startsWith('photo_') && installationData[key] !== null && installationData[key] !== undefined) {
          // Convertir les boolÃ©ens en entiers pour Laravel
          if (typeof installationData[key] === 'boolean') {
            formData.append(key, installationData[key] ? '1' : '0');
          } else {
            formData.append(key, installationData[key]);
          }
        }
      });

      // Ajouter les photos si elles existent
      const photoFields = [
        'photo_coffret',
        'photo_cable_electrique', 
        'photo_type_cable',
        'photo_barette_coupure',
        'photo_terre_pc'
      ];

      photoFields.forEach(field => {
        if (installationData[field] && installationData[field].length > 0) {
          installationData[field].forEach((photo, index) => {
            formData.append(`${field}[${index}]`, photo);
          });
        }
      });

      const response = await api.post('/installations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la crÃ©ation de l\'installation:', error);
      if (error.response) {
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre Ã  jour une installation
  update: async (id, installationData) => {
    try {
      // Si pas de photos, envoyer en JSON avec PUT
      if (!installationData.photo_coffret?.length && 
          !installationData.photo_cable_electrique?.length &&
          !installationData.photo_type_cable?.length &&
          !installationData.photo_barette_coupure?.length &&
          !installationData.photo_terre_pc?.length) {
        
        const jsonData = { ...installationData };
        
        // Supprimer les champs photos vides
        const photoFields = [
          'photo_coffret',
          'photo_cable_electrique', 
          'photo_type_cable',
          'photo_barette_coupure',
          'photo_terre_pc'
        ];
        
        photoFields.forEach(field => {
          delete jsonData[field];
        });

        const response = await api.put(`/installations/${id}`, jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos avec _method PUT
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les donnÃ©es de base
      Object.keys(installationData).forEach(key => {
        if (!key.startsWith('photo_') && installationData[key] !== null && installationData[key] !== undefined) {
          // Convertir les boolÃ©ens en entiers pour Laravel
          if (typeof installationData[key] === 'boolean') {
            formData.append(key, installationData[key] ? '1' : '0');
          } else {
            formData.append(key, installationData[key]);
          }
        }
      });

      // Ajouter les nouvelles photos si elles existent
      const photoFields = [
        'photo_coffret',
        'photo_cable_electrique', 
        'photo_type_cable',
        'photo_barette_coupure',
        'photo_terre_pc'
      ];

      photoFields.forEach(field => {
        if (installationData[field] && installationData[field].length > 0) {
          installationData[field].forEach((photo, index) => {
            formData.append(`${field}[${index}]`, photo);
          });
        }
      });

      const response = await api.post(`/installations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise à jour de l\'installation:', error);
      if (error.response) {
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer une installation
  delete: async (id) => {
    try {
      const response = await api.delete(`/installations/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la suppression de l\'installation:', error);
      if (error.response) {
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // RÃ©cupÃ©rer une installation spÃ©cifique
  getById: async (id) => {
    try {
      const response = await api.get(`/installations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la rÃ©cupÃ©ration de l\'installation:', error);
      throw error;
    }
  }
};
