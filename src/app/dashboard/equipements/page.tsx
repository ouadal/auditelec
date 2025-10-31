"use client";

import { useState, useEffect, useRef } from "react";
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
  DialogFooter,
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
  Camera,
  ImageIcon,
  Upload,
  Save,
  X,
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
  // Temps moyens
  temps_diurne_journalier?: number;
  temps_nocturne_journalier?: number;
  temps_diurne_semaine?: number;
  temps_nocturne_semaine?: number;
  temps_diurne_weekend?: number;
  temps_nocturne_weekend?: number;
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
    // Temps moyens
    temps_diurne_journalier: 0,
    temps_nocturne_journalier: 0,
    temps_diurne_semaine: 0,
    temps_nocturne_semaine: 0,
    temps_diurne_weekend: 0,
    temps_nocturne_weekend: 0,
  });

  // État pour la prévisualisation des photos
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(["", "", ""]);

  // États pour la caméra
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Effet pour surveiller les changements de showCamera
  useEffect(() => {
    console.log('showCamera a changé:', showCamera);
  }, [showCamera]);

  // Ouvrir la caméra
  const handleCameraCapture = async (photoIndex: number) => {
    try {
      console.log('handleCameraCapture appelé avec index:', photoIndex);
      
      // Vérifier si mediaDevices est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('La capture de photo n\'est pas supportée sur cet appareil');
      }

      console.log('mediaDevices disponible, énumération des caméras...');
      
      // Récupérer la liste des caméras disponibles
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Caméras disponibles:', videoDevices);

      // Définir les contraintes de base
      let constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Préférer la caméra arrière
        },
        audio: false
      };

      console.log('Contraintes initiales:', constraints);

      // Si on est sur mobile et qu'il y a plusieurs caméras, essayer d'utiliser la caméra arrière
      if (videoDevices.length > 1 && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const rearCamera = videoDevices.find(device => 
          /(back|rear|environment|arrière)/i.test(device.label)
        );
        if (rearCamera) {
          constraints.video = {
            ...constraints.video as MediaTrackConstraints,
            deviceId: { exact: rearCamera.deviceId }
          };
          console.log('Caméra arrière trouvée, nouvelles contraintes:', constraints);
        }
      }

      console.log('Demande d\'accès à la caméra...');
      
      // Demander l'accès à la caméra avec les contraintes
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Flux vidéo obtenu:', stream);
      
      if (videoRef.current) {
        console.log('Affectation du flux à la vidéo...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCurrentPhotoIndex(photoIndex);
        setShowCamera(true);
        console.log('Modal caméra ouverte, showCamera:', true);
      } else {
        console.log('Erreur: videoRef.current est null');
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra. Vérifiez que vous avez autorisé l'accès à la caméra dans votre navigateur.",
        variant: "destructive",
      });
    }
  };

  // Prendre une photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo${currentPhotoIndex + 1}.jpg`, { type: 'image/jpeg' });
            const photoKey = `photo${currentPhotoIndex + 1}` as keyof typeof formData;
            
            // Créer une prévisualisation
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const newPreviews = [...photoPreviews];
              newPreviews[currentPhotoIndex] = base64String;
              setPhotoPreviews(newPreviews);
              setFormData({ ...formData, [photoKey]: file });
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.8);

        closeCamera();
      }
    }
  };

  // Fermer la caméra
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

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
      photo1: "",
      photo2: "",
      photo3: "",
      // Temps détaillés par jour (8h par défaut en semaine, 4h le weekend)
      lundi_diurne: 8,
      lundi_nocturne: 0,
      mardi_diurne: 8,
      mardi_nocturne: 0,
      mercredi_diurne: 8,
      mercredi_nocturne: 0,
      jeudi_diurne: 8,
      jeudi_nocturne: 0,
      vendredi_diurne: 8,
      vendredi_nocturne: 0,
      samedi_diurne: 4,
      samedi_nocturne: 0,
      dimanche_diurne: 4,
      dimanche_nocturne: 0,
      // Temps moyens (calculés à partir des temps détaillés)
      temps_diurne_journalier: 8,
      temps_nocturne_journalier: 0,
      temps_diurne_semaine: 8,
      temps_nocturne_semaine: 0,
      temps_diurne_weekend: 4,
      temps_nocturne_weekend: 0,
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

  // Supprimer la deuxième définition de handleCameraCapture car elle est déjà définie plus haut

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
        nombre: Math.round(equipement.nombre || 0),
        valeur_mesuree: Math.round(equipement.valeur_mesuree || 0),
        type_valeur: equipement.type_valeur,
        tension: Math.round(equipement.tension || 0),
        courant: Math.round(equipement.courant || 0),
        facteur_puissance: equipement.facteur_puissance,
        lundi_diurne: Math.round(equipement.lundi_diurne || 0),
        lundi_nocturne: Math.round(equipement.lundi_nocturne || 0),
        mardi_diurne: Math.round(equipement.mardi_diurne || 0),
        mardi_nocturne: Math.round(equipement.mardi_nocturne || 0),
        mercredi_diurne: Math.round(equipement.mercredi_diurne || 0),
        mercredi_nocturne: Math.round(equipement.mercredi_nocturne || 0),
        jeudi_diurne: Math.round(equipement.jeudi_diurne || 0),
        jeudi_nocturne: Math.round(equipement.jeudi_nocturne || 0),
        vendredi_diurne: Math.round(equipement.vendredi_diurne || 0),
        vendredi_nocturne: Math.round(equipement.vendredi_nocturne || 0),
        samedi_diurne: Math.round(equipement.samedi_diurne || 0),
        samedi_nocturne: Math.round(equipement.samedi_nocturne || 0),
        dimanche_diurne: Math.round(equipement.dimanche_diurne || 0),
        dimanche_nocturne: Math.round(equipement.dimanche_nocturne || 0),
        photo1: photos[0] || "",
        photo2: photos[1] || "",
        photo3: photos[2] || "",
        // Temps détaillés par jour (utiliser les moyennes pour remplir les champs)
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

  // Fonction pour calculer les heures d'utilisation totales par jour
  const calculerHeuresUtilisationJour = (data: any) => {
    // Si les données sont au format du formulaire (détail par jour)
    if (data.lundi_diurne !== undefined) {
      // On calcule d'abord le total hebdomadaire
      const totalHeuresDiurnes = (
        (data.lundi_diurne || 0) +
        (data.mardi_diurne || 0) +
        (data.mercredi_diurne || 0) +
        (data.jeudi_diurne || 0) +
        (data.vendredi_diurne || 0) +
        (data.samedi_diurne || 0) +
        (data.dimanche_diurne || 0)
      );

      const totalHeuresNocturnes = (
        (data.lundi_nocturne || 0) +
        (data.mardi_nocturne || 0) +
        (data.mercredi_nocturne || 0) +
        (data.jeudi_nocturne || 0) +
        (data.vendredi_nocturne || 0) +
        (data.samedi_nocturne || 0) +
        (data.dimanche_nocturne || 0)
      );

      // On arrondit à l'entier le plus proche après la division par 7
      return Math.round((totalHeuresDiurnes + totalHeuresNocturnes) / 7);
    }

    // Si on a juste heures_utilisation_jour
    else if (data.heures_utilisation_jour !== undefined) {
      return Math.round(data.heures_utilisation_jour);
    }
    
    return 0;
  };

  // Fonction pour calculer la moyenne des temps d'utilisation
  const calculerMoyenne = (valeurs: (number | undefined)[]) => {
    const valeursValides = valeurs
      .map(v => typeof v === 'number' ? v : 0)
      .filter(v => !isNaN(v));
    return valeursValides.length > 0 
      ? Math.round(valeursValides.reduce((a, b) => a + b, 0) / valeursValides.length)
      : 0;
  };

  // Sauvegarder
  const handleSave = async () => {
    try {
      // Filtrer pour obtenir uniquement les vraies nouvelles photos (fichiers), pas les URLs existantes
      const newPhotos = [formData.photo1, formData.photo2, formData.photo3]
        .filter((photo): photo is File => {
          // Accepter uniquement les fichiers image (pas les URLs)
          return Boolean(photo) && typeof photo === 'object' && 'type' in photo && photo.type.startsWith('image/');
        });
      
      // Si on modifie uniquement les photos, on envoie les photos et les valeurs existantes des temps d'utilisation
      if (newPhotos.length > 0 && editingId) {
        const data = new FormData();
        
        // Ajouter les nouvelles photos (fichiers seulement)
        newPhotos.forEach((photo) => {
          data.append('photo[]', photo);
        });


        
        await apiHelpers.equipements.update(editingId, data);
        toast({
          title: "Succès",
          description: "Photos modifiées avec succès",
        });
        
        await loadData();
        setShowForm(false);
        resetForm();
        return;
      }

      // Sinon, on envoie toutes les données
      // Préparer les données pour l'envoi
      const data: any = {
        nom_equipement: formData.nom_equipement || '',
        piece_id: formData.piece_id?.toString() || '0',
        type_equipement_id: formData.type_equipement_id?.toString() || '0',
        nombre: formData.nombre?.toString() || '1',
        valeur_mesuree: formData.valeur_mesuree?.toString() || '0',
        type_valeur: 'puissance', // Forcer le type à puissance pour le calcul d'énergie
        tension: formData.tension?.toString() || '230', // Tension par défaut en France
        courant: formData.courant?.toString() || '0',
        facteur_puissance: formData.facteur_puissance?.toString() || '0.8', // Facteur de puissance par défaut
      };



      // Envoyer directement les champs individuels de temps (nouveau format backend)
      data.lundi_diurne = formData.lundi_diurne || 0;
      data.lundi_nocturne = formData.lundi_nocturne || 0;
      data.mardi_diurne = formData.mardi_diurne || 0;
      data.mardi_nocturne = formData.mardi_nocturne || 0;
      data.mercredi_diurne = formData.mercredi_diurne || 0;
      data.mercredi_nocturne = formData.mercredi_nocturne || 0;
      data.jeudi_diurne = formData.jeudi_diurne || 0;
      data.jeudi_nocturne = formData.jeudi_nocturne || 0;
      data.vendredi_diurne = formData.vendredi_diurne || 0;
      data.vendredi_nocturne = formData.vendredi_nocturne || 0;
      data.samedi_diurne = formData.samedi_diurne || 0;
      data.samedi_nocturne = formData.samedi_nocturne || 0;
      data.dimanche_diurne = formData.dimanche_diurne || 0;
      data.dimanche_nocturne = formData.dimanche_nocturne || 0;

      // Ajouter les photos seulement si elles existent (fichiers)
      if (newPhotos.length > 0) {
        // Préparer les données pour apiHelpers.js qui attend un objet avec photo1, photo2, photo3
        const dataWithPhotos = { ...data };
        
        // Ajouter les nouvelles photos comme photo1, photo2, photo3
        newPhotos.forEach((photo, index) => {
          dataWithPhotos[`photo${index + 1}`] = photo;
        });

        // Envoyer les données avec photos
        if (editingId) {
          await apiHelpers.equipements.update(editingId, dataWithPhotos);
        } else {
          await apiHelpers.equipements.create(dataWithPhotos);
        }
      } else {
        // Envoyer les données sans photos (objet simple)
        if (editingId) {
          await apiHelpers.equipements.update(editingId, data);
        } else {
          await apiHelpers.equipements.create(data);
        }
      }

      await loadData();
      setShowForm(false);
      resetForm();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
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
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(e, index)}
                        className="cursor-pointer text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => {
                          console.log('Bouton caméra cliqué, index:', index);
                          setCurrentPhotoIndex(index);
                          setShowCamera(true);
                          handleCameraCapture(index);
                        }}
                        title="Prendre une photo avec la caméra"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Dialog open={showCamera} onOpenChange={(open) => {
                        console.log('onOpenChange appelé avec:', open);
                        if (!open) {
                          closeCamera();
                        }
                      }}>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                              <Camera className="h-6 w-6" />
                              Prendre une photo
                            </DialogTitle>
                            <div className="mt-4 space-y-2 bg-muted p-4 rounded-lg">
                              <p className="font-medium text-base">Instructions :</p>
                              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Positionnez l'équipement dans le cadre</li>
                                <li>Cliquez sur le bouton vert "Capturer la photo" ci-dessous</li>
                              </ol>
                            </div>
                          </DialogHeader>
                          
                          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mt-4">
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <LoadingSpinner size="lg" />
                            </div>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              onLoadedMetadata={() => console.log('Vidéo chargée')}
                              className="w-full h-full object-contain"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                          </div>

                          <DialogFooter className="flex gap-4 mt-6">
                            <Button 
                              type="button" 
                              variant="secondary" 
                              onClick={() => {
                                console.log('Bouton Annuler cliqué');
                                closeCamera();
                              }} 
                              className="flex-1 py-6 text-lg"
                            >
                              <X className="h-5 w-5 mr-2" />
                              Annuler
                            </Button>
                            <Button 
                              type="button" 
                              onClick={() => {
                                console.log('Bouton Capturer cliqué');
                                capturePhoto();
                              }} 
                              className="flex-1 py-6 text-lg bg-green-600 hover:bg-green-700"
                            >
                              <Camera className="h-5 w-5 mr-2" />
                              Capturer la photo
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
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
                          size="icon"
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
                            step="1"
                            min="0"
                            max="12"
                            value={
                              formData[
                                `${jour.key}_diurne` as keyof typeof formData
                              ] as number
                            }
                            onChange={(e) => {
                              const value = e.target.value.replace(',', '.');
                              const parsedValue = parseFloat(value);
                              const validValue = !isNaN(parsedValue) ? Math.min(Math.max(Math.round(parsedValue), 0), 12) : 0;
                              setFormData({
                                ...formData,
                                [`${jour.key}_diurne`]: validValue,
                              });
                            }}
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
                            step="1"
                            min="0"
                            max="12"
                            value={
                              formData[
                                `${jour.key}_nocturne` as keyof typeof formData
                              ] as number
                            }
                            onChange={(e) => {
                              const value = e.target.value.replace(',', '.');
                              const parsedValue = parseFloat(value);
                              const validValue = !isNaN(parsedValue) ? Math.min(Math.max(Math.round(parsedValue), 0), 12) : 0;
                              setFormData({
                                ...formData,
                                [`${jour.key}_nocturne`]: validValue,
                              });
                            }}
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
                        )}
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
                        )}
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
                        )}
                        h
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">
                        Total heures/jour (utilisé pour les calculs):
                      </span>
                      <span className="ml-2 font-medium">
                        {calculerHeuresUtilisationJour(formData)}h
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
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Total heures/jour:</span>
                      <span>{calculerHeuresUtilisationJour(equipement)}h</span>
                    </div>
                  </div>

                  {/* Énergies */}
                  <div className="border-t pt-2 mt-2">
                    <div className="font-medium text-primary">
                      <span className="text-muted-foreground">Jour:</span>{" "}
                      {equipement.energie?.toFixed(3) || "0.000"} kWh/jour
                    </div>
                    <div className="font-medium text-blue-600">
                      <span className="text-muted-foreground">Mois:</span>{" "}
                      {equipement.energie_mensuelle?.toFixed(2) || "0.00"} kWh/mois
                    </div>
                    <div className="font-medium text-orange-600">
                      <span className="text-muted-foreground">An:</span>{" "}
                      {equipement.energie_annuelle?.toFixed(2) || "0.00"} kWh/an
                    </div>
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
        <DialogContent className="max-w-2xl p-3">
          <DialogHeader className="p-0 mb-2">
            <DialogTitle className="flex items-center gap-1 text-base">
              <Eye className="h-4 w-4" />
              Détails Énergétiques
            </DialogTitle>
          </DialogHeader>

          {loadingEnergyDetails ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="md" />
            </div>
          ) : energyDetails ? (
            <div className="space-y-2">
              {/* Informations Essentielles */}
              <Card className="p-2">
                <CardHeader className="p-2">
                  <CardTitle className="flex items-center gap-1 text-base">
                    <Eye className="h-4 w-4 text-primary" />
                    {energyDetails.equipement.nom}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {/* Informations de base */}
                  <div className="flex flex-wrap gap-1 text-xs">
                    <div className="flex-1">
                      <span className="text-muted-foreground">Pièce:</span>
                      <span className="ml-1 font-medium text-blue-600">
                        {energyDetails.piece.nom}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-muted-foreground">Bâtiment:</span>
                      <span className="ml-1 font-medium text-orange-600">
                        {energyDetails.batiment.nom}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="ml-1 font-medium">
                        {energyDetails.piece.resume?.nombre_equipements || 0}
                      </span>
                    </div>
                  </div>

                  {/* Énergies Totales de la Pièce */}
                  <div className="border-t pt-1">
                    <h4 className="font-medium mb-1 text-blue-600 text-xs">
                      🏠 Pièce
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-1 bg-blue-50 rounded border border-blue-200">
                        <span className="text-xs">
                          Énergie journalière totale:
                        </span>
                        <span className="font-medium text-blue-700 text-xs">
                          {energyDetails.piece.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.piece.resume
                                  .energie_totale_annuelle_kWh / 365
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/j
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-blue-50 rounded border border-blue-200">
                        <span className="text-xs">
                          Énergie mensuelle totale:
                        </span>
                        <span className="font-medium text-blue-700 text-xs">
                          {energyDetails.piece.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.piece.resume
                                  .energie_totale_annuelle_kWh / 12
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/m
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-blue-100 rounded border border-blue-300">
                        <span className="text-xs">
                           Énergie annuelle totale:
                        </span>
                        <span className="font-medium text-blue-800 text-xs">
                          {energyDetails.piece.resume?.energie_totale_annuelle_kWh?.toFixed(
                            2
                          ) || "0.00"}{" "}
                          kWh/an
                        </span>
                      </div>
                      {/* Total Puissance Pièce */}
                      {energyDetails.piece.resume?.puissance_totale_W > 0 && (
                        <div className="flex justify-between items-center p-1 bg-green-50 rounded border border-green-200">
                          <span className="text-xs">
                            Puissance total par:
                          </span>
                          <span className="font-medium text-green-700 text-xs">
                            {energyDetails.piece.resume.puissance_totale_W.toFixed(0)}{" "}
                            W
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Énergies Totales du Bâtiment */}
                  <div className="border-t pt-1">
                    <h4 className="font-medium mb-1 text-orange-600 text-xs">
                      🏢 Bâtiment
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-1 bg-orange-50 rounded border border-orange-200">
                        <span className="text-xs">
                          Energie journalière totale:
                        </span>
                        <span className="font-medium text-orange-700 text-xs">
                          {energyDetails.batiment.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.batiment.resume
                                  .energie_totale_annuelle_kWh / 365
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/j
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-orange-50 rounded border border-orange-200">
                        <span className="text-xs">
                          Energie mensuelle totale:
                        </span>
                        <span className="font-medium text-orange-700 text-xs">
                          {energyDetails.batiment.resume
                            ?.energie_totale_annuelle_kWh
                            ? (
                                energyDetails.batiment.resume
                                  .energie_totale_annuelle_kWh / 12
                              ).toFixed(2)
                            : "0.00"}{" "}
                          kWh/m
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-orange-100 rounded border border-orange-300">
                        <span className="text-xs">
                          Energie annuelle totale:
                        </span>
                        <span className="font-medium text-orange-800 text-xs">
                          {energyDetails.batiment.resume?.energie_totale_annuelle_kWh?.toFixed(
                            2
                          ) || "0.00"}{" "}
                          kWh/an
                        </span>
                      </div>
                      {/* Total Puissance Bâtiment */}
                      {energyDetails.batiment.resume?.puissance_totale_W > 0 && (
                        <div className="flex justify-between items-center p-1 bg-green-50 rounded border border-green-200">
                          <span className="text-xs">
                            Puissance:
                          </span>
                          <span className="font-medium text-green-700 text-xs">
                            {energyDetails.batiment.resume.puissance_totale_W.toFixed(0)}{" "}
                            W
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photos de l'équipement */}
                  {(energyDetails.equipement.photo1 ||
                    energyDetails.equipement.photo2 ||
                    energyDetails.equipement.photo3) && (
                    <div className="border-t pt-2">
                      <h4 className="font-medium mb-2 text-purple-600 flex items-center gap-1 text-sm">
                        <ImageIcon className="h-4 w-4" />
                        📸 Photos
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1 flex-1">
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
