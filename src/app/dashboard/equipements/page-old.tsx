"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Save,
  Plus,
  Zap,
  Clock,
  Calculator,
  Edit,
  X,
  Trash2,
  Image as ImageIcon,
  TrendingUp,
  Battery,
  Sun,
  Moon,
  Calendar,
  BarChart3,
  Eye,
  Building2,
  Home,
  Euro,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiHelpers } from "../../../../services/apiHelpers";

interface TypeEquipement {
  id: number;
  nom: string;
  description?: string;
}

interface Piece {
  id: number;
  nom_piece: string;
  batiment?: {
    id: number;
    nom_batiment: string;
  };
}

interface EquipementData {
  id?: number;
  piece_id: number;
  type_equipement_id: number;
  nom_equipement: string;
  photo?: string[];
  nombre: number;
  valeur_mesuree: number;
  type_valeur: "puissance" | "courant" | "tension" | "energie";
  tension?: number;
  courant?: number;
  facteur_puissance: number;
  energie_calculee?: number;

  // Temps d'utilisation - Mode simple
  heures_utilisation_jour?: number;

  // Temps d'utilisation - Mode journalier
  temps_diurne_journalier?: number;
  temps_nocturne_journalier?: number;

  // Temps d'utilisation - Mode hebdomadaire (anciens champs pour compatibilité)
  temps_diurne_semaine?: number;
  temps_nocturne_semaine?: number;
  temps_diurne_weekend?: number;
  temps_nocturne_weekend?: number;

  // Temps d'utilisation - Mode hebdomadaire détaillé (nouveaux champs)
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
}

interface Equipement extends EquipementData {
  id: number;
  type_equipement?: TypeEquipement;
  piece?: Piece;

  // Attributs calculés
  energie?: number;
  energie_avec_unite?: string;
  energie_annuelle?: number;
  energie_annuelle_avec_unite?: string;
  energie_mensuelle?: number;
  energie_mensuelle_avec_unite?: string;
  consommation_mensuelle?: number;
  consommation_annuelle?: number;
  heures_hebdomadaires?: number;
  heures_mensuelles?: number;

  informations_calcul?: {
    type_valeur: string;
    valeur_mesuree: number;
    unite_mesuree: string;
    heures_utilisation_jour?: number;
    energie_calculee_kWh_jour?: number;
    energie_annuelle_kWh_an?: number;
    energie_totale_jour_kWh?: number;
    energie_totale_annuelle_kWh?: number;
    nombre_equipements: number;
    formule_utilisee: string;
  };

  temps_utilisation_detail?: {
    journalier?: {
      diurne?: number;
      nocturne?: number;
      total: number;
    };
    semaine?: {
      diurne?: number;
      nocturne?: number;
      total_par_jour: number;
    };
    weekend?: {
      diurne?: number;
      nocturne?: number;
      total_par_jour: number;
    };
    hebdomadaire?: {
      total_heures: number;
    };
    mensuel?: {
      total_heures: number;
      energie_kWh: number;
    };
  };
}

type ModeTemps = "hebdomadaire";

interface ResumeEnergetiquePiece {
  piece_id: number;
  nom_piece: string;
  niveau: string;
  nombre_equipements: number;
  energie_totale_jour_kWh: number;
  energie_totale_jour_avec_unite: string;
  energie_totale_mensuelle_kWh: number;
  energie_totale_mensuelle_avec_unite: string;
  energie_totale_annuelle_kWh: number;
  energie_totale_annuelle_avec_unite: string;
}

interface ResumeEnergetiqueBatiment {
  batiment_id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
  surface_totale: number;
  nombre_pieces: number;
  nombre_equipements: number;
  energie_totale_jour_kWh: number;
  energie_totale_jour_avec_unite: string;
  energie_totale_mensuelle_kWh: number;
  energie_totale_mensuelle_avec_unite: string;
  energie_totale_annuelle_kWh: number;
  energie_totale_annuelle_avec_unite: string;
  intensite_energetique_kWh_m2_an: number | null;
  intensite_energetique_avec_unite: string;
  cout_annuel_estime_fcfa: number;
}

export default function EquipementsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const equipementId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [loadingEquipements, setLoadingEquipements] = useState(true);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [typesEquipement, setTypesEquipement] = useState<TypeEquipement[]>([]);
  const [showForm, setShowForm] = useState(!!equipementId);
  const [modeTemps, setModeTemps] = useState<ModeTemps>("hebdomadaire");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    equipement: Equipement | null;
  }>({ isOpen: false, equipement: null });

  const [energyDetailsDialog, setEnergyDetailsDialog] = useState<{
    isOpen: boolean;
    pieceId: number | null;
    batimentId: number | null;
  }>({ isOpen: false, pieceId: null, batimentId: null });

  const [resumePiece, setResumePiece] = useState<ResumeEnergetiquePiece | null>(
    null
  );
  const [resumeBatiment, setResumeBatiment] =
    useState<ResumeEnergetiqueBatiment | null>(null);
  const [loadingEnergyDetails, setLoadingEnergyDetails] = useState(false);

  const [formData, setFormData] = useState<EquipementData>({
    piece_id: 0,
    type_equipement_id: 0,
    nom_equipement: "",
    nombre: 1,
    valeur_mesuree: 0,
    type_valeur: "puissance",
    facteur_puissance: 1.0,
    heures_utilisation_jour: 8,
  });

  const isEditing = !!(formData.id && formData.id !== undefined);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔄 Chargement des équipements...");

        // Charger toutes les données en parallèle
        const [equipementsResponse, piecesResponse, typesResponse] =
          await Promise.all([
            apiHelpers.equipements.getAll(),
            apiHelpers.pieces.getAll(),
            apiHelpers.typesEquipement.getAll(),
          ]);

        // Traiter les équipements
        const equipementsData = equipementsResponse.data?.data || [];
        console.log("📊 Équipements extraits:", equipementsData);
        setEquipements(Array.isArray(equipementsData) ? equipementsData : []);

        // Traiter les pièces
        const piecesData = piecesResponse.data?.data || [];
        console.log("📊 Pièces extraites:", piecesData);
        setPieces(Array.isArray(piecesData) ? piecesData : []);

        // Traiter les types d'équipements
        const typesData = typesResponse.data?.data || [];
        console.log("📊 Types d'équipements extraits:", typesData);
        setTypesEquipement(Array.isArray(typesData) ? typesData : []);

        // Si en mode édition, charger l'équipement
        if (equipementId) {
          const equipementResponse = await apiHelpers.equipements.getById(
            equipementId
          );
          const equipement = equipementResponse.data?.data;
          if (equipement) {
            setFormData({
              id: equipement.id,
              piece_id: equipement.piece_id || 0,
              type_equipement_id: equipement.type_equipement_id || 0,
              nom_equipement: equipement.nom_equipement || "",
              nombre: equipement.nombre || 1,
              valeur_mesuree: equipement.valeur_mesuree || 0,
              type_valeur: equipement.type_valeur || "puissance",
              tension: equipement.tension || undefined,
              courant: equipement.courant || undefined,
              facteur_puissance: equipement.facteur_puissance || 1.0,
              heures_utilisation_jour: equipement.heures_utilisation_jour || 8,
              temps_diurne_journalier:
                equipement.temps_diurne_journalier || undefined,
              temps_nocturne_journalier:
                equipement.temps_nocturne_journalier || undefined,
              temps_diurne_semaine:
                equipement.temps_diurne_semaine || undefined,
              temps_nocturne_semaine:
                equipement.temps_nocturne_semaine || undefined,
              temps_diurne_weekend:
                equipement.temps_diurne_weekend || undefined,
              temps_nocturne_weekend:
                equipement.temps_nocturne_weekend || undefined,
              // Nouveaux champs détaillés
              lundi_diurne: equipement.lundi_diurne || undefined,
              lundi_nocturne: equipement.lundi_nocturne || undefined,
              mardi_diurne: equipement.mardi_diurne || undefined,
              mardi_nocturne: equipement.mardi_nocturne || undefined,
              mercredi_diurne: equipement.mercredi_diurne || undefined,
              mercredi_nocturne: equipement.mercredi_nocturne || undefined,
              jeudi_diurne: equipement.jeudi_diurne || undefined,
              jeudi_nocturne: equipement.jeudi_nocturne || undefined,
              vendredi_diurne: equipement.vendredi_diurne || undefined,
              vendredi_nocturne: equipement.vendredi_nocturne || undefined,
              samedi_diurne: equipement.samedi_diurne || undefined,
              samedi_nocturne: equipement.samedi_nocturne || undefined,
              dimanche_diurne: equipement.dimanche_diurne || undefined,
              dimanche_nocturne: equipement.dimanche_nocturne || undefined,
            });
          }
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données",
          variant: "destructive",
        });
      } finally {
        setLoadingEquipements(false);
      }
    };

    loadData();
  }, [equipementId, toast]);

  const handleInputChange = (
    field: keyof EquipementData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      piece_id: 0,
      type_equipement_id: 0,
      nom_equipement: "",
      nombre: 1,
      valeur_mesuree: 0,
      type_valeur: "puissance",
      facteur_puissance: 1.0,
      heures_utilisation_jour: 8,
      // Réinitialiser tous les nouveaux champs
      temps_diurne_journalier: undefined,
      temps_nocturne_journalier: undefined,
      temps_diurne_semaine: undefined,
      temps_nocturne_semaine: undefined,
      temps_diurne_weekend: undefined,
      temps_nocturne_weekend: undefined,
      lundi_diurne: undefined,
      lundi_nocturne: undefined,
      mardi_diurne: undefined,
      mardi_nocturne: undefined,
      mercredi_diurne: undefined,
      mercredi_nocturne: undefined,
      jeudi_diurne: undefined,
      jeudi_nocturne: undefined,
      vendredi_diurne: undefined,
      vendredi_nocturne: undefined,
      samedi_diurne: undefined,
      samedi_nocturne: undefined,
      dimanche_diurne: undefined,
      dimanche_nocturne: undefined,
    });
    setModeTemps("hebdomadaire");
  };

  const handleSubmit = async () => {
    // Validation basique
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
      let response;

      if (isEditing) {
        // Exclure l'ID des données envoyées (il est déjà dans l'URL)
        const { id, ...dataToUpdate } = formData;
        response = await apiHelpers.equipements.update(
          formData.id,
          dataToUpdate
        );
      } else {
        response = await apiHelpers.equipements.create(formData);
      }

      if (response.data) {
        toast({
          title: "Succès",
          description: isEditing
            ? "Équipement mis à jour avec succès"
            : "Équipement créé avec succès",
        });

        // Recharger la liste
        const equipementsResponse = await apiHelpers.equipements.getAll();
        const equipementsData = equipementsResponse.data?.data || [];
        setEquipements(Array.isArray(equipementsData) ? equipementsData : []);

        // Fermer le formulaire
        setShowForm(false);
        resetForm();
        router.push("/dashboard/equipements");
      } else {
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipement = (equipement: Equipement) => {
    setFormData({
      id: equipement.id,
      piece_id: equipement.piece_id,
      type_equipement_id: equipement.type_equipement_id,
      nom_equipement: equipement.nom_equipement,
      nombre: equipement.nombre,
      valeur_mesuree: equipement.valeur_mesuree,
      type_valeur: equipement.type_valeur,
      tension: equipement.tension,
      courant: equipement.courant,
      facteur_puissance: equipement.facteur_puissance,
      heures_utilisation_jour: equipement.heures_utilisation_jour,
      temps_diurne_journalier: equipement.temps_diurne_journalier,
      temps_nocturne_journalier: equipement.temps_nocturne_journalier,
      temps_diurne_semaine: equipement.temps_diurne_semaine,
      temps_nocturne_semaine: equipement.temps_nocturne_semaine,
      temps_diurne_weekend: equipement.temps_diurne_weekend,
      temps_nocturne_weekend: equipement.temps_nocturne_weekend,
      // Nouveaux champs détaillés
      lundi_diurne: equipement.lundi_diurne,
      lundi_nocturne: equipement.lundi_nocturne,
      mardi_diurne: equipement.mardi_diurne,
      mardi_nocturne: equipement.mardi_nocturne,
      mercredi_diurne: equipement.mercredi_diurne,
      mercredi_nocturne: equipement.mercredi_nocturne,
      jeudi_diurne: equipement.jeudi_diurne,
      jeudi_nocturne: equipement.jeudi_nocturne,
      vendredi_diurne: equipement.vendredi_diurne,
      vendredi_nocturne: equipement.vendredi_nocturne,
      samedi_diurne: equipement.samedi_diurne,
      samedi_nocturne: equipement.samedi_nocturne,
      dimanche_diurne: equipement.dimanche_diurne,
      dimanche_nocturne: equipement.dimanche_nocturne,
    });
    setShowForm(true);
    router.push(`/dashboard/equipements?id=${equipement.id}`);
  };

  const handleNewEquipement = () => {
    router.push("/dashboard/equipements");
    resetForm();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    if (isEditing) {
      router.push("/dashboard/equipements");
    }
    setShowForm(false);
    resetForm();
  };

  const handleDeleteClick = (equipement: Equipement) => {
    setDeleteDialog({ isOpen: true, equipement });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.equipement) return;

    setLoading(true);
    try {
      await apiHelpers.equipements.delete(deleteDialog.equipement.id);

      toast({
        title: "Succès",
        description: "Équipement supprimé avec succès",
      });

      // Recharger la liste
      const equipementsResponse = await apiHelpers.equipements.getAll();
      const equipementsData = equipementsResponse.data?.data || [];
      setEquipements(Array.isArray(equipementsData) ? equipementsData : []);
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialog({ isOpen: false, equipement: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, equipement: null });
  };

  const getTypeValeurLabel = (type: string) => {
    switch (type) {
      case "puissance":
        return "Puissance (W)";
      case "courant":
        return "Courant (A)";
      case "tension":
        return "Tension (V)";
      case "energie":
        return "Énergie (kWh/an)";
      default:
        return type;
    }
  };

  const getUnite = (type: string) => {
    switch (type) {
      case "puissance":
        return "W";
      case "courant":
        return "A";
      case "tension":
        return "V";
      case "energie":
        return "kWh/an";
      default:
        return "";
    }
  };

  const handleShowEnergyDetails = async (equipementId: number) => {
    setEnergyDetailsDialog({ isOpen: true, pieceId: null, batimentId: null });
    setLoadingEnergyDetails(true);

    try {
      // Utiliser notre nouvelle API des détails énergétiques complets
      const response = await apiHelpers.equipements.getDetailsEnergetiques(
        equipementId
      );

      if (response.data?.success) {
        const data = response.data.data;

        // Extraire les données pour les états existants
        setResumePiece(data.piece.resume);
        setResumeBatiment(data.batiment.resume);

        // Optionnel : afficher les recommandations dans un toast
        if (
          data.analyse.recommandations &&
          data.analyse.recommandations.length > 0
        ) {
          const premierConseil = data.analyse.recommandations[0];
          toast({
            title: `${premierConseil.icone} ${premierConseil.titre}`,
            description: premierConseil.message,
          });
        }
      }
    } catch (error: any) {
      console.error(
        "Erreur lors du chargement des détails énergétiques:",
        error
      );
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des détails énergétiques",
        variant: "destructive",
      });
    } finally {
      setLoadingEnergyDetails(false);
    }
  };

  const handleCloseEnergyDetails = () => {
    setEnergyDetailsDialog({ isOpen: false, pieceId: null, batimentId: null });
    setResumePiece(null);
    setResumeBatiment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Équipements & Énergie
          </h1>
        </div>
        {!showForm && (
          <Button onClick={handleNewEquipement}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Équipement
          </Button>
        )}
      </div>

      {/* Formulaire (conditionnel) */}
      {showForm && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Modifier l'Équipement" : "Nouvel Équipement"}
            </h2>
            <Button variant="outline" size="sm" onClick={handleCancelForm}>
              <X className="mr-2 h-4 w-4" />
              {isEditing ? "Retour à la liste" : "Annuler"}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Informations de Base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="piece">Pièce *</Label>
                  <Select
                    value={
                      formData.piece_id > 0 ? formData.piece_id.toString() : ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("piece_id", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une pièce" />
                    </SelectTrigger>
                    <SelectContent>
                      {pieces.map((piece) => (
                        <SelectItem key={piece.id} value={piece.id.toString()}>
                          {piece.nom_piece}
                          {piece.batiment &&
                            ` - ${piece.batiment.nom_batiment}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type d'équipement *</Label>
                  <Select
                    value={
                      formData.type_equipement_id > 0
                        ? formData.type_equipement_id.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("type_equipement_id", parseInt(value))
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

                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de l'équipement *</Label>
                  <Input
                    id="nom"
                    placeholder="ex: Climatiseur Split 12000 BTU"
                    value={formData.nom_equipement}
                    onChange={(e) =>
                      handleInputChange("nom_equipement", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre d'unités</Label>
                  <Input
                    id="nombre"
                    type="number"
                    min="1"
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mesures électriques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Mesures Électriques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type-valeur">Type de mesure</Label>
                  <Select
                    value={formData.type_valeur}
                    onValueChange={(value: any) =>
                      handleInputChange("type_valeur", value)
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

                <div className="space-y-2">
                  <Label htmlFor="valeur">Valeur mesurée</Label>
                  <div className="flex">
                    <Input
                      id="valeur"
                      type="number"
                      step="0.01"
                      value={formData.valeur_mesuree}
                      onChange={(e) =>
                        handleInputChange(
                          "valeur_mesuree",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="rounded-r-none"
                    />
                    <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
                      {getUnite(formData.type_valeur)}
                    </div>
                  </div>
                </div>

                {/* Champs conditionnels pour calcul */}
                {formData.type_valeur !== "puissance" &&
                  formData.type_valeur !== "energie" && (
                    <>
                      {formData.type_valeur !== "tension" && (
                        <div className="space-y-2">
                          <Label htmlFor="tension">Tension (V)</Label>
                          <Input
                            id="tension"
                            type="number"
                            placeholder="ex: 230"
                            value={formData.tension || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "tension",
                                parseFloat(e.target.value) || undefined
                              )
                            }
                          />
                        </div>
                      )}

                      {formData.type_valeur !== "courant" && (
                        <div className="space-y-2">
                          <Label htmlFor="courant">Courant (A)</Label>
                          <Input
                            id="courant"
                            type="number"
                            placeholder="ex: 10"
                            value={formData.courant || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "courant",
                                parseFloat(e.target.value) || undefined
                              )
                            }
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="facteur">
                          Facteur de puissance (cos φ)
                        </Label>
                        <Input
                          id="facteur"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={formData.facteur_puissance}
                          onChange={(e) =>
                            handleInputChange(
                              "facteur_puissance",
                              parseFloat(e.target.value) || 1.0
                            )
                          }
                        />
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Temps d'utilisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Temps d'Utilisation
              </CardTitle>
              <CardDescription>
                Configurez les heures d'utilisation pour calculer l'énergie
                consommée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode Hebdomadaire - Interface détaillée */}
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Configuration Hebdomadaire Détaillée
                </Label>
                <p className="text-sm text-muted-foreground">
                  Configurez les heures d'utilisation pour chaque jour de la
                  semaine
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-6">
                  {/* Jours ouvrables */}
                  <div className="border rounded-lg p-4 bg-blue-50/50">
                    <h4 className="font-medium mb-4 flex items-center gap-2 text-blue-800">
                      <Calendar className="h-5 w-5" />
                      Jours Ouvrables (Lundi - Vendredi)
                    </h4>

                    <div className="space-y-4">
                      {/* En-têtes */}
                      <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
                        <div>Jour</div>
                        <div className="flex items-center gap-1">
                          <Sun className="h-4 w-4 text-orange-500" />
                          Diurne (6h-22h)
                        </div>
                        <div className="flex items-center gap-1">
                          <Moon className="h-4 w-4 text-blue-500" />
                          Nocturne (22h-6h)
                        </div>
                      </div>

                      {/* Lundi */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Lundi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.lundi_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "lundi_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.lundi_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "lundi_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>

                      {/* Mardi */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Mardi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.mardi_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "mardi_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.mardi_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "mardi_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>

                      {/* Mercredi */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Mercredi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.mercredi_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "mercredi_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.mercredi_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "mercredi_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>

                      {/* Jeudi */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Jeudi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.jeudi_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "jeudi_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.jeudi_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "jeudi_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>

                      {/* Vendredi */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Vendredi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.vendredi_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendredi_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.vendredi_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendredi_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weekend */}
                  <div className="border rounded-lg p-4 bg-green-50/50">
                    <h4 className="font-medium mb-4 flex items-center gap-2 text-green-800">
                      <Calendar className="h-5 w-5" />
                      Weekend (Samedi - Dimanche)
                    </h4>

                    <div className="space-y-4">
                      {/* En-têtes */}
                      <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
                        <div>Jour</div>
                        <div className="flex items-center gap-1">
                          <Sun className="h-4 w-4 text-orange-500" />
                          Diurne (6h-22h)
                        </div>
                        <div className="flex items-center gap-1">
                          <Moon className="h-4 w-4 text-blue-500" />
                          Nocturne (22h-6h)
                        </div>
                      </div>

                      {/* Samedi */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Samedi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.samedi_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "samedi_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.samedi_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "samedi_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>

                      {/* Dimanche */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label className="font-medium">Dimanche</Label>
                        <Input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          placeholder="0"
                          value={formData.dimanche_diurne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "dimanche_diurne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          placeholder="0"
                          value={formData.dimanche_nocturne || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "dimanche_nocturne",
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Résumé automatique */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium mb-2 text-gray-800">
                      Résumé Hebdomadaire
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Total Jours Ouvrables:
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
                            (formData.vendredi_nocturne || 0)
                          ).toFixed(1)}
                          h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Weekend:</span>
                        <span className="ml-2 font-medium">
                          {(
                            (formData.samedi_diurne || 0) +
                            (formData.samedi_nocturne || 0) +
                            (formData.dimanche_diurne || 0) +
                            (formData.dimanche_nocturne || 0)
                          ).toFixed(1)}
                          h
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t">
                        <span className="text-gray-600">
                          Total Hebdomadaire:
                        </span>
                        <span className="ml-2 font-bold text-lg text-primary">
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
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Mettre à jour" : "Créer l'Équipement"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Liste des équipements */}
      {!showForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Équipements existants</h2>
            <p className="text-muted-foreground">
              {equipements.length} équipement{equipements.length > 1 ? "s" : ""}{" "}
              enregistré
              {equipements.length > 1 ? "s" : ""}
            </p>
          </div>

          {loadingEquipements ? (
            <LoadingPage text="Chargement des équipements..." />
          ) : equipements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun équipement trouvé
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Commencez par ajouter des équipements pour calculer la
                  consommation énergétique
                </p>
                <Button onClick={handleNewEquipement}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un équipement
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {equipements.map((equipement) => (
                <Card
                  key={equipement.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">
                            {equipement.nom_equipement}
                          </CardTitle>
                          {equipement.type_equipement && (
                            <p className="text-sm text-muted-foreground">
                              {equipement.type_equipement.nom}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {equipement.nombre} unité
                        {equipement.nombre > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    {equipement.piece && (
                      <CardDescription className="flex items-center space-x-1">
                        <span>{equipement.piece.nom_piece}</span>
                        {equipement.piece.batiment && (
                          <span>
                            {" "}
                            - {equipement.piece.batiment.nom_batiment}
                          </span>
                        )}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Mesure principale */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">
                        {getTypeValeurLabel(equipement.type_valeur)}
                      </span>
                      <span className="font-bold">
                        {equipement.valeur_mesuree}{" "}
                        {getUnite(equipement.type_valeur)}
                      </span>
                    </div>

                    {/* Énergie calculée */}
                    {equipement.energie_avec_unite && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Battery className="h-4 w-4" />
                            Énergie/jour
                          </span>
                          <span className="font-semibold text-green-600">
                            {equipement.energie_avec_unite}
                          </span>
                        </div>

                        {equipement.energie_mensuelle_avec_unite && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Énergie/mois
                            </span>
                            <span className="font-semibold text-blue-600">
                              {equipement.energie_mensuelle_avec_unite}
                            </span>
                          </div>
                        )}

                        {equipement.energie_annuelle_avec_unite && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              Énergie/an
                            </span>
                            <span className="font-semibold text-orange-600">
                              {equipement.energie_annuelle_avec_unite}
                            </span>
                          </div>
                        )}

                        {equipement.consommation_annuelle && (
                          <div className="flex items-center justify-between p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                            <span className="text-sm font-medium text-orange-800 flex items-center gap-1">
                              <BarChart3 className="h-4 w-4" />
                              Total annuel ({equipement.nombre} unités)
                            </span>
                            <span className="font-bold text-orange-800">
                              {equipement.consommation_annuelle.toFixed(1)}{" "}
                              kWh/an
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Temps d'utilisation */}
                    {equipement.heures_utilisation_jour && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Utilisation
                        </span>
                        <span>{equipement.heures_utilisation_jour}h/jour</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      {equipement.piece && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowEnergyDetails(equipement.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
                          title="Voir les détails énergétiques de la pièce et du bâtiment"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEquipement(equipement)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
                        title="Modifier l'équipement"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(equipement)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                        title="Supprimer l'équipement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dialogue de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer l'équipement"
        description={
          deleteDialog.equipement
            ? `Êtes-vous sûr de vouloir supprimer l'équipement "${deleteDialog.equipement.nom_equipement}" ? Cette action est irréversible.`
            : ""
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      {/* Modal des détails énergétiques */}
      <Dialog
        open={energyDetailsDialog.isOpen}
        onOpenChange={handleCloseEnergyDetails}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Détails Énergétiques - Pièce & Bâtiment
            </DialogTitle>
            <DialogDescription>
              Consommation énergétique totale par pièce et bâtiment
            </DialogDescription>
          </DialogHeader>

          {loadingEnergyDetails ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Résumé de la pièce */}
              {resumePiece && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Home className="h-5 w-5" />
                      Pièce : {resumePiece.nom_piece}
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Niveau : {resumePiece.niveau} •{" "}
                      {resumePiece.nombre_equipements} équipement
                      {resumePiece.nombre_equipements > 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                          {resumePiece.energie_totale_jour_kWh.toFixed(1)}
                        </div>
                        <p className="text-sm text-blue-600">kWh/jour</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                          {resumePiece.energie_totale_mensuelle_kWh.toFixed(0)}
                        </div>
                        <p className="text-sm text-blue-600">kWh/mois</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                          {resumePiece.energie_totale_annuelle_kWh.toFixed(0)}
                        </div>
                        <p className="text-sm text-blue-600">kWh/an</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800 flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          Coût annuel estimé (pièce)
                        </span>
                        <span className="font-bold text-blue-800">
                          {Math.round(
                            resumePiece.energie_totale_annuelle_kWh * 100
                          ).toLocaleString()}{" "}
                          FCFA
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Résumé du bâtiment */}
              {resumeBatiment && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Building2 className="h-5 w-5" />
                      Bâtiment : {resumeBatiment.nom_batiment}
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      {resumeBatiment.adresse_site}, {resumeBatiment.commune} •{" "}
                      {resumeBatiment.surface_totale} m²
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">
                          {resumeBatiment.energie_totale_jour_kWh.toFixed(1)}
                        </div>
                        <p className="text-sm text-orange-600">kWh/jour</p>
                        <p className="text-xs text-orange-500 mt-1">
                          Total bâtiment
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">
                          {resumeBatiment.energie_totale_mensuelle_kWh.toFixed(
                            0
                          )}
                        </div>
                        <p className="text-sm text-orange-600">kWh/mois</p>
                        <p className="text-xs text-orange-500 mt-1">
                          Total bâtiment
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">
                          {resumeBatiment.energie_totale_annuelle_kWh.toFixed(
                            0
                          )}
                        </div>
                        <p className="text-sm text-orange-600">kWh/an</p>
                        <p className="text-xs text-orange-500 mt-1">
                          Total bâtiment
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">
                          {resumeBatiment.intensite_energetique_kWh_m2_an?.toFixed(
                            1
                          ) || "N/A"}
                        </div>
                        <p className="text-sm text-orange-600">kWh/m²/an</p>
                        <p className="text-xs text-orange-500 mt-1">
                          Intensité
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="p-3 bg-white rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-800">
                            Pièces équipées
                          </span>
                          <span className="font-bold text-orange-800">
                            {resumeBatiment.nombre_pieces}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-800">
                            Total équipements
                          </span>
                          <span className="font-bold text-orange-800">
                            {resumeBatiment.nombre_equipements}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800 flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          Coût annuel estimé (bâtiment complet)
                        </span>
                        <span className="font-bold text-orange-800">
                          {resumeBatiment.cout_annuel_estime_fcfa.toLocaleString()}{" "}
                          FCFA
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
