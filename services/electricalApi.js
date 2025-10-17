import api from './api';
import axios from 'axios';

// Services pour les Prises Électriques
export const priseElectriqueService = {
  // Récupérer toutes les prises d'une installation
  getByInstallation: async (installationId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api-web/prises-electriques?installation_id=${installationId}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des prises:', error);
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
        
        const response = await axios.post('http://127.0.0.1:8000/api-web/prises-electriques', jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
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

      // Ajouter les photos si elles existent
      if (priseData.photos && priseData.photos.length > 0) {
        priseData.photos.forEach((photo, index) => {
          formData.append(`photo_prise[${index}]`, photo);
        });
      }

      const response = await axios.post('http://127.0.0.1:8000/api-web/prises-electriques', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la prise:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour une prise
  update: async (id, priseData) => {
    try {
      // Si pas de nouvelles photos, utiliser JSON avec PUT direct
      if (!priseData.photos || priseData.photos.length === 0) {
        const jsonData = { ...priseData };
        delete jsonData.photos;
        delete jsonData.id;
        
        // Convertir les booléens en entiers pour Laravel
        if (typeof jsonData.avec_terre === 'boolean') {
          jsonData.avec_terre = jsonData.avec_terre ? 1 : 0;
        }
        
        const response = await axios.put(`http://127.0.0.1:8000/api-web/prises-electriques/${id}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les données de base
      Object.keys(priseData).forEach(key => {
        if (key !== 'photos' && key !== 'id' && priseData[key] !== null && priseData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
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

      const response = await axios.post(`http://127.0.0.1:8000/api-web/prises-electriques/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la prise:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer une prise
  delete: async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api-web/prises-electriques/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la prise:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Réponse du serveur:', error.response.data);
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
      console.error('Erreur lors de la récupération de la prise:', error);
      throw error;
    }
  }
};

// Services pour les Interrupteurs
export const interrupteurService = {
  // Récupérer tous les interrupteurs d'une installation
  getByInstallation: async (installationId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api-web/interrupteurs?installation_id=${installationId}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des interrupteurs:', error);
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
        
        const response = await axios.post('http://127.0.0.1:8000/api-web/interrupteurs', jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
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

      // Ajouter les photos si elles existent
      if (interrupteurData.photos && interrupteurData.photos.length > 0) {
        interrupteurData.photos.forEach((photo, index) => {
          formData.append(`photo_interrupteur[${index}]`, photo);
        });
      }

      const response = await axios.post('http://127.0.0.1:8000/api-web/interrupteurs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'interrupteur:', error);
      if (error.response) {
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour un interrupteur
  update: async (id, interrupteurData) => {
    try {
      // Si pas de nouvelles photos, utiliser JSON avec PUT direct
      if (!interrupteurData.photos || interrupteurData.photos.length === 0) {
        const jsonData = { ...interrupteurData };
        delete jsonData.photos;
        delete jsonData.id;
        
        const response = await axios.put(`http://127.0.0.1:8000/api-web/interrupteurs/${id}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les données de base
      Object.keys(interrupteurData).forEach(key => {
        if (key !== 'photos' && key !== 'id' && interrupteurData[key] !== null && interrupteurData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
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

      const response = await axios.post(`http://127.0.0.1:8000/api-web/interrupteurs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'interrupteur:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer un interrupteur
  delete: async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api-web/interrupteurs/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'interrupteur:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Réponse du serveur:', error.response.data);
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
      console.error('Erreur lors de la récupération de l\'interrupteur:', error);
      throw error;
    }
  }
};

// Services pour les Clients
export const clientService = {
  // Récupérer tous les clients
  getAll: async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api-web/clients', {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  // Récupérer un client spécifique
  getById: async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api-web/clients/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      throw error;
    }
  }
};

// Services pour les Installations
export const installationService = {
  // Récupérer toutes les installations d'un client
  getByClient: async (clientId) => {
    try {
      const response = await api.get(`/installations?client_id=${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des installations:', error);
      throw error;
    }
  },

  // Récupérer toutes les installations
  getAll: async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api-web/installations', {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des installations:', error);
      throw error;
    }
  },

  // Créer une nouvelle installation
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

        const response = await axios.post('http://127.0.0.1:8000/api-web/installations', jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos
      const formData = new FormData();
      
      // Ajouter les données de base
      Object.keys(installationData).forEach(key => {
        if (!key.startsWith('photo_') && installationData[key] !== null && installationData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
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

      const response = await axios.post('http://127.0.0.1:8000/api-web/installations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'installation:', error);
      if (error.response) {
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour une installation
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

        const response = await axios.put(`http://127.0.0.1:8000/api-web/installations/${id}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      }
      
      // Sinon utiliser FormData pour les photos avec _method PUT
      const formData = new FormData();
      formData.append('_method', 'PUT');
      
      // Ajouter les données de base
      Object.keys(installationData).forEach(key => {
        if (!key.startsWith('photo_') && installationData[key] !== null && installationData[key] !== undefined) {
          // Convertir les booléens en entiers pour Laravel
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

      const response = await axios.post(`http://127.0.0.1:8000/api-web/installations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'installation:', error);
      if (error.response) {
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Supprimer une installation
  delete: async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api-web/installations/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'installation:', error);
      if (error.response) {
        console.error('Réponse du serveur:', error.response.data);
      }
      throw error;
    }
  },

  // Récupérer une installation spécifique
  getById: async (id) => {
    try {
      const response = await api.get(`/installations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'installation:', error);
      throw error;
    }
  }
};