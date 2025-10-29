"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../../../services/apiHelpers";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "admin" | "technicien";
  contact?: string;
  adresse?: string;
  date_naissance?: string;
  date_creation?: string;
}

export default function UtilisateursPage() {
  const { toast } = useToast();
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Dialog de suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    mot_de_passe_confirmation: "",
    role: "technicien" as "admin" | "technicien",
    contact: "",
    adresse: "",
    date_naissance: "",
  });

  // Vérifier le rôle de l'utilisateur
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions pour accéder à cette page",
          variant: "destructive",
        });
        router.push("/dashboard");
        return;
      }
    }
  }, [router, toast]);

  // Charger les données
  const loadData = async () => {
    try {
      const response = await apiHelpers.techniciens.getAll();
      setUtilisateurs(response.data?.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de chargement des utilisateurs",
        variant: "destructive",
      });
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
      nom: "",
      prenom: "",
      email: "",
      mot_de_passe: "",
      mot_de_passe_confirmation: "",
      role: "technicien",
      contact: "",
      adresse: "",
      date_naissance: "",
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
  const handleEdit = (user: Utilisateur) => {
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      mot_de_passe: "",
      mot_de_passe_confirmation: "",
      role: user.role,
      contact: user.contact || "",
      adresse: user.adresse || "",
      date_naissance: user.date_naissance || "",
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    if (!formData.nom || !formData.prenom || !formData.email) return false;
    if (!editingId && (!formData.mot_de_passe || formData.mot_de_passe.length < 6))
      return false;
    if (formData.mot_de_passe && formData.mot_de_passe !== formData.mot_de_passe_confirmation)
      return false;
    return true;
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!isFormValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires correctement",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dataToSend: any = { ...formData };
      // Ne pas envoyer le mot de passe si vide en mode édition
      if (editingId && !dataToSend.mot_de_passe) {
        delete dataToSend.mot_de_passe;
        delete dataToSend.mot_de_passe_confirmation;
      }

      if (editingId) {
        await apiHelpers.techniciens.update(editingId, dataToSend);
        toast({ title: "Succès", description: "Utilisateur modifié" });
      } else {
        await apiHelpers.techniciens.create(dataToSend);
        toast({ title: "Succès", description: "Utilisateur créé" });
      }

      await loadData();
      resetForm();
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de la sauvegarde";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le dialog de suppression
  const openDeleteDialog = (id: number) => {
    setUserToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      await apiHelpers.techniciens.delete(userToDelete);
      toast({ title: "Succès", description: "Utilisateur supprimé" });
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
      setUserToDelete(null);
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
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        </div>
        {!showForm && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Modifier l'Utilisateur" : "Nouvel Utilisateur"}
              <Button variant="outline" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <Label>Nom *</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Dupont"
                />
              </div>

              {/* Prénom */}
              <div>
                <Label>Prénom *</Label>
                <Input
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Jean"
                />
              </div>

              {/* Email */}
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean@medilight.com"
                />
              </div>

              {/* Rôle */}
              <div>
                <Label>Rôle *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "technicien") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technicien">Technicien</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mot de passe */}
              <div>
                <Label>
                  Mot de passe {!editingId && "*"} {editingId && "(laisser vide pour ne pas changer)"}
                </Label>
                <Input
                  type="password"
                  value={formData.mot_de_passe}
                  onChange={(e) =>
                    setFormData({ ...formData, mot_de_passe: e.target.value })
                  }
                  placeholder="Minimum 6 caractères"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <Label>Confirmer le mot de passe {!editingId && "*"}</Label>
                <Input
                  type="password"
                  value={formData.mot_de_passe_confirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mot_de_passe_confirmation: e.target.value,
                    })
                  }
                  placeholder="Confirmer le mot de passe"
                />
              </div>

              {/* Contact */}
              <div>
                <Label>Contact</Label>
                <Input
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+225 07 12 34 56 78"
                />
              </div>

              {/* Date de naissance */}
              <div>
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) =>
                    setFormData({ ...formData, date_naissance: e.target.value })
                  }
                />
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <Label>Adresse</Label>
                <Input
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Abidjan, Cocody"
                />
              </div>
            </div>

            {formData.mot_de_passe &&
              formData.mot_de_passe !== formData.mot_de_passe_confirmation && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  ⚠️ Les mots de passe ne correspondent pas
                </div>
              )}

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

      {/* Liste des utilisateurs */}
      {!showForm && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {utilisateurs.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {user.role === "admin" ? (
                        <Shield className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Users className="h-5 w-5 text-blue-600" />
                      )}
                      {user.prenom} {user.nom}
                    </CardTitle>
                  </div>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "Technicien"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.contact && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{user.contact}</span>
                    </div>
                  )}
                  {user.adresse && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{user.adresse}</span>
                    </div>
                  )}
                  {user.date_creation && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(user.date_creation).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {utilisateurs.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Aucun utilisateur</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez par créer votre premier utilisateur.
          </p>
          <div className="mt-6">
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Utilisateur
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
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est
              irréversible et supprimera définitivement toutes les données associées.
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
