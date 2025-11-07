"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../services/apiHelpers";

export interface TypeEquipement {
  id: number;
  nom: string;
  description?: string;
}

export interface Piece {
  id: number;
  name: string;
  level?: string;
  manager?: string;
  batiment_id: number;
  batiment?: {
    id: number;
    nom_batiment: string;
  };
}

export interface EquipementData {
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
  heures_utilisation_jour?: number;
  temps_diurne_journalier?: number;
  temps_nocturne_journalier?: number;
  temps_diurne_semaine?: number;
  temps_nocturne_semaine?: number;
  temps_diurne_weekend?: number;
  temps_nocturne_weekend?: number;
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

export interface Equipement extends EquipementData {
  id: number;
  type_equipement?: TypeEquipement;
  piece?: Piece;
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
  informations_calcul?: any;
  temps_utilisation_detail?: any;
}

export const useEquipements = (
  onSuccess?: () => void,
  onShowForm?: (show: boolean) => void
) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const equipementId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [loadingEquipements, setLoadingEquipements] = useState(true);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [typesEquipement, setTypesEquipement] = useState<TypeEquipement[]>([]);
  const [editingEquipementId, setEditingEquipementId] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState<EquipementData>({
    piece_id: 0,
    type_equipement_id: 0,
    nom_equipement: "",
    nombre: 1,
    valeur_mesuree: 0,
    type_valeur: "",
    facteur_puissance: 1.0,
    heures_utilisation_jour: 8,
  });

  const isEditing = !!(
    editingEquipementId ||
    (equipementId && equipementId !== null)
  );

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les données de manière robuste
        let equipementsResponse, piecesResponse, typesResponse;

        try {
          equipementsResponse = await apiHelpers.equipements.getAll();
        } catch (error) {
          console.error("Erreur chargement équipements:", error);
          equipementsResponse = { data: { data: [] } };
        }

        try {
          piecesResponse = await apiHelpers.pieces.getAll();
        } catch (error) {
          console.error("Erreur chargement pièces:", error);
          piecesResponse = { data: { data: [] } };
        }

        try {
          typesResponse = await apiHelpers.typesEquipement.getAll();
        } catch (error) {
          console.error("Erreur chargement types équipement:", error);
          typesResponse = { data: { data: [] } };
        }

        setEquipements(equipementsResponse.data?.data || []);
        setPieces(piecesResponse.data?.data || []);
        setTypesEquipement(typesResponse.data?.data || []);

        if (equipementId) {
          try {
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
                heures_utilisation_jour:
                  equipement.heures_utilisation_jour || 8,
                // ... autres champs
              });
            }
          } catch (error) {
            console.error("Erreur chargement équipement spécifique:", error);
          }
        }
      } catch (error) {
        console.error("Erreur générale lors du chargement:", error);
      } finally {
        setLoadingEquipements(false);
        setLoading(false); // S'assurer que loading est à false
      }
    };

    loadData();
  }, [equipementId, toast]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setLoading(false); // Sécurité : s'assurer que loading est à false
    setEditingEquipementId(null);
    setFormData({
      piece_id: 0,
      type_equipement_id: 0,
      nom_equipement: "",
      nombre: 1,
      valeur_mesuree: 0,
      type_valeur: "",
      facteur_puissance: 1.0,
      heures_utilisation_jour: 8,
    });
  };

  const handleSubmit = async () => {
    // Validation simple
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
      let newEquipement;
      if (isEditing) {
        // Mode modification : enregistrer et fermer
        const { id, ...dataToUpdate } = formData;
        const response = await apiHelpers.equipements.update(
          editingEquipementId || formData.id,
          dataToUpdate
        );
        newEquipement = response.data?.data;
        toast({
          title: "Succès",
          description: "Équipement modifié avec succès",
        });
        setEditingEquipementId(null);
        onShowForm?.(false);
      } else {
        // Mode création : enregistrer et fermer
        const response = await apiHelpers.equipements.create(formData);
        newEquipement = response.data?.data;
        toast({ title: "Succès", description: "Équipement créé avec succès" });
        onSuccess?.();
      }

      // Recharger la liste
      const newList = await apiHelpers.equipements.getAll();
      setEquipements(newList.data?.data || []);
    } catch (error: any) {
      console.error("Erreur lors de l'opération:", error);
      toast({
        title: "Erreur",
        description: isEditing
          ? "Erreur lors de la modification"
          : "Erreur lors de la création",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (equipement: Equipement) => {
    // S'assurer que loading est à false (sécurité)
    setLoading(false);

    // Marquer comme mode édition
    setEditingEquipementId(equipement.id);

    // 2. Charger TOUTES les données dans le formulaire
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

      // Temps d'utilisation - TOUS les champs
      heures_utilisation_jour: equipement.heures_utilisation_jour,
      temps_diurne_journalier: equipement.temps_diurne_journalier,
      temps_nocturne_journalier: equipement.temps_nocturne_journalier,
      temps_diurne_semaine: equipement.temps_diurne_semaine,
      temps_nocturne_semaine: equipement.temps_nocturne_semaine,
      temps_diurne_weekend: equipement.temps_diurne_weekend,
      temps_nocturne_weekend: equipement.temps_nocturne_weekend,

      // Temps détaillés par jour
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

    // Afficher le formulaire
    onShowForm?.(true);
  };

  const handleDelete = async (equipementId: number) => {
    console.log("🗑️ DEBUG: Début suppression équipement", equipementId);
    console.time("suppression-totale");

    setLoading(true);
    try {
      console.log("🗑️ DEBUG: Appel API delete...");
      console.time("api-delete");
      await apiHelpers.equipements.delete(equipementId);
      console.timeEnd("api-delete");
      console.log("🗑️ DEBUG: API delete terminée avec succès");

      // Retirer l'équipement de la liste APRÈS confirmation API
      const equipementsFiltered = equipements.filter(
        (eq) => eq.id !== equipementId
      );
      setEquipements(equipementsFiltered);
      console.log("🗑️ DEBUG: Équipement retiré de l'UI après confirmation API");

      toast({
        title: "Succès",
        description: "Équipement supprimé avec succès",
      });
    } catch (error: any) {
      console.error("🗑️ DEBUG: Erreur suppression:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.timeEnd("suppression-totale");
      console.log("🗑️ DEBUG: Suppression terminée");
    }
  };

  return {
    // States
    loading,
    loadingEquipements,
    equipements,
    pieces,
    typesEquipement,
    formData,
    isEditing,

    // Actions
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};
