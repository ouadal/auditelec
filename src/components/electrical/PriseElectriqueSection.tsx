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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Eye,
  Edit,
} from "lucide-react";
import { PriseElectriqueForm as PriseElectriqueFormComponent } from "@/components/electrical/PriseElectriqueForm";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { priseElectriqueService } from "../../../services/electricalApi";
import { PriseElectrique, PriseElectriqueForm } from "@/types/electrical";
import { ImageModal } from "@/components/ui/image-modal";

interface PriseElectriqueSectionProps {
  installationId?: number;
}

export function PriseElectriqueSection({
  installationId = 1,
}: PriseElectriqueSectionProps) {
  const [prises, setPrises] = useState<PriseElectrique[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPrise, setEditingPrise] = useState<PriseElectrique | null>(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [priseToDelete, setPriseToDelete] = useState<PriseElectrique | null>(null);
  const { toast } = useToast();

  // Charger les prises existantes
  useEffect(() => {
    loadPrises();
  }, [installationId]);

  const loadPrises = async () => {
    try {
      setLoading(true);
      const response = await priseElectriqueService.getByInstallation(
        installationId
      );
      console.log("🔍 Réponse API prises:", response);
      if (response.success) {
        console.log("📋 Données prises:", response.data);
        response.data?.forEach((prise: any, index: number) => {
          console.log(`📸 Prise ${index + 1} (${prise.reference}):`, {
            id: prise.id,
            photos: prise.photo_prise,
            photosType: typeof prise.photo_prise,
            photosLength: prise.photo_prise?.length,
            created_at: prise.created_at,
            created_at_type: typeof prise.created_at
          });
        });
        setPrises(response.data || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des prises:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les prises électriques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrise = async (formData: PriseElectriqueForm) => {
    try {
      setSaving(true);
      const response = await priseElectriqueService.create(formData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Prise électrique ajoutée avec succès",
        });
        setShowAddModal(false);
        await loadPrises();
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de la prise:", error);
      console.error("Détails de l'erreur:", error.response?.data);
      let errorMessage = "Erreur lors de l'ajout de la prise";
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(
          error.response.data.errors
        ).flat();
        errorMessage = validationErrors.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: "Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditPrise = (prise: PriseElectrique) => {
    setEditingPrise(prise);
    setShowEditModal(true);
  };

  const handleUpdatePrise = async (formData: PriseElectriqueForm) => {
    if (!editingPrise?.id) {
      console.error("❌ Pas d'ID pour la prise à modifier:", editingPrise);
      return;
    }
    
    console.log("🔧 Modification de la prise:", {
      id: editingPrise.id,
      formData: formData
    });
    
    try {
      setSaving(true);
      const response = await priseElectriqueService.update(editingPrise.id, formData);
      console.log("✅ Réponse de modification:", response);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Prise électrique modifiée avec succès",
        });
        setShowEditModal(false);
        setEditingPrise(null);
        await loadPrises();
      } else {
        console.error("❌ Échec de la modification:", response);
        toast({
          title: "Erreur",
          description: response.message || "Erreur lors de la modification",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la modification:", error);
      console.error("❌ Détails de l'erreur:", error.response?.data);
      let errorMessage = "Erreur lors de la modification de la prise";
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: "Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePrise = (prise: PriseElectrique) => {
    setPriseToDelete(prise);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!priseToDelete?.id) {
      console.error("❌ Pas d'ID pour la prise à supprimer:", priseToDelete);
      return;
    }
    
    console.log("🗑️ Suppression de la prise:", {
      id: priseToDelete.id,
      reference: priseToDelete.reference
    });
    
    try {
      const response = await priseElectriqueService.delete(priseToDelete.id);
      console.log("✅ Réponse de suppression:", response);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: `Prise "${priseToDelete.reference}" supprimée avec succès`,
        });
        await loadPrises();
      } else {
        console.error("❌ Échec de la suppression:", response);
        toast({
          title: "Erreur",
          description: response.message || "Erreur lors de la suppression de la prise",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la suppression:", error);
      console.error("❌ Détails de l'erreur:", error.response?.data);
      
      let errorMessage = "Erreur lors de la suppression de la prise";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setPriseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setPriseToDelete(null);
  };



  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Les prises électriques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Chargement des prises..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Les prises électriques</CardTitle>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une prise
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">


        {/* Tableau des prises existantes */}
        {prises.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Prises enregistrées ({prises.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="w-12">
                      <span className="text-blue-600">🔌</span>
                    </TableHead>
                    <TableHead className="font-semibold">Référence</TableHead>
                    <TableHead className="font-semibold">État</TableHead>
                    <TableHead className="font-semibold">Terre</TableHead>
                    <TableHead className="font-semibold">
                      Localisation
                    </TableHead>
                    <TableHead className="font-semibold text-center">
                      Photos
                    </TableHead>
                    <TableHead className="font-semibold">
                      Commentaires
                    </TableHead>
                    <TableHead className="font-semibold">
                      Date création
                    </TableHead>
                    <TableHead className="font-semibold text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prises.map((prise) => (
                    <TableRow key={prise.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">
                            {prise.ordre}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          {prise.reference}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {prise.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            prise.etat === "bon"
                              ? "bg-emerald-100 text-emerald-700"
                              : prise.etat === "defectueux"
                              ? "bg-red-100 text-red-700"
                              : prise.etat === "a_remplacer"
                              ? "bg-amber-100 text-amber-700"
                              : prise.etat === "manquant"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {prise.etat === "bon"
                            ? "Bon"
                            : prise.etat === "defectueux"
                            ? "Défectueux"
                            : prise.etat === "non_installe"
                            ? "Non installé"
                            : prise.etat === "a_remplacer"
                            ? "À remplacer"
                            : prise.etat === "manquant"
                            ? "Manquant"
                            : prise.etat}
                        </span>
                      </TableCell>
                      <TableCell>
                        {prise.avec_terre ? (
                          <span className="text-xs font-medium text-green-700">Oui</span>
                        ) : (
                          <span className="text-xs text-gray-400">Non</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prise.localisation ? (
                          <span className="text-sm text-gray-700">
                            {prise.localisation}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Non spécifié
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {prise.photo_prise && prise.photo_prise.length > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setModalImages(prise.photo_prise || []);
                              setModalCurrentIndex(0);
                              setIsModalOpen(true);
                            }}
                            className="h-8 px-2"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {prise.photo_prise.length}
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">Aucune</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prise.commentaire ? (
                          <div className="max-w-xs">
                            <p
                              className="text-sm text-gray-700 truncate"
                              title={prise.commentaire}
                            >
                              {prise.commentaire}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prise.created_at ? (
                          <div className="text-xs text-gray-600">
                            <span>
                              {new Date(prise.created_at).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(prise.created_at).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">
                            <span>Données anciennes</span>
                            <div className="text-xs text-gray-500 mt-1">
                              Pas de date
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPrise(prise)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePrise(prise)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            title={`Supprimer la prise "${prise.reference}"`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}


      </CardContent>

      {/* Modal pour afficher les images */}
      <ImageModal
        images={modalImages}
        currentIndex={modalCurrentIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Photos de la prise électrique"
      />

      {/* Modal d'ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle prise électrique</DialogTitle>
          </DialogHeader>
          <PriseElectriqueFormComponent
            onSubmit={handleAddPrise}
            onCancel={() => setShowAddModal(false)}
            isEditing={false}
            installationId={installationId}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la prise électrique</DialogTitle>
          </DialogHeader>
          {editingPrise && (
            <PriseElectriqueFormComponent
              initialData={{
                id: editingPrise.id,
                installation_id: editingPrise.installation_id,
                reference: editingPrise.reference,
                etat: editingPrise.etat,
                commentaire: editingPrise.commentaire || "",
                localisation: editingPrise.localisation || "",
                avec_terre: editingPrise.avec_terre || false,
                ordre: editingPrise.ordre || 1,
                photos: [], // Les photos existantes seront gérées séparément
              }}
              onSubmit={handleUpdatePrise}
              onCancel={() => {
                setShowEditModal(false);
                setEditingPrise(null);
              }}
              isEditing={true}
              installationId={installationId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        title="Supprimer la prise électrique"
        description={
          priseToDelete
            ? `Êtes-vous sûr de vouloir supprimer la prise "${priseToDelete.reference}" ? Cette action est irréversible et supprimera également toutes les photos associées.`
            : ""
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </Card>
  );
}
