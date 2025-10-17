"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Building } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "@/components/ui/modal";

import { InstallationForm } from "@/components/electrical/InstallationForm";
import { PriseElectriqueSection } from "@/components/electrical/PriseElectriqueSection";
import { InterrupteurSection } from "@/components/electrical/InterrupteurSection";
import { InstallationCard } from "@/components/electrical/InstallationCard";
import { PhotoModal } from "@/components/electrical/PhotoModal";
import { ZoomModal } from "@/components/electrical/ZoomModal";
import { ClientSelector } from "@/components/electrical/ClientSelector";
import { installationService } from "../../../../services/electricalApi";
import {
  Installation,
  InstallationForm as InstallationFormType,
} from "@/types/electrical";

export default function ElectricalPage() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [allInstallations, setAllInstallations] = useState<Installation[]>([]);
  const [selectedInstallation, setSelectedInstallation] =
    useState<Installation | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInstallationForm, setShowInstallationForm] = useState(false);
  const [editingInstallation, setEditingInstallation] =
    useState<Installation | null>(null);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  const { toast } = useToast();

  // Charger les installations au démarrage
  useEffect(() => {
    loadInstallations();
  }, []);

  const loadInstallations = async () => {
    try {
      setLoading(true);
      const response = await installationService.getAll();
      console.log("Installations chargées:", response);

      const installations = response.data || [];
      setAllInstallations(installations);
      
      // Filtrer par client si un client est sélectionné
      filterInstallationsByClient(installations, selectedClientId);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les installations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInstallationsByClient = (installations: Installation[], clientId: number | null) => {
    let filteredInstallations = installations;
    
    if (clientId) {
      filteredInstallations = installations.filter(
        installation => installation.client_id === clientId
      );
    }
    
    setInstallations(filteredInstallations);
    
    // Sélectionner la première installation filtrée ou réinitialiser
    if (filteredInstallations.length > 0) {
      // Si l'installation actuellement sélectionnée n'est plus dans la liste filtrée
      if (!selectedInstallation || !filteredInstallations.find(i => i.id === selectedInstallation.id)) {
        setSelectedInstallation(filteredInstallations[0]);
      }
    } else {
      setSelectedInstallation(null);
    }
  };

  const handleClientSelect = (clientId: number | null) => {
    setSelectedClientId(clientId);
    filterInstallationsByClient(allInstallations, clientId);
  };

  const handleInstallationSelect = (installation: Installation) => {
    setSelectedInstallation(installation);
  };

  const handleInstallationSubmit = async (formData: InstallationFormType) => {
    try {
      setLoading(true);

      if (editingInstallation) {
        await installationService.update(editingInstallation.id!, formData);
        toast({
          title: "Succès",
          description: "Installation modifiée avec succès",
        });
      } else {
        await installationService.create(formData);
        toast({
          title: "Succès",
          description: "Installation créée avec succès",
        });
      }

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

  const handleViewPhotos = (
    installation: Installation,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingInstallation(installation);
    setShowPhotosModal(true);
  };

  const handleClosePhotosModal = () => {
    setShowPhotosModal(false);
    setEditingInstallation(null);
  };

  const handleDeleteInstallation = async (installation: Installation) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette installation ?"))
      return;

    try {
      await installationService.delete(installation.id!);
      toast({
        title: "Succès",
        description: "Installation supprimée avec succès",
      });
      await loadInstallations();
      if (selectedInstallation?.id === installation.id) {
        setSelectedInstallation(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'installation",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner
          size="lg"
          text="Chargement des installations électriques..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de client */}
      <ClientSelector
        selectedClientId={selectedClientId}
        onClientSelect={handleClientSelect}
        onRefresh={loadInstallations}
      />

      {/* En-tête avec sélecteur d'installation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Installations Électriques</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Gestion des installations, prises et interrupteurs
                </p>
              </div>
            </div>
            <Button onClick={() => setShowInstallationForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Installation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {installations.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune installation trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Label>Sélectionner une installation :</Label>
              <div className="grid gap-3">
                {installations.map((installation) => (
                  <InstallationCard
                    key={installation.id}
                    installation={installation}
                    isSelected={selectedInstallation?.id === installation.id}
                    onSelect={handleInstallationSelect}
                    onEdit={(installation, e) => {
                      e.stopPropagation();
                      setEditingInstallation(installation);
                      setShowInstallationForm(true);
                    }}
                    onDelete={handleDeleteInstallation}
                    onViewPhotos={handleViewPhotos}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section des équipements */}
      {selectedInstallation && (
        <div className="space-y-6">
          {/* Section Prises Électriques */}
          <PriseElectriqueSection installationId={selectedInstallation.id} />

          {/* Section Interrupteurs */}
          <InterrupteurSection installationId={selectedInstallation.id} />
        </div>
      )}

      {/* MODALE FORMULAIRE INSTALLATION */}
      <Modal
        isOpen={showInstallationForm}
        onClose={handleInstallationCancel}
        title={
          editingInstallation
            ? "Modifier l'installation"
            : "Nouvelle installation électrique"
        }
        size="xl"
      >
        <div className="p-6">
          <InstallationForm
            initialData={
              editingInstallation
                ? {
                    client_id: editingInstallation.client_id,
                    type_compteur: editingInstallation.type_compteur,
                    configuration_compteur:
                      editingInstallation.configuration_compteur,
                    amperage: editingInstallation.amperage,
                    composantes_coffret:
                      editingInstallation.composantes_coffret || "",
                    cable_type: editingInstallation.cable_type || "",
                    commentaire_cable:
                      editingInstallation.commentaire_cable || "",
                    protection_terre:
                      editingInstallation.protection_terre || false,
                    barette_de_coupure:
                      editingInstallation.barette_de_coupure || false,
                    valeur_terre: editingInstallation.valeur_terre || 0,
                    terre_dans_pc: editingInstallation.terre_dans_pc || false,
                    presence_differentiel:
                      editingInstallation.presence_differentiel || false,
                    commentaire_terre:
                      editingInstallation.commentaire_terre || "",
                    date_installation: editingInstallation.date_installation,
                    photo_coffret: [],
                    photo_cable_electrique: [],
                    photo_type_cable: [],
                    photo_barette_coupure: [],
                    photo_terre_pc: [],
                  }
                : undefined
            }
            onSubmit={handleInstallationSubmit}
            onCancel={handleInstallationCancel}
            isEditing={!!editingInstallation}
          />
        </div>
      </Modal>

      {/* MODALE PHOTOS */}
      <PhotoModal
        isOpen={showPhotosModal}
        onClose={handleClosePhotosModal}
        installation={editingInstallation}
        onPhotoClick={setZoomedPhoto}
      />

      {/* MODALE ZOOM PHOTO */}
      <ZoomModal photoUrl={zoomedPhoto} onClose={() => setZoomedPhoto(null)} />
    </div>
  );
}