"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../../../services/apiHelpers";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  Save,
  X,
  Building,
  MapPin,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

interface Equipement {
  id: number;
  nom_equipement: string;
  piece_id: number;
  type_equipement_id: number;
  nombre: number;
  valeur_mesuree: number;
  type_valeur: string;
  tension?: number;
  courant?: number;
  facteur_puissance: number;
  heures_utilisation_jour: number;
  // Temps détaillés par jour
  lundi_diurne?: number;
  lundi_nocturne?: number;
  mardi_diurne?: number;
  mardi_nocturne?: number;
  mercredi_diurne?: number;
  mercredi_nocturne?: number;
  jeudi_diurne?: number;
  jeudi_nocturne?: number;
  vendredi_diurne?: number;
  vendredi_nocturne?: number;
  samedi_diurne?: number;
  samedi_nocturne?: number;
  dimanche_diurne?: number;
  dimanche_nocturne?: number;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  piece?: { nom_piece: string; batiment?: { nom_batiment: string } };
  type_equipement?: { nom: string };
  energie_avec_unite?: string;
  energie_mensuelle_avec_unite?: string;
  energie_annuelle_avec_unite?: string;
}

interface Piece {
  batiment_nom: any;
  nom_batiment: any;
  name: string;
  id: number;
  nom_piece: string;
  level: string;
  manager: string;
  batiment?: {
    id?: number;
    nom_batiment: string;
  };
  equipements?: Array<{
    id: number;
    nom_equipement: string;
    type_equipement?: {
      id: number;
      nom: string;
      icone?: string;
    };
  }>;
}

interface TypeEquipement {
  id: number;
  nom: string;
}

export default function EquipementsPage() {
  const { toast } = useToast();

  // États
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [typesEquipement, setTypesEquipement] = useState<TypeEquipement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Modal détails énergétiques
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [loadingEnergyDetails, setLoadingEnergyDetails] = useState(false);
  const [energyDetails, setEnergyDetails] = useState<any>(null);

  // Dialog de suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [equipementToDelete, setEquipementToDelete] = useState<number | null>(
    null
  );

  // Modal galerie photos
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);

  // Formulaire
  const [formData, setFormData] = useState({
    nom_equipement: "",
    piece_id: 0,
    type_equipement_id: 0,
    nombre: 1,
    valeur_mesuree: 0,
    type_valeur: "puissance",
    tension: 0,
    courant: 0,
    facteur_puissance: 1.0,
    heures_utilisation_jour: 8,
    photo1: "",
    photo2: "",
    photo3: "",
    // Temps détaillés par jour
    lundi_diurne: 0,
    lundi_nocturne: 0,
    mardi_diurne: 0,
    mardi_nocturne: 0,
    mercredi_diurne: 0,
    mercredi_nocturne: 0,
    jeudi_diurne: 0,
    jeudi_nocturne: 0,
    vendredi_diurne: 0,
    vendredi_nocturne: 0,
    samedi_diurne: 0,
    samedi_nocturne: 0,
    dimanche_diurne: 0,
    dimanche_nocturne: 0,
  });

  // État pour la prévisualisation des photos
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(["", "", ""]);

  // Charger les données
  const loadData = async () => {
    try {
      console.log('Début du chargement des données...');
      
      const [equipementsRes, piecesRes, typesRes] = await Promise.all([
        apiHelpers.equipements.getAll(),
        apiHelpers.pieces.getAll(),
        apiHelpers.typesEquipement.getAll(),
      ]);

      console.log('Résultat équipements:', equipementsRes);
      console.log('Résultat pièces:', piecesRes);
      console.log('Résultat types:', typesRes);

      // Debug: vérifier la structure exacte des données
      console.log('Structure equipementsRes.data:', equipementsRes.data);
      console.log('Type de equipementsRes.data:', typeof equipementsRes.data);
      console.log('Est-ce un tableau?', Array.isArray(equipementsRes.data));
      console.log('Structure typesRes.data:', typesRes.data);

      // Corriger l'accès aux données basé sur la structure réelle de l'API
      setEquipements(equipementsRes.data?.data || []);
      setPieces(piecesRes.data || []);
      setTypesEquipement(typesRes.data?.data || []);
      
      // Debug: vérifier les données des pièces
      console.log('Pièces chargées:', piecesRes.data);
      console.log('Structure des pièces:', piecesRes.data?.[0]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de chargement",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    // Debug: vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    console.log('Token présent:', !!token);
    console.log('Utilisateur présent:', !!user);
    
    if (token) {
      console.log('Token:', token.substring(0, 20) + '...');
    }
    if (user) {
      console.log('Utilisateur:', JSON.parse(user));
    }
    
    loadData();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom_equipement: "",
      piece_id: 0,
      type_equipement_id: 0,
      nombre: 1,
      valeur_mesuree: 0,
      type_valeur: "puissance",
      tension: 0,
      courant: 0,
      facteur_puissance: 1.0,
      heures_utilisation_jour: 8,
      photo1: "",
      photo2: "",
      photo3: "",
      // Temps détaillés par jour
      lundi_diurne: 0,
      lundi_nocturne: 0,
      mardi_diurne: 0,
      mardi_nocturne: 0,
      mercredi_diurne: 0,
      mercredi_nocturne: 0,
      jeudi_diurne: 0,
      jeudi_nocturne: 0,
      vendredi_diurne: 0,
      vendredi_nocturne: 0,
      samedi_diurne: 0,
      samedi_nocturne: 0,
      dimanche_diurne: 0,
      dimanche_nocturne: 0,
    });
    setPhotoPreviews(["", "", ""]);
    setEditingId(null);
    setShowForm(false);
  };

  // Nouveau
  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Gérer le changement de photo
  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    photoIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une image valide",
          variant: "destructive",
        });
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newPreviews = [...photoPreviews];
        newPreviews[photoIndex] = base64String;
        setPhotoPreviews(newPreviews);

        // Stocker le fichier dans formData
        const photoKey = `photo${photoIndex + 1}` as keyof typeof formData;
        setFormData({ ...formData, [photoKey]: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer une photo
  const removePhoto = (photoIndex: number) => {
    const newPreviews = [...photoPreviews];
    newPreviews[photoIndex] = "";
    setPhotoPreviews(newPreviews);

    const photoKey = `photo${photoIndex + 1}` as "photo1" | "photo2" | "photo3";
    setFormData({ ...formData, [photoKey]: "" });
  };

  // Gérer la capture de photo par caméra
  const handleCameraCapture = async (photoIndex: number, photoData: string) => {
    // Convertir le base64 en Blob
    const base64Data = photoData.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Créer un fichier à partir du Blob
    const file = new File([blob], `camera_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });

    // Mettre à jour la prévisualisation
    const newPreviews = [...photoPreviews];
    newPreviews[photoIndex] = photoData;
    setPhotoPreviews(newPreviews);

    // Mettre à jour le formulaire avec le fichier
    const photoKey = `photo${photoIndex + 1}` as "photo1" | "photo2" | "photo3";
    setFormData({ ...formData, [photoKey]: file });
  };

  // Modifier
  const handleEdit = async (equipement: Equipement) => {
    // Récupérer les détails complets de l'équipement pour avoir les URLs des photos
    try {
      const response = await apiHelpers.equipements.getById(equipement.id);
      const equipementDetails = response.data.data;
      console.log("Détails de l'équipement:", equipementDetails);

      // Convertir le tableau de photos en photo1, photo2, photo3
      const photos = equipementDetails.photos || [];
      console.log("Photos de l'équipement:", photos);

      setFormData({
        nom_equipement: equipement.nom_equipement,
        piece_id: equipement.piece_id,
        type_equipement_id: equipement.type_equipement_id,
        nombre: equipement.nombre,
        valeur_mesuree: equipement.valeur_mesuree,
        type_valeur: equipement.type_valeur,
        tension: equipement.tension || 0,
        courant: equipement.courant || 0,
        facteur_puissance: equipement.facteur_puissance,
        heures_utilisation_jour: equipement.heures_utilisation_jour,
        photo1: photos[0] || "",
        photo2: photos[1] || "",
        photo3: photos[2] || "",
        // Temps détaillés par jour
        lundi_diurne: equipement.lundi_diurne || 0,
        lundi_nocturne: equipement.lundi_nocturne || 0,
        mardi_diurne: equipement.mardi_diurne || 0,
        mardi_nocturne: equipement.mardi_nocturne || 0,
        mercredi_diurne: equipement.mercredi_diurne || 0,
        mercredi_nocturne: equipement.mercredi_nocturne || 0,
        jeudi_diurne: equipement.jeudi_diurne || 0,
        jeudi_nocturne: equipement.jeudi_nocturne || 0,
        vendredi_diurne: equipement.vendredi_diurne || 0,
        vendredi_nocturne: equipement.vendredi_nocturne || 0,
        samedi_diurne: equipement.samedi_diurne || 0,
        samedi_nocturne: equipement.samedi_nocturne || 0,
        dimanche_diurne: equipement.dimanche_diurne || 0,
        dimanche_nocturne: equipement.dimanche_nocturne || 0,
      });

      // Mettre à jour les prévisualisations avec les URLs des photos existantes
      setPhotoPreviews([
        photos[0] || "",
        photos[1] || "",
        photos[2] || "",
      ]);

      setEditingId(equipement.id);
      setShowForm(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des détails",
        variant: "destructive",
      });
    }
  };

  // Sauvegarder
  const handleSave = async () => {
    if (
      !formData.nom_equipement ||
      formData.piece_id === 0 ||
      formData.type_equipement_id === 0
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Créer un FormData pour envoyer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les champs de base
      formDataToSend.append('nom_equipement', formData.nom_equipement);
      formDataToSend.append('piece_id', formData.piece_id.toString());
      formDataToSend.append('type_equipement_id', formData.type_equipement_id.toString());
      formDataToSend.append('nombre', formData.nombre.toString());
      formDataToSend.append('valeur_mesuree', formData.valeur_mesuree.toString());
      formDataToSend.append('type_valeur', formData.type_valeur);
      formDataToSend.append('tension', (formData.tension || 0).toString());
      formDataToSend.append('courant', (formData.courant || 0).toString());
      formDataToSend.append('facteur_puissance', formData.facteur_puissance.toString());
      formDataToSend.append('heures_utilisation_jour', formData.heures_utilisation_jour.toString());
      
      // Ajouter les temps détaillés par jour
      formDataToSend.append('lundi_diurne', formData.lundi_diurne.toString());
      formDataToSend.append('lundi_nocturne', formData.lundi_nocturne.toString());
      formDataToSend.append('mardi_diurne', formData.mardi_diurne.toString());
      formDataToSend.append('mardi_nocturne', formData.mardi_nocturne.toString());
      formDataToSend.append('mercredi_diurne', formData.mercredi_diurne.toString());
      formDataToSend.append('mercredi_nocturne', formData.mercredi_nocturne.toString());
      formDataToSend.append('jeudi_diurne', formData.jeudi_diurne.toString());
      formDataToSend.append('jeudi_nocturne', formData.jeudi_nocturne.toString());
      formDataToSend.append('vendredi_diurne', formData.vendredi_diurne.toString());
      formDataToSend.append('vendredi_nocturne', formData.vendredi_nocturne.toString());
      formDataToSend.append('samedi_diurne', formData.samedi_diurne.toString());
      formDataToSend.append('samedi_nocturne', formData.samedi_nocturne.toString());
      formDataToSend.append('dimanche_diurne', formData.dimanche_diurne.toString());
      formDataToSend.append('dimanche_nocturne', formData.dimanche_nocturne.toString());

      // Ajouter les photos si elles existent
      const photos = [formData.photo1, formData.photo2, formData.photo3].filter(Boolean);
      photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append('photo[]', photo);
        } else if (typeof photo === 'string' && photo.startsWith('http')) {
          // Si c'est une URL existante, on ne l'envoie pas car elle existe déjà sur le serveur
          console.log(`Photo ${index + 1} est une URL existante:`, photo);
        }
      });

      console.log("FormData à envoyer:", Object.fromEntries(formDataToSend.entries()));

      if (editingId) {
        await apiHelpers.equipements.update(editingId, formDataToSend);
        toast({ title: "Succès", description: "Équipement modifié" });
      } else {
        await apiHelpers.equipements.create(formDataToSend);
        toast({ title: "Succès", description: "Équipement créé" });
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le dialog de suppression
  const openDeleteDialog = (id: number) => {
    setEquipementToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!equipementToDelete) return;

    setLoading(true);
    try {
      await apiHelpers.equipements.delete(equipementToDelete);
      toast({ title: "Succès", description: "Équipement supprimé" });
      await loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setEquipementToDelete(null);
    }
  };

  // Détails énergétiques
  const handleEnergyDetails = async (id: number) => {
    setShowEnergyModal(true);
    setLoadingEnergyDetails(true);
    setEnergyDetails(null);

    try {
      const response = await apiHelpers.equipements.getDetailsEnergetiques(id);
      if (response.data?.success) {
        setEnergyDetails(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails",
        variant: "destructive",
      });
      setShowEnergyModal(false);
    } finally {
      setLoadingEnergyDetails(false);
    }
  };

  const closeEnergyModal = () => {
    setShowEnergyModal(false);
    setEnergyDetails(null);
  };

  // Ouvrir la galerie de photos
  const openPhotoGallery = (photos: string[]) => {
    setCurrentPhotos(photos.filter(Boolean));
    setShowPhotoGallery(true);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Équipements & Énergie</h1>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Équipement
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Modifier l'Équipement" : "Nouvel Équipement"}
              <Button variant="outline" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <Label>Nom de l'équipement *</Label>
                <Input
                  value={formData.nom_equipement}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_equipement: e.target.value })
                  }
                  placeholder="ex: Climatiseur Split"
                />
              </div>

              {/* Pièce */}
              <div>
                <Label>Pièce *</Label>
                <Select
                  value={
                    formData.piece_id > 0 ? formData.piece_id.toString() : ""
                  }
                  onValueChange={(value) =>
                    setFormData({ ...formData, piece_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une pièce" />
                  </SelectTrigger>
                  <SelectContent>
                    {pieces.map((piece) => {
                      console.log('Piece dans le selecteur - structure complète:', piece);
                      
                      // Gérer différentes structures de données pour les noms de pièces
                      const nomPiece = piece.name || 'Pièce sans nom';
                      
                      // Gérer différentes structures de données pour les bâtiments
                      let nomBatiment = '';
                      
                      if (piece.batiment?.nom_batiment) {
                        nomBatiment = ` - ${piece.batiment.nom_batiment}`;
                      } else if (piece.nom_batiment) {
                        // Si le nom du bâtiment est directement sur l'objet pièce
                        nomBatiment = ` - ${piece.nom_batiment}`;
                      } else if (piece.batiment_nom) {
                        // Autre format possible
                        nomBatiment = ` - ${piece.batiment_nom}`;
                      }
                      
                      const texteAffiche = `${nomPiece}${nomBatiment}`;
                      console.log('Texte à afficher:', texteAffiche);
                      
                      return (
                        <SelectItem key={piece.id} value={piece.id.toString()}>
                          {texteAffiche}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Type d'équipement */}
              <div>
                <Label>Type d'équipement *</Label>
                <Select
                  value={
                    formData.type_equipement_id > 0
                      ? formData.type_equipement_id.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type_equipement_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesEquipement.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nombre */}
              <div>
                <Label>Nombre d'unités</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Type de mesure */}
              <div>
                <Label>Type de mesure</Label>
                <Select
                  value={formData.type_valeur}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type_valeur: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puissance">Puissance (W)</SelectItem>
                    <SelectItem value="courant">Courant (A)</SelectItem>
                    <SelectItem value="tension">Tension (V)</SelectItem>
                    <SelectItem value="energie">Énergie (kWh/an)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Valeur mesurée */}
              <div>
                <Label>Valeur mesurée</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.valeur_mesuree}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valeur_mesuree: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Champ supplémentaire pour la tension quand le type est courant */}
              {formData.type_valeur === "courant" && (
                <div>
                  <Label>Tension (V)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.tension || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tension: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="230"
                  />
                </div>
              )}

              {/* Champ supplémentaire pour le courant quand le type est tension */}
              {formData.type_valeur === "tension" && (
                <div>
                  <Label>Intensité (A)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.courant || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courant: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="16"
                  />
                </div>
              )}

              {/* Heures d'utilisation */}
              <div>
                <Label>Heures d'utilisation par jour</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={formData.heures_utilisation_jour}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heures_utilisation_jour: parseFloat(e.target.value) || 8,
                    })
                  }
                />
              </div>

              {/* Facteur de puissance */}
              <div>
                <Label>Facteur de puissance</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.facteur_puissance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facteur_puissance: parseFloat(e.target.value) || 1.0,
                    })
                  }
                />
              </div>
            </div>

            {/* Photos de l'équipement */}
            <div className="space-y-4">
              <Label className="text-base">
                Photos de l'équipement (3 max)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Photo {index + 1}
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(e, index)}
                        className="cursor-pointer text-xs"
                      />
                      {photoPreviews[index] ? (
                        <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-muted group">
                          <img
                            src={photoPreviews[index]}
                            alt={`Prévisualisation ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                          <ImageIcon className="h-8 w-8 mb-2" />
                          <span className="text-xs">Aucune image</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Format: JPG, PNG, GIF (max 5MB par image)
              </p>
            </div>

            {/* Section Temps d'Utilisation Détaillé */}
            <div className="space-y-4 mt-6">
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">
                  Temps d'Utilisation Détaillé
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez les heures d'utilisation pour chaque jour de la
                  semaine (diurne: 6h-18h, nocturne: 18h-6h)
                </p>

                {/* Jours de la semaine */}
                <div className="space-y-4">
                  {[
                    { key: "lundi", label: "Lundi" },
                    { key: "mardi", label: "Mardi" },
                    { key: "mercredi", label: "Mercredi" },
                    { key: "jeudi", label: "Jeudi" },
                    { key: "vendredi", label: "Vendredi" },
                    { key: "samedi", label: "Samedi" },
                    { key: "dimanche", label: "Dimanche" },
                  ].map((jour) => (
                    <div
                      key={jour.key}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                    >
                      <div className="font-medium">{jour.label}</div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Diurne (6h-18h)
                        </Label>
                        <div className="flex">
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            max="12"
                            value={
                              formData[
                                `${jour.key}_diurne` as keyof typeof formData
                              ] as number
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`${jour.key}_diurne`]:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="rounded-r-none text-sm"
                          />
                          <div className="flex items-center px-2 bg-muted border border-l-0 rounded-r-md text-xs">
                            h
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Nocturne (18h-6h)
                        </Label>
                        <div className="flex">
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            max="12"
                            value={
                              formData[
                                `${jour.key}_nocturne` as keyof typeof formData
                              ] as number
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`${jour.key}_nocturne`]:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="rounded-r-none text-sm"
                          />
                          <div className="flex items-center px-2 bg-muted border border-l-0 rounded-r-md text-xs">
                            h
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Résumé hebdomadaire */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    Résumé Hebdomadaire
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Total diurne:
                      </span>
                      <span className="ml-2 font-medium">
                        {(
                          (formData.lundi_diurne || 0) +
                          (formData.mardi_diurne || 0) +
                          (formData.mercredi_diurne || 0) +
                          (formData.jeudi_diurne || 0) +
                          (formData.vendredi_diurne || 0) +
                          (formData.samedi_diurne || 0) +
                          (formData.dimanche_diurne || 0)
                        ).toFixed(1)}
                        h
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Total nocturne:
                      </span>
                      <span className="ml-2 font-medium">
                        {(
                          (formData.lundi_nocturne || 0) +
                          (formData.mardi_nocturne || 0) +
                          (formData.mercredi_nocturne || 0) +
                          (formData.jeudi_nocturne || 0) +
                          (formData.vendredi_nocturne || 0) +
                          (formData.samedi_nocturne || 0) +
                          (formData.dimanche_nocturne || 0)
                        ).toFixed(1)}
                        h
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">
                        Total hebdomadaire:
                      </span>
                      <span className="ml-2 font-medium">
                        {(
                          (formData.lundi_diurne || 0) +
                          (formData.lundi_nocturne || 0) +
                          (formData.mardi_diurne || 0) +
                          (formData.mardi_nocturne || 0) +
                          (formData.mercredi_diurne || 0) +
                          (formData.mercredi_nocturne || 0) +
                          (formData.jeudi_diurne || 0) +
                          (formData.jeudi_nocturne || 0) +
                          (formData.vendredi_diurne || 0) +
                          (formData.vendredi_nocturne || 0) +
                          (formData.samedi_diurne || 0) +
                          (formData.samedi_nocturne || 0) +
                          (formData.dimanche_diurne || 0) +
                          (formData.dimanche_nocturne || 0)
                        ).toFixed(1)}
                        h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editingId ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des équipements */}
      {!showForm && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {equipements.map((equipement) => (
            <Card key={equipement.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {equipement.nom_equipement}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {equipement.piece?.nom_piece} •{" "}
                  {equipement.type_equipement?.nom}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <div>Nombre: {equipement.nombre}</div>
                  <div>
                    {equipement.type_valeur === "puissance" ? (
                      <div>Puissance: {equipement.valeur_mesuree} W</div>
                    ) : equipement.type_valeur === "courant" ? (
                      <>
                        <div>Courant: {equipement.valeur_mesuree} A</div>
                        {equipement.tension && <div>Tension: {equipement.tension} V</div>}
                      </>
                    ) : equipement.type_valeur === "tension" ? (
                      <>
                        <div>Tension: {equipement.valeur_mesuree} V</div>
                        {equipement.courant && <div>Courant: {equipement.courant} A</div>}
                      </>
                    ) : (
                      <div>Énergie: {equipement.valeur_mesuree} kWh/an</div>
                    )}
                  </div>
                  <div>Heures/jour: {equipement.heures_utilisation_jour}h</div>

                  {/* Énergies */}
                  <div className="border-t pt-2 mt-2">
                    {equipement.energie_avec_unite && (
                      <div className="font-medium text-primary">
                        <span className="text-muted-foreground">Jour:</span>{" "}
                        {equipement.energie_avec_unite}
                      </div>
                    )}
                    {equipement.energie_mensuelle_avec_unite && (
                      <div className="font-medium text-blue-600">
                        <span className="text-muted-foreground">Mois:</span>{" "}
                        {equipement.energie_mensuelle_avec_unite}
                      </div>
                    )}
                    {equipement.energie_annuelle_avec_unite && (
                      <div className="font-medium text-orange-600">
                        <span className="text-muted-foreground">An:</span>{" "}
                        {equipement.energie_annuelle_avec_unite}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnergyDetails(equipement.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(equipement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(equipement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {equipements.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Zap className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Aucun équipement</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez par créer votre premier équipement.
          </p>
          <div className="mt-6">
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Équipement
            </Button>
          </div>
        </div>
      )}

      {/* Modal Détails Énergétiques */}
      <Dialog open={showEnergyModal} onOpenChange={setShowEnergyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Détails Énergétiques
            </DialogTitle>
          </DialogHeader>

          {loadingEnergyDetails ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : energyDetails ? (
            <div className="space-y-4">
              {/* Informations Essentielles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5 text-primary" />
                    {energyDetails.equipement.nom}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Informations de base */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pièce:</span>
                      <span className="ml-2 font-medium text-blue-600">
                        {energyDetails.piece.nom}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bâtiment:</span>
                      <span className="ml-2 font-medium text-orange-600">
                        {energyDetails.batiment.nom}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Nombre d'équipements:
                      </span>
                      <span className="ml-2 font-medium">
                        {energyDetails.piece.resume?.nombre_equipements || 0}
                      </span>
                    </div>
                  </div>

                  {/* Énergies Totales de la Pièce */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-blue-600">
                      🏠 Consommations Totales de la Pièce
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-sm font-medium">
                          Énergie journalière totale:
                        </span>
                        <span className="font-bold text-blue-700">
                          {energyDetails.piece.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.piece.resume
                                  .energie_totale_annuelle_kWh / 365
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/jour
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-sm font-medium">
                          Énergie mensuelle totale:
                        </span>
                        <span className="font-bold text-blue-700">
                          {energyDetails.piece.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.piece.resume
                                  .energie_totale_annuelle_kWh / 12
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/mois
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                        <span className="text-sm font-medium">
                          Énergie annuelle totale:
                        </span>
                        <span className="font-bold text-blue-800">
                          {energyDetails.piece.resume?.energie_totale_annuelle_kWh?.toFixed(
                            2
                          ) || "0.00"}{" "}
                          kWh/an
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Énergies Totales du Bâtiment */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-orange-600">
                      🏢 Consommations Totales du Bâtiment
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="text-sm font-medium">
                          Énergie journalière totale:
                        </span>
                        <span className="font-bold text-orange-700">
                          {energyDetails.batiment.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.batiment.resume
                                  .energie_totale_annuelle_kWh / 365
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/jour
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="text-sm font-medium">
                          Énergie mensuelle totale:
                        </span>
                        <span className="font-bold text-orange-700">
                          {energyDetails.batiment.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.batiment.resume
                                  .energie_totale_annuelle_kWh / 12
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/mois
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border-2 border-orange-300">
                        <span className="text-sm font-medium">
                          Énergie annuelle totale:
                        </span>
                        <span className="font-bold text-orange-800">
                          {energyDetails.batiment.resume?.energie_totale_annuelle_kWh?.toFixed(
                            2
                          ) || "0.00"}{" "}
                          kWh/an
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Photos de l'équipement */}
                  {(energyDetails.equipement.photo1 ||
                    energyDetails.equipement.photo2 ||
                    energyDetails.equipement.photo3) && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-purple-600 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        📸 Photos de l'équipement
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2 flex-1">
                          {[
                            energyDetails.equipement.photo1,
                            energyDetails.equipement.photo2,
                            energyDetails.equipement.photo3,
                          ]
                            .filter(Boolean)
                            .map((photo, idx) => (
                              <div
                                key={idx}
                                className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-colors"
                              >
                                <img
                                  src={photo}
                                  alt={`Photo ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openPhotoGallery([
                              energyDetails.equipement.photo1,
                              energyDetails.equipement.photo2,
                              energyDetails.equipement.photo3,
                            ])
                          }
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Voir en grand
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmation de Suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action
              est irréversible et supprimera définitivement toutes les données
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Galerie Photos */}
      <Dialog open={showPhotoGallery} onOpenChange={setShowPhotoGallery}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Galerie Photos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-muted hover:border-primary transition-colors group"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-sm font-medium">
                        Photo {idx + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucune photo disponible</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
