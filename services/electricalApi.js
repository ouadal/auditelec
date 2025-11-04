import api from './api';
import axios from 'axios';

// Services pour les Prises Électriques
export const priseElectriqueService = {
  // Récupérer toutes les prises d'une installation
  getByInstallation: async (installationId) => {
    try {
      const response = await api.get(`/prises-electriques?installation_id=${installationId}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des prises:', error);
      throw error;
    }
  },

  // Créer une nouvelle prise
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
      
      // Ajouter les données de base
      Object.keys(priseData).forEach(key => {
        if (key !== 'photos' && priseData[key] !== null && priseData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
          if (typeof priseData[key] === 'boolean') {
            formData.append(key, priseData[key] ? '1' : '0');
          } else {
            formData.append(key, priseData[key]);
          }
        }
      });
      
      // Ajouter les photos avec le bon nom de champ
      if (priseData.photos && priseData.photos.length > 0) {
        priseData.photos.forEach(photo => {
          formData.append('photo_prise[]', photo);
        });
      }
      
      const response = await api.post('/prises-electriques', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la création de la prise:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour une prise
  update: async (id, priseData) => {
    try {
      // Si pas de photos, envoyer en JSON
      if (!priseData.photos || priseData.photos.length === 0) {
        const jsonData = { ...priseData };
        delete jsonData.photos;
        const response = await api.put(`/prises-electriques/${id}`, jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les données de base
      Object.keys(priseData).forEach(key => {
        if (key !== 'photos' && priseData[key] !== null && priseData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
          if (typeof priseData[key] === 'boolean') {
            formData.append(key, priseData[key] ? '1' : '0');
          } else {
            formData.append(key, priseData[key]);
          }
        }
      });
      
      // Ajouter les photos avec le bon nom de champ
      if (priseData.photos && priseData.photos.length > 0) {
        priseData.photos.forEach(photo => {
          formData.append('photo_prise[]', photo);
        });
      }
      
      // Ajouter _method=PUT pour Laravel
      formData.append('_method', 'PUT');
      
      const response = await api.post(`/prises-electriques/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise à jour de la prise:', error);
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

  // Récupérer une prise spécifique
  getById: async (id) => {
    try {
      const response = await api.get(`/prises-electriques/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération de la prise:', error);
      throw error;
    }
  }
};

// Services pour les Interrupteurs
export const interrupteurService = {
  // Récupérer tous les interrupteurs d'une installation
  getByInstallation: async (installationId) => {
    try {
      const response = await api.get(`/interrupteurs?installation_id=${installationId}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des interrupteurs:', error);
      throw error;
    }
  },

  // Créer un nouveau interrupteur
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
      
      // Ajouter les données de base
      Object.keys(interrupteurData).forEach(key => {
        if (key !== 'photos' && interrupteurData[key] !== null && interrupteurData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
          if (typeof interrupteurData[key] === 'boolean') {
            formData.append(key, interrupteurData[key] ? '1' : '0');
          } else {
            formData.append(key, interrupteurData[key]);
          }
        }
      });
      
      // Ajouter les photos avec le bon nom de champ
      if (interrupteurData.photos && interrupteurData.photos.length > 0) {
        interrupteurData.photos.forEach(photo => {
          formData.append('photo_interrupteur[]', photo);
        });
      }
      
      const response = await api.post('/interrupteurs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la création de l\'interrupteur:', error);
      if (error.response) {
        console.warn('Status:', error.response.status);
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour un interrupteur
  update: async (id, interrupteurData) => {
    try {
      // Si pas de photos, envoyer en JSON
      if (!interrupteurData.photos || interrupteurData.photos.length === 0) {
        const jsonData = { ...interrupteurData };
        delete jsonData.photos;
        const response = await api.put(`/interrupteurs/${id}`, jsonData);
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les données de base
      Object.keys(interrupteurData).forEach(key => {
        if (key !== 'photos' && interrupteurData[key] !== null && interrupteurData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
          if (typeof interrupteurData[key] === 'boolean') {
            formData.append(key, interrupteurData[key] ? '1' : '0');
          } else {
            formData.append(key, interrupteurData[key]);
          }
        }
      });
      
      // Ajouter les photos avec le bon nom de champ
      if (interrupteurData.photos && interrupteurData.photos.length > 0) {
        interrupteurData.photos.forEach(photo => {
          formData.append('photo_interrupteur[]', photo);
        });
      }
      
      // Ajouter _method=PUT pour Laravel
      formData.append('_method', 'PUT');
      
      const response = await api.post(`/interrupteurs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise à jour de l\'interrupteur:', error);
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

  // Récupérer un interrupteur spécifique
  getById: async (id) => {
    try {
      const response = await api.get(`/interrupteurs/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'interrupteur:', error);
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
      console.warn('Erreur lors de la récupération des clients:', error);
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
          if (!jsonData[field]?.length) {
            delete jsonData[field];
          }
        });
        
        const response = await api.post('/installations', jsonData);
        return response.data;
      }
      
      // Sinon, envoyer en FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les champs non-photo
      Object.keys(installationData).forEach(key => {
        if (!key.startsWith('photo_')) {
          // Forcer les booléens à être des nombres (1 ou 0)
          const value = typeof installationData[key] === 'boolean' 
            ? (installationData[key] ? 1 : 0) 
            : installationData[key];
          formData.append(key, value);
        }
      });

      // Ajouter un log pour vérifier les données des photos
      console.log('Données des photos avant envoi:', {
        photo_coffret: installationData.photo_coffret,
        photo_cable_electrique: installationData.photo_cable_electrique,
        photo_type_cable: installationData.photo_type_cable,
        photo_barette_coupure: installationData.photo_barette_coupure,
        photo_terre_pc: installationData.photo_terre_pc
      });
      
      // Ajouter les photos
      const photoFields = [
        'photo_coffret',
        'photo_cable_electrique',
        'photo_type_cable',
        'photo_barette_coupure',
        'photo_terre_pc'
      ];
      
      photoFields.forEach(field => {
        if (installationData[field]?.length) {
          installationData[field].forEach(photo => {
            formData.append(`${field}[]`, photo);
          });
        }
      });
      
      const response = await api.post('/installations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'installation:', error);
      if (error.response?.data?.errors) {
        console.error('Détails des erreurs de validation:', error.response.data.errors);
      }
      throw error;
    }
  },

  // Mettre à jour une installation
  update: async (id, installationData) => {
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
          if (!jsonData[field]?.length) {
            delete jsonData[field];
          }
        });
        
        const response = await api.put(`/installations/${id}`, jsonData);
        return response.data;
      }
      
      // Sinon, envoyer en FormData pour les photos avec _method PUT
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les champs non-photo
      Object.keys(installationData).forEach(key => {
        if (!key.startsWith('photo_')) {
          formData.append(key, installationData[key]);
        }
      });
      
      // Ajouter les photos
      const photoFields = [
        'photo_coffret',
        'photo_cable_electrique',
        'photo_type_cable',
        'photo_barette_coupure',
        'photo_terre_pc'
      ];
      
      photoFields.forEach(field => {
        if (installationData[field]?.length) {
          installationData[field].forEach(photo => {
            formData.append(`${field}[]`, photo);
          });
        }
      });
      
      // Ajouter _method=PUT pour Laravel
      formData.append('_method', 'PUT');
      
      const response = await api.post(`/installations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'installation:', error);
      throw error;
    }
  },

  // Supprimer une installation
  delete: async (id) => {
    try {
      const response = await api.delete(`/installations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'installation:', error);
      throw error;
    }
  }
};

// Services pour les Équipements
export const equipementService = {
  // Récupérer tous les équipements
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/equipements', { params });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des équipements:', error);
      throw error;
    }
  },

  // Récupérer un équipement spécifique
  getById: async (id) => {
    try {
      const response = await api.get(`/equipements/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'équipement:', error);
      throw error;
    }
  },

  // Récupérer les détails énergétiques
  getDetailsEnergetiques: async (id) => {
    try {
      const response = await api.get(`/equipements/${id}/details-energetiques`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des détails énergétiques:', error);
      throw error;
    }
  },

  // Créer un nouvel équipement
  create: async (data) => {
    try {
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
        
        const response = await api.post('/equipements', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
      const response = await api.post('/equipements', data);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la création de l\'équipement:', error);
      if (error.response) {
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour un équipement
  update: async (id, data) => {
    try {
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
        
        const response = await api.put(`/equipements/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
      const response = await api.put(`/equipements/${id}`, data);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise à jour de l\'équipement:', error);
      if (error.response) {
        console.warn('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer un équipement
  delete: async (id) => {
    try {
      const response = await api.delete(`/equipements/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la suppression de l\'équipement:', error);
      throw error;
    }
  },

  // Upload de photos (fichiers)
  uploadPhotos: async (id, photos) => {
    try {
      const formData = new FormData();
      photos.forEach(photo => {
        if (photo) formData.append('photo[]', photo);
      });
      const response = await api.post(`/equipements/${id}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de l\'upload des photos:', error);
      throw error;
    }
  },

  // Upload de photos capturées par caméra (base64)
  uploadCameraPhotos: async (id, photos) => {
    try {
      const response = await api.post(`/equipements/${id}/photos-camera`, { photos });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de l\'ajout des photos de la caméra:', error);
      throw error;
    }
  },

  // Calculer l'énergie
  calculerEnergie: async (id) => {
    try {
      const response = await api.post(`/equipements/${id}/calculer-energie`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors du calcul de l\'énergie:', error);
      throw error;
    }
  },

  // Récupérer les types de valeurs
  getTypesValeurs: async () => {
    try {
      const response = await api.get('/equipements/types-valeurs');
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des types de valeurs:', error);
      throw error;
    }
  }
};

// Services pour les Pièces
export const pieceService = {
  // Récupérer toutes les pièces
  getAll: async () => {
    try {
      const response = await api.get('/pieces');
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des pièces:', error);
      throw error;
    }
  },

  // Récupérer une pièce spécifique
  getById: async (id) => {
    try {
      const response = await api.get(`/pieces/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération de la pièce:', error);
      throw error;
    }
  },

  // Récupérer le résumé énergétique d'une pièce
  getResumeEnergetique: async (id) => {
    try {
      const response = await api.get(`/pieces/${id}/resume-energetique`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération du résumé énergétique:', error);
      throw error;
    }
  },

  // Récupérer les résumés énergétiques des pièces
  getResumesEnergetiques: async (batiment_id) => {
    try {
      const response = await api.get('/pieces-resumes-energetiques', {
        params: batiment_id ? { batiment_id } : {}
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des résumés énergétiques:', error);
      throw error;
    }
  },

  // Créer une nouvelle pièce
  create: async (data) => {
    try {
      const response = await api.post('/pieces', data);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la création de la pièce:', error);
      throw error;
    }
  },

  // Mettre à jour une pièce
  update: async (id, data) => {
    try {
      const response = await api.put(`/pieces/${id}`, data);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la mise à jour de la pièce:', error);
      throw error;
    }
  },

  // Supprimer une pièce
  delete: async (id) => {
    try {
      const response = await api.delete(`/pieces/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la suppression de la pièce:', error);
      throw error;
    }
  },

  // Récupérer les pièces d'un bâtiment
  getByBatiment: async (batiment_id) => {
    try {
      const response = await api.get('/pieces', {
        params: { batiment_id }
      });
      return response.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération des pièces du bâtiment:', error);
      throw error;
    }
  }
};
