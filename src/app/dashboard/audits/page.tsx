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
  Save,
  X,
  Calendar,
  Building,
  Layers,
} from "lucide-react";

interface Audit {
  id: number;
  batiment_id: number;
  date_audit: string;
  nombre_niveaux: number;
  batiment?: {
    nom_batiment: string;
    adresse_site?: string;
  };
}

interface Batiment {
  id: number;
  nom_batiment: string;
  adresse_site?: string;
  nombre_etages?: number;
}

export default function AuditsPage() {
  const { toast } = useToast();

  // États
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Dialog de suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState<number | null>(null);

  // Formulaire
  const [formData, setFormData] = useState({
    batiment_id: 0,
    date_audit: new Date().toISOString().split("T")[0],
    nombre_niveaux: 1,
  });

  // Charger les données
  const loadData = async () => {
    try {
      const [auditsRes, batimentsRes] = await Promise.all([
        apiHelpers.audits.getAll(),
        apiHelpers.batiments.getAll(),
      ]);

      setAudits(auditsRes.data?.data || []);
      setBatiments(batimentsRes.data?.data || []);
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
    loadData();
  }, []);

  // Mettre à jour nombre_niveaux quand un bâtiment est sélectionné
  useEffect(() => {
    if (formData.batiment_id > 0) {
      const batiment = batiments.find((b) => b.id === formData.batiment_id);
      if (batiment && batiment.nombre_etages) {
        setFormData((prev) => ({
          ...prev,
          nombre_niveaux: batiment.nombre_etages || 1,
        }));
      }
    }
  }, [formData.batiment_id, batiments]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      batiment_id: 0,
      date_audit: new Date().toISOString().split("T")[0],
      nombre_niveaux: 1,
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
  const handleEdit = (audit: Audit) => {
    setFormData({
      batiment_id: audit.batiment_id,
      date_audit: audit.date_audit,
      nombre_niveaux: audit.nombre_niveaux,
    });
    setEditingId(audit.id);
    setShowForm(true);
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    return formData.batiment_id > 0 && formData.date_audit !== "";
  };

  // Sauvegarder
  const handleSave = async () => {
    // Vérifier si un bâtiment est sélectionné
    if (formData.batiment_id === 0) {
      toast({
        title: "⚠️ Bâtiment requis",
        description: "Vous devez sélectionner un bâtiment avant de continuer",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await apiHelpers.audits.update(editingId, formData);
        toast({ title: "Succès", description: "Audit modifié" });
      } else {
        await apiHelpers.audits.create(formData);
        toast({ title: "Succès", description: "Audit créé" });
      }

      await loadData();
      resetForm();
    } catch (error) {
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
    setAuditToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!auditToDelete) return;

    setLoading(true);
    try {
      await apiHelpers.audits.delete(auditToDelete);
      toast({ title: "Succès", description: "Audit supprimé" });
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
      setAuditToDelete(null);
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
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Audits Énergétiques</h1>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Audit
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Modifier l'Audit" : "Nouvel Audit"}
              <Button variant="outline" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bâtiment */}
              <div>
                <Label className="text-red-600">Bâtiment *</Label>
                <Select
                  value={
                    formData.batiment_id > 0
                      ? formData.batiment_id.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setFormData({ ...formData, batiment_id: parseInt(value) })
                  }
                  required
                >
                  <SelectTrigger
                    className={
                      formData.batiment_id === 0
                        ? "border-red-300 focus:border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="⚠️ Sélectionner un bâtiment (obligatoire)" />
                  </SelectTrigger>
                  <SelectContent>
                    {batiments.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Aucun bâtiment disponible
                      </div>
                    ) : (
                      batiments.map((batiment) => (
                        <SelectItem
                          key={batiment.id}
                          value={batiment.id.toString()}
                        >
                          {batiment.nom_batiment}
                          {batiment.adresse_site &&
                            ` - ${batiment.adresse_site}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {formData.batiment_id === 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Vous devez sélectionner un bâtiment
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <Label>Date de l'audit *</Label>
                <Input
                  type="date"
                  value={formData.date_audit}
                  onChange={(e) =>
                    setFormData({ ...formData, date_audit: e.target.value })
                  }
                />
              </div>

              {/* Nombre de niveaux */}
              <div>
                <Label>Nombre de niveaux</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.nombre_niveaux}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_niveaux: parseInt(e.target.value) || 1,
                    })
                  }
                />
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
            {formData.batiment_id === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <strong>Attention :</strong> Vous devez sélectionner un
                  bâtiment avant de pouvoir créer l'audit.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Liste des audits */}
      {!showForm && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {audits.map((audit) => (
            <Card key={audit.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  {audit.batiment?.nom_batiment || "Bâtiment inconnu"}
                </CardTitle>
                {audit.batiment?.adresse_site && (
                  <div className="text-sm text-muted-foreground">
                    {audit.batiment.adresse_site}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(audit.date_audit).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>{audit.nombre_niveaux} niveau(x)</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(audit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(audit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {audits.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Aucun audit</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez par créer votre premier audit.
          </p>
          <div className="mt-6">
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Audit
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de Confirmation de Suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet audit ? Cette action est
              irréversible et supprimera définitivement toutes les données
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
    </div>
  );
}
