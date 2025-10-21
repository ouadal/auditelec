"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../../../services/apiHelpers";
import { Plus, Edit, Trash2, Eye, Zap, Save, X } from "lucide-react";

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
  piece?: { nom_piece: string; batiment?: { nom_batiment: string } };
  type_equipement?: { nom: string };
  energie_avec_unite?: string;
  energie_annuelle_avec_unite?: string;
}

interface Piece {
  id: number;
  nom_piece: string;
  batiment?: { nom_batiment: string };
}

interface TypeEquipement {
  id: number;
  nom: string;
}

export default function EquipementsPageSimple() {
  const { toast } = useToast();
  
  // États
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [typesEquipement, setTypesEquipement] = useState<TypeEquipement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
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
  });

  // Charger les données
  const loadData = async () => {
    try {
      const [equipementsRes, piecesRes, typesRes] = await Promise.all([
        apiHelpers.equipements.getAll(),
        apiHelpers.pieces.getAll(),
        apiHelpers.typesEquipement.getAll(),
      ]);
      
      setEquipements(equipementsRes.data?.data || []);
      setPieces(piecesRes.data?.data || []);
      setTypesEquipement(typesRes.data?.data || []);
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur de chargement", variant: "destructive" });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
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
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Nouveau
  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Modifier
  const handleEdit = (equipement: Equipement) => {
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
    });
    setEditingId(equipement.id);
    setShowForm(true);
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!formData.nom_equipement || formData.piece_id === 0 || formData.type_equipement_id === 0) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await apiHelpers.equipements.update(editingId, formData);
        toast({ title: "Succès", description: "Équipement modifié" });
      } else {
        await apiHelpers.equipements.create(formData);
        toast({ title: "Succès", description: "Équipement créé" });
      }
      
      await loadData();
      resetForm();
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la sauvegarde", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) return;
    
    setLoading(true);
    try {
      await apiHelpers.equipements.delete(id);
      toast({ title: "Succès", description: "Équipement supprimé" });
      await loadData();
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Détails énergétiques
  const handleEnergyDetails = async (id: number) => {
    try {
      const response = await apiHelpers.equipements.getDetailsEnergetiques(id);
      if (response.data?.success) {
        const data = response.data.data;
        alert(`Détails énergétiques:\n\nÉquipement: ${data.equipement.nom}\nÉnergie: ${data.equipement.energie_totale_avec_unite}\nPièce: ${data.piece.nom}\nBâtiment: ${data.batiment.nom}`);
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les détails", variant: "destructive" });
    }
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
                  onChange={(e) => setFormData({ ...formData, nom_equipement: e.target.value })}
                  placeholder="ex: Climatiseur Split"
                />
              </div>

              {/* Pièce */}
              <div>
                <Label>Pièce *</Label>
                <Select
                  value={formData.piece_id > 0 ? formData.piece_id.toString() : ""}
                  onValueChange={(value) => setFormData({ ...formData, piece_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une pièce" />
                  </SelectTrigger>
                  <SelectContent>
                    {pieces.map((piece) => (
                      <SelectItem key={piece.id} value={piece.id.toString()}>
                        {piece.nom_piece} {piece.batiment && `- ${piece.batiment.nom_batiment}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div>
                <Label>Type d'équipement *</Label>
                <Select
                  value={formData.type_equipement_id > 0 ? formData.type_equipement_id.toString() : ""}
                  onValueChange={(value) => setFormData({ ...formData, type_equipement_id: parseInt(value) })}
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
                  onChange={(e) => setFormData({ ...formData, nombre: parseInt(e.target.value) || 1 })}
                />
              </div>

              {/* Type de mesure */}
              <div>
                <Label>Type de mesure</Label>
                <Select
                  value={formData.type_valeur}
                  onValueChange={(value) => setFormData({ ...formData, type_valeur: value })}
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
                  onChange={(e) => setFormData({ ...formData, valeur_mesuree: parseFloat(e.target.value) || 0 })}
                />
              </div>

              {/* Heures d'utilisation */}
              <div>
                <Label>Heures d'utilisation par jour</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={formData.heures_utilisation_jour}
                  onChange={(e) => setFormData({ ...formData, heures_utilisation_jour: parseFloat(e.target.value) || 8 })}
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
                  onChange={(e) => setFormData({ ...formData, facteur_puissance: parseFloat(e.target.value) || 1.0 })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
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
                <CardTitle className="text-lg">{equipement.nom_equipement}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {equipement.piece?.nom_piece} • {equipement.type_equipement?.nom}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div>Nombre: {equipement.nombre}</div>
                  <div>Valeur: {equipement.valeur_mesuree} {equipement.type_valeur === "puissance" ? "W" : equipement.type_valeur === "courant" ? "A" : "V"}</div>
                  <div>Heures/jour: {equipement.heures_utilisation_jour}h</div>
                  {equipement.energie_avec_unite && (
                    <div className="font-medium text-primary">Énergie: {equipement.energie_avec_unite}</div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-1 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEnergyDetails(equipement.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(equipement)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(equipement.id)}>
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
          <p className="mt-1 text-sm text-muted-foreground">Commencez par créer votre premier équipement.</p>
          <div className="mt-6">
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Équipement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}