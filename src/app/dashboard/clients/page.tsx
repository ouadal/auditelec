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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(!!clientId);
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

  const isEditing = !!clientId;

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔄 Chargement des clients (serveur lent, patience...)");
        const startTime = Date.now();

        // Charger les clients
        const clientsResponse = await apiHelpers.clients.getAll();
        
        const duration = Date.now() - startTime;
        const fromCache = duration < 100;
        console.log(`✅ Clients chargés en ${duration}ms ${fromCache ? '(cache)' : '(API)'}`);
        
        setClients(
          Array.isArray(clientsResponse.data) ? clientsResponse.data : []
        );

        // Si en mode édition, charger le client
        if (clientId) {
          const clientResponse = await apiHelpers.clients.getById(clientId);
          if (clientResponse.data) {
            const client = clientResponse.data;
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
              date_selection: client.date_selection || "",
            });
          }
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des clients:", error);
        toast({
          title: "Erreur de chargement",
          description: "Le serveur met du temps à répondre. Les données en cache seront utilisées si disponibles.",
          variant: "destructive",
        });
      } finally {
        setLoadingClients(false);
      }
    };

    loadData();
  }, [clientId, toast]);

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
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

    setLoading(true);

    try {
      if (isEditing) {
        // Mise à jour avec cache
        await apiHelpers.clients.update(clientId!, formData);
        toast({
          title: "Succès",
          description: "Client mis à jour avec succès",
        });
      } else {
        // Création avec cache
        await apiHelpers.clients.create(formData);
        toast({
          title: "Succès",
          description: "Client créé avec succès",
        });
        resetForm();
      }

      // Recharger la liste des clients (utilisera le cache invalidé)
      const clientsResponse = await apiHelpers.clients.getAll();
      setClients(
        Array.isArray(clientsResponse.data) ? clientsResponse.data : []
      );

      // Fermer le formulaire si création
      if (!isEditing) {
        setShowForm(false);
      }
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client: Client) => {
    router.push(`/dashboard/clients?id=${client.id}`);
  };

  const handleNewClient = () => {
    // Réinitialiser l'URL et le formulaire
    router.push("/dashboard/clients");
    resetForm();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    if (isEditing) {
      router.push("/dashboard/clients");
    } else {
      setShowForm(false);
      resetForm();
    }
  };

  return (
    <div className="space-y-6">

      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Clients
          </h1>
        </div>
        {!showForm && (
          <Button onClick={handleNewClient}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Client
          </Button>
        )}
      </div>

      {/* Formulaire (conditionnel) */}
      {showForm && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Modifier le Client" : "Nouveau Client"}
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
                    onChange={(e) =>
                      handleInputChange("contact_nom", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("contact_fonction", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email du contact *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="ex: jean.dupont@entreprise.com"
                    value={formData.contact_email}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-tel">Téléphone *</Label>
                  <Input
                    id="contact-tel"
                    placeholder="ex: +229 99 00 00 99"
                    value={formData.contact_tel}
                    onChange={(e) =>
                      handleInputChange("contact_tel", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adresse">Adresse *</Label>
                  <Input
                    id="adresse"
                    placeholder="ex: 123 Rue de la République, Cotonou"
                    value={formData.adresse}
                    onChange={(e) =>
                      handleInputChange("adresse", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="secteur-activite">Secteur d'activité</Label>
                  <Input
                    id="secteur-activite"
                    placeholder="ex: Services informatiques"
                    value={formData.secteur_activite}
                    onChange={(e) =>
                      handleInputChange("secteur_activite", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("nom_entreprise", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    placeholder="ex: Cotonou"
                    value={formData.ville}
                    onChange={(e) => handleInputChange("ville", e.target.value)}
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
                    onChange={(e) =>
                      handleInputChange("adresse_entreprise", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code-postal">Code postal</Label>
                  <Input
                    id="code-postal"
                    placeholder="ex: 01000"
                    value={formData.code_postal}
                    onChange={(e) =>
                      handleInputChange("code_postal", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-selection">Date de sélection</Label>
                  <Input
                    id="date-selection"
                    type="date"
                    value={formData.date_selection}
                    onChange={(e) =>
                      handleInputChange("date_selection", e.target.value)
                    }
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
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Mettre à jour" : "Créer le Client"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Liste des clients */}
      {!showForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Clients existants</h2>
            <p className="text-muted-foreground">
              {clients.length} client{clients.length > 1 ? "s" : ""} enregistré
              {clients.length > 1 ? "s" : ""}
            </p>
          </div>

          {loadingClients ? (
            <LoadingPage text="Chargement des clients..." />
          ) : clients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun client trouvé
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Commencez par ajouter un client pour pouvoir créer des
                  bâtiments
                </p>
                <Button onClick={handleNewClient}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un client
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
                      <Badge variant="outline">Client #{client.id}</Badge>
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
                            {new Date(client.date_selection).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
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
