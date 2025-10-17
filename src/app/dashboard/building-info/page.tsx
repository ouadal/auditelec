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
  Users, 
  Calendar,
  Eye,
  Settings,
  Edit,
  X,
  Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: number;
  contact_nom: string;
  contact_email: string;
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
  client?: {
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
  const [clients, setClients] = useState<Client[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [showForm, setShowForm] = useState(!!batimentId);
  const [editingId, setEditingId] = useState<number | null>(batimentId ? parseInt(batimentId) : null);
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
        
        // Charger clients et bâtiments EN PARALLÈLE pour gagner du temps
        const [clientsResponse, batimentsResponse] = await Promise.all([
          apiHelpers.clients.getAll(),
          apiHelpers.batiments.getAll()
        ]);
        
        const loadTime = Date.now() - startTime;
        console.log(`⚡ Données chargées en ${loadTime}ms`);
        
        // Traiter les clients (structure des routes protégées)
        setClients(Array.isArray(clientsResponse.data) ? clientsResponse.data : []);
        
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
        console.error('❌ Erreur lors du chargement:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données",
          variant: "destructive",
        });
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

  const handleSubmit = async () => {
    console.log('💾 handleSubmit déclenché');
    console.log('📝 Données du formulaire:', formData);
    console.log('🔄 Mode édition:', isEditing);
    console.log('🆔 batimentId:', batimentId);
    
    // Validation basique
    if (!formData.nom_batiment || !formData.adresse_site || !formData.commune) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (formData.client_id === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        console.log('🔄 Mode mise à jour - Appel API update avec ID:', batimentId);
        
        // Utiliser l'ID en cours d'édition
        const idToUpdate = editingId!;
        console.log('🆔 ID utilisé pour la mise à jour:', idToUpdate);
        
        // Mise à jour
        const response = await apiHelpers.batiments.update(idToUpdate, formData);
        console.log('✅ Réponse API update:', response);
        toast({
          title: "Succès",
          description: "Bâtiment mis à jour avec succès",
        });
      } else {
        console.log('➕ Mode création - Appel API create');
        // Création
        const response = await apiHelpers.batiments.create(formData);
        console.log('✅ Réponse API create:', response);
        toast({
          title: "Succès",
          description: "Bâtiment créé avec succès",
        });
        resetForm();
      }

      // Recharger la liste des bâtiments
      const batimentsResponse = await apiHelpers.batiments.getAll();
      setBatiments(Array.isArray(batimentsResponse.data.data) ? batimentsResponse.data.data : []);
      
      // Fermer le formulaire et réinitialiser
      if (!isEditing) {
        setShowForm(false);
      } else {
        // En mode édition, retourner à la liste
        setShowForm(false);
        setEditingId(null);
        router.push('/dashboard/building-info');
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      let errorMessage = "Erreur lors de la sauvegarde";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
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
  };

  const handleCancelForm = () => {
    if (isEditing) {
      router.push('/dashboard/building-info');
      setEditingId(null);
    } else {
      setShowForm(false);
      resetForm();
    }
  };

  const handleDeleteBatiment = async (batiment: Batiment, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la sélection de la carte
    
    console.log('🗑️ Tentative de suppression du bâtiment:', batiment.nom_batiment, 'ID:', batiment.id);
    
    // Confirmation de suppression
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le bâtiment "${batiment.nom_batiment}" ?\n\nCette action est irréversible et supprimera également toutes les pièces associées.`
    );
    
    if (!confirmDelete) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }
    
    console.log('✅ Suppression confirmée, appel API...');

    try {
      setLoading(true);
      
      console.log('📡 Appel API de suppression pour ID:', batiment.id);
      
      // Appel API pour supprimer le bâtiment
      const response = await apiHelpers.batiments.delete(batiment.id);
      
      console.log('✅ Réponse API suppression:', response);
      
      // Mettre à jour la liste locale
      setBatiments(batiments.filter(b => b.id !== batiment.id));
      
      toast({
        title: "Succès",
        description: `Bâtiment "${batiment.nom_batiment}" supprimé avec succès`,
      });
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression:', error);
      console.error('❌ Détails de l\'erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = "Erreur lors de la suppression du bâtiment";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Bâtiment non trouvé";
      } else if (error.response?.status === 409) {
        errorMessage = "Impossible de supprimer : le bâtiment contient des données liées";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  <Label htmlFor="client">Client *</Label>
                  <div className="flex space-x-2">
                    <Select 
                      value={formData.client_id > 0 ? formData.client_id.toString() : ""} 
                      onValueChange={(value) => handleInputChange('client_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.contact_nom} ({client.contact_email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/dashboard/clients')}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {clients.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucun client disponible. <button 
                        onClick={() => router.push('/dashboard/clients')}
                        className="text-primary hover:underline"
                      >
                        Créer un client d'abord
                      </button>
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="building-name">Nom du bâtiment *</Label>
                  <Input 
                    id="building-name" 
                    placeholder="ex: Siège Social"
                    value={formData.nom_batiment}
                    onChange={(e) => handleInputChange('nom_batiment', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-address">Adresse du site *</Label>
                  <Input 
                    id="site-address" 
                    placeholder="ex: 123 Rue de la République"
                    value={formData.adresse_site}
                    onChange={(e) => handleInputChange('adresse_site', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commune">Commune *</Label>
                  <Input 
                    id="commune" 
                    placeholder="ex: Cotonou"
                    value={formData.commune}
                    onChange={(e) => handleInputChange('commune', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-year">Année de mise en service</Label>
                  <Input 
                    id="service-year" 
                    type="number" 
                    placeholder="ex: 2010"
                    value={formData.annee_mise_service}
                    onChange={(e) => handleInputChange('annee_mise_service', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="building-type">Type/Fonction du bâtiment</Label>
                  <Input 
                    id="building-type" 
                    placeholder="ex: Bureaux administratifs"
                    value={formData.type_fonction}
                    onChange={(e) => handleInputChange('type_fonction', e.target.value)}
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
                    onChange={(e) => handleInputChange('surface_construite', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lease-type">Type de bail</Label>
                  <Input 
                    id="lease-type" 
                    placeholder="ex: Propriétaire"
                    value={formData.type_bail}
                    onChange={(e) => handleInputChange('type_bail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="floors">Nombre d'étages</Label>
                  <Input 
                    id="floors" 
                    type="number" 
                    placeholder="ex: 5"
                    value={formData.nombre_etages}
                    onChange={(e) => handleInputChange('nombre_etages', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="building-shape">Forme du bâtiment</Label>
                  <Input 
                    id="building-shape" 
                    placeholder="ex: Rectangulaire"
                    value={formData.forme_batiment}
                    onChange={(e) => handleInputChange('forme_batiment', e.target.value)}
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
                    onChange={(e) => handleInputChange('nb_travailleurs', parseInt(e.target.value) || 0)}
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
                        <span className="text-muted-foreground">Surface:</span>
                        <span>{batiment.surface_totale} m²</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Travailleurs:</span>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{batiment.nb_travailleurs}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Année:</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{batiment.annee_mise_service}</span>
                        </div>
                      </div>
                      {batiment.client && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Client:</span>
                          <span className="text-right">{batiment.client.contact_nom}</span>
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
  );
}