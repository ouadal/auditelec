'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Save, Plus, Trash2, Image as ImageIcon, Eye, Edit } from 'lucide-react';
import { InterrupteurForm as InterrupteurFormComponent } from '@/components/electrical/InterrupteurForm';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { interrupteurService } from '../../../services/electricalApi';
import { Interrupteur, InterrupteurForm } from '@/types/electrical';
import { ImageModal } from '@/components/ui/image-modal';

interface InterrupteurSectionProps {
  installationId?: number;
}

export function InterrupteurSection({ installationId = 1 }: InterrupteurSectionProps) {
  const [interrupteurs, setInterrupteurs] = useState<Interrupteur[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInterrupteur, setEditingInterrupteur] = useState<Interrupteur | null>(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [interrupteurToDelete, setInterrupteurToDelete] = useState<Interrupteur | null>(null);
  const { toast } = useToast();

  // Charger les interrupteurs existants
  useEffect(() => {
    loadInterrupteurs();
  }, [installationId]);

  const loadInterrupteurs = async () => {
    try {
      setLoading(true);
      const response = await interrupteurService.getByInstallation(installationId);
      console.log('🔍 Réponse API interrupteurs:', response);
      if (response.success) {
        console.log('📋 Données interrupteurs:', response.data);
        response.data?.forEach((interrupteur: any, index: number) => {
          console.log(`📸 Interrupteur ${index + 1} (${interrupteur.reference}):`, {
            id: interrupteur.id,
            photos: interrupteur.photo_interrupteur,
            photosType: typeof interrupteur.photo_interrupteur,
            photosLength: interrupteur.photo_interrupteur?.length
          });
        });
        setInterrupteurs(response.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interrupteurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les interrupteurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterrupteur = async (formData: InterrupteurForm) => {
    try {
      setSaving(true);
      const response = await interrupteurService.create(formData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Interrupteur ajouté avec succès",
        });
        setShowAddModal(false);
        await loadInterrupteurs();
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'interrupteur:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      let errorMessage = "Erreur lors de l'ajout de l'interrupteur";
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
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

  const handleEditInterrupteur = (interrupteur: Interrupteur) => {
    setEditingInterrupteur(interrupteur);
    setShowEditModal(true);
  };

  const handleUpdateInterrupteur = async (formData: InterrupteurForm) => {
    if (!editingInterrupteur?.id) return;
    
    try {
      setSaving(true);
      const response = await interrupteurService.update(editingInterrupteur.id, formData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Interrupteur modifié avec succès",
        });
        setShowEditModal(false);
        setEditingInterrupteur(null);
        await loadInterrupteurs();
      }
    } catch (error: any) {
      console.error("Erreur lors de la modification:", error);
      let errorMessage = "Erreur lors de la modification de l'interrupteur";
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

  const handleDeleteInterrupteur = (interrupteur: Interrupteur) => {
    setInterrupteurToDelete(interrupteur);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!interrupteurToDelete?.id) {
      console.error("❌ Pas d'ID pour l'interrupteur à supprimer:", interrupteurToDelete);
      return;
    }
    
    console.log("🗑️ Suppression de l'interrupteur:", {
      id: interrupteurToDelete.id,
      reference: interrupteurToDelete.reference
    });
    
    try {
      const response = await interrupteurService.delete(interrupteurToDelete.id);
      console.log("✅ Réponse de suppression:", response);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: `Interrupteur "${interrupteurToDelete.reference}" supprimé avec succès`,
        });
        await loadInterrupteurs();
      } else {
        console.error("❌ Échec de la suppression:", response);
        toast({
          title: "Erreur",
          description: response.message || "Erreur lors de la suppression de l'interrupteur",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la suppression:", error);
      console.error("❌ Détails de l'erreur:", error.response?.data);
      
      let errorMessage = "Erreur lors de la suppression de l'interrupteur";
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
      setInterrupteurToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setInterrupteurToDelete(null);
  };



  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Les interrupteurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Chargement des interrupteurs..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Les interrupteurs</CardTitle>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un interrupteur
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Les interrupteurs sont maintenant ajoutés via modale */}

        {/* Tableau des interrupteurs existants */}
        {interrupteurs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Interrupteurs enregistrés ({interrupteurs.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="w-12">
                      <span className="text-blue-600">💡</span>
                    </TableHead>
                    <TableHead className="font-semibold">Référence</TableHead>
                    <TableHead className="font-semibold">État</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Localisation</TableHead>
                    <TableHead className="font-semibold text-center">Photos</TableHead>
                    <TableHead className="font-semibold">Commentaires</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interrupteurs.map((interrupteur) => (
                    <TableRow key={interrupteur.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">{interrupteur.ordre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">{interrupteur.reference}</div>
                        <div className="text-xs text-gray-500">ID: {interrupteur.id}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          interrupteur.etat === 'bon' ? 'bg-emerald-100 text-emerald-700' :
                          interrupteur.etat === 'defectueux' ? 'bg-red-100 text-red-700' :
                          interrupteur.etat === 'a_remplacer' ? 'bg-amber-100 text-amber-700' :
                          interrupteur.etat === 'manquant' ? 'bg-gray-100 text-gray-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {interrupteur.etat === 'bon' ? 'Bon' :
                           interrupteur.etat === 'defectueux' ? 'Défectueux' :
                           interrupteur.etat === 'non_installe' ? 'Non installé' :
                           interrupteur.etat === 'a_remplacer' ? 'À remplacer' :
                           interrupteur.etat === 'manquant' ? 'Manquant' : interrupteur.etat}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          interrupteur.type_interrupteur === 'simple' ? 'bg-blue-100 text-blue-700' :
                          interrupteur.type_interrupteur === 'double' ? 'bg-purple-100 text-purple-700' :
                          interrupteur.type_interrupteur === 'va_et_vient' ? 'bg-orange-100 text-orange-700' :
                          interrupteur.type_interrupteur === 'poussoir' ? 'bg-green-100 text-green-700' :
                          interrupteur.type_interrupteur === 'variateur' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {interrupteur.type_interrupteur === 'simple' ? 'Simple' :
                           interrupteur.type_interrupteur === 'double' ? 'Double' :
                           interrupteur.type_interrupteur === 'va_et_vient' ? 'Va-et-vient' :
                           interrupteur.type_interrupteur === 'poussoir' ? 'Poussoir' :
                           interrupteur.type_interrupteur === 'variateur' ? 'Variateur' :
                           interrupteur.type_interrupteur === 'detecteur' ? 'Détecteur' :
                           interrupteur.type_interrupteur}
                        </span>
                      </TableCell>
                      <TableCell>
                        {interrupteur.localisation ? (
                          <span className="text-sm text-gray-700">{interrupteur.localisation}</span>
                        ) : (
                          <span className="text-xs text-gray-400">Non spécifié</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {interrupteur.photo_interrupteur && interrupteur.photo_interrupteur.length > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setModalImages(interrupteur.photo_interrupteur || []);
                              setModalCurrentIndex(0);
                              setIsModalOpen(true);
                            }}
                            className="h-8 px-2"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {interrupteur.photo_interrupteur.length}
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">Aucune</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {interrupteur.commentaire ? (
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-700 truncate" title={interrupteur.commentaire}>
                              {interrupteur.commentaire}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInterrupteur(interrupteur)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInterrupteur(interrupteur)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            title={`Supprimer l'interrupteur "${interrupteur.reference}"`}
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
        title="Photos de l'interrupteur"
      />

      {/* Modal d'ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel interrupteur</DialogTitle>
          </DialogHeader>
          <InterrupteurFormComponent
            onSubmit={handleAddInterrupteur}
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
            <DialogTitle>Modifier l'interrupteur</DialogTitle>
          </DialogHeader>
          {editingInterrupteur && (
            <InterrupteurFormComponent
              initialData={{
                id: editingInterrupteur.id,
                installation_id: editingInterrupteur.installation_id,
                reference: editingInterrupteur.reference,
                etat: editingInterrupteur.etat,
                commentaire: editingInterrupteur.commentaire || "",
                localisation: editingInterrupteur.localisation || "",
                type_interrupteur: editingInterrupteur.type_interrupteur || "simple",
                ordre: editingInterrupteur.ordre || 1,
                photos: [], // Les photos existantes seront gérées séparément
              }}
              onSubmit={handleUpdateInterrupteur}
              onCancel={() => {
                setShowEditModal(false);
                setEditingInterrupteur(null);
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
        title="Supprimer l'interrupteur"
        description={
          interrupteurToDelete
            ? `Êtes-vous sûr de vouloir supprimer l'interrupteur "${interrupteurToDelete.reference}" ? Cette action est irréversible et supprimera également toutes les photos associées.`
            : ""
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </Card>
  );
}