"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import apiHelpers from "../../../../services/apiHelpers";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";

interface Client {
  id: number;
  nom_entreprise: string;
  contact_nom: string;
  contact_fonction?: string;
  contact_tel?: string;
  contact_email?: string;
  adresse: string;
  secteur_activite?: string;
  ville?: string;
  adresse_entreprise?: string;
}

export default function ClientsPage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nom_entreprise: "",
    contact_nom: "",
    contact_fonction: "",
    contact_tel: "",
    contact_email: "",
    // 'adresse' field removed (use adresse_entreprise instead)
    secteur_activite: "",
    ville: "",
    adresse_entreprise: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+\d][\d\s().-]{6,}$/;

  const validateField = (field: string, value: string) => {
    let message = "";
    const v = value?.toString() || "";
    switch (field) {
      case "nom_entreprise":
        if (!v.trim()) message = "Le nom du projet est requis";
        break;
      case "contact_nom":
        if (!v.trim()) message = "Le responsable projet est requis";
        break;
      case "contact_tel":
        if (!v.trim()) message = "Le numéro de téléphone est requis";
        else if (!phoneRegex.test(v)) message = "Numéro de téléphone invalide";
        break;
      case "contact_email":
        if (v && !emailRegex.test(v)) message = "Email invalide";
        break;
      case "adresse_entreprise":
        if (!v.trim()) message = "L'adresse entreprise est requise";
        break;
      case "secteur_activite":
        if (!v.trim()) message = "Le secteur d'activité est requis";
        break;
      default:
        message = "";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // validate on change for immediate feedback
    validateField(field, value);
  };

  const loadData = async () => {
    try {
      const response = await apiHelpers.clients.getAll();
      setClients(response.data?.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de chargement des projets",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      nom_entreprise: "",
      contact_nom: "",
      contact_fonction: "",
      contact_tel: "",
      contact_email: "",
      secteur_activite: "",
      ville: "",
      adresse_entreprise: "",
    });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  // Prefill helpers (localStorage)
  const PREFILL_KEY = "auditelec_client_prefill";

  const loadPrefill = () => {
    try {
      const raw = localStorage.getItem(PREFILL_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      setFormData((prev) => ({ ...prev, ...data }));
    } catch (e) {
      // ignore
    }
  };

  const savePrefill = (data: Record<string, any>) => {
    try {
      localStorage.setItem(PREFILL_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  };

  const handleNew = () => {
    resetForm();
    loadPrefill();
    setShowForm(true);
  };

  const handleEdit = (client: Client) => {
    setFormData({
      nom_entreprise: client.nom_entreprise,
      contact_nom: client.contact_nom,
      contact_fonction: client.contact_fonction || "",
      contact_tel: client.contact_tel || "",
      contact_email: client.contact_email || "",
      // Prefer explicit entreprise address if available, otherwise fall back to adresse
      adresse_entreprise: client.adresse_entreprise || client.adresse || "",
      secteur_activite: client.secteur_activite || "",
      ville: client.ville || "",
      // adresse_entreprise already set above
    });
    setEditingId(client.id);
    setShowForm(true);
    setErrors({});
  };

  // Now require adresse_entreprise instead of the removed adresse field
  const isFormValid = () => {
    const requiredFilled =
      Boolean(formData.nom_entreprise?.toString().trim()) &&
      Boolean(formData.contact_nom?.toString().trim()) &&
      Boolean(formData.contact_tel?.toString().trim()) &&
      Boolean(formData.secteur_activite?.toString().trim()) &&
      Boolean(formData.adresse_entreprise?.toString().trim());
    const noErrors = Object.values(errors).every((v) => !v);
    return Boolean(requiredFilled && noErrors && !loading);
  };

  const handleSave = async () => {
    // validate all required fields to show errors for untouched fields
    validateField("nom_entreprise", formData.nom_entreprise);
    validateField("contact_nom", formData.contact_nom);
    validateField("contact_tel", formData.contact_tel);
    validateField("secteur_activite", formData.secteur_activite);
    validateField("adresse_entreprise", formData.adresse_entreprise);

    if (!isFormValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, adresse: formData.adresse_entreprise };
      if (editingId) {
        await apiHelpers.clients.update(editingId, payload);
        toast({ title: "Succès", description: "Projet modifié" });
      } else {
        await apiHelpers.clients.create(payload);
        toast({ title: "Succès", description: "Projet créé" });
      }

      // save prefill
      savePrefill({
        contact_fonction: formData.contact_fonction,
        secteur_activite: formData.secteur_activite,
        adresse_entreprise: formData.adresse_entreprise,
        ville: formData.ville,
      });

      await loadData();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id: number) => {
    setClientToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    // Optimistic delete with undo via Radix toast
    const previous = [...clients];
    const clientObj = clients.find(c => c.id === clientToDelete);

    try {
      setLoading(true);
      // Remove locally immediately
      setClients(prev => prev.filter(c => c.id !== clientToDelete));

      let cancelled = false;
      const undo = () => {
        cancelled = true;
        setClients(previous);
        toast({ title: 'Annulé', description: 'Suppression annulée', variant: 'default' });
      };

      toast({
        title: 'Suppression',
        description: `Projet "${clientObj?.nom_entreprise}" supprimé (Annuler dans 4s)`,
        variant: 'destructive',
        action: (
          <Button variant="ghost" size="sm" onClick={undo}>
            Annuler
          </Button>
        )
      });

      // wait before calling API to allow undo
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 4000));
      if (cancelled) {
        return;
      }

      const response = await apiHelpers.clients.delete(clientToDelete);
      const message = response.data?.message || 'Projet supprimé';
      toast({ title: 'Succès', description: message });

    } catch (error) {
      setClients(previous);
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression', variant: 'destructive' });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setClientToDelete(null);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Projets</h1>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Projet
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Modifier le Projet" : "Nouveau Projet"}
              <Button variant="outline" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nom du projet *</Label>
                <Input
                  autoComplete="organization"
                  value={formData.nom_entreprise}
                  onChange={(e) => handleChange("nom_entreprise", e.target.value)}
                  className={errors.nom_entreprise ? "border-destructive" : ""}
                  placeholder="Projet ABC"
                />
                {errors.nom_entreprise && (
                  <p className="text-destructive text-sm mt-1">{errors.nom_entreprise}</p>
                )}
              </div>

              <div>
                <Label>Responsable projet *</Label>
                <Input
                  autoComplete="name"
                  value={formData.contact_nom}
                  onChange={(e) => handleChange("contact_nom", e.target.value)}
                  className={errors.contact_nom ? "border-destructive" : ""}
                  placeholder="Jean Dupont"
                />
                {errors.contact_nom && (
                  <p className="text-destructive text-sm mt-1">{errors.contact_nom}</p>
                )}
              </div>

              <div>
                <Label>Responsable entreprise</Label>
                <Input
                  autoComplete="organization-title"
                  value={formData.contact_fonction}
                  onChange={(e) => handleChange("contact_fonction", e.target.value)}
                  placeholder="Responsable entreprise"
                />
              </div>

              <div>
                <Label>Téléphone *</Label>
                <Input
                  autoComplete="tel"
                  value={formData.contact_tel}
                  onChange={(e) => handleChange("contact_tel", e.target.value)}
                  className={errors.contact_tel ? "border-destructive" : ""}
                  placeholder="+225 07 12 34 56 78"
                />
                {errors.contact_tel && (
                  <p className="text-destructive text-sm mt-1">{errors.contact_tel}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  autoComplete="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  className={errors.contact_email ? "border-destructive" : ""}
                  placeholder="contact@entreprise.com"
                />
                {errors.contact_email && (
                  <p className="text-destructive text-sm mt-1">{errors.contact_email}</p>
                )}
              </div>
              <div>
                <Label>Ville</Label>
                <Input
                  autoComplete="address-level2"
                  value={formData.ville}
                  onChange={(e) => handleChange("ville", e.target.value)}
                  placeholder="Abidjan"
                />
              </div>
              <div>
                <Label>Secteur d'activité *</Label>
                <Input
                  autoComplete="off"
                  value={formData.secteur_activite}
                  onChange={(e) => handleChange("secteur_activite", e.target.value)}
                  className={errors.secteur_activite ? "border-destructive" : ""}
                  placeholder="Industrie, Commerce, etc."
                />
                {errors.secteur_activite && (
                  <p className="text-destructive text-sm mt-1">{errors.secteur_activite}</p>
                )}
              </div>

              <div aria-hidden="true" />

              <div>
                <Label>Adresse entreprise *</Label>
                <Input
                  autoComplete="street-address"
                  value={formData.adresse_entreprise}
                  onChange={(e) => handleChange("adresse_entreprise", e.target.value)}
                  className={errors.adresse_entreprise ? "border-destructive" : ""}
                  placeholder="Adresse entreprise (rue, quartier)"
                />
                {errors.adresse_entreprise && (
                  <p className="text-destructive text-sm mt-1">{errors.adresse_entreprise}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={loading || !isFormValid()}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editingId ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {client.nom_entreprise}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="text-sm space-y-2">
                    {client.secteur_activite && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span className="truncate">{client.secteur_activite}</span>
                      </div>
                    )}
                    {client.contact_email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{client.contact_email}</span>
                      </div>
                    )}
                    {client.adresse_entreprise && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{client.adresse_entreprise}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-muted-foreground/30 pt-2" />

                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>
                      <span className="font-medium">Responsable du projet:</span>{" "}
                      <span>{client.contact_nom}</span>
                    </div>
                    {client.contact_tel && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{client.contact_tel}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {clients.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Aucun projet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez par créer votre premier projet.
          </p>
          <div className="mt-6">
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Projet
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est
                irréversible et supprimera également :
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tous les bâtiments associés</li>
                <li>Toutes les installations électriques</li>
                <li>Toutes les pièces et équipements des bâtiments</li>
              </ul>
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
