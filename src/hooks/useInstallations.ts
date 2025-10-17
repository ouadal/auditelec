import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  installationService,
  priseElectriqueService,
  interrupteurService,
} from "../../services/electricalApi";
import {
  Installation,
  PriseElectrique,
  Interrupteur,
  InstallationForm as InstallationFormType,
} from "@/types/electrical";

export function useInstallations() {
  // États principaux
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [selectedInstallation, setSelectedInstallation] =
    useState<Installation | null>(null);
  const [prises, setPrises] = useState<PriseElectrique[]>([]);
  const [interrupteurs, setInterrupteurs] = useState<Interrupteur[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // États pour les modales
  const [showInstallationForm, setShowInstallationForm] = useState(false);
  const [showPriseForm, setShowPriseForm] = useState(false);
  const [showInterrupteurForm, setShowInterrupteurForm] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  // États pour l'édition
  const [editingInstallation, setEditingInstallation] =
    useState<Installation | null>(null);
  const [editingPrise, setEditingPrise] = useState<PriseElectrique | null>(
    null
  );
  const [editingInterrupteur, setEditingInterrupteur] =
    useState<Interrupteur | null>(null);
  const [selectedInstallationPhotos, setSelectedInstallationPhotos] =
    useState<Installation | null>(null);

  // État pour la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [installationToDelete, setInstallationToDelete] =
    useState<Installation | null>(null);

  // Charger les installations au démarrage
  useEffect(() => {
    loadInstallations();
  }, []);

  const loadInstallations = async () => {
    try {
      setLoading(true);
      const response = await installationService.getAll();
      const installations = response.data || [];
      setInstallations(installations);

      if (installations.length > 0) {
        handleInstallationSelect(installations[0]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      // Données de test en cas d'erreur
      const mockInstallations: Installation[] = [
        {
          id: 1,
          client_id: 1,
          type_compteur: "BT",
          configuration_compteur: "4 fils",
          amperage: 32,
          composantes_coffret: "Disjoncteur principal 32A",
          photo_coffret: [],
          cable_type: "Cuivre 2.5mm²",
          photo_cable_electrique: [],
          photo_type_cable: [],
          commentaire_cable: "Câblage conforme",
          protection_terre: true,
          barette_de_coupure: true,
          photo_barette_coupure: [],
          valeur_terre: 15,
          terre_dans_pc: true,
          photo_terre_pc: [],
          presence_differentiel: true,
          commentaire_terre: "Installation conforme",
          date_installation: "2024-01-15",
        },
      ];
      setInstallations(mockInstallations);
      if (mockInstallations.length > 0) {
        handleInstallationSelect(mockInstallations[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEquipments = async (installationId: number) => {
    try {
      const [prisesResponse, interrupteursResponse] = await Promise.all([
        priseElectriqueService.getByInstallation(installationId),
        interrupteurService.getByInstallation(installationId),
      ]);

      setPrises(prisesResponse.data || []);
      setInterrupteurs(interrupteursResponse.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des équipements:", error);
      setPrises([]);
      setInterrupteurs([]);
    }
  };

  const handleInstallationSelect = async (installation: Installation) => {
    setSelectedInstallation(installation);
    if (installation.id) {
      await loadEquipments(installation.id);
    }
  };

  // Conversion d'une Installation vers InstallationFormType
  const convertInstallationToForm = (
    installation: Installation
  ): Partial<InstallationFormType> => {
    return {
      client_id: installation.client_id,
      type_compteur: installation.type_compteur,
      configuration_compteur: installation.configuration_compteur,
      amperage: installation.amperage,
      composantes_coffret: installation.composantes_coffret,
      cable_type: installation.cable_type,
      commentaire_cable: installation.commentaire_cable,
      protection_terre: installation.protection_terre,
      barette_de_coupure: installation.barette_de_coupure,
      valeur_terre: installation.valeur_terre,
      terre_dans_pc: installation.terre_dans_pc,
      presence_differentiel: installation.presence_differentiel,
      commentaire_terre: installation.commentaire_terre,
      date_installation: installation.date_installation,
      photo_coffret: [],
      photo_cable_electrique: [],
      photo_type_cable: [],
      photo_barette_coupure: [],
      photo_terre_pc: [],
    };
  };

  // Gestion du formulaire d'installation
  const handleInstallationSubmit = async (formData: InstallationFormType) => {
    try {
      setLoading(true);

      let response;
      if (editingInstallation) {
        response = await installationService.update(
          editingInstallation.id,
          formData
        );
      } else {
        response = await installationService.create(formData);
      }

      toast({
        title: "Succès",
        description: editingInstallation
          ? "Installation modifiée avec succès"
          : "Installation créée avec succès",
      });

      setShowInstallationForm(false);
      setEditingInstallation(null);
      await loadInstallations();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'installation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInstallationCancel = () => {
    setShowInstallationForm(false);
    setEditingInstallation(null);
  };

  // Fonction pour ouvrir la modale de photos
  const handleViewPhotos = (
    installation: Installation,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedInstallationPhotos(installation);
    setShowPhotosModal(true);
  };

  // Fonction pour ouvrir la confirmation de suppression
  const handleDeleteInstallation = (
    installation: Installation,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setInstallationToDelete(installation);
    setShowDeleteConfirm(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteInstallation = async () => {
    if (!installationToDelete) return;

    try {
      setLoading(true);
      await installationService.delete(installationToDelete.id);

      toast({
        title: "🗑️ Installation supprimée",
        description: `L'installation ${installationToDelete.type_compteur} - ${installationToDelete.configuration_compteur} a été supprimée avec succès`,
      });

      await loadInstallations();

      if (selectedInstallation?.id === installationToDelete.id) {
        setSelectedInstallation(null);
        setPrises([]);
        setInterrupteurs([]);
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "❌ Erreur de suppression",
        description:
          "Impossible de supprimer l'installation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInstallationToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const cancelDeleteInstallation = () => {
    setShowDeleteConfirm(false);
    setInstallationToDelete(null);
  };

  return {
    // États
    installations,
    selectedInstallation,
    prises,
    interrupteurs,
    loading,
    showInstallationForm,
    showPriseForm,
    showInterrupteurForm,
    showPhotosModal,
    zoomedPhoto,
    editingInstallation,
    editingPrise,
    editingInterrupteur,
    selectedInstallationPhotos,
    showDeleteConfirm,
    installationToDelete,

    // Setters
    setShowInstallationForm,
    setShowPriseForm,
    setShowInterrupteurForm,
    setShowPhotosModal,
    setZoomedPhoto,
    setEditingInstallation,
    setEditingPrise,
    setEditingInterrupteur,

    // Fonctions
    handleInstallationSelect,
    handleInstallationSubmit,
    handleInstallationCancel,
    handleViewPhotos,
    handleDeleteInstallation,
    confirmDeleteInstallation,
    cancelDeleteInstallation,
    convertInstallationToForm,
    loadEquipments,
  };
}
