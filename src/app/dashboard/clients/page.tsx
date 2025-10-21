"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiHelpers } from "../../../../services/apiHelpers";
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
import { Badge } from "@/components/ui/badge";
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Save,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  Edit,
  X,
  Building,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ClientData {
  id?: number;
  contact_nom: string;
  contact_fonction: string;
  contact_email: string;
  contact_tel: string;
  adresse: string;
  nom_entreprise?: string;
  adresse_entreprise?: string;
  ville?: string;
  code_postal?: string;
  secteur_activite?: string;
  date_selection?: string;
}

interface Client {
  id: number;
  contact_nom: string;
  contact_fonction: string;
  contact_email: string;
  contact_tel: string;
  adresse: string;
  nom_entreprise?: string;
  adresse_entreprise?: string;
  ville?: string;
  code_postal?: string;
  secteur_activite?: string;
  date_selection?: string;
  created_at: string;
}

export default function ClientsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");

  console.log("🔧 Paramètres URL:", { clientId });
  console.log("🔧 Mode édition:", !!clientId);

  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    client: Client | null;
  }>({ isOpen: false, client: null });
  const [formData, setFormData] = useState<ClientData>({
    contact_nom: "",
    contact_fonction: "",
    contact_email: "",
    contact_tel: "",
    adresse: "",
    nom_entreprise: "",
    adresse_entreprise: "",
    ville: "",
    code_postal: "",
    secteur_activite: "",
    date_selection: "",
  });

  const isEditing = !!(formData.id && formData.id !== undefined);

  // Fonction pour formater la date pour l'input HTML
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    
    try {
      // Si la date contient déjà le bon format YYYY-MM-DD, la retourner telle quelle
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Sinon, parser la date et la formater
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      // Formater en YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn("Erreur lors du formatage de la date:", dateString, error);
      return "";
    }
  };
  
  console.log("🔧 État du composant:", {
    clientId,
    "formData.id": formData.id,
    isEditing,
    showForm,
    loadingClients,
    clientsCount: clients.length
  });

  // Charger les données initiales
  useEffect(() => {
    console.log("🔧 useEffect déclenché avec clientId:", clientId);
    const loadData = async () => {
      try {
        console.log("🔄 Chargement des projets (serveur lent, patience...)");
        const startTime = Date.now();

        // Charger les projets
        const clientsResponse = await apiHelpers.clients.getAll();

        const duration = Date.now() - startTime;
        const fromCache = duration < 100;
        console.log(
          `✅ Projets chargés en ${duration}ms ${
            fromCache ? "(cache)" : "(API)"
          }`
        );
        console.log("🔍 Structure de la réponse:", clientsResponse);
        console.log("🔍 Données projets:", clientsResponse.data);

        // L'API retourne {success: true, data: [...]}
        // Axios retourne response.data, donc clientsResponse.data = {success: true, data: [...]}
        const clientsData = clientsResponse.data?.data || [];
        console.log("📊 Projets extraits:", clientsData);

        setClients(Array.isArray(clientsData) ? clientsData : []);

        // Si en mode édition, charger le projet SEULEMENT si le formulaire n'est pas déjà rempli
        if (clientId && !formData.id) {
          console.log("🔧 Mode édition détecté, ID:", clientId);

          // Trouver le client dans la liste déjà chargée
          const client = clientsData.find(
            (c: Client) => c.id.toString() === clientId
          );
          console.log("🔧 Projet trouvé dans la liste:", client);

          if (client) {
            console.log("🔧 Configuration du formulaire avec les données du projet");
            setFormData({
              id: client.id,
              contact_nom: client.contact_nom,
              contact_fonction: client.contact_fonction || "",
              contact_email: client.contact_email,
              contact_tel: client.contact_tel || "",
              adresse: client.adresse || "",
              nom_entreprise: client.nom_entreprise || "",
              adresse_entreprise: client.adresse_entreprise || "",
              ville: client.ville || "",
              code_postal: client.code_postal || "",
              secteur_activite: client.secteur_activite || "",
              date_selection: formatDateForInput(client.date_selection),
            });
            console.log("🔧 Formulaire configuré, showForm devrait être:", !!clientId);
            setShowForm(true);
          } else {
            console.error("🔧 Projet non trouvé avec l'ID:", clientId);
          }
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des projets:", error);
        toast({
          title: "Erreur de chargement",
          description:
            "Le serveur met du temps à répondre. Les données en cache seront utilisées si disponibles.",
          variant: "destructive",
        });
      } finally {
        setLoadingClients(false);
      }
    };

    loadData();
  }, []); // Chargement une seule fois au montage

  // Gérer l'URL pour l'édition (séparé du chargement des données)
  useEffect(() => {
    if (clientId && clients.length > 0 && !showForm) {
      console.log("🔧 URL contient un ID, chargement pour édition:", clientId);
      const client = clients.find((c: Client) => c.id.toString() === clientId);
      if (client) {
        setFormData({
          id: client.id,
          contact_nom: client.contact_nom,
          contact_fonction: client.contact_fonction || "",
          contact_email: client.contact_email,
          contact_tel: client.contact_tel || "",
          adresse: client.adresse || "",
          nom_entreprise: client.nom_entreprise || "",
          adresse_entreprise: client.adresse_entreprise || "",
          ville: client.ville || "",
          code_postal: client.code_postal || "",
          secteur_activite: client.secteur_activite || "",
          date_selection: formatDateForInput(client.date_selection),
        });
        setShowForm(true);
      }
    }
  }, [clientId, clients, showForm]);

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: undefined, // Important : remettre l'ID à undefined
      contact_nom: "",
      contact_fonction: "",
      contact_email: "",
      contact_tel: "",
      adresse: "",
      nom_entreprise: "",
      adresse_entreprise: "",
      ville: "",
      code_postal: "",
      secteur_activite: "",
      date_selection: "",
    });
  };

  const handleSubmit = async () => {
    console.log("🔧 handleSubmit appelé");
    console.log("🔧 isEditing:", isEditing);
    console.log("🔧 clientId (URL):", clientId);
    console.log("🔧 formData.id:", formData.id);
    console.log("🔧 Mode détecté:", isEditing ? "MODIFICATION" : "CRÉATION");
    console.log("🔧 formData:", formData);
    
    // Validation basique
    if (
      !formData.contact_nom ||
      !formData.contact_fonction ||
      !formData.contact_email ||
      !formData.contact_tel ||
      !formData.adresse
    ) {
      toast({
        title: "Erreur",
        description:
          "Veuillez remplir tous les champs obligatoires (nom, fonction, email, téléphone, adresse)",
        variant: "destructive",
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_email)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un email valide",
        variant: "destructive",
      });
      return;
    }

    // Validation téléphone
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
    if (!phoneRegex.test(formData.contact_tel)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de téléphone valide (8-20 caractères)",
        variant: "destructive",
      });
      return;
    }

    // Validation nom (pas de chiffres)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(formData.contact_nom)) {
      toast({
        title: "Erreur",
        description: "Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes",
        variant: "destructive",
      });
      return;
    }

    // Validation nom d'entreprise (si rempli)
    if (formData.nom_entreprise && formData.nom_entreprise.trim()) {
      const companyNameRegex = /^[a-zA-ZÀ-ÿ\s\-'&]+$/;
      if (!companyNameRegex.test(formData.nom_entreprise)) {
        toast({
          title: "Erreur",
          description: "Le nom de l'entreprise ne doit contenir que des lettres, espaces, tirets, apostrophes et &",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation secteur d'activité (si rempli)
    if (formData.secteur_activite && formData.secteur_activite.trim()) {
      const sectorRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
      if (!sectorRegex.test(formData.secteur_activite)) {
        toast({
          title: "Erreur",
          description: "Le secteur d'activité ne doit contenir que des lettres, espaces, tirets et apostrophes",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation ville (si remplie)
    if (formData.ville && formData.ville.trim()) {
      const cityRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
      if (!cityRegex.test(formData.ville)) {
        toast({
          title: "Erreur",
          description: "La ville ne doit contenir que des lettres, espaces, tirets et apostrophes",
          variant: "destructive",
        });
        return;
      }
    }

    // Validation date de sélection (si remplie)
    if (formData.date_selection && formData.date_selection.trim()) {
      const selectedDate = new Date(formData.date_selection);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Fin de journée pour permettre aujourd'hui
      
      if (selectedDate > today) {
        toast({
          title: "Erreur",
          description: "La date de sélection ne peut pas être dans le futur",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isEditing) {
        // Vérification de sécurité
        if (!formData.id || formData.id === undefined) {
          console.error("🔧 ERREUR: Pas d'ID valide pour la mise à jour!");
          toast({
            title: "Erreur",
            description: "Impossible de mettre à jour : ID manquant ou invalide",
            variant: "destructive",
          });
          return;
        }
        
        // Mise à jour avec cache
        console.log("🔧 Tentative de mise à jour avec ID:", formData.id);
        
        // Exclure l'ID des données envoyées (il est déjà dans l'URL)
        const { id, ...dataToUpdate } = formData;
        console.log("🔧 Données à envoyer (sans ID):", dataToUpdate);
        
        await apiHelpers.clients.update(formData.id, dataToUpdate);
        console.log("🔧 Mise à jour réussie");
        toast({
          title: "Succès",
          description: "Projet mis à jour avec succès",
        });
      } else {
        // Création avec cache
        await apiHelpers.clients.create(formData);
        toast({
          title: "Succès",
          description: "Projet créé avec succès",
        });
      }

      // Recharger la liste des clients
      const clientsResponse = await apiHelpers.clients.getAll();
      const clientsData = clientsResponse.data?.data || [];
      setClients(
        Array.isArray(clientsData) ? clientsData : []
      );

      // Fermer le formulaire SEULEMENT en cas de succès
      console.log("🔧 Fermeture du formulaire après succès");
      setShowForm(false);
      resetForm();
      router.push("/dashboard/clients");
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);

      let errorMessage = "Erreur lors de la sauvegarde";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      
      // En cas d'erreur, le formulaire reste ouvert pour permettre à l'utilisateur de corriger
      
      // Fermer le formulaire même en cas d'erreur (optionnel)
      // setShowForm(false);
      // resetForm();
      // router.push("/dashboard/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client: Client) => {
    console.log("🔧 Modification du projet:", client);
    
    // D'abord mettre à jour l'URL
    router.push(`/dashboard/clients?id=${client.id}`);
    
    // Puis remplir le formulaire avec les données du client
    setFormData({
      id: client.id,
      contact_nom: client.contact_nom,
      contact_fonction: client.contact_fonction || "",
      contact_email: client.contact_email,
      contact_tel: client.contact_tel || "",
      adresse: client.adresse || "",
      nom_entreprise: client.nom_entreprise || "",
      adresse_entreprise: client.adresse_entreprise || "",
      ville: client.ville || "",
      code_postal: client.code_postal || "",
      secteur_activite: client.secteur_activite || "",
      date_selection: formatDateForInput(client.date_selection),
    });
    
    // Afficher le formulaire
    setShowForm(true);
  };

  const handleNewClient = () => {
    // Réinitialiser l'URL et le formulaire
    router.push("/dashboard/clients");
    resetForm();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    if (isEditing) {
      // Nettoyer l'URL et revenir à la liste
      router.push("/dashboard/clients");
      setShowForm(false);
      resetForm();
    } else {
      setShowForm(false);
      resetForm();
    }
  };

  const handleDeleteClick = (client: Client) => {
    setDeleteDialog({ isOpen: true, client });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.client) return;

    setLoading(true);
    try {
      await apiHelpers.clients.delete(deleteDialog.client.id);
      
      toast({
        title: "Succès",
        description: "Projet supprimé avec succès",
      });

      // Recharger la liste des clients
      const clientsResponse = await apiHelpers.clients.getAll();
      const clientsData = clientsResponse.data?.data || [];
      setClients(Array.isArray(clientsData) ? clientsData : []);

    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);

      let errorMessage = "Erreur lors de la suppression";
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
      setDeleteDialog({ isOpen: false, client: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, client: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Projets
          </h1>
        </div>
        {!showForm && (
          <Button onClick={handleNewClient}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Projet
          </Button>
        )}
      </div>

      {/* Formulaire (conditionnel) */}
      {showForm && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Modifier le Projet" : "Nouveau Projet"}
            </h2>
            <Button variant="outline" size="sm" onClick={handleCancelForm}>
              <X className="mr-2 h-4 w-4" />
              {isEditing ? "Retour à la liste" : "Annuler"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations du Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-nom">Nom du contact *</Label>
                  <Input
                    id="contact-nom"
                    placeholder="ex: Jean Dupont"
                    value={formData.contact_nom}
                    onChange={(e) => {
                      // Permettre seulement les lettres, espaces, tirets et apostrophes
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                      handleInputChange("contact_nom", value);
                    }}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-fonction">
                    Fonction du contact *
                  </Label>
                  <Input
                    id="contact-fonction"
                    placeholder="ex: Directeur technique"
                    value={formData.contact_fonction}
                    onChange={(e) => {
                      // Permettre lettres, chiffres, espaces et caractères spéciaux courants
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'().,]/g, '');
                      handleInputChange("contact_fonction", value);
                    }}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email du contact *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="ex: jean.dupont@entreprise.com"
                    value={formData.contact_email}
                    onChange={(e) => {
                      // Convertir en minuscules et supprimer les espaces
                      const value = e.target.value.toLowerCase().trim();
                      handleInputChange("contact_email", value);
                    }}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-tel">Téléphone *</Label>
                  <Input
                    id="contact-tel"
                    type="tel"
                    placeholder="ex: +229 99 00 00 99"
                    value={formData.contact_tel}
                    onChange={(e) => {
                      // Permettre seulement les chiffres, espaces, +, -, (, )
                      const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                      handleInputChange("contact_tel", value);
                    }}
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    placeholder="ex: 123 Rue de la République, Cotonou"
                    value={formData.adresse}
                    onChange={(e) => {
                      // Permettre lettres, chiffres, espaces et caractères d'adresse
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'().,/]/g, '');
                      handleInputChange("adresse", value);
                    }}
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="secteur-activite">Secteur d'activité</Label>
                  <Input
                    id="secteur-activite"
                    placeholder="ex: Services informatiques"
                    value={formData.secteur_activite}
                    onChange={(e) => {
                      // Permettre seulement les lettres, espaces, tirets et apostrophes
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                      handleInputChange("secteur_activite", value);
                    }}
                    maxLength={100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations de l'Entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom-entreprise">Nom de l'entreprise</Label>
                  <Input
                    id="nom-entreprise"
                    placeholder="ex: ACME Corporation"
                    value={formData.nom_entreprise}
                    onChange={(e) => {
                      // Permettre seulement les lettres, espaces, tirets, apostrophes et &
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-'&]/g, '');
                      handleInputChange("nom_entreprise", value);
                    }}
                    maxLength={150}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    placeholder="ex: Cotonou"
                    value={formData.ville}
                    onChange={(e) => {
                      // Permettre seulement les lettres, espaces, tirets et apostrophes
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                      handleInputChange("ville", value);
                    }}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adresse-entreprise">
                    Adresse de l'entreprise
                  </Label>
                  <Input
                    id="adresse-entreprise"
                    placeholder="ex: 123 Rue de la République"
                    value={formData.adresse_entreprise}
                    onChange={(e) => {
                      // Permettre lettres, chiffres, espaces et caractères d'adresse
                      const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'().,/]/g, '');
                      handleInputChange("adresse_entreprise", value);
                    }}
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code-postal">Code postal</Label>
                  <Input
                    id="code-postal"
                    placeholder="ex: 01000"
                    value={formData.code_postal}
                    onChange={(e) => {
                      // Permettre seulement les chiffres et lettres (pour codes postaux internationaux)
                      const value = e.target.value.replace(/[^0-9A-Za-z\s-]/g, '').toUpperCase();
                      handleInputChange("code_postal", value);
                    }}
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-selection">Date de sélection</Label>
                  <Input
                    id="date-selection"
                    type="date"
                    value={formData.date_selection}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const today = new Date().toISOString().split('T')[0];
                      
                      // Empêcher la sélection de dates futures
                      if (selectedDate > today) {
                        toast({
                          title: "Date invalide",
                          description: "La date de sélection ne peut pas être dans le futur",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      handleInputChange("date_selection", selectedDate);
                    }}
                    max={new Date().toISOString().split('T')[0]} // Limite à aujourd'hui
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
              onClick={() => {
                console.log("🔧 Clic sur le bouton Mettre à jour");
                handleSubmit();
              }} 
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
                  {isEditing ? "Mettre à jour" : "Créer le Projet"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Liste des projets */}
      {!showForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projets existants</h2>
            <p className="text-muted-foreground">
              {clients.length} projet{clients.length > 1 ? "s" : ""} enregistré
              {clients.length > 1 ? "s" : ""}
            </p>
          </div>

          {loadingClients ? (
            <LoadingPage text="Chargement des projets..." />
          ) : clients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Commencez par ajouter un projet pour pouvoir créer des
                  bâtiments
                </p>
                <Button onClick={handleNewClient}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un projet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card
                  key={client.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">
                            {client.contact_nom}
                          </CardTitle>
                          {client.contact_fonction && (
                            <p className="text-sm text-muted-foreground">
                              {client.contact_fonction}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">Projet #{client.id}</Badge>
                    </div>
                    {client.nom_entreprise && (
                      <CardDescription className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{client.nom_entreprise}</span>
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{client.contact_email}</span>
                      </div>

                      {client.contact_tel && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{client.contact_tel}</span>
                        </div>
                      )}

                      {client.adresse && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{client.adresse}</span>
                        </div>
                      )}

                      {client.secteur_activite && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Secteur:
                          </span>
                          <span>{client.secteur_activite}</span>
                        </div>
                      )}

                      {client.date_selection && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Date sélection:
                          </span>
                          <span>
                            {new Date(client.date_selection).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("🔧 Clic sur le bouton Modifier");
                          console.log("🔧 Client à modifier:", client);
                          handleEditClient(client);
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
                        title="Modifier le projet"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(client)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                        title="Supprimer le projet"
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
        title="Supprimer le projet"
        description={
          deleteDialog.client
            ? `Êtes-vous sûr de vouloir supprimer le projet de "${deleteDialog.client.contact_nom}" ? Cette action est irréversible.`
            : ""
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
