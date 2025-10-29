"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiHelpers } from "../../../../services/apiHelpers";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Save, 
  ArrowLeft, 
  Building, 
  Plus, 
  MapPin, 
  Eye,
  Settings,
  Edit,
  X,
  Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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

interface Projet {
  id: number;
  contact_nom: string;
  contact_email: string;
  nom_entreprise?: string;
}

interface BatimentData {
  id?: number;
  client_id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
  annee_mise_service: number;
  type_fonction: string;
  surface_construite: number;
  type_bail: string;
  nombre_etages: number;
  forme_batiment: string;
  hauteur_moyenne: number;
  perimetre: number;
  nb_travailleurs: number;
  surface_climatisee: number;
  surface_totale: number;
}

interface Batiment {
  id: number;
  client_id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
  annee_mise_service: number;
  type_fonction: string;
  surface_construite: number;
  type_bail: string;
  nombre_etages: number;
  forme_batiment: string;
  hauteur_moyenne: number;
  perimetre: number;
  nb_travailleurs: number;
  surface_climatisee: number;
  surface_totale: number;
  projet?: {
    id: number;
    contact_nom: string;
    contact_email: string;
  };
}

export default function BuildingInfoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const batimentId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [loadingBatiments, setLoadingBatiments] = useState(true);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [showForm, setShowForm] = useState(!!batimentId);
  const [editingId, setEditingId] = useState<number | null>(batimentId ? parseInt(batimentId) : null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [batimentToDelete, setBatimentToDelete] = useState<Batiment | null>(null);
  const [formData, setFormData] = useState<BatimentData>({
    client_id: 0,
    nom_batiment: '',
    adresse_site: '',
    commune: '',
    annee_mise_service: new Date().getFullYear(),
    type_fonction: '',
    surface_construite: 0,
    type_bail: '',
    nombre_etages: 0,
    forme_batiment: '',
    hauteur_moyenne: 0,
    perimetre: 0,
    nb_travailleurs: 0,
    surface_climatisee: 0,
    surface_totale: 0,
  });

  const isEditing = !!editingId;

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now();
      try {
        console.log('🚀 Début du chargement des données...');
        
        // Charger projets et bâtiments EN PARALLÈLE pour gagner du temps
        const [projetsResponse, batimentsResponse] = await Promise.all([
          apiHelpers.clients.getAll(),
          apiHelpers.batiments.getAll()
        ]);
        
        const loadTime = Date.now() - startTime;
        console.log(`⚡ Données chargées en ${loadTime}ms`);
        console.log('🔍 Structure de la réponse projets:', projetsResponse.data);
        
        // Traiter les projets (structure des routes protégées)
        const projetsData = projetsResponse.data?.data || [];
        console.log('📊 Projets extraits:', projetsData);
        setProjets(Array.isArray(projetsData) ? projetsData : []);
        
        // Traiter les bâtiments (structure des routes protégées)
        setBatiments(Array.isArray(batimentsResponse.data.data) ? batimentsResponse.data.data : batimentsResponse.data || []);

        // Si en mode édition, charger le bâtiment
        if (batimentId) {
          setEditingId(parseInt(batimentId));
          const batimentResponse = await apiHelpers.batiments.getById(batimentId);
          console.log('Réponse bâtiment:', batimentResponse.data); // Debug
          
          if (batimentResponse.data.success && batimentResponse.data.data) {
            const batiment = batimentResponse.data.data.batiment;
            setFormData({
              id: batiment.id,
              client_id: batiment.client_id || 0,
              nom_batiment: batiment.nom_batiment || '',
              adresse_site: batiment.adresse_site || '',
              commune: batiment.commune || '',
              annee_mise_service: batiment.annee_mise_service || new Date().getFullYear(),
              type_fonction: batiment.type_fonction || '',
              surface_construite: batiment.surface_construite || 0,
              type_bail: batiment.type_bail || '',
              nombre_etages: batiment.nombre_etages || 0,
              forme_batiment: batiment.forme_batiment || '',
              hauteur_moyenne: batiment.hauteur_moyenne || 0,
              perimetre: batiment.perimetre || 0,
              nb_travailleurs: batiment.nb_travailleurs || 0,
              surface_climatisee: batiment.surface_climatisee || 0,
              surface_totale: batiment.surface_totale || 0,
            });
          } else if (batimentResponse.data && !batimentResponse.data.success) {
            // Essayer de charger directement si la structure est différente
            const batiment = batimentResponse.data;
            setFormData({
              id: batiment.id,
              client_id: batiment.client_id || 0,
              nom_batiment: batiment.nom_batiment || '',
              adresse_site: batiment.adresse_site || '',
              commune: batiment.commune || '',
              annee_mise_service: batiment.annee_mise_service || new Date().getFullYear(),
              type_fonction: batiment.type_fonction || '',
              surface_construite: batiment.surface_construite || 0,
              type_bail: batiment.type_bail || '',
              nombre_etages: batiment.nombre_etages || 0,
              forme_batiment: batiment.forme_batiment || '',
              hauteur_moyenne: batiment.hauteur_moyenne || 0,
              perimetre: batiment.perimetre || 0,
              nb_travailleurs: batiment.nb_travailleurs || 0,
              surface_climatisee: batiment.surface_climatisee || 0,
              surface_totale: batiment.surface_totale || 0,
            });
          }
        }
      } catch (error) {
          // Log détaillé pour diagnostiquer les erreurs 500 renvoyées par le backend
          console.error('❌ Erreur lors du chargement:', error);
          try {
            // axios error shape
            // @ts-ignore
            const resp = error?.response;
            if (resp) {
              console.error('Response status:', resp.status);
              console.error('Response data:', resp.data);
              toast({
                title: `Erreur ${resp.status}`,
                description: resp.data?.message || 'Erreur lors du chargement des données',
                variant: 'destructive',
              });
            } else {
              toast({
                title: "Erreur",
                description: "Erreur lors du chargement des données",
                variant: "destructive",
              });
            }
          } catch (e) {
            console.error('Erreur lors du traitement de l\'erreur:', e);
            toast({ title: "Erreur", description: "Erreur lors du chargement des données", variant: "destructive" });
          }
      } finally {
        const totalTime = Date.now() - startTime;
        console.log(`🏁 Chargement terminé en ${totalTime}ms`);
        setLoadingBatiments(false);
      }
    };

    loadData();
  }, [batimentId, toast]);

  const handleInputChange = (field: keyof BatimentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      client_id: 0,
      nom_batiment: '',
      adresse_site: '',
      commune: '',
      annee_mise_service: new Date().getFullYear(),
      type_fonction: '',
      surface_construite: 0,
      type_bail: '',
      nombre_etages: 0,
      forme_batiment: '',
      hauteur_moyenne: 0,
      perimetre: 0,
      nb_travailleurs: 0,
      surface_climatisee: 0,
      surface_totale: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation rapide côté client avant d'envoyer au serveur
    const currentYear = new Date().getFullYear();
    const requiredFields = {
      client_id: 'Projet',
      nom_batiment: 'Nom du bâtiment',
      adresse_site: 'Adresse du site',
      commune: 'Commune',
      type_fonction: 'Type/Fonction du bâtiment',
      type_bail: 'Type de bail',
      forme_batiment: 'Forme du bâtiment'
    };

    // Vérifier tous les champs requis d'un coup
    const missingFields = Object.entries(requiredFields)
      .filter(([field, label]) => !formData[field as keyof typeof formData])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      toast({
        title: 'Champs requis manquants',
        description: `Veuillez remplir : ${missingFields.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }

    // Validation de l'année
    if (formData.annee_mise_service > 0 && (formData.annee_mise_service < 1900 || formData.annee_mise_service > currentYear + 5)) {
      toast({
        title: 'Erreur',
        description: `L'année de mise en service doit être entre 1900 et ${currentYear + 5}`,
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Fermer le formulaire immédiatement pour une meilleure UX
      setShowForm(false);
      window.scrollTo(0, 0);

      // Appel API pour créer ou mettre à jour le bâtiment
      if (isEditing) {
        await apiHelpers.batiments.update(editingId!, formData);
        toast({
          title: "Succès",
          description: "Bâtiment mis à jour avec succès"
        });
      } else {
        await apiHelpers.batiments.create(formData);
        toast({
          title: "Succès",
          description: "Bâtiment créé avec succès"
        });
        // Réinitialiser le formulaire après création
        resetForm();
      }

      // Recharger la liste des bâtiments
      const response = await apiHelpers.batiments.getAll();
      setBatiments(response.data?.data || []);

    } catch (error: any) {
      console.error('Erreur:', error);
      // Réafficher le formulaire en cas d'erreur
      setShowForm(true);
      
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la sauvegarde du bâtiment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoirPieces = (batimentId: number) => {
    router.push(`/dashboard/audit?batiment_id=${batimentId}`);
  };

  const handleEditBatiment = (batiment: Batiment) => {
    console.log('🔧 Modification du bâtiment:', batiment.nom_batiment, 'ID:', batiment.id);
    
    // Remplir le formulaire avec les données du bâtiment
    setFormData({
      id: batiment.id,
      client_id: batiment.client_id || 0,
      nom_batiment: batiment.nom_batiment || '',
      adresse_site: batiment.adresse_site || '',
      commune: batiment.commune || '',
      annee_mise_service: batiment.annee_mise_service || new Date().getFullYear(),
      type_fonction: batiment.type_fonction || '',
      surface_construite: batiment.surface_construite || 0,
      type_bail: batiment.type_bail || '',
      nombre_etages: batiment.nombre_etages || 0,
      forme_batiment: batiment.forme_batiment || '',
      hauteur_moyenne: batiment.hauteur_moyenne || 0,
      perimetre: batiment.perimetre || 0,
      nb_travailleurs: batiment.nb_travailleurs || 0,
      surface_climatisee: batiment.surface_climatisee || 0,
      surface_totale: batiment.surface_totale || 0,
    });
    
    // Définir l'ID en cours d'édition et ouvrir le formulaire
    setEditingId(batiment.id);
    setShowForm(true);
    router.push(`/dashboard/building-info?id=${batiment.id}`);
  };

  const handleNewBatiment = () => {
    // Réinitialiser l'URL et le formulaire
    router.push('/dashboard/building-info');
    setEditingId(null);
    resetForm();
    setShowForm(true);
    // Scroll to top for better UX
    window.scrollTo(0, 0);
  };

  const handleCancelForm = () => {
    if (isEditing) {
      // Fermer le formulaire côté client immédiatement
      // pour éviter d'avoir à cliquer deux fois (une pour retirer l'ID de l'url,
      // une autre pour fermer l'affichage)
      setShowForm(false);
      setEditingId(null);
      resetForm();
      // Naviguer vers la liste sans paramètre
      router.push('/dashboard/building-info');
    } else {
      setShowForm(false);
      resetForm();
    }
  };

  // Open confirmation dialog for deletion
  const handleDeleteBatiment = (batiment: Batiment, e: React.MouseEvent) => {
    e.stopPropagation();
    setBatimentToDelete(batiment);
    setShowDeleteDialog(true);
  };

  // Confirmed delete from dialog -> perform optimistic delete with undoable toast
  const confirmDeleteBatiment = async () => {
    if (!batimentToDelete) return;

    const previous = [...batiments];
    const target = batimentToDelete;

    try {
      setLoading(true);

      // Remove immediately for instant feedback
      setBatiments(prev => prev.filter(b => b.id !== target.id));

      let cancelled = false;
      const undo = () => {
        cancelled = true;
        setBatiments(previous);
        toast({ title: 'Annulé', description: 'Suppression annulée', variant: 'default' });
      };

      toast({
        title: 'Suppression',
        description: `Bâtiment "${target.nom_batiment}" supprimé (Annuler dans 4s)`,
        variant: 'destructive',
        action: (
          <Button variant="ghost" size="sm" onClick={undo}>
            Annuler
          </Button>
        )
      });

      // wait 4s to allow undo
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 4000));
      if (cancelled) return;

      await apiHelpers.batiments.delete(target.id);
      toast({ title: 'Succès', description: `Bâtiment "${target.nom_batiment}" supprimé` });

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression:', error);
      setBatiments(previous);
      let errorMessage = "Erreur lors de la suppression du bâtiment";
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      toast({ title: 'Erreur', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setBatimentToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">

      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Bâtiments</h1>
        </div>
        {!showForm && (
          <Button onClick={handleNewBatiment}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Bâtiment
          </Button>
        )}
      </div>

      {/* Formulaire (conditionnel) */}
      {showForm && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Modifier le Bâtiment' : 'Nouveau Bâtiment'}
            </h2>
            <Button variant="outline" size="sm" onClick={handleCancelForm}>
              <X className="mr-2 h-4 w-4" />
              {isEditing ? 'Retour à la liste' : 'Annuler'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projet">Projet *</Label>
                  <Select 
                    value={formData.client_id > 0 ? formData.client_id.toString() : ""} 
                    onValueChange={(value) => handleInputChange('client_id', parseInt(value))}
                    autoComplete="off"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projets.map((projet) => (
                        <SelectItem key={projet.id} value={projet.id.toString()}>
                          {projet.contact_nom} ({projet.nom_entreprise || "Nom du projet"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {projets.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucun projet disponible. <button 
                        onClick={() => router.push('/dashboard/clients')}
                        className="text-primary hover:underline"
                      >
                        Créer un projet d'abord
                      </button>
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="building-name">Nom du bâtiment *</Label>
                  <Input 
                    id="building-name" 
                    placeholder="ex: Siège Social - Bâtiment A1"
                    value={formData.nom_batiment}
                    onChange={(e) => {
                      handleInputChange('nom_batiment', e.target.value);
                    }}
                    maxLength={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-address">Adresse du bâtiment *</Label>
                  <Input 
                    id="site-address" 
                    placeholder="ex: 123 Rue de la République, BP 456"
                    value={formData.adresse_site}
                    onChange={(e) => {
                      handleInputChange('adresse_site', e.target.value);
                    }}
                    maxLength={255}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commune">Commune *</Label>
                  <Input 
                    id="commune" 
                    placeholder="ex: Cotonou"
                    value={formData.commune}
                    onChange={(e) => {
                      // Permettre les lettres, chiffres, espaces, tirets et apostrophes
                      const value = e.target.value.replace(/[^a-zA-Z0-9À-ÿ\s\-']/g, '');
                      handleInputChange('commune', value);
                    }}
                    maxLength={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-year">Année de mise en service</Label>
                  <Input 
                    id="service-year" 
                    type="number" 
                    placeholder="ex: 2010"
                    value={formData.annee_mise_service}
                    onChange={(e) => {
                      const year = parseInt(e.target.value) || 0;
                      const currentYear = new Date().getFullYear();
                      
                      // Limiter entre 1900 et année actuelle + 5 ans
                      if (year > 0 && (year < 1900 || year > currentYear + 5)) {
                        toast({
                          title: "Année invalide",
                          description: `L'année doit être entre 1900 et ${currentYear + 5}`,
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      handleInputChange('annee_mise_service', year);
                    }}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="building-type">Type/Fonction du bâtiment</Label>
                  <Input 
                    id="building-type" 
                    placeholder="ex: Bureaux administratifs"
                    value={formData.type_fonction}
                    onChange={(e) => {
                      // Permettre lettres, espaces et caractères spéciaux courants
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-'().,/]/g, '');
                      handleInputChange('type_fonction', value);
                    }}
                    maxLength={100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails du Bâtiment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="built-surface">Surface construite (m²)</Label>
                  <Input 
                    id="built-surface" 
                    type="number" 
                    placeholder="ex: 1500"
                    value={formData.surface_construite}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (value < 0) {
                        toast({
                          title: "Valeur invalide",
                          description: "La surface ne peut pas être négative",
                          variant: "destructive",
                        });
                        return;
                      }
                      handleInputChange('surface_construite', value);
                    }}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lease-type">Type de bail</Label>
                  <Input 
                    id="lease-type" 
                    placeholder="ex: Propriétaire"
                    value={formData.type_bail}
                    onChange={(e) => {
                      // Permettre seulement les lettres, espaces, tirets et apostrophes
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                      handleInputChange('type_bail', value);
                    }}
                    maxLength={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="floors">Nombre d'étages</Label>
                  <Input 
                    id="floors" 
                    type="number" 
                    placeholder="ex: 5"
                    value={formData.nombre_etages}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (value < 0 || value > 200) {
                        toast({
                          title: "Valeur invalide",
                          description: "Le nombre d'étages doit être entre 0 et 200",
                          variant: "destructive",
                        });
                        return;
                      }
                      handleInputChange('nombre_etages', value);
                    }}
                    min="0"
                    max="200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="building-shape">Forme du bâtiment</Label>
                  <Input 
                    id="building-shape" 
                    placeholder="ex: Rectangulaire"
                    value={formData.forme_batiment}
                    onChange={(e) => {
                      // Permettre seulement les lettres, espaces, tirets et apostrophes
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                      handleInputChange('forme_batiment', value);
                    }}
                    maxLength={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avg-floor-height">Hauteur moyenne d'un étage (m)</Label>
                  <Input 
                    id="avg-floor-height" 
                    type="number" 
                    step="0.1"
                    placeholder="ex: 3.5"
                    value={formData.hauteur_moyenne}
                    onChange={(e) => handleInputChange('hauteur_moyenne', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="perimeter">Périmètre du bâtiment (m)</Label>
                  <Input 
                    id="perimeter" 
                    type="number" 
                    placeholder="ex: 200"
                    value={formData.perimetre}
                    onChange={(e) => handleInputChange('perimetre', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workers">Nombre de travailleurs</Label>
                  <Input 
                    id="workers" 
                    type="number" 
                    placeholder="ex: 80"
                    value={formData.nb_travailleurs}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (value < 0 || value > 10000) {
                        toast({
                          title: "Valeur invalide",
                          description: "Le nombre de travailleurs doit être entre 0 et 10000",
                          variant: "destructive",
                        });
                        return;
                      }
                      handleInputChange('nb_travailleurs', value);
                    }}
                    min="0"
                    max="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ac-surface">Surface climatisée (m²)</Label>
                  <Input 
                    id="ac-surface" 
                    type="number" 
                    placeholder="ex: 1200"
                    value={formData.surface_climatisee}
                    onChange={(e) => handleInputChange('surface_climatisee', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
                  <Label htmlFor="total-surface">Surface totale du bâtiment (m²)</Label>
                  <Input 
                    id="total-surface" 
                    type="number" 
                    placeholder="ex: 2500"
                    value={formData.surface_totale}
                    onChange={(e) => handleInputChange('surface_totale', parseFloat(e.target.value) || 0)}
                  />
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
            <Button 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Mettre à jour' : 'Créer le Bâtiment'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Liste des bâtiments */}
      {!showForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Bâtiments existants</h2>
              <p className="text-sm text-muted-foreground">
                Cliquez sur une carte pour voir les pièces, ou utilisez les icônes pour modifier/supprimer
              </p>
            </div>
            <p className="text-muted-foreground">
              {batiments.length} bâtiment{batiments.length > 1 ? 's' : ''} enregistré{batiments.length > 1 ? 's' : ''}
            </p>
          </div>

          {loadingBatiments ? (
            <LoadingPage text="Chargement des bâtiments..." />
          ) : batiments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun bâtiment trouvé</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Commencez par ajouter un bâtiment pour pouvoir gérer vos audits
                </p>
                <Button onClick={handleNewBatiment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un bâtiment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {batiments.map((batiment) => (
                <Card 
                  key={batiment.id} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    batimentId && parseInt(batimentId) === batiment.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : ''
                  }`}
                  onClick={() => handleVoirPieces(batiment.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{batiment.nom_batiment}</CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {batiment.nombre_etages} étage{batiment.nombre_etages > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{batiment.commune}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{batiment.type_fonction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adresse:</span>
                        <span className="text-right">{batiment.adresse_site}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commune:</span>
                        <span>{batiment.commune}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Surface totale:</span>
                        <span>{batiment.surface_totale} m²</span>
                      </div>
                      {batiment.projet && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projet:</span>
                          <span className="text-right">{batiment.projet.contact_nom}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Empêcher la double sélection
                          handleEditBatiment(batiment);
                        }}
                        title="Modifier le bâtiment"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => handleDeleteBatiment(batiment, e)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Supprimer le bâtiment"
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
    </div>
      {/* Delete confirmation dialog (matches clients style + undoable toast) */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bâtiment ? Cette action est irréversible et supprimera également toutes les pièces associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBatiment}
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
    </>
  );
}